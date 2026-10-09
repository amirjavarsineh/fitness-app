import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { toTehranDateKey, startOfDayTehran } from '../lib/dates';

export const getWeightLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const logs = await prisma.weightLog.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
    res.json({ success: true, logs });
  } catch (error) {
    console.error('getWeightLogs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const upsertWeightLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { weight, date, note } = req.body;

    if (weight === undefined || weight === null) {
      res.status(400).json({ success: false, message: 'weight is required' });
      return;
    }

    const weightNum = Number(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      res.status(400).json({ success: false, message: 'weight must be a positive number' });
      return;
    }

    const dateKey = date
      ? toTehranDateKey(new Date(date))
      : toTehranDateKey(new Date());
    const dateObj = startOfDayTehran(dateKey);

    const log = await prisma.weightLog.upsert({
      where: {
        userId_date: { userId, date: dateObj },
      },
      update: {
        weight: weightNum,
        note: note ?? null,
      },
      create: {
        userId,
        date: dateObj,
        weight: weightNum,
        note: note ?? null,
      },
    });

    res.json({ success: true, log });
  } catch (error) {
    console.error('upsertWeightLog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteWeightLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.weightLog.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Weight log not found' });
      return;
    }

    await prisma.weightLog.delete({ where: { id } });

    res.json({ success: true, message: 'Weight log deleted' });
  } catch (error) {
    console.error('deleteWeightLog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getWeightStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const logs = await prisma.weightLog.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    if (logs.length === 0) {
      res.json({
        success: true,
        stats: {
          current: null,
          start: null,
          change: 0,
          min: null,
          max: null,
          count: 0,
        },
      });
      return;
    }

    const first = logs[0].weight;
    const last = logs[logs.length - 1].weight;
    const weights = logs.map((l) => l.weight);

    res.json({
      success: true,
      stats: {
        current: last,
        start: first,
        change: Number((last - first).toFixed(1)),
        min: Math.min(...weights),
        max: Math.max(...weights),
        count: logs.length,
      },
    });
  } catch (error) {
    console.error('getWeightStats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};