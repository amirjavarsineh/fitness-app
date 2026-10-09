import api from './api';

export type ExerciseCategory =
  | 'CARDIO'
  | 'STRENGTH'
  | 'FLEXIBILITY'
  | 'HIIT'
  | 'YOGA'
  | 'OTHER';

export interface Exercise {
  id: string;
  name: string;
  nameFa: string;
  category: ExerciseCategory;
  metValue: number;
  muscleGroup: string | null;
  description: string | null;
}

export interface ExerciseFilters {
  category?: string;
  muscleGroup?: string;
  search?: string;
}

export const exerciseService = {
  getAll: async (filters?: ExerciseFilters): Promise<Exercise[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.muscleGroup) params.append('muscleGroup', filters.muscleGroup);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    const url = query ? `/exercises?${query}` : '/exercises';

    const res = await api.get<{ success: boolean; exercises: Exercise[] }>(url);
    return res.data.exercises;
  },

  getCategories: async (): Promise<{
    categories: string[];
    muscleGroups: string[];
  }> => {
    const res = await api.get<{
      success: boolean;
      categories: string[];
      muscleGroups: string[];
    }>('/exercises/categories');
    return {
      categories: res.data.categories,
      muscleGroups: res.data.muscleGroups,
    };
  },
};