import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { todayTehran } from '../lib/dates';

export const getTodayWater = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const today = todayTehran();

    const [log, user] = await Promise.all([
      prisma.waterLog.findUnique({
        where: { userId_date: { userId, date: today } },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { waterGoal: true },
      }),
    ]);

    res.json({
      success: true,
      log: log ?? { amount: 0, date: today.toISOString() },
      goal: user?.waterGoal ?? 2000,
    });
  } catch (error) {
    console.error('getTodayWater error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addWater = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { amount } = req.body;

    if (amount === undefined || amount === null) {
      res.status(400).json({ success: false, message: 'amount is required' });
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      res.status(400).json({
        success: false,
        message: 'amount must be a positive number',
      });
      return;
    }

    const today = todayTehran();

    const existing = await prisma.waterLog.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    const log = await prisma.waterLog.upsert({
      where: { userId_date: { userId, date: today } },
      update: { amount: (existing?.amount ?? 0) + amountNum },
      create: { userId, date: today, amount: amountNum },
    });

    res.json({ success: true, log });
  } catch (error) {
    console.error('addWater error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetTodayWater = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const today = todayTehran();

    await prisma.waterLog.deleteMany({
      where: { userId, date: today },
    });

    res.json({ success: true, message: 'Water log reset' });
  } catch (error) {
    console.error('resetTodayWater error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getWaterStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const today = todayTehran();
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);

    const [logs, user] = await Promise.all([
      prisma.waterLog.findMany({
        where: { userId, date: { gte: weekStart } },
        orderBy: { date: 'asc' },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { waterGoal: true },
      }),
    ]);

    const totalWeek = logs.reduce((sum, l) => sum + l.amount, 0);
    const avgDaily = logs.length > 0 ? Math.round(totalWeek / 7) : 0;

    res.json({
      success: true,
      stats: {
        logs,
        totalWeek,
        avgDaily,
        goal: user?.waterGoal ?? 2000,
      },
    });
  } catch (error) {
    console.error('getWaterStats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateWaterGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { goal } = req.body;

    if (goal === undefined || goal === null) {
      res.status(400).json({ success: false, message: 'goal is required' });
      return;
    }

    const goalNum = Number(goal);
    if (isNaN(goalNum) || goalNum < 500 || goalNum > 10000) {
      res.status(400).json({
        success: false,
        message: 'goal must be between 500 and 10000 ml',
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { waterGoal: goalNum },
      select: { waterGoal: true },
    });

    res.json({ success: true, goal: user.waterGoal });
  } catch (error) {
    console.error('updateWaterGoal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};