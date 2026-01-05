import { Router } from 'express';
import {getAllSubjects,getSubjectById,createSubject,updateSubject,
  deleteSubject,} from '../controllers/subject.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
