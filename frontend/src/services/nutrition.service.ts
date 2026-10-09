import api from './api';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface NutritionLog {
  id: string;
  userId: string;
  foodName: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  mealType: MealType;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface CreateNutritionInput {
  foodName: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType: MealType;
}

export interface UpdateNutritionInput {
  foodName?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType?: MealType;
}

export const nutritionService = {
  getAll: async (date?: string): Promise<{ logs: NutritionLog[]; totals: NutritionTotals }> => {
    const url = date ? `/nutrition?date=${date}` : '/nutrition';
    const res = await api.get<{
      success: boolean;
      logs: NutritionLog[];
      totals: NutritionTotals;
    }>(url);
    return { logs: res.data.logs, totals: res.data.totals };
  },

  create: async (data: CreateNutritionInput): Promise<NutritionLog> => {
    const res = await api.post<{ success: boolean; log: NutritionLog }>('/nutrition', data);
    return res.data.log;
  },

  update: async (id: string, data: UpdateNutritionInput): Promise<NutritionLog> => {
    const res = await api.put<{ success: boolean; log: NutritionLog }>(
      `/nutrition/${id}`,
      data
    );
    return res.data.log;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/nutrition/${id}`);
  },
};