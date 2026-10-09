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
import foodRouter from './routes/food.routes';
import measurementRouter from './routes/measurement.routes';
import reminderRouter from './routes/reminder.routes';

import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS - اجازه به چند دامنه
const allowedOrigins = [
  'http://localhost:5173', // Dev
  'http://localhost:4173', // Preview (PWA)
  process.env.FRONTEND_URL, // Production
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body Parser with limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
app.use(morgan('dev'));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'تعداد درخواست‌ها زیاد است. کمی صبر کن.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'تعداد تلاش‌های ورود زیاد است. ۱۵ دقیقه صبر کن.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'تعداد ثبت‌نام‌ها زیاد است. ۱ ساعت صبر کن.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);

// Routes
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
app.use('/api/foods', foodRouter);
app.use('/api/measurements', measurementRouter);
app.use('/api/reminders', reminderRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;