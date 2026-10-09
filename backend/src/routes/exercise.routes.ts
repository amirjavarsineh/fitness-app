import { Router } from 'express';
import {
  getExercises,
  getExerciseById,
  getCategories,
} from '../controllers/exercise.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getExercises);
router.get('/categories', getCategories);
router.get('/:id', getExerciseById);

export default router;