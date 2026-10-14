import { ActivityLevel, GoalType, Gender } from '@prisma/client';

// =====================================================
//                    BMI
// =====================================================

/**
 * محاسبه BMI (شاخص توده بدنی)
 * فرمول: وزن (kg) / قد (m)²
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

export function getBMICategoryKey(bmi: number): string {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

/**
 * بازه‌ی وزن سالم بر اساس قد (BMI بین ۱۸.۵ تا ۲۵)
 */
export function getIdealWeightRange(height: number): {
  min: number;
  max: number;
} {
  const heightInMeters = height / 100;
  const min = parseFloat((18.5 * heightInMeters ** 2).toFixed(1));
  const max = parseFloat((24.9 * heightInMeters ** 2).toFixed(1));
  return { min, max };
}

// =====================================================
//                    BMR
// =====================================================

/**
 * محاسبه BMR با فرمول Mifflin-St Jeor
 * (دقیق‌ترین فرمول برای عموم)
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number {
  if (gender === 'MALE') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

// =====================================================
//                    TDEE
// =====================================================

/**
 * محاسبه TDEE (کل کالری روزانه)
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

// =====================================================
//                Target Calories
// =====================================================

/**
 * کالری هدف بر اساس هدف کاربر
 */
export function calculateTargetCalories(tdee: number, goal: GoalType): number {
  switch (goal) {
    case 'LOSE_WEIGHT':
      return Math.round(tdee - 500); // کسری ۵۰۰ کالری
    case 'GAIN_MUSCLE':
      return Math.round(tdee + 300); // مازاد ۳۰۰ کالری
    default:
      return tdee;
  }
}

// =====================================================
//                Macros (درشت‌مغذی‌ها)
// =====================================================

export interface MacroBreakdown {
  protein: number; // گرم
  carbs: number; // گرم
  fat: number; // گرم
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
}

/**
 * محاسبه درشت‌مغذی‌ها بر اساس هدف
 * - کاهش وزن: پروتئین بالا
 * - عضله‌سازی: کربوهیدرات بالا
 * - حفظ: متعادل
 */
export function calculateMacros(
  targetCalories: number,
  goal: GoalType,
  weight: number
): MacroBreakdown {
  let proteinPercent: number;
  let carbsPercent: number;
  let fatPercent: number;

  switch (goal) {
    case 'LOSE_WEIGHT':
      proteinPercent = 40;
      carbsPercent = 30;
      fatPercent = 30;
      break;
    case 'GAIN_MUSCLE':
      proteinPercent = 30;
      carbsPercent = 45;
      fatPercent = 25;
      break;
    default:
      proteinPercent = 30;
      carbsPercent = 40;
      fatPercent = 30;
  }

  const proteinCalories = Math.round((targetCalories * proteinPercent) / 100);
  const carbsCalories = Math.round((targetCalories * carbsPercent) / 100);
  const fatCalories = Math.round((targetCalories * fatPercent) / 100);

  return {
    protein: Math.round(proteinCalories / 4), // ۱ گرم پروتئین = ۴ کالری
    carbs: Math.round(carbsCalories / 4), // ۱ گرم کربوهیدرات = ۴ کالری
    fat: Math.round(fatCalories / 9), // ۱ گرم چربی = ۹ کالری
    proteinPercent,
    carbsPercent,
    fatPercent,
    proteinCalories,
    carbsCalories,
    fatCalories,
  };
}

// =====================================================
//            Calories Burned (MET)
// =====================================================

/**
 * محاسبه کالری سوزانده‌شده از تمرین
 * فرمول: MET × وزن (kg) × زمان (ساعت)
 */
export function calculateCaloriesBurned(
  metValue: number,
  weightKg: number,
  durationMinutes: number
): number {
  return parseFloat((metValue * weightKg * (durationMinutes / 60)).toFixed(1));
}

// =====================================================
//                Body Fat (Navy)
// =====================================================

