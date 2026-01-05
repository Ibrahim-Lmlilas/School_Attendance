import { apiClient } from '../utils/api-client';
import type { Attendance, CreateAttendanceData, BulkAttendanceData } from '../types/school.types';

// Mark attendance for a single student
export const markAttendance = async (data: CreateAttendanceData): Promise<Attendance> => {
  const response = await apiClient.post('/attendance', data);
  return response.data;
};

// Mark attendance for multiple students (bulk)
export const markBulkAttendance = async (data: BulkAttendanceData): Promise<Attendance[]> => {
  const response = await apiClient.post('/attendance/bulk', data);
  return response.data;
};

// Get attendance for a session
export const getAttendanceBySession = async (sessionId: string): Promise<Attendance[]> => {
  const response = await apiClient.get(`/attendance/session/${sessionId}`);
  return response.data;
};

// Get attendance history for a student
export const getAttendanceByStudent = async (
  studentId: string,
  startDate?: string,
  endDate?: string
): Promise<Attendance[]> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await apiClient.get(`/attendance/student/${studentId}?${params}`);
  return response.data;
};

// Get attendance statistics for a student
export const getStudentStats = async (studentId: string) => {
  const response = await apiClient.get(`/attendance/student/${studentId}/stats`);
  return response.data;
};

// Get attendance for a class
export const getAttendanceByClass = async (
  classId: string,
  startDate?: string,
  endDate?: string
): Promise<Attendance[]> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await apiClient.get(`/attendance/class/${classId}?${params}`);
  return response.data;
};

// Get students with attendance for teacher
export const getStudentsWithAttendance = async (teacherId: string) => {
  const response = await apiClient.get(`/attendance/teacher/${teacherId}/students`);
  return response.data;
};

// Delete attendance record
export const deleteAttendance = async (id: string): Promise<void> => {
  await apiClient.delete(`/attendance/${id}`);
};
