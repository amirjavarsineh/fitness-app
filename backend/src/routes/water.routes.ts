import { Router } from 'express';
import {
  getTodayWater,
  addWater,
  resetTodayWater,
  getWaterStats,
  updateWaterGoal,
} from '../controllers/water.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/today', getTodayWater);
router.get('/stats', getWaterStats);
router.post('/add', addWater);
router.put('/goal', updateWaterGoal);
router.delete('/today', resetTodayWater);

export default router;