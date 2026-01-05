import { Request, Response } from 'express';
import * as classService from '../services/class.service';

// Get all classes
export const getAllClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await classService.getAllClasses();
    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes',
    });
  }
};

// Get class by ID
export const getClassById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const classData = await classService.getClassById(id);

    if (!classData) {
      res.status(404).json({
        success: false,
        message: 'Class not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch class',
    });
  }
};

// Create new class
export const createClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Name is required',
      });
      return;
    }

    const newClass = await classService.createClass(name);
    res.status(201).json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create class',
    });
  }
};

// Update class
export const updateClass = async (req: Request, res: Response): Promise<void> => {
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

    const updatedClass = await classService.updateClass(id, name);
    res.status(200).json({
      success: true,
      data: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update class',
    });
  }
};

// Delete class
export const deleteClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    await classService.deleteClass(id);
    res.status(200).json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete class',
    });
  }
};
