import api from './api';

export interface Rank {
  title: string;
  emoji: string;
  color: string;
}

export interface XpBreakdown {
  workouts: number;
  nutrition: number;
  water: number;
  weight: number;
  measurements: number;
  challenges: number;
  goals: number;
}

export interface XpCounts {
  workouts: number;
  nutrition: number;
  waterDays: number;
  weight: number;
  measurements: number;
  challengeCheckIns: number;
  goalsCompleted: number;
}

export interface XpValues {
  WORKOUT: number;
  NUTRITION: number;
  WATER_DAY: number;
  WEIGHT: number;
  MEASUREMENT: number;
  CHALLENGE_CHECKIN: number;
  GOAL_COMPLETED: number;
}

export interface XpProfile {
  totalXp: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  totalXpForNextLevel: number;
  rank: Rank;
  breakdown: XpBreakdown;
  counts: XpCounts;
  xpValues: XpValues;
}

export interface XpSummary {
  totalXp: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  rank: Rank;
}

export const xpService = {
  getProfile: async (): Promise<XpProfile> => {
    const res = await api.get<{ success: boolean; profile: XpProfile }>('/xp');
    return res.data.profile;
  },

  getSummary: async (): Promise<XpSummary> => {
    const res = await api.get<{ success: boolean; summary: XpSummary }>('/xp/summary');
    return res.data.summary;
  },
};