import { Request, Response } from 'express';
import * as studentService from '../services/student.service';

// Get all students
export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await studentService.getAllStudents();
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
    });
  }
};

// Get students by class
export const getStudentsByClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classId = req.params.classId;
    const students = await studentService.getStudentsByClass(classId);
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
    });
  }
};

// Get student by ID
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const student = await studentService.getStudentById(id);

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
    });
  }
};

// Create new student
export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, classId } = req.body;

    if (!firstName || !lastName || !classId) {
      res.status(400).json({
        success: false,
        message: 'First name, last name, and class are required',
      });
      return;
    }

    const newStudent = await studentService.createStudent(firstName, lastName, classId);
    res.status(201).json({
      success: true,
      data: newStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create student',
    });
  }
};

// Update student
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { firstName, lastName, classId } = req.body;

    if (!firstName || !lastName || !classId) {
      res.status(400).json({
        success: false,
        message: 'First name, last name, and class are required',
      });
      return;
    }

    const updatedStudent = await studentService.updateStudent(id, firstName, lastName, classId);
    res.status(200).json({
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
    });
  }
};

// Delete student
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    await studentService.deleteStudent(id);
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
    });
  }
};
