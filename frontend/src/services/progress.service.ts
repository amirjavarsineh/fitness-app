import api from './api';

export interface WeightLog {
  id: string;
  userId: string;
  date: string;
  weight: number;
  note: string | null;
  createdAt: string;
}

export interface WeightStats {
  current: number | null;
  start: number | null;
  change: number;
  min: number | null;
  max: number | null;
  count: number;
}

export interface CreateWeightInput {
  weight: number;
  date?: string;
  note?: string;
}

export const progressService = {
  // گرفتن همه وزن‌ها
  getWeightLogs: async (): Promise<WeightLog[]> => {
    const res = await api.get<{ success: boolean; logs: WeightLog[] }>('/progress/weight');
    return res.data.logs;
  },

  // گرفتن آمار
  getWeightStats: async (): Promise<WeightStats> => {
    const res = await api.get<{ success: boolean; stats: WeightStats }>(
      '/progress/weight/stats'
    );
    return res.data.stats;
  },

  // ثبت یا آپدیت وزن
  upsertWeight: async (data: CreateWeightInput): Promise<WeightLog> => {
    const res = await api.post<{ success: boolean; log: WeightLog }>(
      '/progress/weight',
      data
    );
    return res.data.log;
  },

  // حذف
  removeWeight: async (id: string): Promise<void> => {
    await api.delete(`/progress/weight/${id}`);
  },
};