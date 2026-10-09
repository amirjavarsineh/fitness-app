import { ActivityLevel, GoalType, Gender } from '@prisma/client';

/**
 * محاسبه BMI
 */
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters ** 2)).toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'کمبود وزن';
  if (bmi < 25) return 'وزن طبیعی';
  if (bmi < 30) return 'اضافه‌وزن';
  return 'چاقی';
}

/**
 * محاسبه BMR با فرمول Mifflin-St Jeor
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number {
  if (gender === 'MALE') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * محاسبه TDEE (کالری مورد نیاز روزانه)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTRA_ACTIVE: 1.9,
  };
  return Math.round(bmr * multipliers[activityLevel]);
}

/**
 * محاسبه کالری هدف بر اساس هدف کاربر
 */
export function calculateTargetCalories(tdee: number, goal: GoalType): number {
  switch (goal) {
    case 'LOSE_WEIGHT': return tdee - 500;   // کسری ۵۰۰ کالری
    case 'GAIN_MUSCLE': return tdee + 300;   // مازاد ۳۰۰ کالری
    default: return tdee;
  }
}

/**
 * محاسبه کالری سوزانده‌شده از تمرین (فرمول MET)
 * کالری = MET × وزن(کیلوگرم) × زمان(ساعت)
 */
export function calculateCaloriesBurned(
  metValue: number,
  weightKg: number,
  durationMinutes: number
): number {
  return parseFloat((metValue * weightKg * (durationMinutes / 60)).toFixed(1));
}

/**
 * محاسبه درصد چربی بدن (فرمول Navy)
 */
export function estimateBodyFat(
  gender: Gender,
  waist: number,
  neck: number,
  height: number,
  hip?: number
): number {
  if (gender === 'MALE') {
    return parseFloat(
      (495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(1)
    );
  }
  // برای زنان نیاز به اندازه باسن هست
  const h = hip ?? waist + 10;
  return parseFloat(
    (495 / (1.29579 - 0.35004 * Math.log10(waist + h - neck) + 0.22100 * Math.log10(height)) - 450).toFixed(1)
  );
}
