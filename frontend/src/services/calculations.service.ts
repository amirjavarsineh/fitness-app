import api from './api';

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fat: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
}


// ===== محاسبات پیشرفته =====
export interface CategoryInfo {
  label: string;
  labelKey: string;
  color: string;
}

export interface SomatotypeInfo {
  type: string;
  typeKey: string;
  description: string;
  descriptionKey: string;
  color: string;
}

export interface FrameSizeInfo {
  size: string;
  sizeKey: string;
  description: string;
  descriptionKey: string;
}

export interface AdvancedCalculation {
  // Body composition
  leanBodyMass: number;
  skeletalMuscleMass: number;
  ffmi: number;
  ffmiCategory: CategoryInfo;

  // Health ratios
  whr: number | null;
  whrRisk: CategoryInfo | null;
  whtr: number | null;
  whtrCategory: CategoryInfo | null;
  visceralFat: number | null;
  visceralFatCategory: CategoryInfo | null;

  // Fitness & symmetry
  vTaper: number | null;
  vTaperCategory: CategoryInfo | null;
  symmetry: number | null;

  // Somatotype
  somatotype: SomatotypeInfo;

  // Metabolic age
  metabolicAge: number;

  // Frame size
  frameSize: FrameSizeInfo | null;

  // Health score
  healthScore: number;
  healthScoreCategory: CategoryInfo;
}



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

export interface FullCalculation extends CalculationResult {
  advanced: AdvancedCalculation;
  hasMeasurements: boolean;
  lastMeasurementDate: string | null;
  profile: {
    weight: number;
    height: number;
    age: number;
    gender: string;
    activityLevel: string;
    goal: string;
    targetWeight: number | null;
  };
}

export interface BodyFatResult {
  bodyFat: number;
  category: string;
  categoryKey: string;
  inputs: {
    waist: number;
    neck: number;
    hip: number | null;
  };
}

export interface InstantCalculationInput {
  weight: number;
  height: number;
  age: number;
  gender: 'MALE' | 'FEMALE';
  activityLevel: string;
  goal: string;
}

export const calculationsService = {
  // محاسبه‌ی کامل از پروفایل کاربر
  getCalculations: async (): Promise<FullCalculation> => {
    const res = await api.get<{ success: boolean; calculations: FullCalculation }>(
      '/calculations'
    );
    return res.data.calculations;
  },

  // محاسبه‌ی آنی
  calculateInstant: async (
    data: InstantCalculationInput
  ): Promise<CalculationResult> => {
    const res = await api.post<{
      success: boolean;
      calculations: CalculationResult;
    }>('/calculations/instant', data);
    return res.data.calculations;
  },

  // محاسبه‌ی کالری تمرین
  calculateWorkoutCalories: async (
    metValue: number,
    durationMinutes: number
  ): Promise<{ calories: number; metValue: number; duration: number; weight: number }> => {
    const res = await api.post<{
      success: boolean;
      calories: number;
      metValue: number;
      duration: number;
      weight: number;
    }>('/calculations/workout-calories', { metValue, durationMinutes });
    return {
      calories: res.data.calories,
      metValue: res.data.metValue,
      duration: res.data.duration,
      weight: res.data.weight,
    };
  },

  // تخمین چربی بدن
  calculateBodyFat: async (data: {
    waist: number;
    neck: number;
    hip?: number;
  }): Promise<BodyFatResult> => {
    const res = await api.post<{ success: boolean } & BodyFatResult>(
      '/calculations/body-fat',
      data
    );
    return {
      bodyFat: res.data.bodyFat,
      category: res.data.category,
      categoryKey: res.data.categoryKey,
      inputs: res.data.inputs,
    };
  },
};