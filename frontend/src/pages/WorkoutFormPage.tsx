import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  ArrowRight,
  Save,
  X,
  Plus,
  Check,
  FileText,
  Dumbbell,
  Info,
  Pencil,
  Play,
  Flame,
  Sparkles,
  Calendar,
  Clock,
} from 'lucide-react';
import { useEffect } from 'react';
import { workoutService, type CreateWorkoutDto } from '../services/workout.service';
import ExercisePicker from '../components/ExercisePicker';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Data ====================

const WORKOUT_TYPES = [
  { value: 'CARDIO', labelKey: 'workoutTypes.CARDIO', Icon: Play, gradient: 'from-rose-500 to-orange-500' },
  { value: 'STRENGTH', labelKey: 'workoutTypes.STRENGTH', Icon: Dumbbell, gradient: 'from-blue-500 to-indigo-600' },
  { value: 'FLEXIBILITY', labelKey: 'workoutTypes.FLEXIBILITY', Icon: Sparkles, gradient: 'from-emerald-500 to-teal-500' },
  { value: 'HIIT', labelKey: 'workoutTypes.HIIT', Icon: Flame, gradient: 'from-orange-500 to-red-600' },
  { value: 'YOGA', labelKey: 'workoutTypes.YOGA', Icon: Sparkles, gradient: 'from-purple-500 to-pink-500' },
  { value: 'OTHER', labelKey: 'workoutTypes.OTHER', Icon: Dumbbell, gradient: 'from-slate-500 to-slate-700' },
] as const;

// تاریخ امروز به فرمت YYYY-MM-DD بر اساس timezone کاربر
function todayLocalISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toDateInputValue(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ==================== Page ====================

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
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="animate-fade-in-up">
        <button
          onClick={() => navigate('/workouts')}
          className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-all"
        >
          <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 flex items-center justify-center transition-colors rtl:rotate-0 ltr:rotate-180">
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
          <span className="font-semibold">{t('workouts.backToWorkouts')}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              {isEdit ? <Pencil size={26} strokeWidth={2.2} /> : <Dumbbell size={26} strokeWidth={2.2} />}
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isEdit ? t('workouts.formEditTitle') : t('workouts.formTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isEdit ? t('workouts.formEditDesc') : t('workouts.formNewDesc')}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        {/* ===== Basic Info ===== */}
        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-1 card-hover">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                <FileText size={22} strokeWidth={2.2} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('workouts.basicInfo')}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('workouts.workoutName')}
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder={t('workouts.workoutNamePlaceholder')}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('workouts.description')}
                </label>
                <textarea
                  rows={2}
                  {...register('description')}
                  placeholder={t('workouts.descriptionPlaceholder')}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 resize-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('workouts.workoutType')} *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {WORKOUT_TYPES.map((type) => {
                    const isActive = selectedType === type.value;
                    const TypeIcon = type.Icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setValue('type', type.value, { shouldValidate: true })
                        }
                        className={`relative overflow-hidden p-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${
                          isActive
                            ? 'text-white shadow-lg scale-105'
                            : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
                        }`}
                      >
                        {isActive && (
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${type.gradient}`}
                          />
                        )}
                        <TypeIcon size={20} strokeWidth={2.5} className="relative" />
                        <span className="relative text-[11px] font-semibold text-center">
                          {t(type.labelKey as never)}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <input
                  type="hidden"
                  {...register('type', {
                    required: t('workouts.workoutType') + ' ' + t('common.required'),
                  })}
                />
                {errors.type && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5 animate-wiggle">
                    <X size={14} strokeWidth={2.5} />
                    <span>{errors.type.message}</span>
                  </p>
                )}
              </div>

              {/* Duration + Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} strokeWidth={2.5} />
                      {t('workouts.duration')} *
                    </span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...register('duration', {
                      required: t('workouts.durationError'),
                      valueAsNumber: true,
                      min: { value: 1, message: t('workouts.durationMin') },
                    })}
                    className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                  />
                  {errors.duration && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <X size={12} strokeWidth={2.5} />
                      <span>{errors.duration.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} strokeWidth={2.5} />
                      {t('workouts.dateLabel')}
                    </span>
                  </label>
                  <input
                    type="date"
                    {...register('date')}
                    className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {t('workouts.dateHint')}
                  </p>
                </div>
              </div>

              {/* Template Toggle */}
              <div
                className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isTemplate
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
                onClick={() => setValue('isTemplate', !isTemplate)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      isTemplate
                        ? 'bg-gradient-to-br from-purple-500 to-fuchsia-500 border-transparent text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isTemplate && <Check size={14} strokeWidth={3} />}
                  </div>
                  <input type="hidden" {...register('isTemplate')} />

                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isTemplate
                          ? 'bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <FileText size={20} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {t('workouts.templateLabel')}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t('workouts.templateDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Exercises ===== */}
        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-2 card-hover">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                  <Dumbbell size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {t('workouts.exercises')}
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                      {fields.length}
                    </span>
                  </h2>
                </div>
              </div>
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
                className="btn-shine flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-l from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span className="hidden sm:inline">{t('workouts.addExercise')}</span>
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-100 dark:border-slate-700 animate-fade-in"
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                        {index + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {t('workouts.exerciseN')} {index + 1}
                      </span>
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-all hover:scale-110 flex items-center justify-center shadow-sm"
                        title={t('common.delete')}
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
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
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <X size={12} strokeWidth={2.5} />
                          <span>{errors.exercises[index]?.name?.message}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {t('workouts.sets')}
                      </label>
                      <input
                        type="number"
                        min={1}
                        {...register(`exercises.${index}.sets`, {
                          valueAsNumber: true,
                        })}
                        className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {t('workouts.reps')}
                      </label>
                      <input
                        type="number"
                        min={1}
                        {...register(`exercises.${index}.reps`, {
                          valueAsNumber: true,
                        })}
                        className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {t('workouts.weightKg')}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        {...register(`exercises.${index}.weight`, {
                          setValueAs: (v) => (v === '' ? null : Number(v)),
                        })}
                        placeholder={t('common.optional')}
                        className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {t('workouts.restTime')}
                      </label>
                      <input
                        type="number"
                        {...register(`exercises.${index}.restTime`, {
                          setValueAs: (v) => (v === '' ? null : Number(v)),
                        })}
                        className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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

            <div className="mt-5 flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs">
              <Info size={16} strokeWidth={2.5} className="shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {t('workouts.exerciseNamePlaceholder')}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Error ===== */}
        {mutation.isError && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 animate-wiggle">
            <X size={22} strokeWidth={2.5} />
            <span className="font-semibold">{t('workouts.workoutError')}</span>
          </div>
        )}

        {/* ===== Actions ===== */}
        <div className="flex gap-3 animate-fade-in-up delay-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-shine flex-1 h-14 rounded-2xl bg-gradient-to-l from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Save size={20} strokeWidth={2.5} />
            {mutation.isPending
              ? t('common.saving')
              : isEdit
              ? t('workouts.saveChanges')
              : t('workouts.createWorkout')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-6 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all hover:scale-105 flex items-center gap-2"
          >
            <X size={20} strokeWidth={2.5} />
            <span className="hidden sm:inline">{t('common.cancel')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}