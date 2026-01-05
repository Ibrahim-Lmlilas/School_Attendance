import { Request, Response } from 'express';
import * as sessionService from '../services/session.service';

// Get all sessions
export const getAllSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await sessionService.getAllSessions();
    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
    });
  }
};

// Get sessions by class
export const getSessionsByClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classId = req.params.classId;
    const sessions = await sessionService.getSessionsByClass(classId);
    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
    });
  }
};

// Get session by ID
export const getSessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const session = await sessionService.getSessionById(id);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session',
    });
  }
};

// Create new session
export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, classId, subjectId, teacherId } = req.body;

    if (!date || !classId || !subjectId || !teacherId) {
      res.status(400).json({
        success: false,
        message: 'Date, class, subject, and teacher are required',
      });
      return;
    }

    const newSession = await sessionService.createSession(
      new Date(date),
      classId,
      subjectId,
      teacherId
    );
    res.status(201).json({
      success: true,
      data: newSession,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
    });
  }
};

// Update session
export const updateSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { date, classId, subjectId, teacherId } = req.body;

    if (!date || !classId || !subjectId || !teacherId) {
      res.status(400).json({
        success: false,
        message: 'Date, class, subject, and teacher are required',
      });
      return;
    }

    const updatedSession = await sessionService.updateSession(
      id,
      new Date(date),
      classId,
      subjectId,
      teacherId
    );
    res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update session',
    });
  }
};

// Delete session
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    await sessionService.deleteSession(id);
    res.status(200).json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete session',
    });
  }
};
