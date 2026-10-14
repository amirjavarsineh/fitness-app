import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  Check,
  X,
  Dumbbell,
  Clock,
  Calendar,
  Save,
  CircleCheck,
  Circle,
  Lightbulb,
  Timer,
  Flame,
  Pencil,
} from 'lucide-react';
import {
  programProgressService,
  type ProgressExercise,
} from '../../services/program-progress.service';
import { useTranslation } from '../../i18n/useTranslation';

// ==================== Page ====================

export default function ProgramDayProgressPage() {
  const { assignmentId, dayId } = useParams<{
    assignmentId: string;
    dayId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, language } = useTranslation();

  // تاریخ امروز به فرمت YYYY-MM-DD
  const todayKey = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  const [date, setDate] = useState(todayKey);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  const [editingExercise, setEditingExercise] = useState<string | null>(null);

  // ===== گرفتن progress =====
  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress', assignmentId, dayId, date],
    queryFn: () => programProgressService.getOrCreate(assignmentId!, dayId!, date),
    enabled: !!assignmentId && !!dayId,
  });

  // ===== Mutation آپدیت یه حرکت =====
  const updateExerciseMutation = useMutation({
    mutationFn: ({
      exerciseId,
      data,
    }: {
      exerciseId: string;
      data: {
        completed?: boolean;
        actualSets?: number | null;
        actualReps?: number | null;
        actualWeight?: number | null;
        timeSpent?: number | null;
        notes?: string | null;
      };
    }) => programProgressService.updateExercise(progress!.id, exerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['progress', assignmentId, dayId, date],
      });
    },
    onError: () => {
      setError(t('programProgress.saveError'));
      setTimeout(() => setError(''), 3000);
    },
  });

  // ===== Mutation تکمیل کل روز =====
  const completeDayMutation = useMutation({
    mutationFn: () =>
      programProgressService.updateProgress(progress!.id, {
        status: 'COMPLETED',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['progress', assignmentId, dayId, date],
      });
      queryClient.invalidateQueries({ queryKey: ['myProgressSummary'] });
      setSuccess(t('programProgress.allCompleted'));
      setTimeout(() => setSuccess(''), 4000);
    },
  });

  // ===== Mutation ریست کل روز =====
  const resetDayMutation = useMutation({
    mutationFn: () =>
      programProgressService.updateProgress(progress!.id, {
        status: 'IN_PROGRESS',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['progress', assignmentId, dayId, date],
      });
      queryClient.invalidateQueries({ queryKey: ['myProgressSummary'] });
    },
  });

  // وقتی progress لود شد، notes‌ها رو توی state محلی بذار
  useEffect(() => {
    if (progress) {
      const notes: Record<string, string> = {};
      progress.exercises.forEach((ex) => {
        notes[ex.id] = ex.notes ?? '';
      });
      setLocalNotes(notes);
    }
  }, [progress]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300">
          {t('common.error')}
        </div>
      </div>
    );
  }

  const completedCount = progress.exercises.filter((e) => e.completed).length;
  const totalCount = progress.exercises.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted = progress.status === 'COMPLETED';
  const allChecked = completedCount === totalCount && totalCount > 0;

  // مجموع زمان صرف‌شده
  const totalTimeSpent = progress.exercises.reduce(
    (sum, ex) => sum + (ex.timeSpent ?? 0),
    0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="animate-fade-in-up">
        <button
          onClick={() => navigate('/my-programs')}
          className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-all"
        >
          <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 flex items-center justify-center transition-colors rtl:rotate-0 ltr:rotate-180">
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
          <span className="font-semibold">{t('programProgress.backToPrograms')}</span>
        </button>
      </div>

      {/* ===== Alerts ===== */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-sm animate-bounce-in">
          <CircleCheck size={22} strokeWidth={2.5} />
          <span className="font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
          <X size={20} strokeWidth={2.5} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* ===== Hero Progress ===== */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl animate-fade-in-up delay-1 ${
          isCompleted
            ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-emerald-500/30'
            : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-blue-500/30'
        }`}
      >
        <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              {isCompleted ? (
                <CircleCheck size={28} strokeWidth={2.2} />
              ) : (
                <Dumbbell size={28} strokeWidth={2.2} />
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold mb-1">
                <Calendar size={11} strokeWidth={2.5} />
                <span>
                  {new Date(date).toLocaleDateString(
                    language === 'fa' ? 'fa-IR' : 'en-US',
                    { weekday: 'long', day: 'numeric', month: 'long' }
                  )}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {progress.day.label}
              </h1>
            </div>
          </div>

          {progress.day.notes && (
            <p className="text-white/85 text-sm mb-4">{progress.day.notes}</p>
          )}

          {/* Progress bar */}
          <div className="relative mt-4">
            <div className="flex items-center justify-between mb-2 text-sm font-medium">
              <span className="text-white/90">
                {completedCount} / {totalCount} {t('programProgress.exercisesUnit')}
              </span>
              <span className="text-lg font-bold">{percent}%</span>
            </div>

            <div className="relative w-full h-4 rounded-full bg-black/25 backdrop-blur-sm overflow-hidden shadow-inner border border-white/10">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percent}%`,
                  background: isCompleted
                    ? 'linear-gradient(90deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)'
                    : 'linear-gradient(90deg, #a5b4fc 0%, #60a5fa 50%, #22d3ee 100%)',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                }}
              />
            </div>

            {totalTimeSpent > 0 && (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-white/80">
                <Timer size={13} strokeWidth={2.5} />
                <span>
                  {t('programProgress.totalTime')}:{' '}
                  <span className="font-bold">{totalTimeSpent}</span>{' '}
                  {t('programProgress.minutes')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Date Picker ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft animate-fade-in-up delay-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Calendar size={18} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {t('programProgress.sessionDate')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayKey}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
        </div>
      </div>

      {/* ===== Exercises Checklist ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft animate-fade-in-up delay-3">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Dumbbell size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('programProgress.checklist')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('programProgress.checklistDesc')}
            </p>
          </div>
        </div>

        {progress.exercises.length === 0 ? (
          <p className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
            {t('programProgress.noExercises')}
          </p>
        ) : (
          <div className="space-y-3">
            {progress.exercises.map((exercise, idx) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                index={idx}
                isEditing={editingExercise === exercise.id}
                onToggleEdit={() =>
                  setEditingExercise(
                    editingExercise === exercise.id ? null : exercise.id
                  )
                }
                localNote={localNotes[exercise.id] ?? ''}
                onNoteChange={(v) =>
                  setLocalNotes({ ...localNotes, [exercise.id]: v })
                }
                onToggleComplete={() =>
                  updateExerciseMutation.mutate({
                    exerciseId: exercise.id,
                    data: { completed: !exercise.completed },
                  })
                }
                onSaveField={(field, value) =>
                  updateExerciseMutation.mutate({
                    exerciseId: exercise.id,
                    data: { [field]: value },
                  })
                }
                onSaveNote={() =>
                  updateExerciseMutation.mutate({
                    exerciseId: exercise.id,
                    data: { notes: localNotes[exercise.id] || null },
                  })
                }
                saving={updateExerciseMutation.isPending}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== Big Action Buttons ===== */}
      <div className="flex flex-col gap-3 animate-fade-in-up delay-4">
        {allChecked && !isCompleted && (
          <button
            onClick={() => completeDayMutation.mutate()}
            disabled={completeDayMutation.isPending}
            className="btn-shine w-full py-4 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CircleCheck size={22} strokeWidth={2.5} />
            {completeDayMutation.isPending
              ? t('common.saving')
              : t('programProgress.markDayComplete')}
          </button>
        )}

        {isCompleted && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 py-4 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-500 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg">
              <CircleCheck size={22} strokeWidth={2.5} />
              {t('programProgress.dayCompleted')}
            </div>
            <button
              onClick={() => resetDayMutation.mutate()}
              disabled={resetDayMutation.isPending}
              className="px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all disabled:opacity-50"
            >
              {t('programProgress.reopen')}
            </button>
          </div>
        )}

        {!allChecked && !isCompleted && !completeDayMutation.isPending && (
          <button
            onClick={() => completeDayMutation.mutate()}
            disabled={completeDayMutation.isPending}
            className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-400 font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CircleCheck size={18} strokeWidth={2.2} />
            {t('programProgress.markAllComplete')}
          </button>
        )}
      </div>

      {/* ===== Tip ===== */}
      <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs animate-fade-in-up delay-5">
        <Lightbulb size={16} strokeWidth={2.5} className="shrink-0 mt-0.5" />
        <span>{t('programProgress.tip')}</span>
      </div>
    </div>
  );
}

