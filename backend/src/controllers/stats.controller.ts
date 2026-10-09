import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// ===== Helpers =====
function toDateKey(d: Date): string {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

function calculateStreaks(dateKeys: Set<string>): { current: number; best: number } {
  if (dateKeys.size === 0) return { current: 0, best: 0 };

  // Current streak
  let current = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toDateKey(today);
  const checkDate = new Date(today);

  if (!dateKeys.has(todayKey)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (dateKeys.has(toDateKey(checkDate))) {
    current++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Best streak
  const sorted = Array.from(dateKeys).sort();
  let best = 1;
  let running = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      running++;
      best = Math.max(best, running);
    } else {
      running = 1;
    }
  }
  best = Math.max(best, current);

  return { current, best };
}

// ===== Main Controller =====
export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);

    const [
      totalWorkouts,
      weeklyWorkouts,
      recentWorkouts,
      todayNutrition,
      weeklyNutrition,
      activeGoals,
      completedGoals,
      todayWater,
      user,
      weightLogs,
      allWorkoutDates,
      allWaterLogs,
    ] = await Promise.all([
      prisma.workout.count({ where: { userId } }),
      prisma.workout.count({
        where: { userId, createdAt: { gte: weekStart } },
      }),
      prisma.workout.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          exercises: {
            select: { name: true },
            orderBy: { order: 'asc' },
          },
        },
      }),
      prisma.nutritionLog.aggregate({
        where: { userId, createdAt: { gte: todayStart } },
        _sum: { calories: true, protein: true, carbs: true, fat: true },
      }),
      prisma.nutritionLog.aggregate({
        where: { userId, createdAt: { gte: weekStart } },
        _sum: { calories: true, protein: true, carbs: true, fat: true },
        _count: true,
      }),
      prisma.goal.findMany({
        where: { userId, status: 'ACTIVE' },
        select: {
          id: true,
          title: true,
          goalType: true,
          targetValue: true,
          currentValue: true,
          deadline: true,
        },
      }),
      prisma.goal.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.waterLog.findUnique({
        where: { userId_date: { userId, date: todayStart } },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { waterGoal: true },
      }),
      prisma.weightLog.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
      }),
      prisma.workout.findMany({
        where: { userId },
        select: { date: true },
        orderBy: { date: 'desc' },
      }),
      prisma.waterLog.findMany({
        where: { userId },
        select: { date: true, amount: true },
        orderBy: { date: 'desc' },
      }),
    ]);

    const dailyAvgCalories =
      weeklyNutrition._count > 0
        ? Math.round((weeklyNutrition._sum.calories ?? 0) / 7)
        : 0;

    const goalsWithProgress = activeGoals.map((g) => ({
      ...g,
      progressPercent:
        g.targetValue > 0
          ? Math.min(100, Math.round((g.currentValue / g.targetValue) * 100))
          : 0,
    }));

    const DAILY_WATER_GOAL = user?.waterGoal ?? 2000;
    const waterAmount = todayWater?.amount ?? 0;
    const waterPercent = Math.min(
      100,
      Math.round((waterAmount / DAILY_WATER_GOAL) * 100)
    );

    let weightStats = {
      current: null as number | null,
      start: null as number | null,
      change: 0,
      count: 0,
    };

    if (weightLogs.length > 0) {
      const first = weightLogs[0].weight;
      const last = weightLogs[weightLogs.length - 1].weight;
      weightStats = {
        current: last,
        start: first,
        change: Number((last - first).toFixed(1)),
        count: weightLogs.length,
      };
    }

    // ===== Streaks =====
    const workoutDateKeys = new Set(
      allWorkoutDates.map((w) => toDateKey(w.date))
    );
    const waterMetDateKeys = new Set(
      allWaterLogs
        .filter((w) => w.amount >= DAILY_WATER_GOAL)
        .map((w) => toDateKey(w.date))
    );
    const weightDateKeys = new Set(weightLogs.map((w) => toDateKey(w.date)));

    const workoutStreak = calculateStreaks(workoutDateKeys);
    const waterStreak = calculateStreaks(waterMetDateKeys);
    const weightStreak = calculateStreaks(weightDateKeys);

    res.json({
      success: true,
      stats: {
        workouts: {
          total: totalWorkouts,
          thisWeek: weeklyWorkouts,
          recent: recentWorkouts,
        },
        nutrition: {
          today: {
            calories: todayNutrition._sum.calories ?? 0,
            protein: todayNutrition._sum.protein ?? 0,
            carbs: todayNutrition._sum.carbs ?? 0,
            fat: todayNutrition._sum.fat ?? 0,
          },
          weekly: {
            totalCalories: weeklyNutrition._sum.calories ?? 0,
            dailyAvgCalories,
          },
        },
        water: {
          today: waterAmount,
          goal: DAILY_WATER_GOAL,
          percent: waterPercent,
        },
        weight: weightStats,
        goals: {
          active: goalsWithProgress,
          activeCount: activeGoals.length,
          completedCount: completedGoals,
          totalCount: activeGoals.length + completedGoals,
        },
        streaks: {
          workout: workoutStreak,
          water: waterStreak,
          weight: weightStreak,
        },
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};