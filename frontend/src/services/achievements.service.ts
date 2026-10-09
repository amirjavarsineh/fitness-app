import api from './api';

export type AchievementCategory =
  | 'workout'
  | 'streak'
  | 'water'
  | 'weight'
  | 'nutrition'
  | 'goal';

export type AchievementUnitKey =
  | 'workout'
  | 'day'
  | 'log'
  | 'kg'
  | 'meal'
  | 'goal';

export interface Achievement {
  id: string;
  emoji: string;
  category: AchievementCategory;
  requirement: number;
  unlocked: boolean;
  progress: number;
  unitKey: AchievementUnitKey;
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
    const res = await api.get<{ success: boolean } & AchievementsResponse>(
      '/achievements'
    );
    return {
      achievements: res.data.achievements,
      summary: res.data.summary,
    };
  },
};