/**
 * تخمین درصد چربی بدن با فرمول Navy
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
      (
        495 /
          (1.0324 -
            0.19077 * Math.log10(waist - neck) +
            0.15456 * Math.log10(height)) -
        450
      ).toFixed(1)
    );
  }
  const h = hip ?? waist + 10;
  return parseFloat(
    (
      495 /
        (1.29579 -
          0.35004 * Math.log10(waist + h - neck) +
          0.221 * Math.log10(height)) -
      450
    ).toFixed(1)
  );
}

// =====================================================
//                Water Goal
// =====================================================

/**
 * محاسبه هدف آب روزانه بر اساس وزن
 * حدوداً ۳۵ میلی‌لیتر به ازای هر کیلوگرم
 */
export function calculateWaterGoal(weight: number): number {
  const goal = Math.round(weight * 35);
  // محدود بین ۱.۵ تا ۵ لیتر
  return Math.max(1500, Math.min(5000, goal));
}

// =====================================================
//                BMR Category Info
// =====================================================

export interface CalculationResult {
  bmi: number;
  bmiCategory: string;
  bmiCategoryKey: string;
  idealWeightRange: { min: number; max: number };
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: MacroBreakdown;
  waterGoal: number;
  activityMultiplier: number;
}

/**
 * محاسبه‌ی همه‌چیز با یه تابع
 */
export function calculateAll(params: {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: GoalType;
}): CalculationResult {
  const { weight, height, age, gender, activityLevel, goal } = params;

  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const bmiCategoryKey = getBMICategoryKey(bmi);
  const idealWeightRange = getIdealWeightRange(height);

  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, goal);

  const macros = calculateMacros(targetCalories, goal, weight);
  const waterGoal = calculateWaterGoal(weight);

  const multipliers: Record<ActivityLevel, number> = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTRA_ACTIVE: 1.9,
  };

  return {
    bmi,
    bmiCategory,
    bmiCategoryKey,
    idealWeightRange,
    bmr,
    tdee,
    targetCalories,
    macros,
    waterGoal,
    activityMultiplier: multipliers[activityLevel],
  };
}


// =====================================================
//         ADVANCED BODY COMPOSITION CALCULATIONS
// =====================================================

/**
 * جرم بدون چربی (Lean Body Mass) - فرمول Boer
 * بخش بدون چربی بدن (عضله، استخوان، آب، اندام)
 */
export function calculateLeanBodyMass(
  weight: number,
  height: number,
  gender: Gender
): number {
  if (gender === 'MALE') {
    return parseFloat((0.407 * weight + 0.267 * height - 19.2).toFixed(1));
  }
  return parseFloat((0.252 * weight + 0.473 * height - 48.3).toFixed(1));
}

/**
 * توده عضلانی اسکلتی (Skeletal Muscle Mass) - تخمین
 * حدوداً ۵۳٪ از جرم بدون چربی برای مردها، ۴۹٪ برای زن‌ها
 */
export function calculateSkeletalMuscleMass(
  leanBodyMass: number,
  gender: Gender
): number {
  const ratio = gender === 'MALE' ? 0.53 : 0.49;
  return parseFloat((leanBodyMass * ratio).toFixed(1));
}

/**
 * شاخص توده بدون چربی (FFMI)
 * یه معیار حرفه‌ای برای ورزشکارها
 */
export function calculateFFMI(leanBodyMass: number, height: number): number {
  const heightInMeters = height / 100;
  return parseFloat((leanBodyMass / heightInMeters ** 2).toFixed(1));
}

export function getFFMICategory(ffmi: number, gender: Gender): {
  label: string;
  labelKey: string;
  color: string;
} {
  if (gender === 'MALE') {
    if (ffmi < 18) return { label: 'زیر میانگین', labelKey: 'belowAverage', color: 'slate' };
    if (ffmi < 20) return { label: 'میانگین', labelKey: 'average', color: 'blue' };
    if (ffmi < 22) return { label: 'خوب', labelKey: 'good', color: 'emerald' };
    if (ffmi < 24) return { label: 'عالی', labelKey: 'excellent', color: 'amber' };
    return { label: 'فوق‌العاده', labelKey: 'elite', color: 'purple' };
  }
  if (ffmi < 15) return { label: 'زیر میانگین', labelKey: 'belowAverage', color: 'slate' };
  if (ffmi < 17) return { label: 'میانگین', labelKey: 'average', color: 'blue' };
  if (ffmi < 19) return { label: 'خوب', labelKey: 'good', color: 'emerald' };
  if (ffmi < 21) return { label: 'عالی', labelKey: 'excellent', color: 'amber' };
  return { label: 'فوق‌العاده', labelKey: 'elite', color: 'purple' };
}

