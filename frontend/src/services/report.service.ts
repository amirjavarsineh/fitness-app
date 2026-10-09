import api from './api';

export interface DailyData {
  date: string;
  workoutsCount: number;
  workoutsDuration: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  weight: number | null;
}

export interface ReportSummary {
  totalWorkouts: number;
  totalDuration: number;
  totalCaloriesBurned: number;
  totalCaloriesConsumed: number;
  totalWater: number;
  avgWater: number;
  weightChange: number;
  daysWithWorkouts: number;
  daysWithNutrition: number;
  daysWithWater: number;
}

export interface WeeklyReport {
  days: DailyData[];
  summary: ReportSummary;
}

export const reportService = {
  getWeekly: async (): Promise<WeeklyReport> => {
    const res = await api.get<{ success: boolean; report: WeeklyReport }>(
      '/report/weekly'
    );
    return res.data.report;
  },
};