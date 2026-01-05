import { apiClient } from '../utils/api-client';
import type { Student, CreateStudentData, UpdateStudentData, ApiResponse } from '../types/school.types';

export const getAllStudents = async (): Promise<Student[]> => {
  const response = await apiClient.get<ApiResponse<Student[]>>('/students');
  return response.data.data || [];
};

export const getStudentsByClass = async (classId: string): Promise<Student[]> => {
  const response = await apiClient.get<ApiResponse<Student[]>>(`/students/class/${classId}`);
  return response.data.data || [];
};

export const getStudentById = async (id: string): Promise<Student> => {
  const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`);
  if (!response.data.data) {
    throw new Error('Student not found');
  }
  return response.data.data;
};

export const createStudent = async (data: CreateStudentData): Promise<Student> => {
  const response = await apiClient.post<ApiResponse<Student>>('/students', data);
  if (!response.data.data) {
    throw new Error('Failed to create student');
  }
  return response.data.data;
};

export const updateStudent = async (id: string, data: UpdateStudentData): Promise<Student> => {
  const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, data);
  if (!response.data.data) {
    throw new Error('Failed to update student');
  }
  return response.data.data;
};

export const deleteStudent = async (id: string): Promise<void> => {
  await apiClient.delete(`/students/${id}`);
};
