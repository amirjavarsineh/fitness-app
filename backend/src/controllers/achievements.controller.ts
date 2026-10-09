import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'workout' | 'streak' | 'water' | 'weight' | 'nutrition' | 'goal';
  requirement: number;
  unlocked: boolean;
  progress: number;
  unit: string;
  color: string;
}

function calculateBestStreak(dateKeys: string[]): number {
  if (dateKeys.length === 0) return 0;
  const sorted = Array.from(new Set(dateKeys)).sort();
  let best = 1;
  let running = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      running++;
      best = Math.max(best, running);
    } else {
      running = 1;
    }
  }
  return best;
}

function toDateKey(d: Date): string {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

export const getAchievements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const [user, workouts, waterLogs, weightLogs, nutritionLogs, goals] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { waterGoal: true } }),
      prisma.workout.findMany({ where: { userId, isTemplate: false }, select: { date: true } }),
      prisma.waterLog.findMany({ where: { userId }, select: { date: true, amount: true } }),
      prisma.weightLog.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
        select: { date: true, weight: true },
      }),
      prisma.nutritionLog.count({ where: { userId } }),
      prisma.goal.findMany({ where: { userId }, select: { status: true } }),
    ]);

    const DAILY_WATER_GOAL = user?.waterGoal ?? 2000;

    const totalWorkouts = workouts.length;
    const workoutStreak = calculateBestStreak(workouts.map((w) => toDateKey(w.date)));
    const waterMetDays = waterLogs.filter((w) => w.amount >= DAILY_WATER_GOAL).length;
    const totalWeightLogs = weightLogs.length;
    const totalNutritionLogs = nutritionLogs;
    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.status === 'COMPLETED').length;

    let weightLoss = 0;
    if (weightLogs.length >= 2) {
      const first = weightLogs[0].weight;
      const last = weightLogs[weightLogs.length - 1].weight;
      weightLoss = Math.max(0, first - last);
    }

    const achievements: Achievement[] = [
      // ===== Workout =====
      {
        id: 'first_workout',
        title: 'شروع سفر',
        description: 'اولین تمرینت رو ثبت کردی',
        emoji: '🥉',
        category: 'workout',
        requirement: 1,
        unlocked: totalWorkouts >= 1,
        progress: Math.min(totalWorkouts, 1),
        unit: 'تمرین',
        color: 'bronze',
      },
      {
        id: 'workout_10',
        title: 'ورزشکار',
        description: '۱۰ تمرین ثبت کردی',
        emoji: '🥈',
        category: 'workout',
        requirement: 10,
        unlocked: totalWorkouts >= 10,
        progress: Math.min(totalWorkouts, 10),
        unit: 'تمرین',
        color: 'silver',
      },
      {
        id: 'workout_50',
        title: 'قهرمان',
        description: '۵۰ تمرین ثبت کردی',
        emoji: '🥇',
        category: 'workout',
        requirement: 50,
        unlocked: totalWorkouts >= 50,
        progress: Math.min(totalWorkouts, 50),
        unit: 'تمرین',
        color: 'gold',
      },
      {
        id: 'workout_100',
        title: 'افسانه',
        description: '۱۰۰ تمرین ثبت کردی',
        emoji: '💎',
        category: 'workout',
        requirement: 100,
        unlocked: totalWorkouts >= 100,
        progress: Math.min(totalWorkouts, 100),
        unit: 'تمرین',
        color: 'diamond',
      },

      // ===== Streak =====
      {
        id: 'streak_3',
        title: 'گرم شدن',
        description: '۳ روز پیوسته تمرین کردی',
        emoji: '🔥',
        category: 'streak',
        requirement: 3,
        unlocked: workoutStreak >= 3,
        progress: Math.min(workoutStreak, 3),
        unit: 'روز',
        color: 'orange',
      },
      {
        id: 'streak_7',
        title: 'هفته آتشین',
        description: '۷ روز پیوسته تمرین کردی',
        emoji: '🔥',
        category: 'streak',
        requirement: 7,
        unlocked: workoutStreak >= 7,
        progress: Math.min(workoutStreak, 7),
        unit: 'روز',
        color: 'orange',
      },
      {
        id: 'streak_30',
        title: 'آتش جاودان',
        description: '۳۰ روز پیوسته تمرین کردی',
        emoji: '🌋',
        category: 'streak',
        requirement: 30,
        unlocked: workoutStreak >= 30,
        progress: Math.min(workoutStreak, 30),
        unit: 'روز',
        color: 'red',
      },

      // ===== Water =====
      {
        id: 'water_first',
        title: 'قطره اول',
        description: 'اولین آب رو ثبت کردی',
        emoji: '💧',
        category: 'water',
        requirement: 1,
        unlocked: waterLogs.length >= 1,
        progress: Math.min(waterLogs.length, 1),
        unit: 'ثبت',
        color: 'cyan',
      },
      {
        id: 'water_10',
        title: 'آب‌رسان',
        description: '۱۰ روز به هدف آب رسیدی',
        emoji: '🌊',
        category: 'water',
        requirement: 10,
        unlocked: waterMetDays >= 10,
        progress: Math.min(waterMetDays, 10),
        unit: 'روز',
        color: 'blue',
      },
      {
        id: 'water_30',
        title: 'اقیانوس',
        description: '۳۰ روز به هدف آب رسیدی',
        emoji: '🐋',
        category: 'water',
        requirement: 30,
        unlocked: waterMetDays >= 30,
        progress: Math.min(waterMetDays, 30),
        unit: 'روز',
        color: 'blue',
      },

      // ===== Weight =====
      {
        id: 'weight_first',
        title: 'اولین ثبت',
        description: 'اولین وزنت رو ثبت کردی',
        emoji: '⚖️',
        category: 'weight',
        requirement: 1,
        unlocked: totalWeightLogs >= 1,
        progress: Math.min(totalWeightLogs, 1),
        unit: 'ثبت',
        color: 'purple',
      },
      {
        id: 'weight_10',
        title: 'پیگیر',
        description: '۱۰ بار وزن ثبت کردی',
        emoji: '📊',
        category: 'weight',
        requirement: 10,
        unlocked: totalWeightLogs >= 10,
        progress: Math.min(totalWeightLogs, 10),
        unit: 'ثبت',
        color: 'purple',
      },
      {
        id: 'weight_loss_5',
        title: '۵ کیلو کمتر',
        description: '۵ کیلو کاهش وزن داشتی',
        emoji: '🎉',
        category: 'weight',
        requirement: 5,
        unlocked: weightLoss >= 5,
        progress: Math.min(weightLoss, 5),
        unit: 'کیلو',
        color: 'emerald',
      },

      // ===== Nutrition =====
      {
        id: 'nutrition_first',
        title: 'شروع تغذیه',
        description: 'اولین غذا رو ثبت کردی',
        emoji: '🍎',
        category: 'nutrition',
        requirement: 1,
        unlocked: totalNutritionLogs >= 1,
        progress: Math.min(totalNutritionLogs, 1),
        unit: 'وعده',
        color: 'green',
      },
      {
        id: 'nutrition_50',
        title: 'تغذیه‌شناس',
        description: '۵۰ غذا ثبت کردی',
        emoji: '🥗',
        category: 'nutrition',
        requirement: 50,
        unlocked: totalNutritionLogs >= 50,
        progress: Math.min(totalNutritionLogs, 50),
        unit: 'وعده',
        color: 'green',
      },

      // ===== Goal =====
      {
        id: 'goal_first',
        title: 'هدف‌گذار',
        description: 'اولین هدفت رو ساختی',
        emoji: '🎯',
        category: 'goal',
        requirement: 1,
        unlocked: totalGoals >= 1,
        progress: Math.min(totalGoals, 1),
        unit: 'هدف',
        color: 'pink',
      },
      {
        id: 'goal_completed_5',
        title: 'هدف‌شکن',
        description: '۵ هدف رو تکمیل کردی',
        emoji: '🏆',
        category: 'goal',
        requirement: 5,
        unlocked: completedGoals >= 5,
        progress: Math.min(completedGoals, 5),
        unit: 'هدف',
        color: 'amber',
      },
    ];

    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    const totalCount = achievements.length;

    res.json({
      success: true,
      achievements,
      summary: {
        unlocked: unlockedCount,
        total: totalCount,
        percent: Math.round((unlockedCount / totalCount) * 100),
      },
    });
  } catch (error) {
    console.error('getAchievements error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};