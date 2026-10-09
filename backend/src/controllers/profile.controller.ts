import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Gender, ActivityLevel, GoalType } from '@prisma/client';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId! },
    });

    res.json({ success: true, profile });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const upsertProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { age, weight, height, gender, activityLevel, goal, targetWeight } = req.body;

    // Validate required fields on create
    if (!age || !weight || !height || !gender || !activityLevel || !goal) {
      res.status(400).json({
        success: false,
        message: 'age, weight, height, gender, activityLevel, goal are required',
      });
      return;
    }

    // Validate enums
    if (!Object.values(Gender).includes(gender)) {
      res.status(400).json({
        success: false,
        message: `Invalid gender. Use: ${Object.values(Gender).join(', ')}`,
      });
      return;
    }
    if (!Object.values(ActivityLevel).includes(activityLevel)) {
      res.status(400).json({
        success: false,
        message: `Invalid activityLevel. Use: ${Object.values(ActivityLevel).join(', ')}`,
      });
      return;
    }
    if (!Object.values(GoalType).includes(goal)) {
      res.status(400).json({
        success: false,
        message: `Invalid goal. Use: ${Object.values(GoalType).join(', ')}`,
      });
      return;
    }

    const data = {
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender: gender as Gender,
      activityLevel: activityLevel as ActivityLevel,
      goal: goal as GoalType,
      targetWeight: targetWeight ? Number(targetWeight) : null,
    };

    const profile = await prisma.profile.upsert({
      where: { userId: req.userId! },
      update: data,
      create: { userId: req.userId!, ...data },
    });

    res.json({ success: true, profile });
  } catch (error) {
    console.error('upsertProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};