import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import nutritionRoutes from './routes/nutrition.routes';
import workoutRoutes from './routes/workout.routes';
import progressRoutes from './routes/progress.routes';
import statsRouter from './routes/stats.routes';
import goalRouter from './routes/goal.routes';
import waterRouter from './routes/water.routes';
import exerciseRouter from './routes/exercise.routes';
import reportRouter from './routes/report.routes';
import exportRouter from './routes/export.routes';
import achievementsRouter from './routes/achievements.routes';

import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Security Headers =====
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ===== CORS =====
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ===== Body Parser with limit =====
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ===== Logging =====
app.use(morgan('dev'));

// ===== Rate Limiting =====
// محدودیت کلی روی همه API ها
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 300, // حداکثر 300 درخواست در 15 دقیقه برای هر IP
  message: { success: false, message: 'تعداد درخواست‌ها زیاد است. کمی صبر کن.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// محدودیت شدید برای login/register (ضد Brute-Force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 10, // حداکثر 10 درخواست در 15 دقیقه
  message: { success: false, message: 'تعداد تلاش‌های ورود زیاد است. ۱۵ دقیقه صبر کن.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // درخواست‌های موفق شمرده نشن
});

// محدودیت برای ثبت‌نام
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ساعت
  max: 5, // حداکثر 5 ثبت‌نام در 1 ساعت
  message: { success: false, message: 'تعداد ثبت‌نام‌ها زیاد است. ۱ ساعت صبر کن.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// اعمال محدودیت‌ها
app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/stats', statsRouter);
app.use('/api/goals', goalRouter);
app.use('/api/water', waterRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/report', reportRouter);
app.use('/api/export', exportRouter);
app.use('/api/achievements', achievementsRouter);

// ===== Health check =====
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== Error Handler =====
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;