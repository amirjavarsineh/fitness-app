import { Router } from 'express';
import {
  exportWorkouts,
  exportNutrition,
  exportWeight,
  exportWater,
  exportGoals,
} from '../controllers/export.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/workouts', exportWorkouts);
router.get('/nutrition', exportNutrition);
router.get('/weight', exportWeight);
router.get('/water', exportWater);
router.get('/goals', exportGoals);

export default router;