// =====================================================
//              HEALTH RATIOS
// =====================================================

/**
 * نسبت دور کمر به باسن (WHR)
 */
export function calculateWHR(waist: number, hips: number): number {
  return parseFloat((waist / hips).toFixed(2));
}

export function getWHRRisk(whr: number, gender: Gender): {
  label: string;
  labelKey: string;
  color: string;
} {
  if (gender === 'MALE') {
    if (whr < 0.9) return { label: 'خطر کم', labelKey: 'low', color: 'emerald' };
    if (whr < 0.95) return { label: 'خطر متوسط', labelKey: 'moderate', color: 'amber' };
    return { label: 'خطر بالا', labelKey: 'high', color: 'red' };
  }
  if (whr < 0.8) return { label: 'خطر کم', labelKey: 'low', color: 'emerald' };
  if (whr < 0.85) return { label: 'خطر متوسط', labelKey: 'moderate', color: 'amber' };
  return { label: 'خطر بالا', labelKey: 'high', color: 'red' };
}

/**
 * نسبت دور کمر به قد (WHtR)
 * دقیق‌تر از BMI برای تشخیص چربی اضافی
 */
export function calculateWHtR(waist: number, height: number): number {
  return parseFloat((waist / height).toFixed(2));
}

export function getWHtRCategory(whtr: number): {
  label: string;
  labelKey: string;
  color: string;
} {
  if (whtr < 0.4) return { label: 'خیلی لاغر', labelKey: 'verySlim', color: 'blue' };
  if (whtr < 0.5) return { label: 'سالم', labelKey: 'healthy', color: 'emerald' };
  if (whtr < 0.6) return { label: 'اضافه‌وزن', labelKey: 'overweight', color: 'amber' };
  return { label: 'چاقی', labelKey: 'obese', color: 'red' };
}

/**
 * تخمین چربی احشایی (Visceral Fat) بر اساس دور کمر و سن
 * چربی احشایی = چربی خطرناک دور اندام‌های داخلی
 * خروجی: سطح از ۱ تا ۱۲
 */
export function estimateVisceralFat(
  waist: number,
  age: number,
  gender: Gender
): number {
  // فرمول تخمینی بر اساس مطالعات
  let base: number;
  if (gender === 'MALE') {
    base = (waist - 60) / 5;
  } else {
    base = (waist - 55) / 5;
  }
  const ageFactor = (age - 30) / 20;
  const result = base + ageFactor;
  return Math.max(1, Math.min(12, Math.round(result)));
}

export function getVisceralFatCategory(level: number): {
  label: string;
  labelKey: string;
  color: string;
} {
  if (level <= 4) return { label: 'سالم', labelKey: 'healthy', color: 'emerald' };
  if (level <= 6) return { label: 'متوسط', labelKey: 'moderate', color: 'amber' };
  if (level <= 9) return { label: 'بالا', labelKey: 'high', color: 'orange' };
  return { label: 'خیلی بالا', labelKey: 'veryHigh', color: 'red' };
}

// =====================================================
//              FITNESS & SYMMETRY
// =====================================================

/**
 * نسبت شانه به کمر (V-Taper)
 * معیار مردانه‌ی زیبایی بدنی
 */
export function calculateVTaper(shoulder: number, waist: number): number {
  return parseFloat((shoulder / waist).toFixed(2));
}

