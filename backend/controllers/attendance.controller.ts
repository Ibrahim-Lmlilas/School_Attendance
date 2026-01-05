import { Request, Response } from 'express';
import * as attendanceService from '../services/attendance.service';
import { CreateAttendanceDTO } from '../types';

// Mark attendance for a single student
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const data: CreateAttendanceDTO = req.body;
    const attendance = await attendanceService.markAttendance(data);
    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Mark attendance for multiple students in a session
export const markBulkAttendance = async (req: Request, res: Response) => {
  try {
    const { sessionId, attendances } = req.body;
    const result = await attendanceService.markBulkAttendance(sessionId, attendances);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get attendance for a specific session
export const getAttendanceBySession = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    const attendances = await attendanceService.getAttendanceBySession(sessionId);
    res.json(attendances);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance history for a student
export const getAttendanceByStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;

    const attendances = await attendanceService.getAttendanceByStudent(studentId, start, end);
    res.json(attendances);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance statistics for a student
export const getStudentStats = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const stats = await attendanceService.getStudentAttendanceStats(studentId);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance for a class
export const getAttendanceByClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.classId;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;

    const attendances = await attendanceService.getAttendanceByClass(classId, start, end);
    res.json(attendances);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get students with attendance for teacher dashboard
export const getStudentsWithAttendance = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId;
    const students = await attendanceService.getStudentsWithAttendance(teacherId);
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete attendance record
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await attendanceService.deleteAttendance(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
