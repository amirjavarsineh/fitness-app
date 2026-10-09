import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { goalService } from '../services/goal.service';
import { GoalCategory, GoalStatus } from '@prisma/client';

export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goals = await goalService.getAll(req.userId!);
    res.json({ success: true, goals });
  } catch (error) {
    console.error('getGoals error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch goals' });
  }
};

export const getGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await goalService.getById(req.params.id as string, req.userId!);
    if (!goal) {
      res.status(404).json({ success: false, message: 'Goal not found' });
      return;
    }
    res.json({ success: true, goal });
  } catch (error) {
    console.error('getGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch goal' });
  }
};

export const createGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, goalType, targetValue, currentValue, deadline } = req.body;

    if (!title || !goalType || targetValue === undefined) {
      res.status(400).json({
        success: false,
        message: 'title, goalType, and targetValue are required',
      });
      return;
    }

    if (!Object.values(GoalCategory).includes(goalType)) {
      res.status(400).json({
        success: false,
        message: `Invalid goalType. Use: ${Object.values(GoalCategory).join(', ')}`,
      });
      return;
    }

    if (typeof targetValue !== 'number' || targetValue <= 0) {
      res.status(400).json({
        success: false,
        message: 'targetValue must be a positive number',
      });
      return;
    }

    const goal = await goalService.create(req.userId!, {
      title,
      description,
      goalType: goalType as GoalCategory,
      targetValue: Number(targetValue),
      currentValue: currentValue !== undefined ? Number(currentValue) : 0,
      deadline: deadline ? new Date(deadline) : undefined,
    });

    res.status(201).json({ success: true, goal });
  } catch (error) {
    console.error('createGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to create goal' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, goalType, targetValue, currentValue, deadline, status } = req.body;

    if (goalType && !Object.values(GoalCategory).includes(goalType)) {
      res.status(400).json({
        success: false,
        message: `Invalid goalType. Use: ${Object.values(GoalCategory).join(', ')}`,
      });
      return;
    }

    if (status && !Object.values(GoalStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Use: ${Object.values(GoalStatus).join(', ')}`,
      });
      return;
    }

    const goal = await goalService.update(req.params.id as string, req.userId!, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(goalType !== undefined && { goalType: goalType as GoalCategory }),
      ...(targetValue !== undefined && { targetValue: Number(targetValue) }),
      ...(currentValue !== undefined && { currentValue: Number(currentValue) }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : undefined }),
      ...(status !== undefined && { status: status as GoalStatus }),
    });

    if (!goal) {
      res.status(404).json({ success: false, message: 'Goal not found' });
      return;
    }

    res.json({ success: true, goal });
  } catch (error) {
    console.error('updateGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to update goal' });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await goalService.remove(req.params.id as string, req.userId!);
    if (!goal) {
      res.status(404).json({ success: false, message: 'Goal not found' });
      return;
    }
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    console.error('deleteGoal error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete goal' });
  }
};