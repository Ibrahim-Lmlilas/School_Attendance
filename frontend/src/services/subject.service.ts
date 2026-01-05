import { apiClient } from '../utils/api-client';
import type { Subject, CreateSubjectData, UpdateSubjectData, ApiResponse } from '../types/school.types';

export const getAllSubjects = async (): Promise<Subject[]> => {
  const response = await apiClient.get<ApiResponse<Subject[]>>('/subjects');
  return response.data.data || [];
};

export const getSubjectById = async (id: string): Promise<Subject> => {
  const response = await apiClient.get<ApiResponse<Subject>>(`/subjects/${id}`);
  if (!response.data.data) {
    throw new Error('Subject not found');
  }
  return response.data.data;
};

export const createSubject = async (data: CreateSubjectData): Promise<Subject> => {
  const response = await apiClient.post<ApiResponse<Subject>>('/subjects', data);
  if (!response.data.data) {
    throw new Error('Failed to create subject');
  }
  return response.data.data;
};

export const updateSubject = async (id: string, data: UpdateSubjectData): Promise<Subject> => {
  const response = await apiClient.put<ApiResponse<Subject>>(`/subjects/${id}`, data);
  if (!response.data.data) {
    throw new Error('Failed to update subject');
  }
  return response.data.data;
};

export const deleteSubject = async (id: string): Promise<void> => {
  await apiClient.delete(`/subjects/${id}`);
};
