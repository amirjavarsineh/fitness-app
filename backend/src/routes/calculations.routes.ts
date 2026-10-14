import { Router } from 'express';
import {
  getCalculations,
  calculateInstant,
  calculateWorkoutCalories,
  calculateBodyFat,
} from '../controllers/calculations.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// محاسبه‌ی کامل از پروفایل کاربر
router.get('/', getCalculations);

// محاسبه‌ی آنی با داده‌ی ورودی
router.post('/instant', calculateInstant);

// محاسبه‌ی کالری سوزانده‌شده برای تمرین
router.post('/workout-calories', calculateWorkoutCalories);

// تخمین چربی بدن
router.post('/body-fat', calculateBodyFat);

export default router;