export function getVTaperCategory(ratio: number, gender: Gender): {
  label: string;
  labelKey: string;
  color: string;
} {
  if (gender === 'MALE') {
    if (ratio < 1.2) return { label: 'نیاز به تمرین', labelKey: 'needsWork', color: 'slate' };
    if (ratio < 1.4) return { label: 'خوب', labelKey: 'good', color: 'blue' };
    if (ratio < 1.6) return { label: 'عالی', labelKey: 'excellent', color: 'emerald' };
    return { label: 'V شکل افسانه‌ای', labelKey: 'legendary', color: 'purple' };
  }
  if (ratio < 1.1) return { label: 'نیاز به تمرین', labelKey: 'needsWork', color: 'slate' };
  if (ratio < 1.25) return { label: 'خوب', labelKey: 'good', color: 'blue' };
  if (ratio < 1.4) return { label: 'عالی', labelKey: 'excellent', color: 'emerald' };
  return { label: 'فوق‌العاده', labelKey: 'legendary', color: 'purple' };
}

/**
 * تناسب بالاتنه به پائین‌تنه (Symmetry)
 * نسبت دور سینه به باسن
 */
export function calculateSymmetry(chest: number, hips: number): number {
  return parseFloat((chest / hips).toFixed(2));
}

// =====================================================
//              SOMATOTYPE
// =====================================================

/**
 * تشخیص تیپ بدنی (Somatotype)
 * اکتومورف: لاغر و بلند
 * مزومورف: عضلانی و متعادل
 * اندومورف: چاق‌تر
 */
export function getSomatotype(
  bmi: number,
  wrist: number,
  height: number,
  gender: Gender
): {
  type: string;
  typeKey: string;
  description: string;
  descriptionKey: string;
  color: string;
} {
  // محاسبه‌ی اندازه‌ی اسکلت بر اساس دور مچ
  const heightInCm = height;
  const frameRatio = wrist / heightInCm;

  // چک کردن BMI
  const isLean = bmi < 20;
  const isAverage = bmi >= 20 && bmi < 26;
  const isHeavy = bmi >= 26;

  // اکتومورف: لاغر + اسکلت ریز
  if (isLean && frameRatio < 0.06) {
    return {
      type: 'اکتومورف',
      typeKey: 'ectomorph',
      description: 'بدن لاغر و بلند. متابولیسم سریع، سختی وزن اضافه می‌کنی، راحت عضله نمی‌سازی.',
      descriptionKey: 'ectomorphDesc',
      color: 'blue',
    };
  }

  // اندومورف: وزن بالا
  if (isHeavy) {
    return {
      type: 'اندومورف',
      typeKey: 'endomorph',
      description: 'بدن گرد و توپر. راحت وزن اضافه می‌کنی، ولی می‌تونی عضله‌ی قوی بسازی.',
      descriptionKey: 'endomorphDesc',
      color: 'amber',
    };
  }

  // مزومورف: متعادل
  return {
    type: 'مزومورف',
    typeKey: 'mesomorph',
    description: 'بدن متعادل و عضلانی. مستعد عضله‌سازی، راحت تناسب اندام داری.',
    descriptionKey: 'mesomorphDesc',
    color: 'emerald',
  };
}

// =====================================================
//              METABOLIC AGE
// =====================================================

/**
 * سن متابولیک: بدنت مثل چند ساله کار می‌کنه؟
 */
export function calculateMetabolicAge(
  bmr: number,
  height: number,
  weight: number,
  gender: Gender,
  actualAge: number
): number {
  // BMR مرجع برای سن واقعی (فرد میانگین با همون قد و وزن)
  const referenceBMR = calculateBMR(weight, height, actualAge, gender);

  if (bmr === referenceBMR) return actualAge;

  // نسبت BMR کاربر به BMR مرجع
  const ratio = bmr / referenceBMR;

  // تخمین: هر ۲٪ بالاتر از مرجع = ۱ سال کمتر
  const ageDifference = Math.round((ratio - 1) / 0.02);

  const metabolicAge = actualAge - ageDifference;
  return Math.max(15, Math.min(80, metabolicAge));
}

// =====================================================
//              FRAME SIZE
// =====================================================

/**
 * اندازه‌ی اسکلت (Frame Size) بر اساس دور مچ
 */
