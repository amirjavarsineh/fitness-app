import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// گرفتن همه اندازه‌ها
export const getMeasurements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const measurements = await prisma.bodyMeasurement.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    res.json({ success: true, measurements });
  } catch (error) {
    console.error('getMeasurements error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ثبت یا آپدیت اندازه‌ها
export const upsertMeasurement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { date, neck, chest, waist, hips, bicep, forearm, thigh, calf, note } = req.body;

    const dateObj = date ? new Date(date) : new Date();
    dateObj.setHours(0, 0, 0, 0);

    // تبدیل به عدد یا null
    const toNum = (v: unknown) => {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(v);
      return isNaN(n) ? null : n;
    };

    const data = {
      neck: toNum(neck),
      chest: toNum(chest),
      waist: toNum(waist),
      hips: toNum(hips),
      bicep: toNum(bicep),
      forearm: toNum(forearm),
      thigh: toNum(thigh),
      calf: toNum(calf),
      note: note ?? null,
    };

    const measurement = await prisma.bodyMeasurement.upsert({
      where: {
        userId_date: { userId, date: dateObj },
      },
      update: data,
      create: {
        userId,
        date: dateObj,
        ...data,
      },
    });

    res.json({ success: true, measurement });
  } catch (error) {
    console.error('upsertMeasurement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// حذف یه اندازه
export const deleteMeasurement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const existing = await prisma.bodyMeasurement.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Measurement not found' });
      return;
    }

    await prisma.bodyMeasurement.delete({ where: { id } });

    res.json({ success: true, message: 'Measurement deleted' });
  } catch (error) {
    console.error('deleteMeasurement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// آمار: آخرین اندازه‌ها و تغییرات
export const getMeasurementStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const measurements = await prisma.bodyMeasurement.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    if (measurements.length === 0) {
      res.json({
        success: true,
        stats: {
          latest: null,
          first: null,
          changes: null,
          count: 0,
        },
      });
      return;
    }

    const first = measurements[0];
    const latest = measurements[measurements.length - 1];

    const fields = ['neck', 'chest', 'waist', 'hips', 'bicep', 'forearm', 'thigh', 'calf'] as const;

    const changes: Record<string, number | null> = {};
    for (const field of fields) {
      const f = first[field];
      const l = latest[field];
      if (f !== null && l !== null) {
        changes[field] = Number((l - f).toFixed(1));
      } else {
        changes[field] = null;
      }
    }

    res.json({
      success: true,
      stats: {
        latest,
        first,
        changes,
        count: measurements.length,
      },
    });
  } catch (error) {
    console.error('getMeasurementStats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};