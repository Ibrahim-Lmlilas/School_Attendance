import { apiClient } from '../utils/api-client';
import type { Session, CreateSessionData, UpdateSessionData, ApiResponse } from '../types/school.types';

export const getAllSessions = async (): Promise<Session[]> => {
  const response = await apiClient.get<ApiResponse<Session[]>>('/sessions');
  return response.data.data || [];
};

export const getSessionsByClass = async (classId: string): Promise<Session[]> => {
  const response = await apiClient.get<ApiResponse<Session[]>>(`/sessions/class/${classId}`);
  return response.data.data || [];
};

export const getSessionById = async (id: string): Promise<Session> => {
  const response = await apiClient.get<ApiResponse<Session>>(`/sessions/${id}`);
  if (!response.data.data) {
    throw new Error('Session not found');
  }
  return response.data.data;
};

export const createSession = async (data: CreateSessionData): Promise<Session> => {
  const response = await apiClient.post<ApiResponse<Session>>('/sessions', data);
  if (!response.data.data) {
    throw new Error('Failed to create session');
  }
  return response.data.data;
};

export const updateSession = async (id: string, data: UpdateSessionData): Promise<Session> => {
  const response = await apiClient.put<ApiResponse<Session>>(`/sessions/${id}`, data);
  if (!response.data.data) {
    throw new Error('Failed to update session');
  }
  return response.data.data;
};

export const deleteSession = async (id: string): Promise<void> => {
  await apiClient.delete(`/sessions/${id}`);
};
