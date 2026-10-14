import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Crown, ClipboardList } from 'lucide-react';
import { coachService } from '../../services/coach.service';
import ProgramsListPage from './ProgramsListPage';
import MyProgramsPage from './MyProgramsPage';
import { useTranslation } from '../../i18n/useTranslation';

type Tab = 'coach' | 'student';

export default function ProgramsHubPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('coach');

  // ===== تشخیص نقش کاربر =====
  const { data: coachInfo, isLoading: coachLoading } = useQuery({
    queryKey: ['coachInfo'],
    queryFn: coachService.getInfo,
  });

  const { data: myCoaches, isLoading: coachesLoading } = useQuery({
    queryKey: ['myCoaches'],
    queryFn: coachService.getMyCoaches,
  });

  const isCoach = coachInfo?.isCoach ?? false;
  const isStudent = (myCoaches?.length ?? 0) > 0;
  const isBoth = isCoach && isStudent;

  // اگه کاربر فقط شاگرده، تب پیش‌فرض شاگرد باشه
  useEffect(() => {
    if (!coachLoading && !coachesLoading) {
      if (!isCoach && isStudent) {
        setTab('student');
      } else if (isCoach) {
        setTab('coach');
      }
    }
  }, [isCoach, isStudent, coachLoading, coachesLoading]);

  // ===== حالت لودینگ =====
  if (coachLoading || coachesLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  // ===== اگه کاربر نه مربی نه شاگرده =====
  if (!isCoach && !isStudent) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-5 shadow-2xl shadow-blue-500/30 animate-float">
              <ClipboardList size={40} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('programs.hubNoRole' as never)}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {t('programs.hubNoRoleDesc' as never)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== اگه کاربر فقط یه نقش داره، مستقیم ببر =====
  if (isCoach && !isStudent) {
    return <ProgramsListPage />;
  }
  if (isStudent && !isCoach) {
    return <MyProgramsPage />;
  }

  // ===== اگه هر دو نقش رو داره، تب نشون بده =====
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 animate-fade-in-up">
        <button
          onClick={() => setTab('coach')}
          className={`relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition-all ${
            tab === 'coach'
              ? 'text-white shadow-lg shadow-amber-500/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-700'
          }`}
        >
          {tab === 'coach' && (
            <div className="absolute inset-0 bg-gradient-to-l from-amber-500 to-orange-500" />
          )}
          <Crown size={20} strokeWidth={2.2} className="relative" />
          <span className="relative">
            {t('programs.tabCoachView' as never)}
          </span>
        </button>

        <button
          onClick={() => setTab('student')}
          className={`relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition-all ${
            tab === 'student'
              ? 'text-white shadow-lg shadow-blue-500/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
          }`}
        >
          {tab === 'student' && (
            <div className="absolute inset-0 bg-gradient-to-l from-blue-500 to-indigo-600" />
          )}
          <ClipboardList size={20} strokeWidth={2.2} className="relative" />
          <span className="relative">
            {t('programs.tabStudentView' as never)}
          </span>
        </button>
      </div>

      {/* Content */}
      {tab === 'coach' ? <ProgramsListPage /> : <MyProgramsPage />}
    </div>
  );
}