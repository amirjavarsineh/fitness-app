import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

interface DailyData {
  date: string;
  workoutsCount: number;
  workoutsDuration: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  weight: number | null;
}

export const getWeeklyReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    // ۷ روز اخیر
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: DailyData[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);

      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      // workoutهای این روز
      const workouts = await prisma.workout.findMany({
        where: {
          userId,
          date: { gte: day, lt: nextDay },
        },
      });

      // nutrition این روز
      const nutritionLogs = await prisma.nutritionLog.findMany({
        where: {
          userId,
          createdAt: { gte: day, lt: nextDay },
        },
      });

      // آب این روز
      const waterLog = await prisma.waterLog.findUnique({
        where: { userId_date: { userId, date: day } },
      });

      // وزن این روز
      const weightLog = await prisma.weightLog.findUnique({
        where: { userId_date: { userId, date: day } },
      });

      const workoutsDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
      const caloriesBurned = workouts.reduce(
        (sum, w) => sum + (w.caloriesBurned ?? 0),
        0
      );
      const caloriesConsumed = nutritionLogs.reduce((sum, n) => sum + n.calories, 0);
      const protein = nutritionLogs.reduce((sum, n) => sum + (n.protein ?? 0), 0);
      const carbs = nutritionLogs.reduce((sum, n) => sum + (n.carbs ?? 0), 0);
      const fat = nutritionLogs.reduce((sum, n) => sum + (n.fat ?? 0), 0);

      days.push({
        date: day.toISOString(),
        workoutsCount: workouts.length,
        workoutsDuration,
        caloriesBurned,
        caloriesConsumed,
        protein: Number(protein.toFixed(1)),
        carbs: Number(carbs.toFixed(1)),
        fat: Number(fat.toFixed(1)),
        water: waterLog?.amount ?? 0,
        weight: weightLog?.weight ?? null,
      });
    }

    // آمار خلاصه
    const totalWorkouts = days.reduce((sum, d) => sum + d.workoutsCount, 0);
    const totalDuration = days.reduce((sum, d) => sum + d.workoutsDuration, 0);
    const totalCaloriesBurned = days.reduce((sum, d) => sum + d.caloriesBurned, 0);
    const totalCaloriesConsumed = days.reduce((sum, d) => sum + d.caloriesConsumed, 0);
    const totalWater = days.reduce((sum, d) => sum + d.water, 0);
    const avgWater = Math.round(totalWater / 7);

    // وزن: اولین و آخرین ثبت هفته
    const weights = days.filter((d) => d.weight !== null).map((d) => d.weight!);
    const weightChange =
      weights.length >= 2
        ? Number((weights[weights.length - 1] - weights[0]).toFixed(1))
        : 0;

    res.json({
      success: true,
      report: {
        days,
        summary: {
          totalWorkouts,
          totalDuration,
          totalCaloriesBurned,
          totalCaloriesConsumed,
          totalWater,
          avgWater,
          weightChange,
          daysWithWorkouts: days.filter((d) => d.workoutsCount > 0).length,
          daysWithNutrition: days.filter((d) => d.caloriesConsumed > 0).length,
          daysWithWater: days.filter((d) => d.water > 0).length,
        },
      },
    });
  } catch (error) {
    console.error('getWeeklyReport error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};