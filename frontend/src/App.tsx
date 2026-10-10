import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import InstallPWA from './components/InstallPWA';
import ReminderNotifier from './components/ReminderNotifier';

// ===== Lazy loading صفحات =====
// هر صفحه فقط وقتی لود می‌شه که کاربر بهش بره
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WorkoutsPage = lazy(() => import('./pages/WorkoutsPage'));
const WorkoutFormPage = lazy(() => import('./pages/WorkoutFormPage'));
const NutritionPage = lazy(() => import('./pages/NutritionPage'));
const WaterPage = lazy(() => import('./pages/WaterPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));
const ExportPage = lazy(() => import('./pages/ExportPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const MeasurementsPage = lazy(() => import('./pages/MeasurementsPage'));
const RemindersPage = lazy(() => import('./pages/RemindersPage'));
const ChallengesPage = lazy(() => import('./pages/ChallengesPage'));
const LevelPage = lazy(() => import('./pages/LevelPage'));
const PredictionPage = lazy(() => import('./pages/PredictionPage'));
const GoalListPage = lazy(() => import('./pages/goals/GoalListPage'));
const GoalFormPage = lazy(() => import('./pages/goals/GoalFormPage'));

// صفحه‌ی لودینگ که موقع انتظار نشون داده می‌شه
function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white shadow-lg animate-float">
          <Dumbbell size={24} strokeWidth={2.5} />
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse-soft">
          Loading...
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <InstallPWA />
      <ReminderNotifier />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/workouts/new" element={<WorkoutFormPage />} />
              <Route path="/workouts/:id/edit" element={<WorkoutFormPage />} />

              <Route path="/nutrition" element={<NutritionPage />} />
              <Route path="/water" element={<WaterPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/measurements" element={<MeasurementsPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/level" element={<LevelPage />} />
              <Route path="/prediction" element={<PredictionPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/export" element={<ExportPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />

              <Route path="/goals" element={<GoalListPage />} />
              <Route path="/goals/new" element={<GoalFormPage />} />
              <Route path="/goals/:id/edit" element={<GoalFormPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}