import api from './api';

export type ReminderType = 'WATER' | 'WORKOUT' | 'WEIGHT' | 'MEAL' | 'CUSTOM';
export type ReminderDays = 'ALL' | 'WEEKDAYS' | 'WEEKENDS' | 'CUSTOM';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  message: string | null;
  type: ReminderType;
  time: string;
  days: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderInput {
  title: string;
  message?: string;
  type?: ReminderType;
  time: string;
  days?: string;
  enabled?: boolean;
}

export interface UpdateReminderInput {
  title?: string;
  message?: string;
  type?: ReminderType;
  time?: string;
  days?: string;
  enabled?: boolean;
}

export const reminderService = {
  getAll: async (): Promise<Reminder[]> => {
    const res = await api.get<{ success: boolean; reminders: Reminder[] }>('/reminders');
    return res.data.reminders;
  },

  create: async (data: CreateReminderInput): Promise<Reminder> => {
    const res = await api.post<{ success: boolean; reminder: Reminder }>(
      '/reminders',
      data
    );
    return res.data.reminder;
  },

  update: async (id: string, data: UpdateReminderInput): Promise<Reminder> => {
    const res = await api.put<{ success: boolean; reminder: Reminder }>(
      `/reminders/${id}`,
      data
    );
    return res.data.reminder;
  },

  toggle: async (id: string): Promise<Reminder> => {
    const res = await api.patch<{ success: boolean; reminder: Reminder }>(
      `/reminders/${id}/toggle`
    );
    return res.data.reminder;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/reminders/${id}`);
  },
};