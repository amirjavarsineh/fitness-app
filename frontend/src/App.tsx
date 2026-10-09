import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import InstallPWA from './components/InstallPWA';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutFormPage from './pages/WorkoutFormPage';
import NutritionPage from './pages/NutritionPage';
import WaterPage from './pages/WaterPage';
import ProgressPage from './pages/ProgressPage';
import ReportPage from './pages/ReportPage';
import ExportPage from './pages/ExportPage';
import AchievementsPage from './pages/AchievementsPage';
import MeasurementsPage from './pages/MeasurementsPage';
import GoalListPage from './pages/goals/GoalListPage';
import GoalFormPage from './pages/goals/GoalFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <InstallPWA />
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
    </BrowserRouter>
  );
}