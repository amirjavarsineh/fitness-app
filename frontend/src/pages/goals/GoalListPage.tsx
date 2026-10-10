import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Calendar,
  Target,
  Weight,
  Dumbbell,
  Flame,
  TrendingUp,
  Star,
  Check,
} from 'lucide-react';
import { goalService, type Goal, type GoalStatus } from '../../services/goal.service';
import { useTranslation } from '../../i18n/useTranslation';

// ==================== Data ====================

const GOAL_CATEGORY_INFO: Record<
  string,
  { labelKey: string; Icon: typeof Weight; gradient: string }
> = {
  WEIGHT: { labelKey: 'goals.categoryWeight', Icon: Weight, gradient: 'from-blue-500 to-indigo-600' },
  WORKOUT_FREQUENCY: { labelKey: 'goals.categoryWorkoutFrequency', Icon: Dumbbell, gradient: 'from-purple-500 to-fuchsia-600' },
  CALORIE_INTAKE: { labelKey: 'goals.categoryCalorieIntake', Icon: Flame, gradient: 'from-orange-500 to-red-500' },
  MUSCLE_GAIN: { labelKey: 'goals.categoryMuscleGain', Icon: TrendingUp, gradient: 'from-rose-500 to-pink-600' },
  ENDURANCE: { labelKey: 'goals.categoryEndurance', Icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600' },
  OTHER: { labelKey: 'goals.categoryOther', Icon: Star, gradient: 'from-slate-500 to-slate-700' },
};

const STATUS_INFO: Record<
  GoalStatus,
  { labelKey: string; gradient: string; dot: string }
> = {
  ACTIVE: {
    labelKey: 'goals.statusActive',
    gradient: 'from-emerald-500 to-teal-500',
    dot: 'bg-emerald-400',
  },
  COMPLETED: {
    labelKey: 'goals.statusCompleted',
    gradient: 'from-blue-500 to-indigo-500',
    dot: 'bg-blue-400',
  },
  CANCELLED: {
    labelKey: 'goals.statusCancelled',
    gradient: 'from-slate-500 to-slate-600',
    dot: 'bg-slate-400',
  },
};

// ==================== Page ====================

export default function GoalListPage() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';
  const fmt = (n: number): string => n.toLocaleString(locale);

  const fetchGoals = async () => {
    try {
      const data = await goalService.getAll();
      setGoals(data);
    } catch {
      setError(t('goals.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('goals.deleteConfirm'))) return;
    try {
      await goalService.remove(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch {
      alert(t('goals.errorDelete'));
    }
  };

  const handleStatusChange = async (goal: Goal, status: GoalStatus) => {
    try {
      const updated = await goalService.update(goal.id, { status });
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? updated : g)));
    } catch {
      alert(t('goals.errorStatus'));
    }
  };

  const getProgress = (goal: Goal) => {
    if (goal.targetValue <= 0) return 0;
    return Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  };

  // ===== Loading =====
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  // ===== Error =====
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 animate-wiggle">
          <X size={24} strokeWidth={2.5} />
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
              <Target size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('goals.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {fmt(goals.length)} {t('goals.count')}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/goals/new')}
          className="btn-shine flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-l from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>{t('goals.newGoal')}</span>
        </button>
      </div>

      {/* ===== Empty State ===== */}
      {goals.length === 0 ? (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-pink-500/30 animate-float">
              <Target size={48} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('goals.noGoals')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {t('goals.noGoalsDesc')}
            </p>
            <button
              onClick={() => navigate('/goals/new')}
              className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/30 hover:scale-105 transition-all"
            >
              <Plus size={20} strokeWidth={2.5} />
              {t('goals.start')}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const categoryInfo =
              GOAL_CATEGORY_INFO[goal.goalType] ?? GOAL_CATEGORY_INFO.OTHER;
            const statusInfo = STATUS_INFO[goal.status];
            const progress = getProgress(goal);
            const CatIcon = categoryInfo.Icon;

            return (
              <div
                key={goal.id}
                className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up card-hover"
                style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s` }}
              >
                {/* Glow */}
                <div
                  className={`absolute -top-16 -end-16 w-40 h-40 rounded-full bg-gradient-to-br ${categoryInfo.gradient} opacity-[0.08] group-hover:opacity-[0.15] blur-3xl transition-opacity pointer-events-none`}
                />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-l ${categoryInfo.gradient} text-white text-xs font-bold shadow-md`}
                        >
                          <CatIcon size={13} strokeWidth={2.5} />
                          <span>{t(categoryInfo.labelKey as never)}</span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-l ${statusInfo.gradient} text-white text-xs font-bold shadow-md`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} animate-pulse-soft`}
                          />
                          <span>{t(statusInfo.labelKey as never)}</span>
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {goal.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/goals/${goal.id}/edit`)}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:scale-110 flex items-center justify-center"
                        title={t('goals.edit')}
                      >
                        <Pencil size={16} strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all hover:scale-110 flex items-center justify-center"
                        title={t('goals.delete')}
                      >
                        <Trash2 size={16} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('goals.progress')}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {fmt(goal.currentValue)} / {fmt(goal.targetValue)}
                        </span>
                        <span
                          className={`text-lg font-bold bg-gradient-to-l ${categoryInfo.gradient} bg-clip-text text-transparent`}
                        >
                          {fmt(progress)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-l ${categoryInfo.gradient} transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3 flex-wrap">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {goal.deadline && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <Calendar size={12} strokeWidth={2.5} />
                          <span>
                            {t('goals.deadline')}:{' '}
                            {new Date(goal.deadline).toLocaleDateString(locale)}
                          </span>
                        </span>
                      )}
                    </div>

                    {goal.status === 'ACTIVE' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(goal, 'COMPLETED')}
                          className="btn-shine inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
                        >
                          <Check size={14} strokeWidth={3} />
                          <span>{t('goals.completeBtn')}</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(goal, 'CANCELLED')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-all hover:scale-105"
                        >
                          <X size={14} strokeWidth={2.5} />
                          <span>{t('goals.cancelBtn')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}