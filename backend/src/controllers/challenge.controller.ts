import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// گرفتن همه چالش‌ها
export const getChallenges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const challenges = await prisma.challenge.findMany({
      where: { userId },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, challenges });
  } catch (error) {
    console.error('getChallenges error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ساخت چالش جدید
export const createChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, description, emoji, type, targetDays } = req.body;

    if (!title || !targetDays) {
      res.status(400).json({
        success: false,
        message: 'title and targetDays are required',
      });
      return;
    }

    const days = Number(targetDays);
    if (isNaN(days) || days < 1 || days > 365) {
      res.status(400).json({
        success: false,
        message: 'targetDays must be between 1 and 365',
      });
      return;
    }

    const challenge = await prisma.challenge.create({
      data: {
        userId,
        title,
        description: description ?? null,
        emoji: emoji ?? '🎯',
        type: type ?? 'CUSTOM',
        targetDays: days,
      },
    });

    res.status(201).json({ success: true, challenge });
  } catch (error) {
    console.error('createChallenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ویرایش چالش
export const updateChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.challenge.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    const { title, description, emoji, type, targetDays } = req.body;

    const challenge = await prisma.challenge.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(emoji !== undefined && { emoji }),
        ...(type !== undefined && { type }),
        ...(targetDays !== undefined && { targetDays: Number(targetDays) }),
      },
    });

    res.json({ success: true, challenge });
  } catch (error) {
    console.error('updateChallenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// چک‌این روزانه
export const checkIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const challenge = await prisma.challenge.findFirst({ where: { id, userId } });
    if (!challenge) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    if (challenge.status !== 'ACTIVE') {
      res.status(400).json({
        success: false,
        message: 'فقط چالش‌های فعال قابل چک‌این هستن',
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().slice(0, 10);

    // چک کن امروز قبلاً چک‌این نکرده
    const dates = challenge.checkInDates
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    if (dates.includes(todayKey)) {
      res.status(400).json({
        success: false,
        message: 'امروز قبلاً چک‌این کردی',
      });
      return;
    }

    // چک کن آخرین چک‌این دیروز بوده (برای پیوستگی)
    let newCurrentDays = challenge.currentDays;

    if (challenge.lastCheckIn) {
      const lastDate = new Date(challenge.lastCheckIn);
      lastDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        // پیوسته
        newCurrentDays += 1;
      } else if (diffDays > 1) {
        // قطع شده، از ۱ شروع کن
        newCurrentDays = 1;
      }
    } else {
      // اولین چک‌این
      newCurrentDays = 1;
    }

    // چک کن به هدف رسیده
    const isCompleted = newCurrentDays >= challenge.targetDays;

    const updated = await prisma.challenge.update({
      where: { id },
      data: {
        currentDays: newCurrentDays,
        lastCheckIn: today,
        checkInDates: [...dates, todayKey].join(','),
        status: isCompleted ? 'COMPLETED' : 'ACTIVE',
      },
    });

    res.json({
      success: true,
      challenge: updated,
      completed: isCompleted,
    });
  } catch (error) {
    console.error('checkIn error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// لغو چالش
export const cancelChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.challenge.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.json({ success: true, challenge });
  } catch (error) {
    console.error('cancelChallenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// فعال‌سازی مجدد چالش
export const reactivateChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.challenge.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    res.json({ success: true, challenge });
  } catch (error) {
    console.error('reactivateChallenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// حذف چالش
export const deleteChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.challenge.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    await prisma.challenge.delete({ where: { id } });

    res.json({ success: true, message: 'Challenge deleted' });
  } catch (error) {
    console.error('deleteChallenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};