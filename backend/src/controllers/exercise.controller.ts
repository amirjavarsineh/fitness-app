import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getExercises = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, muscleGroup, search } = req.query;

    const where: {
      category?: string;
      muscleGroup?: string;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        nameFa?: { contains: string };
      }>;
    } = {};

    if (category && typeof category === 'string') {
      where.category = category;
    }

    if (muscleGroup && typeof muscleGroup === 'string') {
      where.muscleGroup = muscleGroup;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameFa: { contains: search } },
      ];
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: [{ category: 'asc' }, { nameFa: 'asc' }],
    });

    res.json({ success: true, exercises });
  } catch (error) {
    console.error('getExercises error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getExerciseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: req.params.id as string },
    });

    if (!exercise) {
      res.status(404).json({ success: false, message: 'Exercise not found' });
      return;
    }

    res.json({ success: true, exercise });
  } catch (error) {
    console.error('getExerciseById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCategories = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await prisma.exercise.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    const muscleGroups = await prisma.exercise.findMany({
      select: { muscleGroup: true },
      distinct: ['muscleGroup'],
    });

    res.json({
      success: true,
      categories: categories.map((c) => c.category),
      muscleGroups: muscleGroups
        .map((m) => m.muscleGroup)
        .filter((m): m is string => m !== null),
    });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};