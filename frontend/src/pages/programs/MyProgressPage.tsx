import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  CheckCircle2,
  Circle,
  Calendar,
  Flame,
  Trophy,
  Activity,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { programProgressService } from '../../services/program-progress.service';
import { useTranslation } from '../../i18n/useTranslation';

export default function MyProgressPage() {
  const { t, language } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['myProgressSummary'],
    queryFn: programProgressService.getMySummary,
  });

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';
  const fmt = (n: number): string => n.toLocaleString(locale);

  const fmtWeekday = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { weekday: 'short' });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  const stats = data?.stats ?? {
    totalSessions: 0,
    completedSessions: 0,
    completionRate: 0,
    weeklyTrend: [],
  };
  const recent = data?.recent ?? [];

  const chartData = stats.weeklyTrend.map((d) => ({
    date: fmtWeekday(d.date),
    completed: d.completed,
    total: d.total,
  }));

  const tooltipStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    fontSize: 13,
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
  } as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
            <TrendingUp size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('programProgress.myProgress')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('programProgress.myProgressDesc')}
          </p>
        </div>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="animate-fade-in-up delay-1">
          <StatCard
            Icon={Activity}
            label={t('programProgress.totalSessions')}
            value={fmt(stats.totalSessions)}
            gradient="from-blue-500 to-indigo-600"
          />
        </div>
        <div className="animate-fade-in-up delay-2">
          <StatCard
            Icon={CheckCircle2}
            label={t('programProgress.completedSessions')}
            value={fmt(stats.completedSessions)}
            gradient="from-emerald-500 to-teal-600"
          />
        </div>
        <div className="animate-fade-in-up delay-3">
          <StatCard
            Icon={Target}
            label={t('programProgress.completionRate')}
            value={`${fmt(stats.completionRate)}%`}
            gradient="from-amber-500 to-orange-600"
          />
        </div>
      </div>

      {/* ===== Weekly Chart ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-4 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Flame size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('programProgress.weeklyActivity')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('programProgress.weeklyActivityDesc')}
            </p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
            {t('programProgress.noActivity')}
          </div>
        ) : (
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="total"
                  fill="#cbd5e1"
                  radius={[6, 6, 0, 0]}
                  name={t('programProgress.plannedChart')}
                />
                <Bar
                  dataKey="completed"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  name={t('programProgress.completedChart')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ===== Recent Sessions ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-5 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center text-white shadow-lg">
            <Trophy size={22} strokeWidth={2.2} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('programProgress.recentSessions')}
          </h2>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Activity size={28} strokeWidth={2} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('programProgress.noSessions')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((item, i) => {
              const percent =
                item.totalExercises > 0
                  ? Math.round(
                      (item.completedExercises / item.totalExercises) * 100
                    )
                  : 0;
              const isCompleted = item.status === 'COMPLETED';

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border animate-fade-in ${
                    isCompleted
                      ? 'bg-gradient-to-l from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800/50 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-gradient-to-l from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 border-slate-100 dark:border-slate-700'
                  }`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shadow-md shrink-0 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-br from-slate-400 to-slate-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={22} strokeWidth={2.2} />
                      ) : (
                        <Circle size={22} strokeWidth={2.2} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.day.label}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={11} strokeWidth={2.5} />
                          {new Date(item.date).toLocaleDateString(locale)}
                        </span>
                        <span>
                          {item.completedExercises} / {item.totalExercises}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    <p
                      className={`text-lg font-bold ${
                        isCompleted
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {percent}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Sub Components ====================

function StatCard({
  Icon,
  label,
  value,
  gradient,
}: {
  Icon: typeof Activity;
  label: string;
  value: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all card-hover">
      <div
        className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}
        >
          <Icon size={24} strokeWidth={2.2} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}