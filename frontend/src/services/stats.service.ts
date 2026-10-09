import api from './api';

export interface StatsResponse {
  workouts: {
    total: number;
    thisWeek: number;
    lastWorkout: string | null;
  };
  nutrition: {
    todayCalories: number;
    todayProtein: number;
    avgCalories7Days: number;
  };
  goals: {
    total: number;
    completed: number;
    inProgress: number;
  };
}

// ساختار خام که از backend میاد
interface RawStatsResponse {
  success: boolean;
  stats: {
    workouts: {
      total: number;
      thisWeek: number;
      recent: Array<{ id: string; type: string; duration: number }>;
    };
    nutrition: {
      today: { calories: number; protein: number; carbs: number; fat: number };
      weekly: { totalCalories: number; dailyAvgCalories: number };
    };
    goals: {
      active: Array<unknown>;
      activeCount: number;
      completedCount: number;
      totalCount: number;
    };
  };
}

export const statsService = {
  getStats: async (): Promise<StatsResponse> => {
    const { data } = await api.get<RawStatsResponse>('/stats');
    const s = data.stats;

    // تبدیل ساختار تودرتو به ساختار تخت
    return {
      workouts: {
        total: s.workouts.total,
        thisWeek: s.workouts.thisWeek,
        lastWorkout: s.workouts.recent?.[0]?.type ?? null,
      },
      nutrition: {
        todayCalories: s.nutrition.today.calories,
        todayProtein: s.nutrition.today.protein,
        avgCalories7Days: s.nutrition.weekly.dailyAvgCalories,
      },
      goals: {
        total: s.goals.totalCount,
        completed: s.goals.completedCount,
        inProgress: s.goals.activeCount,
      },
    };
  },
};