// ==================== Exercise Item ====================

function ExerciseItem({
  exercise,
  index,
  isEditing,
  onToggleEdit,
  localNote,
  onNoteChange,
  onToggleComplete,
  onSaveField,
  onSaveNote,
  saving,
  t,
}: {
  exercise: ProgressExercise;
  index: number;
  isEditing: boolean;
  onToggleEdit: () => void;
  localNote: string;
  onNoteChange: (v: string) => void;
  onToggleComplete: () => void;
  onSaveField: (
    field: 'actualSets' | 'actualReps' | 'actualWeight' | 'timeSpent',
    value: number | null
  ) => void;
  onSaveNote: () => void;
  saving: boolean;
  t: (key: never) => string;
}) {
  const [editFields, setEditFields] = useState({
    actualSets: exercise.actualSets ?? exercise.plannedSets ?? 0,
    actualReps: exercise.actualReps ?? exercise.plannedReps ?? 0,
    actualWeight: exercise.actualWeight ?? exercise.plannedWeight ?? 0,
    timeSpent: exercise.timeSpent ?? 0,
  });

  // وقتی exercise عوض شد (بعد از refresh)، مقادیر رو آپدیت کن
  useEffect(() => {
    if (!isEditing) {
      setEditFields({
        actualSets: exercise.actualSets ?? exercise.plannedSets ?? 0,
        actualReps: exercise.actualReps ?? exercise.plannedReps ?? 0,
        actualWeight: exercise.actualWeight ?? exercise.plannedWeight ?? 0,
        timeSpent: exercise.timeSpent ?? 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.actualSets, exercise.actualReps, exercise.actualWeight, exercise.timeSpent, isEditing]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 transition-all animate-fade-in ${
        exercise.completed
          ? 'border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
          : 'border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800'
      }`}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <button
            onClick={onToggleComplete}
            disabled={saving}
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 ${
              exercise.completed
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 hover:scale-105'
            }`}
          >
            {exercise.completed ? (
              <Check size={18} strokeWidth={3} />
            ) : (
              <Circle size={18} strokeWidth={2.5} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-bold ${
                exercise.completed
                  ? 'text-emerald-700 dark:text-emerald-300 line-through opacity-80'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {exercise.name}
            </h3>

            {/* Planned info */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {exercise.plannedSets && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                  {t('programProgress.planned' as never)}: {exercise.plannedSets} ×{' '}
                  {exercise.plannedReps ?? '—'}
                </span>
              )}
              {exercise.plannedWeight && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-bold">
                  {exercise.plannedWeight} kg
                </span>
              )}
              {exercise.plannedRestTime && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-bold">
                  {exercise.plannedRestTime}s
                </span>
              )}
            </div>

            {exercise.plannedNotes && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {exercise.plannedNotes}
              </p>
            )}
          </div>

          <button
            onClick={onToggleEdit}
            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isEditing
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:scale-110'
            }`}
            title={isEditing ? t('common.close' as never) : t('common.edit' as never)}
          >
            {isEditing ? <X size={14} strokeWidth={2.5} /> : <Pencil size={14} strokeWidth={2.2} />}
          </button>
        </div>

        {/* Actual values (read-only summary) */}
        {!isEditing && (exercise.actualSets || exercise.actualReps || exercise.actualWeight || exercise.timeSpent || exercise.notes) && (
          <div className="ms-12 flex flex-wrap gap-1.5 mb-2">
            {exercise.actualSets != null && (
              <span className="text-[11px] px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold">
                ✓ {exercise.actualSets} × {exercise.actualReps ?? '—'}
              </span>
            )}
            {exercise.actualWeight != null && (
              <span className="text-[11px] px-2 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-semibold">
                {exercise.actualWeight} kg
              </span>
            )}
            {exercise.timeSpent != null && exercise.timeSpent > 0 && (
              <span className="text-[11px] px-2 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold inline-flex items-center gap-1">
                <Clock size={11} strokeWidth={2.5} />
                {exercise.timeSpent} {t('programProgress.minutes' as never)}
              </span>
            )}
            {exercise.notes && (
              <span className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 italic">
                "{exercise.notes}"
              </span>
            )}
          </div>
        )}

        {/* Edit form */}
        {isEditing && (
          <div className="ms-12 mt-2 p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 space-y-3 animate-scale-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t('programProgress.actualSets' as never)}
                </label>
                <input
                  type="number"
                  min={0}
                  value={editFields.actualSets || ''}
                  onChange={(e) =>
                    setEditFields({
                      ...editFields,
                      actualSets: Number(e.target.value) || 0,
                    })
                  }
                  onBlur={() =>
                    onSaveField('actualSets', editFields.actualSets || null)
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-center text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t('programProgress.actualReps' as never)}
                </label>
                <input
                  type="number"
                  min={0}
                  value={editFields.actualReps || ''}
                  onChange={(e) =>
                    setEditFields({
                      ...editFields,
                      actualReps: Number(e.target.value) || 0,
                    })
                  }
                  onBlur={() =>
                    onSaveField('actualReps', editFields.actualReps || null)
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-center text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t('programProgress.actualWeight' as never)}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  value={editFields.actualWeight || ''}
                  onChange={(e) =>
                    setEditFields({
                      ...editFields,
                      actualWeight: Number(e.target.value) || 0,
                    })
                  }
                  onBlur={() =>
                    onSaveField('actualWeight', editFields.actualWeight || null)
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-center text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Clock size={9} strokeWidth={2.5} />
                  {t('programProgress.timeSpent' as never)}
                </label>
                <input
                  type="number"
                  min={0}
                  value={editFields.timeSpent || ''}
                  onChange={(e) =>
                    setEditFields({
                      ...editFields,
                      timeSpent: Number(e.target.value) || 0,
                    })
                  }
                  onBlur={() =>
                    onSaveField('timeSpent', editFields.timeSpent || null)
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-center text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {t('programProgress.notes' as never)}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localNote}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder={t('programProgress.notesPlaceholder' as never)}
                  className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
                <button
                  type="button"
                  onClick={onSaveNote}
                  disabled={saving}
                  className="px-3 h-9 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  <Save size={12} strokeWidth={2.5} />
                  {t('common.save' as never)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}