export function getFrameSize(
  wrist: number,
  height: number,
  gender: Gender
): {
  size: string;
  sizeKey: string;
  description: string;
  descriptionKey: string;
} {
  const ratio = (wrist / height) * 100;

  if (gender === 'MALE') {
    if (ratio < 9.6) {
      return {
        size: 'ریزاستخوان',
        sizeKey: 'small',
        description: 'اسکلت ظریف داری. برایت وزن کمتر و تمرین‌های استقامتی مناسبه.',
        descriptionKey: 'smallDesc',
      };
    }
    if (ratio < 10.4) {
      return {
        size: 'متوسط',
        sizeKey: 'medium',
        description: 'اسکلت متعادل داری. با هر برنامه‌ای راحت پیش می‌ری.',
        descriptionKey: 'mediumDesc',
      };
    }
    return {
      size: 'درشت‌استخوان',
      sizeKey: 'large',
      description: 'اسکلت قوی داری. مستعد قدرت و عضله‌سازی هستی.',
      descriptionKey: 'largeDesc',
    };
  }
  if (ratio < 9.9) {
    return {
      size: 'ریزاستخوان',
      sizeKey: 'small',
      description: 'اسکلت ظریف داری. برایت وزن کمتر و تمرین‌های استقامتی مناسبه.',
      descriptionKey: 'smallDesc',
    };
  }
  if (ratio < 10.9) {
    return {
      size: 'متوسط',
      sizeKey: 'medium',
      description: 'اسکلت متعادل داری. با هر برنامه‌ای راحت پیش می‌ری.',
      descriptionKey: 'mediumDesc',
    };
  }
  return {
    size: 'درشت‌استخوان',
    sizeKey: 'large',
    description: 'اسکلت قوی داری. مستعد قدرت و عضله‌سازی هستی.',
    descriptionKey: 'largeDesc',
  };
}

// =====================================================
//              HEALTH SCORE
// =====================================================

/**
 * امتیاز سلامت کلی (۰ تا ۱۰۰)
 * ترکیبی از BMI، WHtR، چربی احشایی، FFMI و سن متابولیک
 */
