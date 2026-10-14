import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  calculateAll,
  calculateCaloriesBurned,
  estimateBodyFat,
  calculateAdvanced,
} from '../lib/calculations';
import { Gender } from '@prisma/client';

// =====================================================
//      محاسبه‌ی کامل بر اساس پروفایل کاربر
// =====================================================
export const getCalculations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'برای محاسبه، اول پروفایلت رو کامل کن',
        code: 'NO_PROFILE',
      });
      return;
    }

    const result = calculateAll({
      weight: profile.weight,
      height: profile.height,
      age: profile.age,
      gender: profile.gender,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
    });

    // ===== محاسبات پیشرفته (از آخرین اندازه‌های بدن) =====
    const latestMeasurement = await prisma.bodyMeasurement.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const advanced = calculateAdvanced({
      weight: profile.weight,
      height: profile.height,
      age: profile.age,
      gender: profile.gender,
      bmr: result.bmr,
      bmi: result.bmi,
      waist: latestMeasurement?.waist ?? null,
      hips: latestMeasurement?.hips ?? null,
      chest: latestMeasurement?.chest ?? null,
      shoulder: latestMeasurement?.shoulder ?? null,
      wrist: latestMeasurement?.wrist ?? null,
    });

    res.json({
      success: true,
      calculations: {
        ...result,
        advanced,
        hasMeasurements: !!latestMeasurement,
        lastMeasurementDate: latestMeasurement?.date ?? null,
        profile: {
          weight: profile.weight,
          height: profile.height,
          age: profile.age,
          gender: profile.gender,
          activityLevel: profile.activityLevel,
          goal: profile.goal,
          targetWeight: profile.targetWeight,
        },
      },
    });
  } catch (error) {
    console.error('getCalculations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =====================================================
//      محاسبه‌ی آنی (بدون نیاز به پروفایل)
// =====================================================
export const calculateInstant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { weight, height, age, gender, activityLevel, goal } = req.body;

    if (!weight || !height || !age || !gender || !activityLevel || !goal) {
      res.status(400).json({
        success: false,
        message: 'همه‌ی فیلدها الزامی است',
      });
      return;
    }

    const validGenders: Gender[] = ['MALE', 'FEMALE'];
    if (!validGenders.includes(gender)) {
      res.status(400).json({ success: false, message: 'جنسیت نامعتبر است' });
      return;
    }

    const result = calculateAll({
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      gender: gender as Gender,
      activityLevel,
      goal,
    });

    res.json({ success: true, calculations: result });
  } catch (error) {
    console.error('calculateInstant error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =====================================================
//      محاسبه‌ی کالری سوزانده‌شده برای یه تمرین
// =====================================================
export const calculateWorkoutCalories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { metValue, durationMinutes } = req.body;

    if (!metValue || !durationMinutes) {
      res.status(400).json({
        success: false,
        message: 'MET و مدت زمان الزامی است',
      });
      return;
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'برای محاسبه، اول پروفایلت رو کامل کن',
      });
      return;
    }

    const calories = calculateCaloriesBurned(
      Number(metValue),
      profile.weight,
      Number(durationMinutes)
    );

    res.json({
      success: true,
      calories,
      metValue: Number(metValue),
      duration: Number(durationMinutes),
      weight: profile.weight,
    });
  } catch (error) {
    console.error('calculateWorkoutCalories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =====================================================
//      تخمین چربی بدن از اندازه‌ها
// =====================================================
export const calculateBodyFat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { waist, neck, hip } = req.body;

    if (!waist || !neck) {
      res.status(400).json({
        success: false,
        message: 'اندازه‌ی کمر و گردن الزامی است',
      });
      return;
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'برای محاسبه، اول پروفایلت رو کامل کن',
      });
      return;
    }

    if (profile.gender === 'FEMALE' && !hip) {
      res.status(400).json({
        success: false,
        message: 'برای خانم‌ها، اندازه‌ی باسن هم الزامی است',
      });
      return;
    }

    const bodyFat = estimateBodyFat(
      profile.gender,
      Number(waist),
      Number(neck),
      profile.height,
      hip ? Number(hip) : undefined
    );

    // دسته‌بندی
    let category = '';
    let categoryKey = '';
    if (profile.gender === 'MALE') {
      if (bodyFat < 6) {
        category = 'ضروری';
        categoryKey = 'essential';
      } else if (bodyFat < 14) {
        category = 'ورزشکار';
        categoryKey = 'athlete';
      } else if (bodyFat < 18) {
        category = 'تناسب اندام';
        categoryKey = 'fitness';
      } else if (bodyFat < 25) {
        category = 'متوسط';
        categoryKey = 'average';
      } else {
        category = 'چاقی';
        categoryKey = 'obese';
      }
    } else {
      if (bodyFat < 14) {
        category = 'ضروری';
        categoryKey = 'essential';
      } else if (bodyFat < 21) {
        category = 'ورزشکار';
        categoryKey = 'athlete';
      } else if (bodyFat < 25) {
        category = 'تناسب اندام';
        categoryKey = 'fitness';
      } else if (bodyFat < 32) {
        category = 'متوسط';
        categoryKey = 'average';
      } else {
        category = 'چاقی';
        categoryKey = 'obese';
      }
    }

    res.json({
      success: true,
      bodyFat,
      category,
      categoryKey,
      inputs: { waist: Number(waist), neck: Number(neck), hip: hip ? Number(hip) : null },
    });
  } catch (error) {
    console.error('calculateBodyFat error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};