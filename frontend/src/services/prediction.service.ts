import api from './api';

export interface WeightPrediction {
  current: number | null;
  target: number | null;
  trendPerDay: number;
  trendPerWeek: number;
  trendPerMonth: number;
  prediction: { days: number; date: string } | null;
  in30Days: number | null;
  in60Days: number | null;
  enoughData: boolean;
  dataPoints: number;
}

export interface WorkoutsPrediction {
  totalWorkouts: number;
  last30Days: number;
  avgWorkoutsPerWeek: number;
  caloriesTrend: number;
  predictedWorkoutsNext30Days: number;
  enoughData: boolean;
}

export interface WaterPrediction {
  avgDaily: number;
  goal: number;
  successRate: number;
  metDays: number;
  totalDays: number;
  trendPerDay: number;
  predictedNext7Days: number;
  enoughData: boolean;
}

export interface CaloriesPrediction {
  avgDaily: number;
  daysLogged: number;
  trendPerDay: number;
  predictedNext7Days: number;
  maxDay: number;
  minDay: number;
  enoughData: boolean;
}

export interface GoalPrediction {
  id: string;
  title: string;
  goalType: string;
  targetValue: number;
  currentValue: number;
  progress: number;
  remaining: number;
  ratePerDay: number;
  estimatedDays: number;
  estimatedDate: string | null;
  deadline: string | null;
  onTrack: boolean;
  daysLate: number;
}

export interface Predictions {
  weight: WeightPrediction;
  workouts: WorkoutsPrediction;
  water: WaterPrediction;
  calories: CaloriesPrediction;
  goals: GoalPrediction[];
}

export interface PredictionMeta {
  generatedAt: string;
  dataRange: {
    weightLogs: number;
    workouts: number;
    nutritionLogs: number;
    waterLogs: number;
  };
}

export interface PredictionResponse {
  predictions: Predictions;
  meta: PredictionMeta;
}

export const predictionService = {
  getAll: async (): Promise<PredictionResponse> => {
    const res = await api.get<{ success: boolean } & PredictionResponse>(
      '/predictions'
    );
    return {
      predictions: res.data.predictions,
      meta: res.data.meta,
    };
  },
};