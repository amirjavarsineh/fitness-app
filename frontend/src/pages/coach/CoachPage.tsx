import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Copy,
  Check,
  RefreshCw,
  UserPlus,
  Crown,
  Award,
  Sparkles,
  Trash2,
  Mail,
  Calendar,
  Link2,
  X,
  TrendingUp,
} from 'lucide-react';
import { coachService } from '../../services/coach.service';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';

type Tab = 'coach' | 'student';

export default function CoachPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('coach');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // ===== اطلاعات مربی =====
  const { data, isLoading } = useQuery({
    queryKey: ['coachInfo'],
    queryFn: coachService.getInfo,
  });

  // ===== لیست مربی‌های من (به عنوان شاگرد) =====
  const { data: myCoaches } = useQuery({
    queryKey: ['myCoaches'],
    queryFn: coachService.getMyCoaches,
  });

  // ===== Mutation: فعال‌سازی مربی =====
  const activateMutation = useMutation({
    mutationFn: () => coachService.activate({}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachInfo'] });
      setSuccess(t('coach.activated'));
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: () => setError(t('common.error')),
  });

  // ===== Mutation: کد جدید =====
  const regenMutation = useMutation({
    mutationFn: coachService.regenerateCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachInfo'] });
    },
  });

  // ===== Mutation: حذف شاگرد =====
  const disconnectMutation = useMutation({
    mutationFn: coachService.disconnectStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachInfo'] });
    },
  });

  // ===== Mutation: عضویت با کد =====
  const joinMutation = useMutation({
    mutationFn: coachService.join,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['myCoaches'] });
      queryClient.invalidateQueries({ queryKey: ['coachInfo'] });
      setJoinCode('');
      setSuccess(`${t('coach.joinedSuccess')} (${data.coach.name})`);
      setTimeout(() => setSuccess(''), 4000);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t('coach.invalidCode');
      setError(msg);
      setTimeout(() => setError(''), 4000);
    },
  });

  // ===== Mutation: قطع ارتباط با مربی =====
  const leaveCoachMutation = useMutation({
    mutationFn: coachService.disconnectFromCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCoaches'] });
    },
  });

  const handleCopy = () => {
    if (!data?.coachCode) return;
    navigator.clipboard.writeText(data.coachCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!joinCode.trim()) {
      setError(t('coach.enterCode'));
      return;
    }
    joinMutation.mutate(joinCode.trim());
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  const isCoach = data?.isCoach ?? false;
  const students = data?.students ?? [];
  const coaches = myCoaches ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
            <Crown size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('coach.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isCoach ? t('coach.dashboard') : t('coach.becomeCoach')}
          </p>
        </div>
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

      {/* ===== Tabs ===== */}
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
          <span className="relative">{t('coach.tabCoach')}</span>
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
          <UserPlus size={20} strokeWidth={2.2} className="relative" />
          <span className="relative">{t('coach.tabStudent')}</span>
        </button>
      </div>

      {/* ==================== COACH TAB ==================== */}
      {tab === 'coach' && (
        <>
          {/* --- اگه مربی نیست --- */}
          {!isCoach && (
            <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-soft animate-fade-in-up">
              <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="relative text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto mb-5 shadow-2xl shadow-amber-500/30 animate-float">
                  <Award size={40} strokeWidth={2} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('coach.becomeCoach')}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                  {t('coach.becomeCoachDesc')}
                </p>
                <button
                  onClick={() => activateMutation.mutate()}
                  disabled={activateMutation.isPending}
                  className="btn-shine inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Sparkles size={20} strokeWidth={2.5} />
                  {activateMutation.isPending
                    ? t('coach.activating')
                    : t('coach.activateButton')}
                </button>
              </div>
            </div>
          )}

          {/* --- اگه مربی هست --- */}
          {isCoach && (
            <>
              {/* کد دعوت */}
              <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 animate-fade-in-up">
                <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} strokeWidth={2.5} />
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                      {t('coach.yourCode')}
                    </p>
                  </div>
                  <p className="text-sm text-white/80 mb-4">{t('coach.yourCodeDesc')}</p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/20">
                      <p className="text-3xl md:text-4xl font-mono font-bold tracking-widest text-center sm:text-start">
                        {data?.coachCode}
                      </p>
                    </div>

                    <button
                      onClick={handleCopy}
                      className="btn-shine flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white text-amber-600 font-bold shadow-lg hover:bg-amber-50 transition-all hover:scale-105 shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check size={18} strokeWidth={3} />
                          {t('coach.copied')}
                        </>
                      ) : (
                        <>
                          <Copy size={18} strokeWidth={2.5} />
                          {t('coach.copyCode')}
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(t('coach.regenerateConfirm'))) {
                        regenMutation.mutate();
                      }
                    }}
                    disabled={regenMutation.isPending}
                    className="mt-4 inline-flex items-center gap-2 text-xs text-white/80 hover:text-white font-medium transition-colors disabled:opacity-50"
                  >
                    <RefreshCw
                      size={12}
                      strokeWidth={2.5}
                      className={regenMutation.isPending ? 'animate-spin' : ''}
                    />
                    {t('coach.regenerateCode')}
                  </button>
                </div>
              </div>

              {/* لیست شاگردها */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Users size={22} strokeWidth={2.2} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('coach.students')}
                  </h2>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                    {students.length}
                  </span>
                </div>

                {students.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <UserPlus size={28} strokeWidth={2} />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">
                      {t('coach.noStudents')}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                      {t('coach.noStudentsDesc')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {students.map((student, i) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-l from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 border border-slate-100 dark:border-slate-700 animate-fade-in"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                            {student.name?.charAt(0).toUpperCase() ?? '?'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {student.name}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              <span className="inline-flex items-center gap-1 truncate">
                                <Mail size={11} strokeWidth={2.5} />
                                {student.email}
                              </span>
                              <span className="inline-flex items-center gap-1 shrink-0">
                                <Calendar size={11} strokeWidth={2.5} />
                                {new Date(student.joinedAt).toLocaleDateString(
                                  'fa-IR'
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() =>
                              navigate(`/student-progress/${student.studentId}`)
                            }
                            className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-500 transition-all hover:scale-110 flex items-center justify-center"
                            title={t('coach.viewProgress' as never)}
                          >
                            <TrendingUp size={16} strokeWidth={2.2} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(t('coach.disconnectConfirm'))) {
                                disconnectMutation.mutate(student.studentId);
                              }
                            }}
                            disabled={disconnectMutation.isPending}
                            className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all hover:scale-110 disabled:opacity-50 flex items-center justify-center"
                          >
                            <Trash2 size={16} strokeWidth={2.2} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ==================== STUDENT TAB ==================== */}
      {tab === 'student' && (
        <>
          {/* --- فرم عضویت با کد --- */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Link2 size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('coach.joinCoach')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('coach.joinCoachDesc')}
                </p>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('coach.enterCode')}
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder={t('coach.codePlaceholder')}
                  className="w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-lg font-mono text-center tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <button
                type="submit"
                disabled={joinMutation.isPending || !joinCode.trim()}
                className="btn-shine w-full h-12 rounded-2xl bg-gradient-to-l from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <UserPlus size={20} strokeWidth={2.5} />
                {joinMutation.isPending
                  ? t('coach.joining')
                  : t('coach.joinButton')}
              </button>
            </form>
          </div>

          {/* --- لیست مربی‌های من --- */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Crown size={22} strokeWidth={2.2} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('coach.yourCoaches')}
              </h2>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                {coaches.length}
              </span>
            </div>

            {coaches.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Crown size={28} strokeWidth={2} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t('coach.noCoaches')}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {coaches.map((coach, i) => (
                  <div
                    key={coach.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-l from-violet-50 to-white dark:from-slate-800/50 dark:to-slate-800 border border-slate-100 dark:border-slate-700 animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                        <Crown size={20} strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {coach.profile?.displayName || coach.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {coach.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(t('coach.leaveCoachConfirm'))) {
                          leaveCoachMutation.mutate(coach.coachId);
                        }
                      }}
                      disabled={leaveCoachMutation.isPending}
                      className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all hover:scale-110 disabled:opacity-50 flex items-center justify-center shrink-0"
                    >
                      <Trash2 size={16} strokeWidth={2.2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}