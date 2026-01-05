import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', attendanceController.markAttendance);
router.post('/bulk', attendanceController.markBulkAttendance);
router.get('/session/:sessionId', attendanceController.getAttendanceBySession);
router.get('/student/:studentId', attendanceController.getAttendanceByStudent);
router.get('/student/:studentId/stats', attendanceController.getStudentStats);
router.get('/class/:classId', attendanceController.getAttendanceByClass);
router.get('/teacher/:teacherId/students', attendanceController.getStudentsWithAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

export default router;
