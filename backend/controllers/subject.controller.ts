import { Request, Response } from 'express';
import * as subjectService from '../services/subject.service';

// Get all subjects
export const getAllSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
    });
  }
};

// Get subject by ID
export const getSubjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const subject = await subjectService.getSubjectById(id);

    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subject',
    });
  }
};

// Create new subject
export const createSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Name is required',
      });
      return;
    }

    const newSubject = await subjectService.createSubject(name);
    res.status(201).json({
      success: true,
      data: newSubject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create subject',
    });
  }
};

// Update subject
export const updateSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Name is required',
      });
      return;
    }

    const updatedSubject = await subjectService.updateSubject(id, name);
    res.status(200).json({
      success: true,
      data: updatedSubject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update subject',
    });
  }
};

// Delete subject
export const deleteSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    await subjectService.deleteSubject(id);
    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete subject',
    });
  }
};
