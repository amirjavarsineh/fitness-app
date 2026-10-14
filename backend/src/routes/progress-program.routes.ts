import { Router } from 'express';
import {
  getOrCreateProgress,
  updateProgressExercise,
  updateProgress,
  getMyProgressHistory,
  getStudentProgress,
  getProgressDetail,
  getMyProgressSummary,
} from '../controllers/progress-program.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// ===== شاگرد =====
// گرفتن یا ساختن progress برای یه روز
router.get(
  '/assignment/:assignmentId/day/:dayId',
  getOrCreateProgress
);

// آپدیت یه حرکت توی progress
router.put(
  '/:progressId/exercise/:exerciseId',
  updateProgressExercise
);

// آپدیت کل progress (تیک زدن کل روز)
router.put('/:id', updateProgress);

// تاریخچه‌ی یه برنامه
router.get(
  '/assignment/:assignmentId/history',
  getMyProgressHistory
);

// خلاصه‌ی پیشرفت خودم
router.get('/summary/me', getMyProgressSummary);

// ===== مربی =====
// دیدن پیشرفت یه شاگرد
router.get('/student/:studentId', getStudentProgress);

// جزئیات یه progress خاص
router.get('/detail/:progressId', getProgressDetail);

export default router;