import { Router } from 'express';
import {getAllSessions,getSessionsByClass,getSessionById,
  createSession,updateSession,deleteSession,
} from '../controllers/session.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllSessions);
router.get('/class/:classId', getSessionsByClass);
router.get('/:id', getSessionById);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;
