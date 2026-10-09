import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import api from '../services/api';
import { useAuthStore } from '../store/auth.store';
import { useTranslation } from '../i18n/useTranslation';

interface StatsResponse {
  success: boolean;
  stats: {
    workouts: {
      total: number;
      thisWeek: number;
      recent: Array<{
        id: string;
        type: string;
        duration: number;
        caloriesBurned: number | null;
        createdAt: string;
        exercises: Array<{ name: string }>;
      }>;
    };
    nutrition: {
      today: { calories: number; protein: number; carbs: number; fat: number };
      weekly: { totalCalories: number; dailyAvgCalories: number };
    };
    water: { today: number; goal: number; percent: number };
    weight: {
      current: number | null;
      start: number | null;
      change: number;
      count: number;
    };
    goals: {
      active: Array<{
        id: string;
        title: string;
        goalType: string;
        targetValue: number;
        currentValue: number;
        progressPercent: number;
      }>;
      activeCount: number;
      completedCount: number;
      totalCount: number;
    };
    streaks: {
      workout: { current: number; best: number };
      water: { current: number; best: number };
      weight: { current: number; best: number };
    };
  };
  charts: {
    weight: Array<{ date: string; weight: number }>;
    calories: Array<{ date: string; consumed: number; burned: number }>;
    water: Array<{ date: string; amount: number; goal: number }>;
    workouts: Array<{ date: string; count: number; minutes: number }>;
  };
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const { data, isLoading, error } = useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get<StatsResponse>('/stats');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 dark:text-slate-500 animate-pulse-soft">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 animate-wiggle">{t('common.error')}</div>
      </div>
    );
  }

  const stats = data?.stats;
  const charts = data?.charts;
  const displayName = user?.name ?? t('dashboard.userFallback');

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('dashboard.goodMorning')
      : hour < 18
      ? t('dashboard.goodAfternoon')
      : t('dashboard.goodEvening');

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';

  // تبدیل ISO date به فرمت نمایشی بر اساس زبان کاربر
  const fmtDayMonth = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' });

  const fmtWeekday = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { weekday: 'short' });

  // داده چارت‌ها با تاریخ فرمت‌شده
  const weightChartData = (charts?.weight ?? []).map((d) => ({
    ...d,
    date: fmtDayMonth(d.date),
  }));

  const caloriesChartData = (charts?.calories ?? []).map((d) => ({
    ...d,
    date: fmtWeekday(d.date),
  }));

  const waterChartData = (charts?.water ?? []).map((d) => ({
    ...d,
    date: fmtWeekday(d.date),
  }));

  const workoutsChartData = (charts?.workouts ?? []).map((d) => ({
    ...d,
    date: fmtWeekday(d.date),
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-l from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {greeting}، {displayName} 👋
            </h1>
            <p className="text-emerald-50 text-sm">{t('dashboard.greeting')}</p>
          </div>
          <div className="text-6xl opacity-30 hidden md:block animate-float">💪</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="animate-fade-in-up delay-1">
          <StatCard
            icon="🏋️"
            label={t('dashboard.workouts')}
            value={stats?.workouts.total ?? 0}
            subtitle={`${t('common.thisWeek')}: ${stats?.workouts.thisWeek ?? 0}`}
            color="blue"
            onClick={() => navigate('/workouts')}
          />
        </div>
        <div className="animate-fade-in-up delay-2">
          <StatCard
            icon="🔥"
            label={t('dashboard.caloriesToday')}
            value={stats?.nutrition.today.calories ?? 0}
            subtitle={`${t('dashboard.average')}: ${
              stats?.nutrition.weekly.dailyAvgCalories ?? 0
            }`}
            color="orange"
            onClick={() => navigate('/nutrition')}
          />
        </div>
        <div className="animate-fade-in-up delay-3">
          <StatCard
            icon="💧"
            label={t('dashboard.waterToday')}
            value={`${stats?.water.today ?? 0}`}
            subtitle={`${stats?.water.percent ?? 0}% ${t('dashboard.waterPercent')}`}
            color="cyan"
            onClick={() => navigate('/water')}
          />
        </div>
        <div className="animate-fade-in-up delay-4">
          <StatCard
            icon="⚖️"
            label={t('dashboard.currentWeight')}
            value={stats?.weight.current?.toFixed(1) ?? '—'}
            subtitle={
              stats?.weight.count
                ? `${t('dashboard.change')}: ${
                    stats.weight.change > 0 ? '+' : ''
                  }${stats.weight.change} kg`
                : t('dashboard.notRecorded')
            }
            color="purple"
            onClick={() => navigate('/progress')}
          />
        </div>
      </div>

      {/* Streaks */}
      {stats?.streaks && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="animate-fade-in-up delay-1">
            <StreakCard
              icon="🔥"
              label={t('dashboard.workoutStreak')}
              current={stats.streaks.workout.current}
              best={stats.streaks.workout.best}
              color="orange"
              t={t}
            />
          </div>
          <div className="animate-fade-in-up delay-2">
            <StreakCard
              icon="💧"
              label={t('dashboard.waterStreak')}
              current={stats.streaks.water.current}
              best={stats.streaks.water.best}
              color="cyan"
              t={t}
            />
          </div>
          <div className="animate-fade-in-up delay-3">
            <StreakCard
              icon="⚖️"
              label={t('dashboard.weightStreak')}
              current={stats.streaks.weight.current}
              best={stats.streaks.weight.best}
              color="purple"
              t={t}
            />
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-4 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📈</span> {t('dashboard.weightChart')}
            </h2>
            <button
              onClick={() => navigate('/progress')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              {t('dashboard.manage')} →
            </button>
          </div>

          {weightChartData.length < 2 ? (
            <EmptyChart
              emoji="⚖️"
              message={t('dashboard.weightChartEmpty')}
              buttonText={t('dashboard.logWeightButton')}
              onClick={() => navigate('/progress')}
            />
          ) : (
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <LineChart
                  data={weightChartData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: 11 }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-5 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🔥</span> {t('dashboard.caloriesChart')}
            </h2>
            <button
              onClick={() => navigate('/nutrition')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              {t('dashboard.manage')} →
            </button>
          </div>

          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart
                data={caloriesChartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="consumed"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 3 }}
                  name={t('dashboard.consumed')}
                />
                <Line
                  type="monotone"
                  dataKey="burned"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 3 }}
                  name={t('dashboard.burned')}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>💧</span> {t('dashboard.waterChart')}
            </h2>
            <button
              onClick={() => navigate('/water')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              {t('dashboard.manage')} →
            </button>
          </div>

          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart
                data={waterChartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#06b6d4"
                  radius={[8, 8, 0, 0]}
                  name={t('dashboard.amount')}
                />
                <Bar
                  dataKey="goal"
                  fill="#cbd5e1"
                  radius={[8, 8, 0, 0]}
                  opacity={0.3}
                  name={t('dashboard.goal')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-7 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🏋️</span> {t('dashboard.workoutsChart')}
            </h2>
            <button
              onClick={() => navigate('/workouts')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              {t('dashboard.manage')} →
            </button>
          </div>

          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart
                data={workoutsChartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Bar
                  dataKey="minutes"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  name={t('dashboard.minutes')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Water Progress */}
      {stats && stats.water.goal > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>💧</span> {t('dashboard.waterToday2')}
            </h2>
            <button
              onClick={() => navigate('/water')}
              className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
            >
              {t('dashboard.manageWater')} →
            </button>
          </div>

          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              {stats.water.today} / {stats.water.goal} {t('dashboard.ml')}
            </span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {stats.water.percent}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-cyan-400 to-blue-500 transition-all duration-700 ease-out"
              style={{ width: `${stats.water.percent}%` }}
            />
          </div>

          {stats.water.percent >= 100 ? (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 animate-bounce-in">
              🎉 {t('dashboard.goalReached')}
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {(stats.water.goal - stats.water.today).toFixed(0)}{' '}
              {t('dashboard.mlRemaining')}
            </p>
          )}
        </div>
      )}

      {/* Recent Workouts + Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-8 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🏋️</span> {t('dashboard.recentWorkouts')}
            </h2>
            <button
              onClick={() => navigate('/workouts')}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              {t('dashboard.viewAll')} →
            </button>
          </div>

          {!stats?.workouts.recent || stats.workouts.recent.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              <p>{t('dashboard.noWorkouts')}</p>
              <button
                onClick={() => navigate('/workouts/new')}
                className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors"
              >
                {t('dashboard.firstWorkout')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.workouts.recent.map((w, i) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors gap-3 animate-fade-in"
                  style={{ animationDelay: `${0.05 * i}s` }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-lg shrink-0">
                      💪
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {t(`workoutTypes.${w.type}` as never)}
                      </p>
                      {w.exercises && w.exercises.length > 0 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {w.exercises.map((e) => e.name).join(' • ')}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(w.createdAt).toLocaleDateString(locale)}
                      </p>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {w.duration} {t('dashboard.minutes')}
                    </p>
                    {w.caloriesBurned && (
                      <p className="text-xs text-orange-500">{w.caloriesBurned}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-8 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎯</span> {t('dashboard.activeGoals')}
            </h2>
            <button
              onClick={() => navigate('/goals')}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              {t('dashboard.viewAll')} →
            </button>
          </div>

          {!stats?.goals.active || stats.goals.active.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              <p>{t('dashboard.noGoals')}</p>
              <button
                onClick={() => navigate('/goals/new')}
                className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors"
              >
                {t('dashboard.firstGoal')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.goals.active.map((g) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {g.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {g.currentValue} / {g.targetValue}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-emerald-400 to-cyan-500 transition-all duration-700 ease-out"
                      style={{ width: `${g.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {g.progressPercent}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nutrition */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-8 card-hover">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🍎</span> {t('dashboard.nutritionToday')}
          </h2>
          <button
            onClick={() => navigate('/nutrition')}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
          >
            {t('dashboard.manageNutrition')} →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <NutritionCard
            label="🔥"
            value={stats?.nutrition.today.calories ?? 0}
            unit="kcal"
            color="red"
          />
          <NutritionCard
            label="🥩"
            value={stats?.nutrition.today.protein ?? 0}
            unit="g"
            color="blue"
          />
          <NutritionCard
            label="🍞"
            value={stats?.nutrition.today.carbs ?? 0}
            unit="g"
            color="yellow"
          />
          <NutritionCard
            label="🥑"
            value={stats?.nutrition.today.fat ?? 0}
            unit="g"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function StatCard({
  icon,
  label,
  value,
  subtitle,
  color,
  onClick,
}: {
  icon: string;
  label: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'orange' | 'purple' | 'cyan';
  onClick: () => void;
}) {
  const colors = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'hover:border-blue-300 dark:hover:border-blue-700',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/30',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'hover:border-orange-300 dark:hover:border-orange-700',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-300 dark:hover:border-purple-700',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/30',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    },
  }[color];

  return (
    <button
      onClick={onClick}
      className={`w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-start shadow-sm hover:shadow-md transition-all card-hover ${colors.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
    </button>
  );
}

function StreakCard({
  icon,
  label,
  current,
  best,
  color,
  t,
}: {
  icon: string;
  label: string;
  current: number;
  best: number;
  color: 'orange' | 'cyan' | 'purple';
  t: (key: never) => string;
}) {
  const colors = {
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/30',
      text: 'text-orange-600 dark:text-orange-400',
      gradient: 'from-orange-400 to-red-500',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/30',
      text: 'text-cyan-600 dark:text-cyan-400',
      gradient: 'from-cyan-400 to-blue-500',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-400 to-pink-500',
    },
  }[color];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm card-hover h-full">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {t('dashboard.streakRecord' as never)}: {best}{' '}
            {t('dashboard.days' as never)}
          </p>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <p className={`text-4xl font-bold ${colors.text}`}>{current}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          {t('dashboard.consecutiveDays' as never)}
        </p>
      </div>

      {current > 0 ? (
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-l ${colors.gradient} transition-all duration-700 ease-out`}
            style={{
              width: `${Math.min(100, (current / Math.max(best, 7)) * 100)}%`,
            }}
          />
        </div>
      ) : (
        <p className="text-xs text-slate-400 dark:text-slate-500">💪</p>
      )}
    </div>
  );
}

function NutritionCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: 'red' | 'blue' | 'yellow' | 'purple';
}) {
  const colors = {
    red: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
    blue: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
    yellow:
      'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30',
    purple:
      'text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30',
  }[color];

  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 text-center hover:scale-105 transition-transform duration-200">
      <div
        className={`w-10 h-10 rounded-lg ${colors} flex items-center justify-center text-lg mx-auto mb-2`}
      >
        {label}
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-white">
        {value}
        <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">
          {unit}
        </span>
      </p>
    </div>
  );
}

function EmptyChart({
  emoji,
  message,
  buttonText,
  onClick,
}: {
  emoji: string;
  message: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[250px] text-center">
      <div className="text-4xl mb-2 opacity-50">{emoji}</div>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-3 px-4">
        {message}
      </p>
      <button
        onClick={onClick}
        className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}