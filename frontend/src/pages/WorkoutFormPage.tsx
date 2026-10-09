import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { workoutService, type CreateWorkoutDto } from '../services/workout.service';
import { useEffect } from 'react';
import ExercisePicker from '../components/ExercisePicker';
import { useTranslation } from '../i18n/useTranslation';

const WORKOUT_TYPES = [
  { value: 'CARDIO', labelKey: 'workoutTypes.CARDIO', emoji: '🏃' },
  { value: 'STRENGTH', labelKey: 'workoutTypes.STRENGTH', emoji: '💪' },
  { value: 'FLEXIBILITY', labelKey: 'workoutTypes.FLEXIBILITY', emoji: '🤸' },
  { value: 'HIIT', labelKey: 'workoutTypes.HIIT', emoji: '🔥' },
  { value: 'YOGA', labelKey: 'workoutTypes.YOGA', emoji: '🧘' },
  { value: 'OTHER', labelKey: 'workoutTypes.OTHER', emoji: '⭐' },
] as const;

// تاریخ امروز به فرمت YYYY-MM-DD بر اساس timezone کاربر
function todayLocalISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// تبدیل تاریخ دریافتی از سرور به فرمت input type="date"
function toDateInputValue(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function WorkoutFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const { t } = useTranslation();

  const { data: workout, isLoading } = useQuery({
    queryKey: ['workout', id],
    queryFn: () => workoutService.getWorkout(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateWorkoutDto>({
    defaultValues: {
      name: '',
      description: '',
      type: 'STRENGTH',
      duration: 30,
      date: todayLocalISO(),
      isTemplate: false,
      exercises: [
        { name: '', sets: 3, reps: 10, weight: null, duration: null, restTime: 60, order: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  const selectedType = watch('type');
  const isTemplate = watch('isTemplate');

  useEffect(() => {
    if (workout) {
      reset({
        name: workout.name ?? '',
        description: workout.description ?? '',
        type: workout.type,
        duration: workout.duration,
        date: workout.date ? toDateInputValue(workout.date) : todayLocalISO(),
        isTemplate: workout.isTemplate ?? false,
        exercises: workout.exercises.map(({ id, workoutId, createdAt, ...rest }) => rest),
      });
    }
  }, [workout, reset]);

  const mutation = useMutation({
    mutationFn: (data: CreateWorkoutDto) =>
      isEdit ? workoutService.updateWorkout(id!, data) : workoutService.createWorkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      navigate('/workouts');
    },
  });

  if (isEdit && isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-slate-400 dark:text-slate-500 animate-pulse-soft">
          {t('common.loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <button
          onClick={() => navigate('/workouts')}
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-3 flex items-center gap-1 transition-all hover:translate-x-[-3px] rtl:hover:translate-x-[-3px] ltr:hover:translate-x-[3px]"
        >
          <span className="rtl:rotate-0 ltr:rotate-180">→</span>
          <span>{t('workouts.backToWorkouts')}</span>
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEdit ? t('workouts.formEditTitle') : t('workouts.formTitle')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isEdit ? t('workouts.formEditDesc') : t('workouts.formNewDesc')}
        </p>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        {/* Basic Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-1 card-hover">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📝</span> {t('workouts.basicInfo')}
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('workouts.workoutName')}
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder={t('workouts.workoutNamePlaceholder')}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('workouts.description')}
              </label>
              <textarea
                rows={2}
                {...register('description')}
                placeholder={t('workouts.descriptionPlaceholder')}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('workouts.workoutType')} *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {WORKOUT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setValue('type', type.value, { shouldValidate: true })
                    }
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 hover:scale-105 ${
                      selectedType === type.value
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xl">{type.emoji}</span>
                    <span className="text-xs font-medium">
                      {t(type.labelKey as never)}
                    </span>
                  </button>
                ))}
              </div>
              <input
                type="hidden"
                {...register('type', {
                  required: t('workouts.workoutType') + ' ' + t('common.required'),
                })}
              />
              {errors.type && (
                <span className="text-xs text-red-500 mt-1 block animate-wiggle">
                  {errors.type.message}
                </span>
              )}
            </div>

            {/* Duration + Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('workouts.duration')} *
                </label>
                <input
                  type="number"
                  min={1}
                  {...register('duration', {
                    required: t('workouts.durationError'),
                    valueAsNumber: true,
                    min: { value: 1, message: t('workouts.durationMin') },
                  })}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                {errors.duration && (
                  <span className="text-xs text-red-500 mt-1 block animate-wiggle">
                    {errors.duration.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('workouts.dateLabel')}
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {t('workouts.dateHint')}
                </p>
              </div>
            </div>

            {/* Template Checkbox */}
            <div
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isTemplate
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              onClick={() => setValue('isTemplate', !isTemplate)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    isTemplate
                      ? 'bg-purple-500 border-purple-500'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isTemplate && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <input type="hidden" {...register('isTemplate')} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📋</span>
                    <span>{t('workouts.templateLabel')}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('workouts.templateDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-2 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🏋️</span> {t('workouts.exercises')}
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                {fields.length}
              </span>
            </h2>
            <button
              type="button"
              onClick={() =>
                append({
                  name: '',
                  sets: 3,
                  reps: 10,
                  weight: null,
                  duration: null,
                  restTime: 60,
                  order: fields.length,
                })
              }
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all hover:scale-105"
            >
              + {t('workouts.addExercise')}
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-fade-in"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
              >
                {/* Exercise Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('workouts.exerciseN')} {index + 1}
                    </span>
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 text-sm transition-all hover:scale-110"
                      title={t('common.delete')}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Exercise Fields */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t('workouts.exerciseName')} *
                    </label>
                    <Controller
                      control={control}
                      name={`exercises.${index}.name`}
                      rules={{ required: t('workouts.requiredShort') }}
                      render={({ field }) => (
                        <ExercisePicker
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder={t('workouts.exerciseNamePlaceholder')}
                        />
                      )}
                    />
                    {errors.exercises?.[index]?.name && (
                      <span className="text-xs text-red-500 mt-0.5 block animate-wiggle">
                        {errors.exercises[index]?.name?.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t('workouts.sets')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register(`exercises.${index}.sets`, {
                        valueAsNumber: true,
                      })}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t('workouts.reps')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register(`exercises.${index}.reps`, {
                        valueAsNumber: true,
                      })}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t('workouts.weightKg')}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      {...register(`exercises.${index}.weight`, {
                        setValueAs: (v) => (v === '' ? null : Number(v)),
                      })}
                      placeholder={t('common.optional')}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t('workouts.restTime')}
                    </label>
                    <input
                      type="number"
                      {...register(`exercises.${index}.restTime`, {
                        setValueAs: (v) => (v === '' ? null : Number(v)),
                      })}
                      className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <input
                  type="hidden"
                  {...register(`exercises.${index}.order`)}
                  value={index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {mutation.isError && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
            <span className="text-lg">⚠️</span>
            <span>{t('workouts.workoutError')}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 h-14 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {mutation.isPending
              ? t('common.saving')
              : isEdit
              ? '💾 ' + t('workouts.saveChanges')
              : '✅ ' + t('workouts.createWorkout')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-6 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all hover:scale-105"
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}