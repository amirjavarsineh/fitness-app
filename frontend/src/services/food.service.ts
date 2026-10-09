import api from './api';

export interface FoodItem {
  id: string;
  name: string;
  nameFa: string;
  brand: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  isCustom: boolean;
  createdBy: string | null;
}

export interface FoodFilters {
  search?: string;
  brand?: string;
}

export const foodService = {
  getAll: async (filters?: FoodFilters): Promise<FoodItem[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.brand) params.append('brand', filters.brand);

    const query = params.toString();
    const url = query ? `/foods?${query}` : '/foods';

    const res = await api.get<{ success: boolean; foods: FoodItem[] }>(url);
    return res.data.foods;
  },

  getBrands: async (): Promise<string[]> => {
    const res = await api.get<{ success: boolean; brands: string[] }>(
      '/foods/brands'
    );
    return res.data.brands;
  },
};