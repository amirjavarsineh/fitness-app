import api from './api';

export interface WaterLog {
  id?: string;
  userId?: string;
  date: string;
  amount: number;
  createdAt?: string;
}

export interface WaterTodayResponse {
  log: WaterLog;
  goal: number;
}

export interface WaterStats {
  logs: WaterLog[];
  totalWeek: number;
  avgDaily: number;
  goal: number;
}

export const waterService = {
  getToday: async (): Promise<WaterTodayResponse> => {
    const res = await api.get<{
      success: boolean;
      log: WaterLog;
      goal: number;
    }>('/water/today');
    return { log: res.data.log, goal: res.data.goal };
  },

  getStats: async (): Promise<WaterStats> => {
    const res = await api.get<{ success: boolean; stats: WaterStats }>('/water/stats');
    return res.data.stats;
  },

  add: async (amount: number): Promise<WaterLog> => {
    const res = await api.post<{ success: boolean; log: WaterLog }>('/water/add', {
      amount,
    });
    return res.data.log;
  },

  updateGoal: async (goal: number): Promise<number> => {
    const res = await api.put<{ success: boolean; goal: number }>('/water/goal', {
      goal,
    });
    return res.data.goal;
  },

  reset: async (): Promise<void> => {
    await api.delete('/water/today');
  },
};