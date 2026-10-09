import api from './api';

export type WorkoutType = 'CARDIO' | 'STRENGTH' | 'FLEXIBILITY' | 'HIIT' | 'YOGA' | 'OTHER';

export interface WorkoutExercise {
  id?: string;
  workoutId?: string;
  name: string;
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  duration?: number | null;
  restTime?: number | null;
  order?: number;
  createdAt?: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string | null;
  description: string | null;
  type: WorkoutType;
  duration: number;
  caloriesBurned: number | null;
  notes: string | null;
  date: string;
  isTemplate?: boolean;
  exercises: WorkoutExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutDto {
  name?: string;
  description?: string;
  type: WorkoutType;
  duration: number;
  caloriesBurned?: number | null;
  notes?: string;
  exercises?: WorkoutExercise[];
  isTemplate?: boolean;
}

export interface UpdateWorkoutDto extends CreateWorkoutDto {}

export const workoutService = {
  getWorkouts: async (): Promise<Workout[]> => {
    const res = await api.get<{ success: boolean; workouts: Workout[] }>('/workouts');
    return res.data.workouts;
  },

  getTemplates: async (): Promise<Workout[]> => {
    const res = await api.get<{ success: boolean; templates: Workout[] }>(
      '/workouts/templates'
    );
    return res.data.templates;
  },

  useTemplate: async (id: string): Promise<Workout> => {
    const res = await api.post<{ success: boolean; workout: Workout }>(
      `/workouts/templates/${id}/use`
    );
    return res.data.workout;
  },

  getWorkout: async (id: string): Promise<Workout> => {
    const res = await api.get<{ success: boolean; workout: Workout }>(`/workouts/${id}`);
    return res.data.workout;
  },

  createWorkout: async (data: CreateWorkoutDto): Promise<Workout> => {
    const res = await api.post<{ success: boolean; workout: Workout }>('/workouts', data);
    return res.data.workout;
  },

  updateWorkout: async (id: string, data: UpdateWorkoutDto): Promise<Workout> => {
    const res = await api.put<{ success: boolean; workout: Workout }>(`/workouts/${id}`, data);
    return res.data.workout;
  },

  deleteWorkout: async (id: string): Promise<void> => {
    await api.delete(`/workouts/${id}`);
  },
};