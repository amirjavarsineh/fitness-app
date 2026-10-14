import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { toTehranDateKey, startOfDayTehran } from '../lib/dates';

export const createNutritionLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { foodName, calories, protein, carbs, fat, mealType } = req.body;

    if (!foodName || !calories || !mealType) {
      res.status(400).json({ success: false, message: 'foodName, calories, and mealType are required' });
      return;
    }

    const log = await prisma.nutritionLog.create({
      data: {
        userId,
        foodName,
        calories: Number(calories),
        protein: protein ? Number(protein) : null,
        carbs: carbs ? Number(carbs) : null,
        fat: fat ? Number(fat) : null,
        mealType,
      },
    });

    res.status(201).json({ success: true, log });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getNutritionLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { date } = req.query;

    // اگه کاربر تاریخی نفرستاد، امروز به وقت تهران رو استفاده کن
    const dateKey =
      date && typeof date === 'string'
        ? toTehranDateKey(new Date(date))
        : toTehranDateKey(new Date());

    const dayStart = startOfDayTehran(dateKey);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        createdAt: { gte: dayStart, lt: dayEnd },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totals = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + (log.protein ?? 0),
        carbs: acc.carbs + (log.carbs ?? 0),
        fat: acc.fat + (log.fat ?? 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    res.json({ success: true, logs, totals });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateNutritionLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.nutritionLog.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Log not found' });
      return;
    }

    const { foodName, calories, protein, carbs, fat, mealType } = req.body;

    const log = await prisma.nutritionLog.update({
      where: { id },
      data: {
        ...(foodName && { foodName }),
        ...(calories !== undefined && { calories: Number(calories) }),
        ...(protein !== undefined && { protein: Number(protein) }),
        ...(carbs !== undefined && { carbs: Number(carbs) }),
        ...(fat !== undefined && { fat: Number(fat) }),
        ...(mealType && { mealType }),
      },
    });

    res.json({ success: true, log });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteNutritionLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.nutritionLog.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Log not found' });
      return;
    }

    await prisma.nutritionLog.delete({ where: { id } });
    res.json({ success: true, message: 'Log deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};