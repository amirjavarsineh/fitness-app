import api from './api';

export type ProgressStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface ProgressExercise {
  id: string;
  exerciseId: string;
  name: string;
  plannedSets: number | null;
  plannedReps: number | null;
  plannedWeight: number | null;
  plannedRestTime: number | null;
  plannedNotes: string | null;
  completed: boolean;
  actualSets: number | null;
  actualReps: number | null;
  actualWeight: number | null;
  timeSpent: number | null;
  notes: string | null;
  order: number;
}

export interface ProgressDetail {
  id: string;
  status: ProgressStatus;
  date: string;
  notes: string | null;
  completedAt: string | null;
  day: {
    id: string;
    label: string;
    notes: string | null;
  };
  exercises: ProgressExercise[];
}

export interface ProgressHistoryItem {
  id: string;
  date: string;
  status: ProgressStatus;
  completedAt: string | null;
  notes: string | null;
  day: { id: string; label: string };
  totalExercises: number;
  completedExercises: number;
}

export interface WeeklyTrendPoint {
  date: string;
  completed: number;
  total: number;
}

export interface ProgressStats {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  weeklyTrend: WeeklyTrendPoint[];
}

export interface StudentProgress {
  studentId: string;
  stats: ProgressStats;
  assignments: Array<{
    assignmentId: string;
    program: { id: string; name: string; type: string };
    startDate: string;
    recentProgress: Array<{
      id: string;
      date: string;
      status: ProgressStatus;
      completedAt: string | null;
      notes: string | null;
      day: { id: string; label: string };
      totalExercises: number;
      completedExercises: number;
      exercises: Array<{
        id: string;
        completed: boolean;
        actualSets: number | null;
        actualReps: number | null;
        actualWeight: number | null;
        timeSpent: number | null;
        notes: string | null;
      }>;
    }>;
  }>;
}

export const programProgressService = {
  // ===== شاگرد =====
  getOrCreate: async (
    assignmentId: string,
    dayId: string,
    date?: string
  ): Promise<ProgressDetail> => {
    const url = date
      ? `/progress-program/assignment/${assignmentId}/day/${dayId}?date=${date}`
      : `/progress-program/assignment/${assignmentId}/day/${dayId}`;
    const res = await api.get<{ success: boolean; progress: ProgressDetail }>(url);
    return res.data.progress;
  },

  updateExercise: async (
    progressId: string,
    exerciseId: string,
    data: {
      completed?: boolean;
      actualSets?: number | null;
      actualReps?: number | null;
      actualWeight?: number | null;
      timeSpent?: number | null;
      notes?: string | null;
    }
  ): Promise<void> => {
    await api.put(
      `/progress-program/${progressId}/exercise/${exerciseId}`,
      data
    );
  },

  updateProgress: async (
    progressId: string,
    data: { status?: ProgressStatus; notes?: string; date?: string }
  ): Promise<void> => {
    await api.put(`/progress-program/${progressId}`, data);
  },

  getHistory: async (assignmentId: string): Promise<ProgressHistoryItem[]> => {
    const res = await api.get<{
      success: boolean;
      progressList: ProgressHistoryItem[];
    }>(`/progress-program/assignment/${assignmentId}/history`);
    return res.data.progressList;
  },

  getMySummary: async (): Promise<{
    stats: ProgressStats;
    recent: ProgressHistoryItem[];
  }> => {
    const res = await api.get<{
      success: boolean;
      stats: ProgressStats;
      recent: ProgressHistoryItem[];
    }>('/progress-program/summary/me');
    return { stats: res.data.stats, recent: res.data.recent };
  },

  // ===== مربی =====
  getStudentProgress: async (studentId: string): Promise<StudentProgress> => {
    const res = await api.get<{ success: boolean } & StudentProgress>(
      `/progress-program/student/${studentId}`
    );
    return {
      studentId: res.data.studentId,
      stats: res.data.stats,
      assignments: res.data.assignments,
    };
  },

  getProgressDetail: async (progressId: string): Promise<ProgressDetail & { student: { id: string; name: string; email: string } }> => {
    const res = await api.get<{
      success: boolean;
      progress: ProgressDetail & {
        student: { id: string; name: string; email: string };
      };
    }>(`/progress-program/detail/${progressId}`);
    return res.data.progress;
  },
};