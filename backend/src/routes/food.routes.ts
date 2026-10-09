import { Router } from 'express';
import {
  getFoods,
  getFoodById,
  getBrands,
} from '../controllers/food.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getFoods);
router.get('/brands', getBrands);
router.get('/:id', getFoodById);

export default router;
