import { useQuery } from '@tanstack/react-query';
import {
  ClipboardList,
  Calendar,
  Dumbbell,
  Crown,
  CalendarDays,
  Repeat,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { programService, type ProgramType } from '../../services/program.service';
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

export default function MyProgramsPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['myAssignedPrograms'],
    queryFn: programService.getMyAssignedPrograms,
  });

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-64 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  const list = assignments ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <ClipboardList size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('programs.myPrograms')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {list.length} {t('programs.count')}
          </p>
        </div>
      </div>

      {/* ===== Empty State ===== */}
      {list.length === 0 ? (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-500/30 animate-float">
              <ClipboardList size={48} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('programs.noAssignedPrograms')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {t('programs.noAssignedProgramsDesc')}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((assignment, index) => {
            const info = TYPE_INFO[assignment.program.type] ?? TYPE_INFO.WEEKLY;
            const TypeIcon = info.Icon;
            const isExpanded = expanded === assignment.assignmentId;

            return (
              <div
                key={assignment.assignmentId}
                className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft animate-fade-in-up card-hover"
                style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s` }}
              >
                {/* Header (Clickable) */}
                <button
                  onClick={() =>
                    setExpanded(isExpanded ? null : assignment.assignmentId)
                  }
                  className="w-full text-start p-5 relative"
                >
                  <div
                    className={`absolute -top-16 -end-16 w-40 h-40 rounded-full bg-gradient-to-br ${info.gradient} opacity-[0.08] blur-3xl pointer-events-none`}
                  />

                  <div className="relative flex items-start gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}
                    >
                      <TypeIcon size={26} strokeWidth={2.2} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {assignment.program.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <Crown size={11} strokeWidth={2.5} />
                            <span>{assignment.program.coach.name}</span>
                            <span>•</span>
                            <Calendar size={11} strokeWidth={2.5} />
                            <span>
                              {new Date(assignment.startDate).toLocaleDateString(
                                locale
                              )}
                            </span>
                          </p>
                        </div>

                        <span className="shrink-0 text-slate-400">
                          {isExpanded ? (
                            <ChevronUp size={20} strokeWidth={2.2} />
                          ) : (
                            <ChevronDown size={20} strokeWidth={2.2} />
                          )}
                        </span>
                      </div>

                      {assignment.program.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                          {assignment.program.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs mt-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          <Calendar size={11} strokeWidth={2.5} />
                          {assignment.program.days.length}{' '}
                          {t('programs.daysUnit')}
                        </span>
                        {assignment.program.durationWeeks && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            <Dumbbell size={11} strokeWidth={2.5} />
                            {assignment.program.durationWeeks}{' '}
                            {t('programs.weeksUnit')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Days */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-3 animate-scale-in">
                    {assignment.program.days.map((day, dayIdx) => (
                      <div
                        key={day.id ?? dayIdx}
                        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0">
                            {dayIdx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {day.label}
                            </h4>
                            {day.notes && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {day.notes}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md font-medium shrink-0">
                            {day.exercises.length}
                          </span>
                        </div>

                        {/* دکمه‌ی شروع تمرین */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/my-programs/${assignment.assignmentId}/day/${day.id}`
                            );
                          }}
                          className="btn-shine w-full mt-3 py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                          <Play size={16} strokeWidth={2.5} />
                          {t('programProgress.startTraining' as never)}
                          <ArrowLeft size={14} strokeWidth={2.5} className="rtl:rotate-180" />
                        </button>

                        {day.exercises.length > 0 && (
                          <div className="space-y-1.5">
                            {day.exercises.map((ex, exIdx) => (
                              <div
                                key={ex.id ?? exIdx}
                                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                                    {exIdx + 1}
                                  </div>
                                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                    {ex.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] shrink-0">
                                  {ex.sets && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">
                                      {ex.sets} × {ex.reps ?? '—'}
                                    </span>
                                  )}
                                  {ex.weight && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-bold">
                                      {ex.weight} kg
                                    </span>
                                  )}
                                  {ex.restTime && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold">
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
            );
          })}
        </div>
      )}
    </div>
  );
}