import { prisma } from '../lib/prisma';
import { WorkoutType } from '@prisma/client';

export interface WorkoutExerciseDto {
  name: string;
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  duration?: number | null;
  restTime?: number | null;
  order?: number;
}

export interface CreateWorkoutDto {
  name?: string;
  description?: string;
  type: WorkoutType;
  duration: number;
  caloriesBurned?: number;
  notes?: string;
  exercises?: WorkoutExerciseDto[];
  isTemplate?: boolean;
}

export interface UpdateWorkoutDto {
  name?: string;
  description?: string;
  type?: WorkoutType;
  duration?: number;
  caloriesBurned?: number;
  notes?: string;
  exercises?: WorkoutExerciseDto[];
  isTemplate?: boolean;
}

export const getWorkoutsService = async (userId: string) => {
  return prisma.workout.findMany({
    where: { userId, isTemplate: false },
    orderBy: { createdAt: 'desc' },
    include: { exercises: { orderBy: { order: 'asc' } } },
  });
};

export const getTemplatesService = async (userId: string) => {
  return prisma.workout.findMany({
    where: { userId, isTemplate: true },
    orderBy: { createdAt: 'desc' },
    include: { exercises: { orderBy: { order: 'asc' } } },
  });
};

export const getWorkoutByIdService = async (userId: string, workoutId: string) => {
  return prisma.workout.findFirst({
    where: { id: workoutId, userId },
    include: { exercises: { orderBy: { order: 'asc' } } },
  });
};

export const createWorkoutService = async (userId: string, data: CreateWorkoutDto) => {
  return prisma.workout.create({
    data: {
      userId,
      name: data.name ?? null,
      description: data.description ?? null,
      type: data.type,
      duration: data.duration,
      caloriesBurned: data.caloriesBurned ?? null,
      notes: data.notes ?? null,
      isTemplate: data.isTemplate ?? false,
      exercises: data.exercises?.length
        ? {
            create: data.exercises.map((ex, i) => ({
              name: ex.name,
              sets: ex.sets ?? null,
              reps: ex.reps ?? null,
              weight: ex.weight ?? null,
              duration: ex.duration ?? null,
              restTime: ex.restTime ?? null,
              order: ex.order ?? i,
            })),
          }
        : undefined,
    },
    include: { exercises: true },
  });
};

export const updateWorkoutService = async (
  userId: string,
  workoutId: string,
  data: UpdateWorkoutDto
) => {
  const existing = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });

  if (!existing) {
    return null;
  }

  if (data.exercises !== undefined) {
    await prisma.workoutExercise.deleteMany({ where: { workoutId } });
  }

  return prisma.workout.update({
    where: { id: workoutId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.type && { type: data.type }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.caloriesBurned !== undefined && { caloriesBurned: data.caloriesBurned }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.isTemplate !== undefined && { isTemplate: data.isTemplate }),
      ...(data.exercises !== undefined && {
        exercises: {
          create: data.exercises.map((ex, i) => ({
            name: ex.name,
            sets: ex.sets ?? null,
            reps: ex.reps ?? null,
            weight: ex.weight ?? null,
            duration: ex.duration ?? null,
            restTime: ex.restTime ?? null,
            order: ex.order ?? i,
          })),
        },
      }),
    },
    include: { exercises: { orderBy: { order: 'asc' } } },
  });
};

export const deleteWorkoutService = async (userId: string, workoutId: string) => {
  return prisma.workout.deleteMany({
    where: { id: workoutId, userId },
  });
};

// ساخت تمرین از روی قالب
export const useTemplateService = async (userId: string, templateId: string) => {
  const template = await prisma.workout.findFirst({
    where: { id: templateId, userId, isTemplate: true },
    include: { exercises: { orderBy: { order: 'asc' } } },
  });

  if (!template) {
    return null;
  }

  return prisma.workout.create({
    data: {
      userId,
      name: template.name,
      description: template.description,
      type: template.type,
      duration: template.duration,
      notes: template.notes,
      isTemplate: false,
      exercises: {
        create: template.exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration,
          restTime: ex.restTime,
          order: ex.order,
        })),
      },
    },
    include: { exercises: { orderBy: { order: 'asc' } } },
  });
};