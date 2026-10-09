import { Router } from 'express';
import {
  createNutritionLog,
  getNutritionLogs,
  updateNutritionLog,
  deleteNutritionLog,
} from '../controllers/nutrition.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/', createNutritionLog);
router.get('/', getNutritionLogs);
router.put('/:id', updateNutritionLog);
router.delete('/:id', deleteNutritionLog);

export default router;
