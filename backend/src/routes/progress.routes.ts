import { Router } from 'express';
import {
  getWeightLogs,
  upsertWeightLog,
  deleteWeightLog,
  getWeightStats,
} from '../controllers/progress.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/weight', getWeightLogs);
router.get('/weight/stats', getWeightStats);
router.post('/weight', upsertWeightLog);
router.delete('/weight/:id', deleteWeightLog);

export default router;