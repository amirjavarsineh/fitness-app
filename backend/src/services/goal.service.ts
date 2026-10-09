import { prisma } from '../lib/prisma';
import { GoalCategory, GoalStatus } from '@prisma/client';

export interface CreateGoalInput {
  title: string;
  description?: string;
  goalType: GoalCategory;
  targetValue: number;
  currentValue?: number;
  deadline?: Date;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  goalType?: GoalCategory;
  targetValue?: number;
  currentValue?: number;
  deadline?: Date;
  status?: GoalStatus;
}

export const goalService = {
  async getAll(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string, userId: string) {
    return prisma.goal.findFirst({ where: { id, userId } });
  },

  async create(userId: string, data: CreateGoalInput) {
    return prisma.goal.create({
      data: {
        userId,
        title: data.title,
        description: data.description ?? null,
        goalType: data.goalType,
        targetValue: data.targetValue,
        currentValue: data.currentValue ?? 0,
        deadline: data.deadline ?? null,
      },
    });
  },

  async update(id: string, userId: string, data: UpdateGoalInput) {
    const existing = await prisma.goal.findFirst({ where: { id, userId } });
    if (!existing) return null;

    // محاسبه مقادیر نهایی برای auto-complete
    const finalCurrent =
      data.currentValue !== undefined ? data.currentValue : existing.currentValue;
    const finalTarget =
      data.targetValue !== undefined ? data.targetValue : existing.targetValue;

    // منطق status
    let resolvedStatus: GoalStatus = existing.status;
    if (data.status !== undefined) {
      resolvedStatus = data.status;
    } else if (finalCurrent >= finalTarget) {
      resolvedStatus = 'COMPLETED';
    } else if (existing.status === 'COMPLETED') {
      resolvedStatus = 'ACTIVE';
    }

    return prisma.goal.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.goalType !== undefined && { goalType: data.goalType }),
        ...(data.targetValue !== undefined && { targetValue: data.targetValue }),
        ...(data.currentValue !== undefined && { currentValue: data.currentValue }),
        ...(data.deadline !== undefined && { deadline: data.deadline }),
        status: resolvedStatus,
      },
    });
  },

  async remove(id: string, userId: string) {
    const existing = await prisma.goal.findFirst({ where: { id, userId } });
    if (!existing) return null;
    return prisma.goal.delete({ where: { id } });
  },
};