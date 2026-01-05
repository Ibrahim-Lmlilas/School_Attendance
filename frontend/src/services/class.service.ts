import { apiClient } from '../utils/api-client';
import type { Class, CreateClassData, UpdateClassData, ApiResponse } from '../types/school.types';

export const getAllClasses = async (): Promise<Class[]> => {
  const response = await apiClient.get<ApiResponse<Class[]>>('/classes');
  return response.data.data || [];
};

export const getClassById = async (id: string): Promise<Class> => {
  const response = await apiClient.get<ApiResponse<Class>>(`/classes/${id}`);
  if (!response.data.data) {
    throw new Error('Class not found');
  }
  return response.data.data;
};

export const createClass = async (data: CreateClassData): Promise<Class> => {
  const response = await apiClient.post<ApiResponse<Class>>('/classes', data);
  if (!response.data.data) {
    throw new Error('Failed to create class');
  }
  return response.data.data;
};

export const updateClass = async (id: string, data: UpdateClassData): Promise<Class> => {
  const response = await apiClient.put<ApiResponse<Class>>(`/classes/${id}`, data);
  if (!response.data.data) {
    throw new Error('Failed to update class');
  }
  return response.data.data;
};

export const deleteClass = async (id: string): Promise<void> => {
  await apiClient.delete(`/classes/${id}`);
};
