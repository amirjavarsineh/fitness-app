import api from './api';

export type ProgramType = 'WEEKLY' | 'DAILY' | 'PERIODIC';

export interface ProgramExercise {
  id?: string;
  name: string;
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  restTime?: number | null;
  notes?: string | null;
  order?: number;
}

export interface ProgramDay {
  id?: string;
  dayNumber: number;
  label: string;
  notes?: string | null;
  order?: number;
  exercises: ProgramExercise[];
}

export interface ProgramListItem {
  id: string;
  name: string;
  description: string | null;
  type: ProgramType;
  durationWeeks: number | null;
  daysCount: number;
  assignmentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssignedStudent {
  assignmentId: string;
  studentId: string;
  name: string;
  email: string;
  startDate: string;
}

export interface ProgramDetail {
  id: string;
  name: string;
  description: string | null;
  type: ProgramType;
  durationWeeks: number | null;
  coachId: string;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  days: ProgramDay[];
  assignedStudents: AssignedStudent[];
}

export interface CreateProgramInput {
  name: string;
  description?: string;
  type?: ProgramType;
  durationWeeks?: number | null;
  days?: ProgramDay[];
}

export interface UpdateProgramInput extends CreateProgramInput {}

// ===== برنامه‌ی شاگرد =====
export interface AssignedProgram {
  assignmentId: string;
  startDate: string;
  program: {
    id: string;
    name: string;
    description: string | null;
    type: ProgramType;
    durationWeeks: number | null;
    coach: { id: string; name: string };
    days: ProgramDay[];
  };
}

export const programService = {
  // ===== مربی =====
  getMyPrograms: async (): Promise<ProgramListItem[]> => {
    const res = await api.get<{ success: boolean; programs: ProgramListItem[] }>(
      '/programs'
    );
    return res.data.programs;
  },

  getById: async (id: string): Promise<ProgramDetail> => {
    const res = await api.get<{ success: boolean; program: ProgramDetail }>(
      `/programs/${id}`
    );
    return res.data.program;
  },

  create: async (data: CreateProgramInput): Promise<ProgramDetail> => {
    const res = await api.post<{ success: boolean; program: ProgramDetail }>(
      '/programs',
      data
    );
    return res.data.program;
  },

  update: async (id: string, data: UpdateProgramInput): Promise<ProgramDetail> => {
    const res = await api.put<{ success: boolean; program: ProgramDetail }>(
      `/programs/${id}`,
      data
    );
    return res.data.program;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/programs/${id}`);
  },

  assign: async (id: string, studentId: string): Promise<void> => {
    await api.post(`/programs/${id}/assign`, { studentId });
  },

  unassign: async (assignmentId: string): Promise<void> => {
    await api.delete(`/programs/assignments/${assignmentId}`);
  },

  // ===== شاگرد =====
  getMyAssignedPrograms: async (): Promise<AssignedProgram[]> => {
    const res = await api.get<{ success: boolean; assignments: AssignedProgram[] }>(
      '/programs/assigned'
    );
    return res.data.assignments;
  },
};