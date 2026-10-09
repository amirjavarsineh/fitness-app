import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { workoutService, type Workout } from '../services/workout.service';
import { useTranslation } from '../i18n/useTranslation';

const WORKOUT_TYPE_INFO: Record<
  string,
  { labelKey: string; emoji: string; color: string }
> = {
  CARDIO: {
    labelKey: 'workoutTypes.CARDIO',
    emoji: '🏃',
    color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  },
  STRENGTH: {
    labelKey: 'workoutTypes.STRENGTH',
    emoji: '💪',
    color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  },
  FLEXIBILITY: {
    labelKey: 'workoutTypes.FLEXIBILITY',
    emoji: '🤸',
    color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  },
  HIIT: {
    labelKey: 'workoutTypes.HIIT',
    emoji: '🔥',
    color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  },
  YOGA: {
    labelKey: 'workoutTypes.YOGA',
    emoji: '🧘',
    color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  },
  OTHER: {
    labelKey: 'workoutTypes.OTHER',
    emoji: '⭐',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  },
};

type Tab = 'workouts' | 'templates';

export default function WorkoutsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('workouts');
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const { data: workouts, isLoading: loadingWorkouts } = useQuery({
    queryKey: ['workouts'],
    queryFn: workoutService.getWorkouts,
  });

  const { data: templates, isLoading: loadingTemplates } = useQuery({
    queryKey: ['templates'],
    queryFn: workoutService.getTemplates,
  });

  const deleteMutation = useMutation({
    mutationFn: workoutService.deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const useTemplateMutation = useMutation({
    mutationFn: workoutService.useTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      setSuccessMsg(t('workouts.useTemplateSuccess'));
      setTimeout(() => {
        setSuccessMsg('');
        setTab('workouts');
      }, 1500);
    },
    onError: () => {
      setError(t('workouts.useTemplateError'));
      setTimeout(() => setError(''), 3000);
    },
  });

  const isLoading = tab === 'workouts' ? loadingWorkouts : loadingTemplates;
  const list = tab === 'workouts' ? workouts ?? [] : templates ?? [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('workouts.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {workouts?.length ?? 0} {t('workouts.count')}
            {(templates?.length ?? 0) > 0 &&
              ` • ${templates?.length} ${t('workouts.tabsTemplates')}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/workouts/new')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
        >
          <span className="text-lg">+</span>
          <span>{t('workouts.newWorkout')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 animate-fade-in-up">
        <button
          onClick={() => setTab('workouts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
            tab === 'workouts'
              ? 'bg-gradient-to-l from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700'
          }`}
        >
          <span>💪</span>
          <span>{t('workouts.tabsWorkouts')}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-md ${
              tab === 'workouts' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {workouts?.length ?? 0}
          </span>
        </button>
        <button
          onClick={() => setTab('templates')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
            tab === 'templates'
              ? 'bg-gradient-to-l from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700'
          }`}
        >
          <span>📋</span>
          <span>{t('workouts.tabsTemplates')}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-md ${
              tab === 'templates' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {templates?.length ?? 0}
          </span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm animate-bounce-in">
          <span>✅</span>
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-52 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && list.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-float">
            {tab === 'workouts' ? '🏋️' : '📋'}
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {tab === 'workouts'
              ? t('workouts.noWorkouts')
              : t('workouts.noTemplates')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {tab === 'workouts'
              ? t('workouts.noWorkoutsDesc')
              : t('workouts.noTemplatesDesc')}
          </p>
          {tab === 'workouts' && (
            <button
              onClick={() => navigate('/workouts/new')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all hover:scale-105"
            >
              {t('workouts.start')}
            </button>
          )}
        </div>
      )}

      {/* List */}
      {!isLoading && list.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((workout, index) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              isTemplate={tab === 'templates'}
              delay={Math.min(index * 0.06, 0.5)}
              onEdit={() =>
                !tab.endsWith('templates') &&
                navigate(`/workouts/${workout.id}/edit`)
              }
              onDelete={() => {
                if (confirm(t('common.delete') + '?')) {
                  deleteMutation.mutate(workout.id);
                }
              }}
              onUse={() => useTemplateMutation.mutate(workout.id)}
              using={useTemplateMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkoutCard({
  workout,
  isTemplate,
  delay,
  onEdit,
  onDelete,
  onUse,
  using,
}: {
  workout: Workout;
  isTemplate: boolean;
  delay: number;
  onEdit: () => void;
  onDelete: () => void;
  onUse: () => void;
  using: boolean;
}) {
  const { t } = useTranslation();
  const typeInfo = WORKOUT_TYPE_INFO[workout.type] ?? WORKOUT_TYPE_INFO.OTHER;
  const exerciseNames = workout.exercises.map((ex) => ex.name).filter(Boolean);

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group animate-fade-in-up card-hover"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`px-3 py-1 rounded-lg text-xs font-medium ${typeInfo.color} flex items-center gap-1 transition-transform group-hover:scale-105`}
        >
          <span>{typeInfo.emoji}</span>
          <span>{t(typeInfo.labelKey as never)}</span>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">
          {workout.exercises.length} {t('workouts.movements')}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 truncate">
        {workout.name ?? '—'}
      </h3>

      {exerciseNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {exerciseNames.slice(0, 4).map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs transition-transform hover:scale-105"
            >
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span>{name}</span>
            </span>
          ))}
          {exerciseNames.length > 4 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              +{exerciseNames.length - 4} {t('workouts.movements')}
            </span>
          )}
        </div>
      )}

      {workout.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
          {workout.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <span>⏱️</span>
          <span>
            {workout.duration} {t('dashboard.minutes')}
          </span>
        </div>
        {workout.caloriesBurned && (
          <div className="flex items-center gap-1">
            <span>🔥</span>
            <span>
              {workout.caloriesBurned} {t('workouts.caloriesUnit')}
            </span>
          </div>
        )}
      </div>

      {isTemplate ? (
        <div className="flex gap-2">
          <button
            onClick={onUse}
            disabled={using}
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {using
              ? t('workouts.usingTemplate')
              : `⚡ ${t('workouts.useTemplate')}`}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm transition-all hover:scale-110"
            title={t('common.delete')}
          >
            🗑️
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
          >
            {t('common.edit')}
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium transition-colors"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}