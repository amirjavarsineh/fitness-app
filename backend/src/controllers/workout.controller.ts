import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { WorkoutType } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { useTemplateService } from '../services/workout.service';

export const getWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.userId!, isTemplate: false },
      include: { exercises: { orderBy: { order: 'asc' } } },
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, workouts });
  } catch (error) {
    console.error('getWorkouts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getTemplates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const templates = await prisma.workout.findMany({
      where: { userId: req.userId!, isTemplate: true },
      include: { exercises: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, templates });
  } catch (error) {
    console.error('getTemplates error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const useTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await useTemplateService(req.userId!, req.params.id as string);
    if (!workout) {
      res.status(404).json({ success: false, message: 'Template not found' });
      return;
    }
    res.status(201).json({ success: true, workout });
  } catch (error) {
    console.error('useTemplate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await prisma.workout.findFirst({
      where: { id: req.params.id as string, userId: req.userId! },
      include: { exercises: { orderBy: { order: 'asc' } } },
    });

    if (!workout) {
      res.status(404).json({ success: false, message: 'Workout not found' });
      return;
    }

    res.json({ success: true, workout });
  } catch (error) {
    console.error('getWorkout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, type, duration, date, caloriesBurned, notes, exercises, isTemplate } = req.body;

    if (!type || !duration) {
      res.status(400).json({ success: false, message: 'type and duration are required' });
      return;
    }

    if (!Object.values(WorkoutType).includes(type)) {
      res.status(400).json({
        success: false,
        message: `Invalid type. Use: ${Object.values(WorkoutType).join(', ')}`,
      });
      return;
    }

    if (typeof duration !== 'number' || duration <= 0) {
      res.status(400).json({ success: false, message: 'duration must be a positive number (minutes)' });
      return;
    }

    const workout = await prisma.workout.create({
      data: {
        userId: req.userId!,
        name: name ?? null,
        description: description ?? null,
        type: type as WorkoutType,
        duration,
        date: date ? new Date(date) : new Date(),
        caloriesBurned: caloriesBurned ? Number(caloriesBurned) : null,
        notes: notes ?? null,
        isTemplate: isTemplate ?? false,
        exercises: {
          create: Array.isArray(exercises)
            ? exercises.map((ex: any, idx: number) => ({
                name: ex.name,
                sets: ex.sets ?? null,
                reps: ex.reps ?? null,
                weight: ex.weight != null ? Number(ex.weight) : null,
                duration: ex.duration != null ? Number(ex.duration) : null,
                restTime: ex.restTime != null ? Number(ex.restTime) : null,
                order: ex.order ?? idx,
              }))
            : [],
        },
      },
      include: { exercises: { orderBy: { order: 'asc' } } },
    });

    res.status(201).json({ success: true, workout });
  } catch (error) {
    console.error('createWorkout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workoutId = req.params.id as string;

    const existing = await prisma.workout.findFirst({
      where: { id: workoutId, userId: req.userId! },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Workout not found' });
      return;
    }

    const { name, description, type, duration, date, caloriesBurned, notes, exercises, isTemplate } = req.body;

    if (type && !Object.values(WorkoutType).includes(type)) {
      res.status(400).json({
        success: false,
        message: `Invalid type. Use: ${Object.values(WorkoutType).join(', ')}`,
      });
      return;
    }

    const workout = await prisma.$transaction(async (tx) => {
      if (Array.isArray(exercises)) {
        await tx.workoutExercise.deleteMany({ where: { workoutId } });
      }

      return tx.workout.update({
        where: { id: workoutId },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(type && { type: type as WorkoutType }),
          ...(duration && { duration: Number(duration) }),
          ...(date && { date: new Date(date) }),
          ...(caloriesBurned !== undefined && { caloriesBurned: caloriesBurned ? Number(caloriesBurned) : null }),
          ...(notes !== undefined && { notes }),
          ...(isTemplate !== undefined && { isTemplate }),
          ...(Array.isArray(exercises) && {
            exercises: {
              create: exercises.map((ex: any, idx: number) => ({
                name: ex.name,
                sets: ex.sets ?? null,
                reps: ex.reps ?? null,
                weight: ex.weight != null ? Number(ex.weight) : null,
                duration: ex.duration != null ? Number(ex.duration) : null,
                restTime: ex.restTime != null ? Number(ex.restTime) : null,
                order: ex.order ?? idx,
              })),
            },
          }),
        },
        include: { exercises: { orderBy: { order: 'asc' } } },
      });
    });

    res.json({ success: true, workout });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workoutId = req.params.id as string;

    const existing = await prisma.workout.findFirst({
      where: { id: workoutId, userId: req.userId! },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Workout not found' });
      return;
    }

    await prisma.workout.delete({ where: { id: workoutId } });
    res.json({ success: true, message: 'Workout deleted' });
  } catch (error) {
    console.error('deleteWorkout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};