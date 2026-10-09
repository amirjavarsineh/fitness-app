import api from './api';

export type ChallengeStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type ChallengeType = 'WATER' | 'WORKOUT' | 'WEIGHT' | 'MEAL' | 'CUSTOM';

export interface Challenge {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  emoji: string;
  type: ChallengeType;
  targetDays: number;
  currentDays: number;
  startDate: string;
  lastCheckIn: string | null;
  checkInDates: string;
  status: ChallengeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChallengeInput {
  title: string;
  description?: string;
  emoji?: string;
  type?: ChallengeType;
  targetDays: number;
}

export interface UpdateChallengeInput {
  title?: string;
  description?: string;
  emoji?: string;
  type?: ChallengeType;
  targetDays?: number;
}

export interface CheckInResponse {
  challenge: Challenge;
  completed: boolean;
}

export const challengeService = {
  getAll: async (): Promise<Challenge[]> => {
    const res = await api.get<{ success: boolean; challenges: Challenge[] }>(
      '/challenges'
    );
    return res.data.challenges;
  },

  create: async (data: CreateChallengeInput): Promise<Challenge> => {
    const res = await api.post<{ success: boolean; challenge: Challenge }>(
      '/challenges',
      data
    );
    return res.data.challenge;
  },

  update: async (id: string, data: UpdateChallengeInput): Promise<Challenge> => {
    const res = await api.put<{ success: boolean; challenge: Challenge }>(
      `/challenges/${id}`,
      data
    );
    return res.data.challenge;
  },

  checkIn: async (id: string): Promise<CheckInResponse> => {
    const res = await api.post<{
      success: boolean;
      challenge: Challenge;
      completed: boolean;
    }>(`/challenges/${id}/checkin`);
    return {
      challenge: res.data.challenge,
      completed: res.data.completed,
    };
  },

  cancel: async (id: string): Promise<Challenge> => {
    const res = await api.patch<{ success: boolean; challenge: Challenge }>(
      `/challenges/${id}/cancel`
    );
    return res.data.challenge;
  },

  reactivate: async (id: string): Promise<Challenge> => {
    const res = await api.patch<{ success: boolean; challenge: Challenge }>(
      `/challenges/${id}/reactivate`
    );
    return res.data.challenge;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/challenges/${id}`);
  },
};