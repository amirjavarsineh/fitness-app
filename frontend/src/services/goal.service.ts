import api from './api';

export type GoalCategory =
  | 'WEIGHT'
  | 'WORKOUT_FREQUENCY'
  | 'CALORIE_INTAKE'
  | 'MUSCLE_GAIN'
  | 'ENDURANCE'
  | 'OTHER';

export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  goalType: GoalCategory;
  targetValue: number;
  currentValue: number;
  deadline: string | null;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  goalType: GoalCategory;
  targetValue: number;
  currentValue?: number;
  deadline?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  goalType?: GoalCategory;
  targetValue?: number;
  currentValue?: number;
  deadline?: string;
  status?: GoalStatus;
}

export const goalService = {
  getAll: async (): Promise<Goal[]> => {
    const res = await api.get<{ success: boolean; goals: Goal[] }>('/goals');
    return res.data.goals;
  },

  getById: async (id: string): Promise<Goal> => {
    const res = await api.get<{ success: boolean; goal: Goal }>(`/goals/${id}`);
    return res.data.goal;
  },

  create: async (data: CreateGoalInput): Promise<Goal> => {
    const res = await api.post<{ success: boolean; goal: Goal }>('/goals', data);
    return res.data.goal;
  },

  update: async (id: string, data: UpdateGoalInput): Promise<Goal> => {
    const res = await api.put<{ success: boolean; goal: Goal }>(`/goals/${id}`, data);
    return res.data.goal;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },
};