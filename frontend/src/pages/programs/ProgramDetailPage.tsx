import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  Pencil,
  Trash2,
  Users,
  Calendar,
  Dumbbell,
  UserPlus,
  UserMinus,
  Crown,
  Check,
  X,
  Mail,
  CalendarDays,
  Repeat,
  Lightbulb,
} from 'lucide-react';
import { programService, type ProgramType } from '../../services/program.service';
import { coachService } from '../../services/coach.service';
import { useTranslation } from '../../i18n/useTranslation';

// ==================== Data ====================

const TYPE_INFO: Record<
  ProgramType,
  { labelKey: string; Icon: typeof Calendar; gradient: string }
> = {
  WEEKLY: {
    labelKey: 'programs.typeWeekly',
    Icon: CalendarDays,
    gradient: 'from-blue-500 to-indigo-600',
  },
  DAILY: {
    labelKey: 'programs.typeDaily',
    Icon: Repeat,
    gradient: 'from-emerald-500 to-teal-600',
  },
  PERIODIC: {
    labelKey: 'programs.typePeriodic',
    Icon: Calendar,
    gradient: 'from-violet-500 to-purple-600',
  },
};

// ==================== Page ====================

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [showAssign, setShowAssign] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: program, isLoading } = useQuery({
    queryKey: ['program', id],
    queryFn: () => programService.getById(id!),
    enabled: !!id,
  });

  const { data: coachInfo, refetch: refetchCoachInfo } = useQuery({
    queryKey: ['coachInfo'],
    queryFn: coachService.getInfo,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const assignMutation = useMutation({
    mutationFn: (studentId: string) => programService.assign(id!, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program', id] });
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      setShowAssign(false);
      setSelectedStudent('');
      setSuccess(t('programs.assignSuccess'));
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t('common.error');
      setError(msg);
      setTimeout(() => setError(''), 3000);
    },
  });

  const unassignMutation = useMutation({
    mutationFn: (assignmentId: string) =>
      programService.unassign(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program', id] });
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      setSuccess(t('programs.unassignSuccess'));
      setTimeout(() => setSuccess(''), 3000);
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300">
          {t('common.error')}
        </div>
      </div>
    );
  }

  const typeInfo = TYPE_INFO[program.type] ?? TYPE_INFO.WEEKLY;
  const TypeIcon = typeInfo.Icon;
  const isOwner = program.isOwner;
  const assigned = program.assignedStudents ?? [];
  const myStudents = coachInfo?.students ?? [];
  const availableStudents = myStudents.filter(
    (s) => !assigned.some((a) => a.studentId === s.studentId)
  );

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
      </div>

      {/* ===== Alerts ===== */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-sm animate-bounce-in">
          <Check size={20} strokeWidth={2.5} />
          <span className="font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
          <X size={20} strokeWidth={2.5} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* ===== Hero ===== */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 animate-fade-in-up delay-1">
        <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <TypeIcon size={28} strokeWidth={2.2} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold mb-1">
                <span>{t(typeInfo.labelKey as never)}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{program.name}</h1>
            </div>
          </div>

          {program.description && (
            <p className="text-white/85 text-sm leading-relaxed mb-4 max-w-2xl">
              {program.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm">
              <Calendar size={14} strokeWidth={2.5} />
              <span className="font-bold">{program.days.length}</span>
              <span className="text-xs opacity-80">{t('programs.daysUnit')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm">
              <Users size={14} strokeWidth={2.5} />
              <span className="font-bold">{assigned.length}</span>
              <span className="text-xs opacity-80">{t('programs.studentsUnit')}</span>
            </span>
            {program.durationWeeks && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm">
                <Dumbbell size={14} strokeWidth={2.5} />
                <span className="font-bold">{program.durationWeeks}</span>
                <span className="text-xs opacity-80">{t('programs.weeksUnit')}</span>
              </span>
            )}
          </div>

          {isOwner && (
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => navigate(`/programs/${program.id}/edit`)}
                className="btn-shine inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-600 text-sm font-bold shadow-lg hover:bg-blue-50 transition-all hover:scale-105"
              >
                <Pencil size={16} strokeWidth={2.5} />
                {t('common.edit')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== Days ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-2">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
            <Calendar size={22} strokeWidth={2.2} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('programs.programDays')}
          </h2>
        </div>

        {program.days.length === 0 ? (
          <p className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
            {t('programs.noDays')}
          </p>
        ) : (
          <div className="space-y-4">
            {program.days.map((day, dayIdx) => (
              <div
                key={day.id ?? dayIdx}
                className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 p-4 animate-fade-in"
                style={{ animationDelay: `${dayIdx * 0.05}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {dayIdx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {day.label}
                    </h3>
                    {day.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {day.notes}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg font-medium">
                    {day.exercises.length} {t('programs.exercisesUnit')}
                  </span>
                </div>

                {day.exercises.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">
                    {t('programs.noExercises')}
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {day.exercises.map((ex, exIdx) => (
                      <div
                        key={ex.id ?? exIdx}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {exIdx + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {ex.name}
                            </p>
                            {ex.notes && (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                                {ex.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
                          {ex.sets && (
                            <span className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">
                              {ex.sets} × {ex.reps ?? '—'}
                            </span>
                          )}
                          {ex.weight && (
                            <span className="px-2 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-bold">
                              {ex.weight} kg
                            </span>
                          )}
                          {ex.restTime && (
                            <span className="px-2 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold">
                              {ex.restTime}s
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Assigned Students (فقط برای مربی) ===== */}
      {isOwner && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-3">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                <Users size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('programs.assignedStudents')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {assigned.length} {t('programs.studentsUnit')}
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                if (availableStudents.length === 0) {
                  await refetchCoachInfo();
                  if (myStudents.length === 0) {
                    setError(
                      t('programs.noStudentsToAssign' as never) as string
                    );
                    setTimeout(() => setError(''), 4000);
                    return;
                  }
                  if (availableStudents.length === 0) {
                    setError(
                      t('programs.allAssignedToThisProgram' as never) as string
                    );
                    setTimeout(() => setError(''), 4000);
                    return;
                  }
                }
                setShowAssign(!showAssign);
              }}
              className={`btn-shine inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                showAssign
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  : 'bg-gradient-to-l from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-105'
              }`}
            >
              {showAssign ? (
                <>
                  <X size={16} strokeWidth={2.5} />
                  {t('common.cancel')}
                </>
              ) : (
                <>
                  <UserPlus size={16} strokeWidth={2.5} />
                  {t('programs.assignToStudent')}
                </>
              )}
            </button>
          </div>

          {/* Assign Form */}
          {showAssign && (
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/50 animate-scale-in">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                {t('programs.selectStudent')}
              </p>
              <div className="flex gap-2">
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">{t('programs.chooseStudent')}</option>
                  {availableStudents.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (selectedStudent) {
                      assignMutation.mutate(selectedStudent);
                    }
                  }}
                  disabled={!selectedStudent || assignMutation.isPending}
                  className="btn-shine px-5 h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg shadow-emerald-500/30"
                >
                  {assignMutation.isPending
                    ? t('common.saving')
                    : t('programs.assign')}
                </button>
              </div>
            </div>
          )}

          {/* List of assigned students */}
          {assigned.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <UserPlus size={28} strokeWidth={2} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t('programs.noAssignedStudents')}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto">
                {myStudents.length === 0
                  ? t('programs.noStudentsToAssign')
                  : t('programs.assignHint')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {assigned.map((a, i) => (
                <div
                  key={a.assignmentId}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-l from-emerald-50 to-white dark:from-slate-800/50 dark:to-slate-800 border border-slate-100 dark:border-slate-700 animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                      {a.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {a.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="inline-flex items-center gap-1 truncate">
                          <Mail size={11} strokeWidth={2.5} />
                          {a.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(t('programs.unassignConfirm'))) {
                        unassignMutation.mutate(a.assignmentId);
                      }
                    }}
                    disabled={unassignMutation.isPending}
                    className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all hover:scale-110 disabled:opacity-50 flex items-center justify-center shrink-0"
                    title={t('programs.unassign')}
                  >
                    <UserMinus size={16} strokeWidth={2.2} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== Delete Program ===== */}
      {isOwner && (
        <div className="flex gap-3 animate-fade-in-up delay-4">
          <button
            onClick={() => {
              if (confirm(t('programs.deleteConfirm'))) {
                programService.remove(program.id).then(() => {
                  queryClient.invalidateQueries({ queryKey: ['programs'] });
                  navigate('/programs');
                });
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-semibold transition-all hover:scale-105"
          >
            <Trash2 size={16} strokeWidth={2.2} />
            {t('programs.deleteProgram')}
          </button>
        </div>
      )}

      {/* ===== Tip ===== */}
      {isOwner && availableStudents.length === 0 && myStudents.length > 0 && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs animate-fade-in-up">
          <Lightbulb size={16} strokeWidth={2.5} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{t('programs.allAssignedTip')}: </span>
            <span>{t('programs.allAssignedDesc')}</span>
          </div>
        </div>
      )}
    </div>
  );
}