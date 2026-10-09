import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// گرفتن همه یادآورها
export const getReminders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const reminders = await prisma.reminder.findMany({
      where: { userId },
      orderBy: { time: 'asc' },
    });

    res.json({ success: true, reminders });
  } catch (error) {
    console.error('getReminders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ساخت یادآور جدید
export const createReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, message, type, time, days, enabled } = req.body;

    if (!title || !time) {
      res.status(400).json({
        success: false,
        message: 'title and time are required',
      });
      return;
    }

    // چک فرمت زمان
    if (!/^\d{2}:\d{2}$/.test(time)) {
      res.status(400).json({
        success: false,
        message: 'time must be in HH:MM format',
      });
      return;
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        title,
        message: message ?? null,
        type: type ?? 'CUSTOM',
        time,
        days: days ?? 'ALL',
        enabled: enabled ?? true,
      },
    });

    res.status(201).json({ success: true, reminder });
  } catch (error) {
    console.error('createReminder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// آپدیت یادآور
export const updateReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.reminder.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Reminder not found' });
      return;
    }

    const { title, message, type, time, days, enabled } = req.body;

    if (time && !/^\d{2}:\d{2}$/.test(time)) {
      res.status(400).json({
        success: false,
        message: 'time must be in HH:MM format',
      });
      return;
    }

    const reminder = await prisma.reminder.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(message !== undefined && { message }),
        ...(type !== undefined && { type }),
        ...(time !== undefined && { time }),
        ...(days !== undefined && { days }),
        ...(enabled !== undefined && { enabled }),
      },
    });

    res.json({ success: true, reminder });
  } catch (error) {
    console.error('updateReminder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// حذف یادآور
export const deleteReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.reminder.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Reminder not found' });
      return;
    }

    await prisma.reminder.delete({ where: { id } });

    res.json({ success: true, message: 'Reminder deleted' });
  } catch (error) {
    console.error('deleteReminder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// toggle (فعال/غیرفعال)
export const toggleReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.reminder.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Reminder not found' });
      return;
    }

    const reminder = await prisma.reminder.update({
      where: { id },
      data: { enabled: !existing.enabled },
    });

    res.json({ success: true, reminder });
  } catch (error) {
    console.error('toggleReminder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};