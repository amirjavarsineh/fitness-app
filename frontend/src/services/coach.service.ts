import api from './api';

export interface CoachStudent {
  id: string;
  studentId: string;
  name: string;
  email: string;
  joinedAt: string;
}

export interface MyCoach {
  id: string;
  coachId: string;
  name: string;
  email: string;
  profile: {
    displayName: string | null;
    bio: string | null;
    specialty: string | null;
  } | null;
  joinedAt: string;
}

export interface CoachInfo {
  isCoach: boolean;
  coachCode?: string;
  coachProfile?: {
    displayName: string | null;
    bio: string | null;
    specialty: string | null;
  } | null;
  students?: CoachStudent[];
}

export const coachService = {
  activate: async (data: {
    displayName?: string;
    bio?: string;
    specialty?: string;
  }): Promise<{ coachCode: string }> => {
    const res = await api.post<{ success: boolean; coachCode: string }>(
      '/coach/activate',
      data
    );
    return { coachCode: res.data.coachCode };
  },

  getInfo: async (): Promise<CoachInfo> => {
    const res = await api.get<{ success: boolean } & CoachInfo>('/coach/info');
    return res.data;
  },

  regenerateCode: async (): Promise<{ coachCode: string }> => {
    const res = await api.post<{ success: boolean; coachCode: string }>(
      '/coach/regenerate-code'
    );
    return { coachCode: res.data.coachCode };
  },

  join: async (code: string): Promise<{ coach: { name: string } }> => {
    const res = await api.post<{
      success: boolean;
      coach: { name: string };
    }>('/coach/join', { code });
    return { coach: res.data.coach };
  },

  getMyCoaches: async (): Promise<MyCoach[]> => {
    const res = await api.get<{ success: boolean; coaches: MyCoach[] }>(
      '/coach/my-coaches'
    );
    return res.data.coaches;
  },

  disconnectStudent: async (studentId: string): Promise<void> => {
    await api.delete(`/coach/students/${studentId}`);
  },

  disconnectFromCoach: async (coachId: string): Promise<void> => {
    await api.delete(`/coach/coaches/${coachId}`);
  },
};