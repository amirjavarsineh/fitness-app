import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Circle,
  Calendar,
  Flame,
  Trophy,
  Activity,
  Target,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
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

export default function StudentProgressPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [expandedProgress, setExpandedProgress] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['studentProgress', studentId],
    queryFn: () => programProgressService.getStudentProgress(studentId!),
    enabled: !!studentId,
  });

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';
  const fmt = (n: number): string => n.toLocaleString(locale);

  const fmtWeekday = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { weekday: 'short' });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300">
          {t('common.error')}
        </div>
      </div>
    );
  }

  const { stats, assignments } = data;

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
      <div className="animate-fade-in-up">
        <button
          onClick={() => navigate('/coach')}
          className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 mb-4 transition-all"
        >
          <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 flex items-center justify-center transition-colors rtl:rotate-0 ltr:rotate-180">
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
          <span className="font-semibold">{t('studentProgress.backToCoach')}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
              <TrendingUp size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('studentProgress.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t('studentProgress.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="animate-fade-in-up delay-1">
          <StatCard
            Icon={Activity}
            label={t('studentProgress.totalSessions')}
            value={fmt(stats.totalSessions)}
            gradient="from-blue-500 to-indigo-600"
          />
        </div>
        <div className="animate-fade-in-up delay-2">
          <StatCard
            Icon={CheckCircle2}
            label={t('studentProgress.completedSessions')}
            value={fmt(stats.completedSessions)}
            gradient="from-emerald-500 to-teal-600"
          />
        </div>
        <div className="animate-fade-in-up delay-3">
          <StatCard
            Icon={Target}
            label={t('studentProgress.completionRate')}
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
              {t('studentProgress.weeklyActivity')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('studentProgress.weeklyActivityDesc')}
            </p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
            {t('studentProgress.noActivity')}
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
                  name={t('studentProgress.plannedChart')}
                />
                <Bar
                  dataKey="completed"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  name={t('studentProgress.completedChart')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ===== Assignments & Progress ===== */}
      {assignments.length === 0 ? (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white mx-auto mb-5 shadow-2xl animate-float">
              <Dumbbell size={40} strokeWidth={2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t('studentProgress.noAssignments')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {t('studentProgress.noAssignmentsDesc')}
            </p>
          </div>
        </div>
      ) : (
        assignments.map((assignment, aIdx) => (
          <div
            key={assignment.assignmentId}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up card-hover"
            style={{ animationDelay: `${0.05 * (aIdx + 5)}s` }}
          >
            {/* Program Header */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Trophy size={22} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {assignment.program.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('studentProgress.startedAt')}{' '}
                  {new Date(assignment.startDate).toLocaleDateString(locale)}
                </p>
              </div>
            </div>

            {/* Progress Sessions */}
            {assignment.recentProgress.length === 0 ? (
              <p className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
                {t('studentProgress.noSessionsYet')}
              </p>
            ) : (
              <div className="space-y-2">
                {assignment.recentProgress.map((p, pIdx) => {
                  const percent =
                    p.totalExercises > 0
                      ? Math.round(
                          (p.completedExercises / p.totalExercises) * 100
                        )
                      : 0;
                  const isCompleted = p.status === 'COMPLETED';
                  const isExpanded = expandedProgress === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`relative overflow-hidden rounded-2xl border animate-fade-in ${
                        isCompleted
                          ? 'bg-gradient-to-l from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800/50 border-emerald-200 dark:border-emerald-800/50'
                          : 'bg-gradient-to-l from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 border-slate-100 dark:border-slate-700'
                      }`}
                      style={{ animationDelay: `${pIdx * 0.04}s` }}
                    >
                      <button
                        onClick={() =>
                          setExpandedProgress(isExpanded ? null : p.id)
                        }
                        className="w-full text-start p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
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
                                {p.day.label}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                <span className="inline-flex items-center gap-1">
                                  <Calendar size={11} strokeWidth={2.5} />
                                  {new Date(p.date).toLocaleDateString(locale)}
                                </span>
                                <span>
                                  {p.completedExercises} / {p.totalExercises}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <p
                              className={`text-lg font-bold ${
                                isCompleted
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {percent}%
                            </p>
                            <span className="text-slate-400">
                              {isExpanded ? (
                                <ChevronUp size={18} strokeWidth={2.2} />
                              ) : (
                                <ChevronDown size={18} strokeWidth={2.2} />
                              )}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-2 animate-scale-in">
                          {p.notes && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mb-2">
                              "{p.notes}"
                            </p>
                          )}
                          {p.exercises.length === 0 ? (
                            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">
                              {t('studentProgress.noExercisesDetail')}
                            </p>
                          ) : (
                            p.exercises.map((ex, eIdx) => (
                              <div
                                key={ex.id}
                                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div
                                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                      ex.completed
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                    }`}
                                  >
                                    {ex.completed ? (
                                      <CheckCircle2 size={12} strokeWidth={3} />
                                    ) : (
                                      <Circle size={10} strokeWidth={2.5} />
                                    )}
                                  </div>
                                  <span className="text-xs text-slate-600 dark:text-slate-400">
                                    {t('studentProgress.exercise')} {eIdx + 1}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] shrink-0">
                                  {ex.actualSets != null && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">
                                      {ex.actualSets} × {ex.actualReps ?? '—'}
                                    </span>
                                  )}
                                  {ex.actualWeight != null && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-bold">
                                      {ex.actualWeight} kg
                                    </span>
                                  )}
                                  {ex.timeSpent != null && ex.timeSpent > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold inline-flex items-center gap-0.5">
                                      <Clock size={9} strokeWidth={2.5} />
                                      {ex.timeSpent}m
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      )}
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