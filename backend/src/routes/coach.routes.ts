import { Router } from 'express';
import {
  activateCoach,
  getCoachInfo,
  regenerateCoachCode,
  joinWithCode,
  disconnectStudent,
  getMyCoaches,
  disconnectFromCoach,
} from '../controllers/coach.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// مربی
router.post('/activate', activateCoach);
router.get('/info', getCoachInfo);
router.post('/regenerate-code', regenerateCoachCode);
router.delete('/students/:studentId', disconnectStudent);

// شاگرد
router.post('/join', joinWithCode);
router.get('/my-coaches', getMyCoaches);
router.delete('/coaches/:coachId', disconnectFromCoach);

export default router;