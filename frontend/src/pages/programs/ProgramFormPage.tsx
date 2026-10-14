import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  Save,
  X,
  Plus,
  Trash2,
  Pencil,
  ClipboardList,
  CalendarDays,
  Repeat,
  Calendar,
  Dumbbell,
  GripVertical,
  Lightbulb,
} from 'lucide-react';
import {
  programService,
  type ProgramType,
  type ProgramDay,
  type ProgramExercise,
} from '../../services/program.service';
import { useTranslation } from '../../i18n/useTranslation';

// ==================== Data ====================

const PROGRAM_TYPES: {
  value: ProgramType;
  labelKey: string;
  Icon: typeof Calendar;
  gradient: string;
}[] = [
  {
    value: 'WEEKLY',
    labelKey: 'programs.typeWeekly',
    Icon: CalendarDays,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    value: 'DAILY',
    labelKey: 'programs.typeDaily',
    Icon: Repeat,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    value: 'PERIODIC',
    labelKey: 'programs.typePeriodic',
    Icon: Calendar,
    gradient: 'from-violet-500 to-purple-600',
  },
];

const DAY_LABELS_FA = [
  'شنبه',
  'یک‌شنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

const DAY_LABELS_EN = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

// ==================== Page ====================

export default function ProgramFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, language } = useTranslation();
  const isEdit = !!id;

  const [error, setError] = useState('');
  const [form, setForm] = useState<{
    name: string;
    description: string;
    type: ProgramType;
    durationWeeks: string;
    days: ProgramDay[];
  }>({
    name: '',
    description: '',
    type: 'WEEKLY',
    durationWeeks: '',
    days: [],
  });

  const dayLabels = language === 'fa' ? DAY_LABELS_FA : DAY_LABELS_EN;

  // ===== گرفتن برنامه در حالت ویرایش =====
  const { data: program, isLoading } = useQuery({
    queryKey: ['program', id],
    queryFn: () => programService.getById(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (program) {
      setForm({
        name: program.name,
        description: program.description ?? '',
        type: program.type,
        durationWeeks: program.durationWeeks ? String(program.durationWeeks) : '',
        days: program.days.map((d) => ({
          dayNumber: d.dayNumber,
          label: d.label,
          notes: d.notes ?? '',
          order: d.order,
          exercises: d.exercises.map((e) => ({
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight,
            restTime: e.restTime,
            notes: e.notes,
            order: e.order,
          })),
        })),
      });
    }
  }, [program]);

  // ===== Mutation ساخت/ویرایش =====
  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name.trim(),
        description: form.description || undefined,
        type: form.type,
        durationWeeks: form.durationWeeks ? Number(form.durationWeeks) : null,
        days: form.days,
      };
      return isEdit
        ? programService.update(id!, payload)
        : programService.create(payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      navigate(`/programs/${data.id}`);
    },
    onError: () => setError(t('programs.saveError')),
  });

  // ===== افزودن روز جدید =====
  const addDay = () => {
    const nextNumber = form.days.length + 1;
    const defaultLabel = dayLabels[(nextNumber - 1) % 7];
    setForm({
      ...form,
      days: [
        ...form.days,
        {
          dayNumber: nextNumber,
          label: defaultLabel,
          notes: '',
          order: form.days.length,
          exercises: [
            {
              name: '',
              sets: 3,
              reps: 10,
              weight: null,
              restTime: 60,
              notes: '',
              order: 0,
            },
          ],
        },
      ],
    });
  };

  // ===== حذف روز =====
  const removeDay = (dayIndex: number) => {
    const newDays = form.days.filter((_, i) => i !== dayIndex);
    setForm({ ...form, days: newDays });
  };

  // ===== افزودن حرکت =====
  const addExercise = (dayIndex: number) => {
    const newDays = [...form.days];
    newDays[dayIndex].exercises.push({
      name: '',
      sets: 3,
      reps: 10,
      weight: null,
      restTime: 60,
      notes: '',
      order: newDays[dayIndex].exercises.length,
    });
    setForm({ ...form, days: newDays });
  };

  // ===== حذف حرکت =====
  const removeExercise = (dayIndex: number, exIndex: number) => {
    const newDays = [...form.days];
    newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter(
      (_, i) => i !== exIndex
    );
    setForm({ ...form, days: newDays });
  };

  // ===== آپدیت فیلد روز =====
  const updateDay = (
    dayIndex: number,
    field: keyof ProgramDay,
    value: string
  ) => {
    const newDays = [...form.days];
    (newDays[dayIndex] as Record<string, unknown>)[field] = value;
    setForm({ ...form, days: newDays });
  };

  // ===== آپدیت فیلد حرکت =====
  const updateExercise = (
    dayIndex: number,
    exIndex: number,
    field: keyof ProgramExercise,
    value: string | number | null
  ) => {
    const newDays = [...form.days];
    (newDays[dayIndex].exercises[exIndex] as Record<string, unknown>)[field] =
      value;
    setForm({ ...form, days: newDays });
  };

  // ===== ذخیره =====
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError(t('programs.nameRequired'));
      return;
    }

    if (form.days.length === 0) {
      setError(t('programs.daysRequired'));
      return;
    }

    // چک کن هر روز حداقل یه حرکت داشته باشه
    for (const day of form.days) {
      if (day.exercises.length === 0) {
        setError(t('programs.dayEmptyError'));
        return;
      }
      for (const ex of day.exercises) {
        if (!ex.name.trim()) {
          setError(t('programs.exerciseNameRequired'));
          return;
        }
      }
    }

    mutation.mutate();
  };

  if (isEdit && isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="animate-fade-in-up">
        <button
          onClick={() => navigate('/programs')}
          className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-all"
        >
          <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 flex items-center justify-center transition-colors rtl:rotate-0 ltr:rotate-180">
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
          <span className="font-semibold">{t('programs.backToPrograms')}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              {isEdit ? (
                <Pencil size={26} strokeWidth={2.2} />
              ) : (
                <ClipboardList size={26} strokeWidth={2.2} />
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isEdit ? t('programs.formEditTitle') : t('programs.formTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isEdit ? t('programs.formEditDesc') : t('programs.formNewDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Error ===== */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
          <X size={20} strokeWidth={2.5} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===== Basic Info ===== */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-1">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                <ClipboardList size={22} strokeWidth={2.2} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('programs.basicInfo')}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('programs.nameLabel')} *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t('programs.namePlaceholder')}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('programs.descriptionLabel')}
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder={t('programs.descriptionPlaceholder')}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 resize-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('programs.typeLabel')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PROGRAM_TYPES.map((type) => {
                    const isActive = form.type === type.value;
                    const Icon = type.Icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setForm({ ...form, type: type.value })}
                        className={`relative overflow-hidden p-3 rounded-2xl transition-all flex flex-col items-center gap-1.5 ${
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
                        <Icon size={20} strokeWidth={2.5} className="relative" />
                        <span className="relative text-xs font-semibold">
                          {t(type.labelKey as never)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration (فقط برای WEEKLY و PERIODIC) */}
              {form.type !== 'DAILY' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t('programs.durationWeeksLabel')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={form.durationWeeks}
                    onChange={(e) =>
                      setForm({ ...form, durationWeeks: e.target.value })
                    }
                    placeholder={t('programs.durationWeeksPlaceholder')}
                    className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Days ===== */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-2">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                  <Calendar size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('programs.days')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {form.days.length} {t('programs.daysUnit')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addDay}
                className="btn-shine flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-l from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
              >
                <Plus size={16} strokeWidth={2.5} />
                {t('programs.addDay')}
              </button>
            </div>

            {form.days.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Calendar size={28} strokeWidth={2} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {t('programs.noDaysYet')}
                </p>
                <button
                  type="button"
                  onClick={addDay}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:scale-105 transition-all"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  {t('programs.addFirstDay')}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {form.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-100 dark:border-slate-700 animate-fade-in"
                  >
                    {/* Day Header */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <GripVertical
                          size={18}
                          className="text-slate-400"
                          strokeWidth={2.2}
                        />
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                          {dayIndex + 1}
                        </div>
                      </div>

                      <input
                        type="text"
                        value={day.label}
                        onChange={(e) =>
                          updateDay(dayIndex, 'label', e.target.value)
                        }
                        placeholder={t('programs.dayLabelPlaceholder')}
                        className="flex-1 min-w-[150px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm font-semibold text-slate-900 dark:text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />

                      <button
                        type="button"
                        onClick={() => removeDay(dayIndex)}
                        className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all hover:scale-110 flex items-center justify-center shrink-0"
                      >
                        <Trash2 size={16} strokeWidth={2.2} />
                      </button>
                    </div>

                    {/* Day Notes */}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={day.notes ?? ''}
                        onChange={(e) =>
                          updateDay(dayIndex, 'notes', e.target.value)
                        }
                        placeholder={t('programs.dayNotesPlaceholder')}
                        className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    {/* Exercises */}
                    <div className="space-y-3 mb-4">
                      {day.exercises.map((exercise, exIndex) => (
                        <div
                          key={exIndex}
                          className="relative overflow-hidden p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-[10px] font-bold flex items-center justify-center">
                                {exIndex + 1}
                              </div>
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                {t('programs.exercise')} {exIndex + 1}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExercise(dayIndex, exIndex)}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-all flex items-center justify-center"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {/* Name */}
                            <div className="col-span-2 md:col-span-1">
                              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                {t('programs.exerciseName')}
                              </label>
                              <input
                                type="text"
                                value={exercise.name}
                                onChange={(e) =>
                                  updateExercise(
                                    dayIndex,
                                    exIndex,
                                    'name',
                                    e.target.value
                                  )
                                }
                                placeholder={t('programs.exerciseNamePlaceholder')}
                                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                              />
                            </div>

                            {/* Sets */}
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                {t('programs.sets')}
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={exercise.sets ?? ''}
                                onChange={(e) =>
                                  updateExercise(
                                    dayIndex,
                                    exIndex,
                                    'sets',
                                    e.target.value ? Number(e.target.value) : null
                                  )
                                }
                                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-center text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                              />
                            </div>

                            {/* Reps */}
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                {t('programs.reps')}
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={exercise.reps ?? ''}
                                onChange={(e) =>
                                  updateExercise(
                                    dayIndex,
                                    exIndex,
                                    'reps',
                                    e.target.value ? Number(e.target.value) : null
                                  )
                                }
                                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-center text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                              />
                            </div>

                            {/* Weight */}
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                {t('programs.weight')}
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                value={exercise.weight ?? ''}
                                onChange={(e) =>
                                  updateExercise(
                                    dayIndex,
                                    exIndex,
                                    'weight',
                                    e.target.value ? Number(e.target.value) : null
                                  )
                                }
                                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-center text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                              />
                            </div>

                            {/* Rest */}
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                {t('programs.rest')}
                              </label>
                              <input
                                type="number"
                                value={exercise.restTime ?? ''}
                                onChange={(e) =>
                                  updateExercise(
                                    dayIndex,
                                    exIndex,
                                    'restTime',
                                    e.target.value
                                      ? Number(e.target.value)
                                      : null
                                  )
                                }
                                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-center text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                              />
                            </div>
                          </div>

                          {/* Notes */}
                          <div className="mt-2">
                            <input
                              type="text"
                              value={exercise.notes ?? ''}
                              onChange={(e) =>
                                updateExercise(
                                  dayIndex,
                                  exIndex,
                                  'notes',
                                  e.target.value
                                )
                              }
                              placeholder={t('programs.exerciseNotesPlaceholder')}
                              className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-[11px] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Exercise */}
                    <button
                      type="button"
                      onClick={() => addExercise(dayIndex)}
                      className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      {t('programs.addExercise')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== Tip ===== */}
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs animate-fade-in-up delay-3">
          <Lightbulb size={16} strokeWidth={2.5} className="shrink-0 mt-0.5" />
          <span>{t('programs.tip')}</span>
        </div>

        {/* ===== Actions ===== */}
        <div className="flex gap-3 animate-fade-in-up delay-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-shine flex-1 h-14 rounded-2xl bg-gradient-to-l from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Save size={20} strokeWidth={2.5} />
            {mutation.isPending
              ? t('common.saving')
              : isEdit
              ? t('programs.saveChanges')
              : t('programs.createProgram')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/programs')}
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