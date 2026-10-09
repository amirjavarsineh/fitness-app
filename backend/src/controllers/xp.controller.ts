import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// محاسبه‌ی سطح از XP
function calculateLevel(xp: number): { level: number; xpInLevel: number; xpForNextLevel: number; totalXpForNextLevel: number } {
  // Level n requires totalXp = 50 * n * (n-1)
  // level = floor((1 + sqrt(1 + totalXp/12.5)) / 2)

  let level = 1;
  while (50 * (level + 1) * level <= xp) {
    level++;
  }

  const totalXpForCurrentLevel = 50 * level * (level - 1);
  const totalXpForNextLevel = 50 * (level + 1) * level;

  const xpInLevel = xp - totalXpForCurrentLevel;
  const xpForNextLevel = totalXpForNextLevel - totalXpForCurrentLevel;

  return {
    level,
    xpInLevel,
    xpForNextLevel,
    totalXpForNextLevel,
  };
}

// رتبه بر اساس سطح
function getRank(level: number): { title: string; emoji: string; color: string } {
  if (level >= 30) return { title: 'ابرقهرمان', emoji: '⚡', color: 'from-yellow-400 to-orange-500' };
  if (level >= 20) return { title: 'افسانه', emoji: '💎', color: 'from-cyan-400 to-blue-500' };
  if (level >= 15) return { title: 'استاد', emoji: '🏆', color: 'from-purple-400 to-pink-500' };
  if (level >= 10) return { title: 'حرفه‌ای', emoji: '🦅', color: 'from-emerald-400 to-cyan-500' };
  if (level >= 5) return { title: 'آماتور', emoji: '🐣', color: 'from-blue-400 to-emerald-500' };
  return { title: 'مبتدی', emoji: '🥚', color: 'from-slate-400 to-slate-600' };
}

// XP به ازای هر فعالیت
const XP_VALUES = {
  WORKOUT: 50,
  NUTRITION: 10,
  WATER_DAY: 20,
  WEIGHT: 15,
  MEASUREMENT: 10,
  CHALLENGE_CHECKIN: 30,
  GOAL_COMPLETED: 100,
};

export const getXpProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const [
      workoutsCount,
      nutritionCount,
      weightCount,
      measurementCount,
      completedGoalsCount,
      challenges,
      user,
      waterLogs,
    ] = await Promise.all([
      prisma.workout.count({ where: { userId, isTemplate: false } }),
      prisma.nutritionLog.count({ where: { userId } }),
      prisma.weightLog.count({ where: { userId } }),
      prisma.bodyMeasurement.count({ where: { userId } }),
      prisma.goal.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.challenge.findMany({ where: { userId }, select: { checkInDates: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { waterGoal: true } }),
      prisma.waterLog.findMany({ where: { userId }, select: { amount: true } }),
    ]);

    // محاسبه‌ی چک‌این‌های چالش
    let challengeCheckIns = 0;
    for (const ch of challenges) {
      challengeCheckIns += ch.checkInDates
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean).length;
    }

    // محاسبه‌ی روزهای آب کامل
    const waterGoal = user?.waterGoal ?? 2000;
    const waterMetDays = waterLogs.filter((w) => w.amount >= waterGoal).length;

    // محاسبه‌ی کل XP
    const breakdown = {
      workouts: workoutsCount * XP_VALUES.WORKOUT,
      nutrition: nutritionCount * XP_VALUES.NUTRITION,
      water: waterMetDays * XP_VALUES.WATER_DAY,
      weight: weightCount * XP_VALUES.WEIGHT,
      measurements: measurementCount * XP_VALUES.MEASUREMENT,
      challenges: challengeCheckIns * XP_VALUES.CHALLENGE_CHECKIN,
      goals: completedGoalsCount * XP_VALUES.GOAL_COMPLETED,
    };

    const totalXp =
      breakdown.workouts +
      breakdown.nutrition +
      breakdown.water +
      breakdown.weight +
      breakdown.measurements +
      breakdown.challenges +
      breakdown.goals;

    const levelInfo = calculateLevel(totalXp);
    const rank = getRank(levelInfo.level);

    res.json({
      success: true,
      profile: {
        totalXp,
        level: levelInfo.level,
        xpInLevel: levelInfo.xpInLevel,
        xpForNextLevel: levelInfo.xpForNextLevel,
        totalXpForNextLevel: levelInfo.totalXpForNextLevel,
        rank,
        breakdown,
        counts: {
          workouts: workoutsCount,
          nutrition: nutritionCount,
          waterDays: waterMetDays,
          weight: weightCount,
          measurements: measurementCount,
          challengeCheckIns,
          goalsCompleted: completedGoalsCount,
        },
        xpValues: XP_VALUES,
      },
    });
  } catch (error) {
    console.error('getXpProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// XP خلاصه (برای داشبورد)
export const getXpSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const [
      workoutsCount,
      nutritionCount,
      weightCount,
      measurementCount,
      completedGoalsCount,
      challenges,
      user,
      waterLogs,
    ] = await Promise.all([
      prisma.workout.count({ where: { userId, isTemplate: false } }),
      prisma.nutritionLog.count({ where: { userId } }),
      prisma.weightLog.count({ where: { userId } }),
      prisma.bodyMeasurement.count({ where: { userId } }),
      prisma.goal.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.challenge.findMany({ where: { userId }, select: { checkInDates: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { waterGoal: true } }),
      prisma.waterLog.findMany({ where: { userId }, select: { amount: true } }),
    ]);

    let challengeCheckIns = 0;
    for (const ch of challenges) {
      challengeCheckIns += ch.checkInDates
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean).length;
    }

    const waterGoal = user?.waterGoal ?? 2000;
    const waterMetDays = waterLogs.filter((w) => w.amount >= waterGoal).length;

    const totalXp =
      workoutsCount * XP_VALUES.WORKOUT +
      nutritionCount * XP_VALUES.NUTRITION +
      waterMetDays * XP_VALUES.WATER_DAY +
      weightCount * XP_VALUES.WEIGHT +
      measurementCount * XP_VALUES.MEASUREMENT +
      challengeCheckIns * XP_VALUES.CHALLENGE_CHECKIN +
      completedGoalsCount * XP_VALUES.GOAL_COMPLETED;

    const levelInfo = calculateLevel(totalXp);
    const rank = getRank(levelInfo.level);

    res.json({
      success: true,
      summary: {
        totalXp,
        level: levelInfo.level,
        xpInLevel: levelInfo.xpInLevel,
        xpForNextLevel: levelInfo.xpForNextLevel,
        rank,
      },
    });
  } catch (error) {
    console.error('getXpSummary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};