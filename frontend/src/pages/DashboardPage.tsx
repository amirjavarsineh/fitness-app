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
import {
  Dumbbell,
  Flame,
  Droplets,
  Scale,
  Target,
  Apple,
  TrendingUp,
  Activity,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
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
  const fmt = (n: number): string => n.toLocaleString(locale);

  const fmtDayMonth = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' });

  const fmtWeekday = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { weekday: 'short' });

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

  const tooltipStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    fontSize: 13,
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
  } as const;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ===== Welcome Hero ===== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-emerald-500/30 animate-fade-in-up">
        <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -start-20 w-72 h-72 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 end-1/4 w-40 h-40 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold mb-3">
              <Sparkles size={12} strokeWidth={2.5} />
              <span>
                {new Date().toLocaleDateString(locale, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {greeting}، {displayName} 👋
            </h1>
            <p className="text-white/90 text-sm max-w-md">
              {t('dashboard.greeting')}
            </p>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg animate-float">
              <Dumbbell size={40} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Stat Cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="animate-fade-in-up delay-1">
          <StatCard
            icon={<Dumbbell size={24} strokeWidth={2.2} />}
            label={t('dashboard.workouts')}
            value={fmt(stats?.workouts.total ?? 0)}
            subtitle={`${t('common.thisWeek')}: ${fmt(stats?.workouts.thisWeek ?? 0)}`}
            gradient="from-blue-500 to-indigo-600"
            onClick={() => navigate('/workouts')}
          />
        </div>
        <div className="animate-fade-in-up delay-2">
          <StatCard
            icon={<Flame size={24} strokeWidth={2.2} />}
            label={t('dashboard.caloriesToday')}
            value={fmt(stats?.nutrition.today.calories ?? 0)}
            subtitle={`${t('dashboard.average')}: ${fmt(
              stats?.nutrition.weekly.dailyAvgCalories ?? 0
            )}`}
            gradient="from-orange-500 to-rose-500"
            onClick={() => navigate('/nutrition')}
          />
        </div>
        <div className="animate-fade-in-up delay-3">
          <StatCard
            icon={<Droplets size={24} strokeWidth={2.2} />}
            label={t('dashboard.waterToday')}
            value={fmt(stats?.water.today ?? 0)}
            subtitle={`${stats?.water.percent ?? 0}% ${t('dashboard.waterPercent')}`}
            gradient="from-cyan-500 to-blue-500"
            onClick={() => navigate('/water')}
          />
        </div>
        <div className="animate-fade-in-up delay-4">
          <StatCard
            icon={<Scale size={24} strokeWidth={2.2} />}
            label={t('dashboard.currentWeight')}
            value={stats?.weight.current?.toFixed(1) ?? '—'}
            subtitle={
              stats?.weight.count
                ? `${t('dashboard.change')}: ${
                    stats.weight.change > 0 ? '+' : ''
                  }${stats.weight.change} kg`
                : t('dashboard.notRecorded')
            }
            gradient="from-purple-500 to-pink-500"
            onClick={() => navigate('/progress')}
          />
        </div>
      </div>

      {/* ===== Streaks ===== */}
      {stats?.streaks && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="animate-fade-in-up delay-1">
            <StreakCard
              icon={<Flame size={28} strokeWidth={2.2} />}
              label={t('dashboard.workoutStreak')}
              current={stats.streaks.workout.current}
              best={stats.streaks.workout.best}
              gradient="from-orange-500 via-red-500 to-rose-600"
              t={t}
              fmt={fmt}
            />
          </div>
          <div className="animate-fade-in-up delay-2">
            <StreakCard
              icon={<Droplets size={28} strokeWidth={2.2} />}
              label={t('dashboard.waterStreak')}
              current={stats.streaks.water.current}
              best={stats.streaks.water.best}
              gradient="from-cyan-500 via-sky-500 to-blue-600"
              t={t}
              fmt={fmt}
            />
          </div>
          <div className="animate-fade-in-up delay-3">
            <StreakCard
              icon={<Scale size={28} strokeWidth={2.2} />}
              label={t('dashboard.weightStreak')}
              current={stats.streaks.weight.current}
              best={stats.streaks.weight.best}
              gradient="from-violet-500 via-purple-500 to-fuchsia-600"
              t={t}
              fmt={fmt}
            />
          </div>
        </div>
      )}

      {/* ===== Charts Row 1 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          icon={<TrendingUp size={20} strokeWidth={2.2} />}
          title={t('dashboard.weightChart')}
          gradient="from-emerald-500 to-teal-500"
          onManage={() => navigate('/progress')}
          manageText={t('dashboard.manage')}
          delay="delay-4"
        >
          {weightChartData.length < 2 ? (
            <EmptyChart
              icon={<Scale size={40} strokeWidth={1.8} />}
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
                  <Tooltip contentStyle={tooltipStyle} />
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
        </ChartCard>

        <ChartCard
          icon={<Flame size={20} strokeWidth={2.2} />}
          title={t('dashboard.caloriesChart')}
          gradient="from-orange-500 to-rose-500"
          onManage={() => navigate('/nutrition')}
          manageText={t('dashboard.manage')}
          delay="delay-5"
        >
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart
                data={caloriesChartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
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
        </ChartCard>
      </div>

      {/* ===== Charts Row 2 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          icon={<Droplets size={20} strokeWidth={2.2} />}
          title={t('dashboard.waterChart')}
          gradient="from-cyan-500 to-blue-500"
          onManage={() => navigate('/water')}
          manageText={t('dashboard.manage')}
          delay="delay-6"
        >
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart
                data={waterChartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
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
        </ChartCard>

        <ChartCard
          icon={<Activity size={20} strokeWidth={2.2} />}
          title={t('dashboard.workoutsChart')}
          gradient="from-violet-500 to-purple-500"
          onManage={() => navigate('/workouts')}
          manageText={t('dashboard.manage')}
          delay="delay-7"
        >
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart
                data={workoutsChartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="minutes"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  name={t('dashboard.minutes')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ===== Water Progress ===== */}
      {stats && stats.water.goal > 0 && (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-8">
          <div className="absolute -top-16 -end-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <Droplets size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('dashboard.waterToday2')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {fmt(stats.water.today)} / {fmt(stats.water.goal)} {t('dashboard.ml')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/water')}
                className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1"
              >
                {t('dashboard.manageWater')}
                <ChevronRight size={16} strokeWidth={2.2} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-cyan-400 via-sky-500 to-blue-600 transition-all duration-700 ease-out rounded-full shadow-lg shadow-cyan-500/30"
                    style={{ width: `${stats.water.percent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {stats.water.percent >= 100
                    ? `🎉 ${t('dashboard.goalReached')}`
                    : `${fmt(
                        Math.max(0, stats.water.goal - stats.water.today)
                      )} ${t('dashboard.mlRemaining')}`}
                </p>
              </div>
              <div className="text-center shrink-0">
                <p className="text-3xl font-bold bg-gradient-to-br from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  {stats.water.percent}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Recent Workouts + Goals ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-8 card-hover">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Dumbbell size={20} strokeWidth={2.2} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('dashboard.recentWorkouts')}
              </h2>
            </div>
            <button
              onClick={() => navigate('/workouts')}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
            >
              {t('dashboard.viewAll')}
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          </div>

          {!stats?.workouts.recent || stats.workouts.recent.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              <p className="mb-3">{t('dashboard.noWorkouts')}</p>
              <button
                onClick={() => navigate('/workouts/new')}
                className="px-4 py-2 rounded-lg bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-sm font-medium hover:scale-105 transition-all shadow-lg shadow-emerald-500/30"
              >
                {t('dashboard.firstWorkout')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.workouts.recent.map((w, i) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-l from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 hover:from-blue-50 hover:to-indigo-50/50 dark:hover:from-slate-700 dark:hover:to-slate-700/50 transition-all gap-3 animate-fade-in group"
                  style={{ animationDelay: `${0.05 * i}s` }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Dumbbell size={18} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
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
                  <div className="text-end shrink-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {fmt(w.duration)}
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-normal ms-1">
                        {t('dashboard.minutes')}
                      </span>
                    </p>
                    {w.caloriesBurned && (
                      <p className="text-xs text-orange-500 font-medium flex items-center gap-1 justify-end">
                        <Flame size={12} strokeWidth={2.5} />
                        {fmt(w.caloriesBurned)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-8 card-hover">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
                <Target size={20} strokeWidth={2.2} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('dashboard.activeGoals')}
              </h2>
            </div>
            <button
              onClick={() => navigate('/goals')}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
            >
              {t('dashboard.viewAll')}
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          </div>

          {!stats?.goals.active || stats.goals.active.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              <p className="mb-3">{t('dashboard.noGoals')}</p>
              <button
                onClick={() => navigate('/goals/new')}
                className="px-4 py-2 rounded-lg bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-sm font-medium hover:scale-105 transition-all shadow-lg shadow-emerald-500/30"
              >
                {t('dashboard.firstGoal')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.goals.active.map((g) => (
                <div key={g.id} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {g.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {fmt(g.currentValue)} / {fmt(g.targetValue)}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-emerald-400 via-teal-500 to-cyan-500 transition-all duration-700 ease-out rounded-full shadow-sm"
                      style={{ width: `${g.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                    {g.progressPercent}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== Nutrition Today ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-8 card-hover">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg">
              <Apple size={20} strokeWidth={2.2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('dashboard.nutritionToday')}
            </h2>
          </div>
          <button
            onClick={() => navigate('/nutrition')}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
          >
            {t('dashboard.manageNutrition')}
            <ChevronRight size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <NutritionCard
            icon={<Flame size={22} strokeWidth={2.2} />}
            value={stats?.nutrition.today.calories ?? 0}
            unit="kcal"
            gradient="from-red-500 to-orange-500"
            fmt={fmt}
          />
          <NutritionCard
            icon={<Dumbbell size={22} strokeWidth={2.2} />}
            value={stats?.nutrition.today.protein ?? 0}
            unit="g"
            gradient="from-blue-500 to-indigo-500"
            fmt={fmt}
          />
          <NutritionCard
            icon={<Apple size={22} strokeWidth={2.2} />}
            value={stats?.nutrition.today.carbs ?? 0}
            unit="g"
            gradient="from-amber-500 to-yellow-500"
            fmt={fmt}
          />
          <NutritionCard
            icon={<Droplets size={22} strokeWidth={2.2} />}
            value={stats?.nutrition.today.fat ?? 0}
            unit="g"
            gradient="from-purple-500 to-pink-500"
            fmt={fmt}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== Sub Components ====================

function StatCard({
  icon,
  label,
  value,
  subtitle,
  gradient,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 text-start shadow-soft hover:shadow-elevated transition-all overflow-hidden card-hover"
    >
      <div
        className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity pointer-events-none`}
      />

      <div className="relative">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
          {label}
        </p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
          {subtitle}
        </p>
      </div>
    </button>
  );
}

function StreakCard({
  icon,
  label,
  current,
  best,
  gradient,
  t,
  fmt,
}: {
  icon: React.ReactNode;
  label: string;
  current: number;
  best: number;
  gradient: string;
  t: (key: never) => string;
  fmt: (n: number) => string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 text-white shadow-xl bg-gradient-to-br ${gradient} card-hover`}
    >
      <div className="absolute -top-16 -end-16 w-40 h-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -start-10 w-32 h-32 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-white/70">
              {t('dashboard.streakRecord' as never)}: {fmt(best)}{' '}
              {t('dashboard.days' as never)}
            </p>
          </div>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <p className="text-5xl font-bold tracking-tight">{fmt(current)}</p>
          <p className="text-sm text-white/80 mb-2 font-medium">
            {t('dashboard.consecutiveDays' as never)}
          </p>
        </div>

        {current > 0 ? (
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{
                width: `${Math.min(100, (current / Math.max(best, 7)) * 100)}%`,
              }}
            />
          </div>
        ) : (
          <p className="text-xs text-white/70">💪</p>
        )}
      </div>
    </div>
  );
}

function ChartCard({
  icon,
  title,
  gradient,
  onManage,
  manageText,
  delay,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  gradient: string;
  onManage: () => void;
  manageText: string;
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up ${delay} card-hover`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
          >
            {icon}
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        <button
          onClick={onManage}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
        >
          {manageText}
          <ChevronRight size={14} strokeWidth={2.2} />
        </button>
      </div>
      {children}
    </div>
  );
}

function NutritionCard({
  icon,
  value,
  unit,
  gradient,
  fmt,
}: {
  icon: React.ReactNode;
  value: number;
  unit: string;
  gradient: string;
  fmt: (n: number) => string;
}) {
  return (
    <div className="group relative rounded-2xl border border-slate-100 dark:border-slate-800 p-4 text-center hover:scale-105 transition-all overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50">
      <div
        className={`absolute -top-8 -end-8 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mx-auto mb-2 shadow-lg`}
        >
          {icon}
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {fmt(value)}
          <span className="text-xs text-slate-400 dark:text-slate-500 ms-1 font-normal">
            {unit}
          </span>
        </p>
      </div>
    </div>
  );
}

function EmptyChart({
  icon,
  message,
  buttonText,
  onClick,
}: {
  icon: React.ReactNode;
  message: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[250px] text-center">
      <div className="text-slate-300 dark:text-slate-700 mb-3">{icon}</div>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-4 px-4">
        {message}
      </p>
      <button
        onClick={onClick}
        className="px-4 py-2 rounded-lg bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-xs font-semibold transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
      >
        {buttonText}
      </button>
    </div>
  );
}