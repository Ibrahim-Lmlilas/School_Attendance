import { Router } from 'express';
import {getAllStudents,getStudentsByClass,getStudentById,
  createStudent,updateStudent,deleteStudent,
} from '../controllers/student.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllStudents);
router.get('/class/:classId', getStudentsByClass);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
