import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// محاسبه‌ی میانگین
function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// محاسبه‌ی شیب خط روند (Linear Regression)
function calculateTrend(dataPoints: { x: number; y: number }[]): number {
  if (dataPoints.length < 2) return 0;

  const n = dataPoints.length;
  const sumX = dataPoints.reduce((s, p) => s + p.x, 0);
  const sumY = dataPoints.reduce((s, p) => s + p.y, 0);
  const sumXY = dataPoints.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = dataPoints.reduce((s, p) => s + p.x * p.x, 0);

  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return 0;

  return (n * sumXY - sumX * sumY) / denom;
}

// پیش‌بینی رسیدن به هدف
function predictGoalDate(
  currentValue: number,
  targetValue: number,
  trendPerDay: number
): { days: number; date: Date | null } | null {
  if (trendPerDay === 0) return null;

  const diff = targetValue - currentValue;
  const days = diff / trendPerDay;

  // اگه روند اشتباهه (داره دور می‌شه) یا خیلی طول می‌کشه، null بده
  if (days < 0) return null;
  if (days > 365 * 3) return null; // بیشتر از ۳ سال

  const date = new Date();
  date.setDate(date.getDate() + Math.ceil(days));

  return { days: Math.ceil(days), date };
}

export const getPredictions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      weightLogs,
      profile,
      activeGoals,
      workouts,
      nutritionLogs,
      waterLogs,
      user,
    ] = await Promise.all([
      prisma.weightLog.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
        take: 60,
      }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.goal.findMany({
        where: { userId, status: 'ACTIVE' },
      }),
      prisma.workout.findMany({
        where: { userId, isTemplate: false },
        orderBy: { date: 'asc' },
      }),
      prisma.nutritionLog.findMany({
        where: { userId, createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.waterLog.findMany({
        where: { userId, date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'asc' },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { waterGoal: true },
      }),
    ]);

    const predictions: Record<string, unknown> = {};

    // ===== 1. پیش‌بینی وزن =====
    if (weightLogs.length >= 3 && profile) {
      const firstDate = new Date(weightLogs[0].date).getTime();
      const dataPoints = weightLogs.map((log) => ({
        x: (new Date(log.date).getTime() - firstDate) / (1000 * 60 * 60 * 24),
        y: log.weight,
      }));

      const trendPerDay = calculateTrend(dataPoints);
      const currentWeight = weightLogs[weightLogs.length - 1].weight;
      const targetWeight = profile.targetWeight;

      let prediction = null;
      if (targetWeight && trendPerDay !== 0) {
        prediction = predictGoalDate(currentWeight, targetWeight, trendPerDay);
      }

      // پیش‌بینی 30 روز دیگه
      const in30Days = currentWeight + trendPerDay * 30;
      const in60Days = currentWeight + trendPerDay * 60;

      predictions.weight = {
        current: Number(currentWeight.toFixed(1)),
        target: targetWeight,
        trendPerDay: Number(trendPerDay.toFixed(3)),
        trendPerWeek: Number((trendPerDay * 7).toFixed(2)),
        trendPerMonth: Number((trendPerDay * 30).toFixed(2)),
        prediction,
        in30Days: Number(in30Days.toFixed(1)),
        in60Days: Number(in60Days.toFixed(1)),
        enoughData: true,
        dataPoints: weightLogs.length,
      };
    } else {
      predictions.weight = {
        current: weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null,
        target: profile?.targetWeight ?? null,
        trendPerDay: 0,
        trendPerWeek: 0,
        trendPerMonth: 0,
        prediction: null,
        in30Days: null,
        in60Days: null,
        enoughData: false,
        dataPoints: weightLogs.length,
      };
    }

    // ===== 2. پیش‌بینی ورزش =====
    if (workouts.length >= 2) {
      const firstDate = new Date(workouts[0].date).getTime();
      const dataPoints = workouts
        .filter((w) => w.caloriesBurned)
        .map((w) => ({
          x: (new Date(w.date).getTime() - firstDate) / (1000 * 60 * 60 * 24),
          y: w.caloriesBurned ?? 0,
        }));

      const caloriesPerDay = calculateTrend(dataPoints);

      // میانگین هفتگی تمرینات در 30 روز اخیر
      const last30Days = workouts.filter(
        (w) => new Date(w.date).getTime() > thirtyDaysAgo.getTime()
      );
      const avgWorkoutsPerWeek = (last30Days.length / 30) * 7;

      predictions.workouts = {
        totalWorkouts: workouts.length,
        last30Days: last30Days.length,
        avgWorkoutsPerWeek: Number(avgWorkoutsPerWeek.toFixed(1)),
        caloriesTrend: Number(caloriesPerDay.toFixed(1)),
        predictedWorkoutsNext30Days: Math.round((last30Days.length / 30) * 30),
        enoughData: workouts.length >= 2,
      };
    } else {
      predictions.workouts = {
        totalWorkouts: workouts.length,
        last30Days: 0,
        avgWorkoutsPerWeek: 0,
        caloriesTrend: 0,
        predictedWorkoutsNext30Days: 0,
        enoughData: false,
      };
    }

    // ===== 3. پیش‌بینی آب =====
    const waterGoal = user?.waterGoal ?? 2000;

    if (waterLogs.length >= 3) {
      const amounts = waterLogs.map((w) => w.amount);
      const avgWater = average(amounts);

      // روزهای رسیدن به هدف
      const metDays = waterLogs.filter((w) => w.amount >= waterGoal).length;
      const successRate = (metDays / waterLogs.length) * 100;

      // پیش‌بینی 7 روز دیگه
      const firstDate = new Date(waterLogs[0].date).getTime();
      const dataPoints = waterLogs.map((log) => ({
        x: (new Date(log.date).getTime() - firstDate) / (1000 * 60 * 60 * 24),
        y: log.amount,
      }));
      const waterTrend = calculateTrend(dataPoints);

      predictions.water = {
        avgDaily: Math.round(avgWater),
        goal: waterGoal,
        successRate: Math.round(successRate),
        metDays,
        totalDays: waterLogs.length,
        trendPerDay: Math.round(waterTrend),
        predictedNext7Days: Math.round(avgWater + waterTrend * 7),
        enoughData: true,
      };
    } else {
      predictions.water = {
        avgDaily: waterLogs.length > 0 ? Math.round(average(waterLogs.map((w) => w.amount))) : 0,
        goal: waterGoal,
        successRate: 0,
        metDays: 0,
        totalDays: waterLogs.length,
        trendPerDay: 0,
        predictedNext7Days: 0,
        enoughData: false,
      };
    }

    // ===== 4. پیش‌بینی کالری =====
    if (nutritionLogs.length >= 3) {
      // گروه‌بندی بر اساس روز
      const byDay: Record<string, number> = {};
      for (const log of nutritionLogs) {
        const key = new Date(log.createdAt).toISOString().slice(0, 10);
        byDay[key] = (byDay[key] ?? 0) + log.calories;
      }

      const dailyCalories = Object.values(byDay);
      const avgDaily = average(dailyCalories);

      const firstDate = new Date(nutritionLogs[0].createdAt).getTime();
      const dataPoints = nutritionLogs.map((log) => ({
        x: (new Date(log.createdAt).getTime() - firstDate) / (1000 * 60 * 60 * 24),
        y: log.calories,
      }));
      const calorieTrend = calculateTrend(dataPoints);

      predictions.calories = {
        avgDaily: Math.round(avgDaily),
        daysLogged: dailyCalories.length,
        trendPerDay: Math.round(calorieTrend),
        predictedNext7Days: Math.round(avgDaily * 7),
        maxDay: Math.round(Math.max(...dailyCalories)),
        minDay: Math.round(Math.min(...dailyCalories)),
        enoughData: true,
      };
    } else {
      predictions.calories = {
        avgDaily: 0,
        daysLogged: 0,
        trendPerDay: 0,
        predictedNext7Days: 0,
        maxDay: 0,
        minDay: 0,
        enoughData: false,
      };
    }

    // ===== 5. پیش‌بینی اهداف =====
    const goalPredictions = activeGoals.map((goal) => {
      const progress =
        goal.targetValue > 0
          ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
          : 0;

      const remaining = Math.max(0, goal.targetValue - goal.currentValue);
      const startDate = new Date(goal.createdAt);
      const daysSinceStart = Math.max(
        1,
        Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      const ratePerDay = goal.currentValue / daysSinceStart;

      let estimatedDays = 0;
      let estimatedDate: Date | null = null;

      if (ratePerDay > 0) {
        estimatedDays = Math.ceil(remaining / ratePerDay);
        if (estimatedDays < 365 * 3) {
          estimatedDate = new Date();
          estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
        } else {
          estimatedDays = 0;
        }
      }

      // چک کن دیرتر از deadline هست یا نه
      let onTrack = true;
      let daysLate = 0;
      if (goal.deadline && estimatedDate) {
        const deadlineDate = new Date(goal.deadline);
        if (estimatedDate > deadlineDate) {
          onTrack = false;
          daysLate = Math.round(
            (estimatedDate.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24)
          );
        }
      }

      return {
        id: goal.id,
        title: goal.title,
        goalType: goal.goalType,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        progress,
        remaining: Number(remaining.toFixed(1)),
        ratePerDay: Number(ratePerDay.toFixed(3)),
        estimatedDays,
        estimatedDate: estimatedDate?.toISOString() ?? null,
        deadline: goal.deadline?.toISOString() ?? null,
        onTrack,
        daysLate,
      };
    });

    predictions.goals = goalPredictions;

    res.json({
      success: true,
      predictions,
      meta: {
        generatedAt: now.toISOString(),
        dataRange: {
          weightLogs: weightLogs.length,
          workouts: workouts.length,
          nutritionLogs: nutritionLogs.length,
          waterLogs: waterLogs.length,
        },
      },
    });
  } catch (error) {
    console.error('getPredictions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};