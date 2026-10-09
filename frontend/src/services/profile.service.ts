import api from './api';

export type Gender = 'MALE' | 'FEMALE';
export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE'
  | 'EXTRA_ACTIVE';
export type GoalType = 'LOSE_WEIGHT' | 'MAINTAIN_WEIGHT' | 'GAIN_MUSCLE';

export interface Profile {
  id: string;
  userId: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: GoalType;
  targetWeight: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertProfileDto {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: GoalType;
  targetWeight?: number | null;
}

export const profileService = {
  getProfile: async (): Promise<Profile | null> => {
    const res = await api.get<{ success: boolean; profile: Profile | null }>('/profile');
    return res.data.profile;
  },

  upsertProfile: async (data: UpsertProfileDto): Promise<Profile> => {
    const res = await api.put<{ success: boolean; profile: Profile }>('/profile', data);
    return res.data.profile;
  },
};