export function calculateHealthScore(params: {
  bmi: number;
  whtr: number;
  visceralFat: number;
  ffmi: number;
  metabolicAge: number;
  actualAge: number;
  gender: Gender;
}): number {
  const { bmi, whtr, visceralFat, ffmi, metabolicAge, actualAge, gender } = params;

  let score = 100;

  // ===== BMI (۳۰٪) =====
  if (bmi < 18.5) score -= 15;
  else if (bmi >= 18.5 && bmi < 25) score -= 0;
  else if (bmi >= 25 && bmi < 30) score -= 15;
  else score -= 25;

  // ===== WHtR (۲۵٪) =====
  if (whtr >= 0.4 && whtr < 0.5) score -= 0;
  else if (whtr >= 0.5 && whtr < 0.6) score -= 15;
  else if (whtr >= 0.6) score -= 25;
  else score -= 10;

  // ===== چربی احشایی (۲۰٪) =====
  if (visceralFat <= 4) score -= 0;
  else if (visceralFat <= 6) score -= 10;
  else if (visceralFat <= 9) score -= 20;
  else score -= 25;

  // ===== FFMI (۱۵٪) =====
  const ffmiTarget = gender === 'MALE' ? 20 : 17;
  const ffmiDiff = Math.abs(ffmi - ffmiTarget);
  score -= Math.min(15, ffmiDiff * 3);

  // ===== سن متابولیک (۱۰٪) =====
  const ageDiff = metabolicAge - actualAge;
  if (ageDiff > 5) score -= 10;
  else if (ageDiff > 0) score -= 5;
  else if (ageDiff < -5) score += 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getHealthScoreCategory(score: number): {
  label: string;
  labelKey: string;
  color: string;
} {
  if (score >= 85) return { label: 'عالی', labelKey: 'excellent', color: 'emerald' };
  if (score >= 70) return { label: 'خوب', labelKey: 'good', color: 'blue' };
  if (score >= 55) return { label: 'متوسط', labelKey: 'moderate', color: 'amber' };
  if (score >= 40) return { label: 'نیاز به بهبود', labelKey: 'needsImprovement', color: 'orange' };
  return { label: 'هشدار', labelKey: 'warning', color: 'red' };
}

// =====================================================
//              COMBINED ADVANCED CALCULATION
// =====================================================

export interface AdvancedCalculation {
  // Body composition
  leanBodyMass: number;
  skeletalMuscleMass: number;
  ffmi: number;
  ffmiCategory: { label: string; labelKey: string; color: string };

  // Health ratios
  whr: number | null;
  whrRisk: { label: string; labelKey: string; color: string } | null;
  whtr: number | null;
  whtrCategory: { label: string; labelKey: string; color: string } | null;
  visceralFat: number | null;
  visceralFatCategory: { label: string; labelKey: string; color: string } | null;

  // Fitness & symmetry
  vTaper: number | null;
  vTaperCategory: { label: string; labelKey: string; color: string } | null;
  symmetry: number | null;

  // Somatotype
  somatotype: {
    type: string;
    typeKey: string;
    description: string;
    descriptionKey: string;
    color: string;
  };

  // Metabolic age
  metabolicAge: number;

  // Frame size
  frameSize: {
    size: string;
    sizeKey: string;
    description: string;
    descriptionKey: string;
  } | null;

  // Health score
  healthScore: number;
  healthScoreCategory: { label: string; labelKey: string; color: string };
}

/**
 * محاسبه‌ی همه‌چیز با یه تابع
 */
export function calculateAdvanced(params: {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  bmr: number;
  bmi: number;
  waist?: number | null;
  hips?: number | null;
  chest?: number | null;
  shoulder?: number | null;
  wrist?: number | null;
}): AdvancedCalculation {
  const {
    weight,
    height,
    age,
    gender,
    bmr,
    bmi,
    waist,
    hips,
    chest,
    shoulder,
    wrist,
  } = params;

  // Body composition
  const leanBodyMass = calculateLeanBodyMass(weight, height, gender);
  const skeletalMuscleMass = calculateSkeletalMuscleMass(leanBodyMass, gender);
  const ffmi = calculateFFMI(leanBodyMass, height);
  const ffmiCategory = getFFMICategory(ffmi, gender);

  // Health ratios
  const whr = waist && hips ? calculateWHR(waist, hips) : null;
  const whrRisk = whr ? getWHRRisk(whr, gender) : null;
  const whtr = waist ? calculateWHtR(waist, height) : null;
  const whtrCategory = whtr ? getWHtRCategory(whtr) : null;
  const visceralFat = waist ? estimateVisceralFat(waist, age, gender) : null;
  const visceralFatCategory = visceralFat
    ? getVisceralFatCategory(visceralFat)
    : null;

  // Fitness
  const vTaper = shoulder && waist ? calculateVTaper(shoulder, waist) : null;
  const vTaperCategory = vTaper ? getVTaperCategory(vTaper, gender) : null;
  const symmetry = chest && hips ? calculateSymmetry(chest, hips) : null;

  // Somatotype
  const somatotype = getSomatotype(bmi, wrist ?? 17, height, gender);

  // Metabolic age
  const metabolicAge = calculateMetabolicAge(bmr, height, weight, gender, age);

  // Frame size
  const frameSize = wrist ? getFrameSize(wrist, height, gender) : null;

  // Health score
  const healthScore = calculateHealthScore({
    bmi,
    whtr: whtr ?? 0.5,
    visceralFat: visceralFat ?? 5,
    ffmi,
    metabolicAge,
    actualAge: age,
    gender,
  });
  const healthScoreCategory = getHealthScoreCategory(healthScore);

  return {
    leanBodyMass,
    skeletalMuscleMass,
    ffmi,
    ffmiCategory,
    whr,
    whrRisk,
    whtr,
    whtrCategory,
    visceralFat,
    visceralFatCategory,
    vTaper,
    vTaperCategory,
    symmetry,
    somatotype,
    metabolicAge,
    frameSize,
    healthScore,
    healthScoreCategory,
  };
}