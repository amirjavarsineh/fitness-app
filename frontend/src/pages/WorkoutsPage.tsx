import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  X,
  Pencil,
  Play,
  Trash2,
  Clock,
  Flame,
  Dumbbell,
  ClipboardList,
} from 'lucide-react';
import { workoutService, type Workout } from '../services/workout.service';
import { useTranslation } from '../i18n/useTranslation';

const WORKOUT_TYPE_INFO: Record<
  string,
  { labelKey: string; Icon: typeof Dumbbell; gradient: string }
> = {
  CARDIO: { labelKey: 'workoutTypes.CARDIO', Icon: Play, gradient: 'from-rose-500 to-orange-500' },
  STRENGTH: { labelKey: 'workoutTypes.STRENGTH', Icon: Dumbbell, gradient: 'from-blue-500 to-indigo-600' },
  FLEXIBILITY: { labelKey: 'workoutTypes.FLEXIBILITY', Icon: Play, gradient: 'from-emerald-500 to-teal-500' },
  HIIT: { labelKey: 'workoutTypes.HIIT', Icon: Flame, gradient: 'from-orange-500 to-red-600' },
  YOGA: { labelKey: 'workoutTypes.YOGA', Icon: Play, gradient: 'from-purple-500 to-pink-500' },
  OTHER: { labelKey: 'workoutTypes.OTHER', Icon: Dumbbell, gradient: 'from-slate-500 to-slate-700' },
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Dumbbell size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('workouts.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {workouts?.length ?? 0} {t('workouts.count')}
              {(templates?.length ?? 0) > 0 &&
                ` • ${templates?.length} ${t('workouts.tabsTemplates')}`}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/workouts/new')}
          className="btn-shine group flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.03]"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>{t('workouts.newWorkout')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 animate-fade-in-up delay-1">
        <button
          onClick={() => setTab('workouts')}
          className={`group relative flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all overflow-hidden ${
            tab === 'workouts'
              ? 'text-white shadow-lg shadow-blue-500/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:scale-105'
          }`}
        >
          {tab === 'workouts' && (
            <div className="absolute inset-0 bg-gradient-to-l from-blue-500 to-indigo-600" />
          )}
          <Dumbbell size={18} strokeWidth={2.2} className="relative" />
          <span className="relative">{t('workouts.tabsWorkouts')}</span>
          <span
            className={`relative text-xs px-2 py-0.5 rounded-lg font-bold ${
              tab === 'workouts' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {workouts?.length ?? 0}
          </span>
        </button>

        <button
          onClick={() => setTab('templates')}
          className={`group relative flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all overflow-hidden ${
            tab === 'templates'
              ? 'text-white shadow-lg shadow-purple-500/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105'
          }`}
        >
          {tab === 'templates' && (
            <div className="absolute inset-0 bg-gradient-to-l from-purple-500 to-pink-500" />
          )}
          <ClipboardList size={18} strokeWidth={2.2} className="relative" />
          <span className="relative">{t('workouts.tabsTemplates')}</span>
          <span
            className={`relative text-xs px-2 py-0.5 rounded-lg font-bold ${
              tab === 'templates' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {templates?.length ?? 0}
          </span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-sm animate-bounce-in">
          <span className="text-2xl">✅</span>
          <span className="font-medium">{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
          <span className="text-2xl">⚠️</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && list.length === 0 && (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-emerald-500/30 animate-float">
              {tab === 'workouts' ? (
                <Dumbbell size={48} strokeWidth={2} />
              ) : (
                <ClipboardList size={48} strokeWidth={2} />
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {tab === 'workouts'
                ? t('workouts.noWorkouts')
                : t('workouts.noTemplates')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              {tab === 'workouts'
                ? t('workouts.noWorkoutsDesc')
                : t('workouts.noTemplatesDesc')}
            </p>
            {tab === 'workouts' && (
              <button
                onClick={() => navigate('/workouts/new')}
                className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
              >
                <Plus size={20} strokeWidth={2.5} />
                {t('workouts.start')}
              </button>
            )}
          </div>
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
              t={t}
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
  t,
}: {
  workout: Workout;
  isTemplate: boolean;
  delay: number;
  onEdit: () => void;
  onDelete: () => void;
  onUse: () => void;
  using: boolean;
  t: (key: never) => string;
}) {
  const typeInfo = WORKOUT_TYPE_INFO[workout.type] ?? WORKOUT_TYPE_INFO.OTHER;
  const TypeIcon = typeInfo.Icon;
  const exerciseNames = workout.exercises.map((ex) => ex.name).filter(Boolean);

  return (
    <div
      className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up overflow-hidden card-hover"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className={`absolute -top-16 -end-16 w-40 h-40 rounded-full bg-gradient-to-br ${typeInfo.gradient} opacity-[0.08] group-hover:opacity-[0.15] blur-3xl transition-opacity pointer-events-none`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-l ${typeInfo.gradient} text-white text-xs font-bold shadow-lg`}
          >
            <TypeIcon size={14} strokeWidth={2.5} />
            <span>{t(typeInfo.labelKey as never)}</span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
            {workout.exercises.length} {t('workouts.movements' as never)}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 truncate group-hover:text-transparent group-hover:bg-gradient-to-l group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300 group-hover:bg-clip-text transition-all">
          {workout.name ?? '—'}
        </h3>

        {exerciseNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {exerciseNames.slice(0, 3).map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-transform hover:scale-105"
              >
                {name}
              </span>
            ))}
            {exerciseNames.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-lg bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-xs font-bold">
                +{exerciseNames.length - 3}
              </span>
            )}
          </div>
        )}

        {workout.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
            {workout.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock size={14} strokeWidth={2.5} />
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {workout.duration}
            </span>
            <span className="text-xs">{t('dashboard.minutes' as never)}</span>
          </div>
          {workout.caloriesBurned && (
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Flame size={14} strokeWidth={2.5} />
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {workout.caloriesBurned}
              </span>
              <span className="text-xs">{t('workouts.caloriesUnit' as never)}</span>
            </div>
          )}
        </div>

        {isTemplate ? (
          <div className="flex gap-2">
            <button
              onClick={onUse}
              disabled={using}
              className="btn-shine flex-1 py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <Play size={16} strokeWidth={2.5} />
              {using
                ? t('workouts.usingTemplate' as never)
                : t('workouts.useTemplate' as never)}
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all hover:scale-110 flex items-center justify-center"
              title={t('common.delete' as never)}
            >
              <Trash2 size={18} strokeWidth={2.2} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02]"
            >
              <Pencil size={16} strokeWidth={2.2} />
              {t('common.edit' as never)}
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all hover:scale-110 flex items-center justify-center"
            >
              <Trash2 size={18} strokeWidth={2.2} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}