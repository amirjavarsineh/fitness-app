import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { goalService, type Goal, type GoalStatus } from '../../services/goal.service';
import { useTranslation } from '../../i18n/useTranslation';

const GOAL_CATEGORY_INFO: Record<string, { labelKey: string; emoji: string; color: string }> = {
  WEIGHT: { labelKey: 'goals.categoryWeight', emoji: '⚖️', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
  WORKOUT_FREQUENCY: { labelKey: 'goals.categoryWorkoutFrequency', emoji: '🏋️', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
  CALORIE_INTAKE: { labelKey: 'goals.categoryCalorieIntake', emoji: '🔥', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' },
  MUSCLE_GAIN: { labelKey: 'goals.categoryMuscleGain', emoji: '💪', color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' },
  ENDURANCE: { labelKey: 'goals.categoryEndurance', emoji: '🏃', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' },
  OTHER: { labelKey: 'goals.categoryOther', emoji: '⭐', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
};

const STATUS_INFO: Record<GoalStatus, { labelKey: string; color: string; dot: string }> = {
  ACTIVE: { labelKey: 'goals.statusActive', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  COMPLETED: { labelKey: 'goals.statusCompleted', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  CANCELLED: { labelKey: 'goals.statusCancelled', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' },
};

export default function GoalListPage() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t('goals.title')}
        </h1>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl animate-wiggle">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('goals.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {goals.length} {t('goals.count')}
          </p>
        </div>
        <button
          onClick={() => navigate('/goals/new')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
        >
          <span className="text-lg">+</span>
          <span>{t('goals.newGoal')}</span>
        </button>
      </div>

      {/* Empty State */}
      {goals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-float">🎯</div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {t('goals.noGoals')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t('goals.noGoalsDesc')}
          </p>
          <button
            onClick={() => navigate('/goals/new')}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all hover:scale-105"
          >
            {t('goals.start')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal, index) => {
            const categoryInfo =
              GOAL_CATEGORY_INFO[goal.goalType] ?? GOAL_CATEGORY_INFO.OTHER;
            const statusInfo = STATUS_INFO[goal.status];
            const progress = getProgress(goal);

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all animate-fade-in-up card-hover"
                style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s` }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${categoryInfo.color} flex items-center gap-1 transition-transform hover:scale-105`}
                      >
                        <span>{categoryInfo.emoji}</span>
                        <span>{t(categoryInfo.labelKey as never)}</span>
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusInfo.color} flex items-center gap-1.5`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} animate-pulse-soft`} />
                        <span>{t(statusInfo.labelKey as never)}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/goals/${goal.id}/edit`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                    >
                      {t('goals.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium transition-all hover:scale-110"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      {t('goals.progress')}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {goal.currentValue} / {goal.targetValue}
                      <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">
                        ({progress}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-emerald-400 to-cyan-500 transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {goal.deadline && (
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        <span>
                          {t('goals.deadline')}: {new Date(goal.deadline).toLocaleDateString(locale)}
                        </span>
                      </span>
                    )}
                  </div>

                  {goal.status === 'ACTIVE' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(goal, 'COMPLETED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium transition-all hover:scale-105"
                      >
                        {t('goals.completeBtn')}
                      </button>
                      <button
                        onClick={() => handleStatusChange(goal, 'CANCELLED')}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-all hover:scale-105"
                      >
                        {t('goals.cancelBtn')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}