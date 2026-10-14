import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Users,
  Dumbbell,
  Pencil,
  Trash2,
  ClipboardList,
  Repeat,
  CalendarDays,
} from 'lucide-react';
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

export default function ProgramsListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: programs, isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: programService.getMyPrograms,
  });

  const deleteMutation = useMutation({
    mutationFn: programService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const list = programs ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <ClipboardList size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('programs.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {list.length} {t('programs.count')}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/programs/new')}
          className="btn-shine flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-l from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>{t('programs.newProgram')}</span>
        </button>
      </div>

      {/* ===== Empty State ===== */}
      {list.length === 0 ? (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-500/30 animate-float">
              <ClipboardList size={48} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('programs.noPrograms')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {t('programs.noProgramsDesc')}
            </p>
            <button
              onClick={() => navigate('/programs/new')}
              className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all"
            >
              <Plus size={20} strokeWidth={2.5} />
              {t('programs.createProgram')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((program, index) => {
            const info = TYPE_INFO[program.type] ?? TYPE_INFO.WEEKLY;
            const Icon = info.Icon;

            return (
              <div
                key={program.id}
                className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all animate-fade-in-up card-hover"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
              >
                <div
                  className={`absolute -top-16 -end-16 w-40 h-40 rounded-full bg-gradient-to-br ${info.gradient} opacity-[0.08] group-hover:opacity-[0.15] blur-3xl transition-opacity pointer-events-none`}
                />

                <div className="relative">
                  {/* Type Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-l ${info.gradient} text-white text-xs font-bold shadow-md`}
                    >
                      <Icon size={13} strokeWidth={2.5} />
                      <span>{t(info.labelKey as never)}</span>
                    </div>
                  </div>

                  {/* Name & Description */}
                  <h3
                    onClick={() => navigate(`/programs/${program.id}`)}
                    className="text-lg font-bold text-slate-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                  >
                    {program.name}
                  </h3>
                  {program.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                      {program.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Calendar size={13} strokeWidth={2.5} />
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {program.daysCount}
                      </span>
                      <span className="text-xs">{t('programs.daysUnit')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Users size={13} strokeWidth={2.5} />
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {program.assignmentsCount}
                      </span>
                      <span className="text-xs">{t('programs.studentsUnit')}</span>
                    </div>
                    {program.durationWeeks && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400">
                          <Dumbbell size={13} strokeWidth={2.5} />
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {program.durationWeeks}
                        </span>
                        <span className="text-xs">{t('programs.weeksUnit')}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/programs/${program.id}`)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <ClipboardList size={15} strokeWidth={2.2} />
                      {t('programs.viewDetails')}
                    </button>
                    <button
                      onClick={() => navigate(`/programs/${program.id}/edit`)}
                      className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-all hover:scale-110 flex items-center justify-center"
                      title={t('common.edit')}
                    >
                      <Pencil size={16} strokeWidth={2.2} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(t('programs.deleteConfirm'))) {
                          deleteMutation.mutate(program.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all hover:scale-110 disabled:opacity-50 flex items-center justify-center"
                    >
                      <Trash2 size={16} strokeWidth={2.2} />
                    </button>
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