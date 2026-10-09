import api from './api';

export type AchievementCategory =
  | 'workout'
  | 'streak'
  | 'water'
  | 'weight'
  | 'nutrition'
  | 'goal';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
  requirement: number;
  unlocked: boolean;
  progress: number;
  unit: string;
  color: string;
}

export interface AchievementsSummary {
  unlocked: number;
  total: number;
  percent: number;
}

export interface AchievementsResponse {
  achievements: Achievement[];
  summary: AchievementsSummary;
}

export const achievementsService = {
  getAll: async (): Promise<AchievementsResponse> => {
    const res = await api.get<{ success: boolean } & AchievementsResponse>('/achievements');
    return {
      achievements: res.data.achievements,
      summary: res.data.summary,
    };
  },
};