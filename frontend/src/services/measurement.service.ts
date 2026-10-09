import api from './api';

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  neck: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  bicep: number | null;
  forearm: number | null;
  thigh: number | null;
  calf: number | null;
  note: string | null;
  createdAt: string;
}

export interface CreateMeasurementInput {
  date?: string;
  neck?: number | null;
  chest?: number | null;
  waist?: number | null;
  hips?: number | null;
  bicep?: number | null;
  forearm?: number | null;
  thigh?: number | null;
  calf?: number | null;
  note?: string;
}

export interface MeasurementStats {
  latest: BodyMeasurement | null;
  first: BodyMeasurement | null;
  changes: Record<string, number | null> | null;
  count: number;
}

export const measurementService = {
  getAll: async (): Promise<BodyMeasurement[]> => {
    const res = await api.get<{ success: boolean; measurements: BodyMeasurement[] }>(
      '/measurements'
    );
    return res.data.measurements;
  },

  getStats: async (): Promise<MeasurementStats> => {
    const res = await api.get<{ success: boolean; stats: MeasurementStats }>(
      '/measurements/stats'
    );
    return res.data.stats;
  },

  upsert: async (data: CreateMeasurementInput): Promise<BodyMeasurement> => {
    const res = await api.post<{ success: boolean; measurement: BodyMeasurement }>(
      '/measurements',
      data
    );
    return res.data.measurement;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/measurements/${id}`);
  },
};