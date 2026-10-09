import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  challengeService,
  type Challenge,
  type ChallengeStatus,
  type ChallengeType,
} from '../services/challenge.service';

const TYPE_INFO: Record<ChallengeType, { label: string; emoji: string }> = {
  WATER: { label: 'آب', emoji: '💧' },
  WORKOUT: { label: 'تمرین', emoji: '💪' },
  WEIGHT: { label: 'وزن', emoji: '⚖️' },
  MEAL: { label: 'تغذیه', emoji: '🍎' },
  CUSTOM: { label: 'دلخواه', emoji: '🎯' },
};

const STATUS_INFO: Record<
  ChallengeStatus,
  { label: string; color: string; dot: string }
> = {
  ACTIVE: {
    label: 'فعال',
    color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  COMPLETED: {
    label: 'تکمیل‌شده',
    color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  FAILED: {
    label: 'ناموفق',
    color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
  CANCELLED: {
    label: 'لغو‌شده',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
};

const PRESETS: {
  title: string;
  description: string;
  emoji: string;
  type: ChallengeType;
  targetDays: number;
}[] = [
  {
    title: 'چالش ۳۰ روزه آب',
    description: 'هر روز ۸ لیوان آب بنوش',
    emoji: '💧',
    type: 'WATER',
    targetDays: 30,
  },
  {
    title: 'چالش ۷ روزه تمرین',
    description: '۷ روز پیوسته تمرین کن',
    emoji: '💪',
    type: 'WORKOUT',
    targetDays: 7,
  },
  {
    title: 'چالش ۱۴ روزه وزنه',
    description: 'دو هفته پیوسته تمرین با وزنه',
    emoji: '🏋️',
    type: 'WORKOUT',
    targetDays: 14,
  },
  {
    title: 'چالش ۲۱ روزه عادت',
    description: '۲۱ روز پیوسته یه عادت سالم بساز',
    emoji: '⭐',
    type: 'CUSTOM',
    targetDays: 21,
  },
  {
    title: 'چالش ۶۰ روزه استقامت',
    description: 'دو ماه پیوسته ورزش کن',
    emoji: '🔥',
    type: 'WORKOUT',
    targetDays: 60,
  },
  {
    title: 'چالش ۱۰ روزه تغذیه سالم',
    description: '۱۰ روز پیوسته غذای سالم بخور',
    emoji: '🥗',
    type: 'MEAL',
    targetDays: 10,
  },
];

type Filter = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export default function ChallengesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    emoji: '🎯',
    type: 'CUSTOM' as ChallengeType,
    targetDays: 30,
  });

  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: challengeService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: challengeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      resetForm();
    },
    onError: () => setError('خطا در ساخت چالش'),
  });

  const checkInMutation = useMutation({
    mutationFn: challengeService.checkIn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      if (data.completed) {
        setSuccessMsg('🎉 تبریک! چالش رو تکمیل کردی!');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        setSuccessMsg(`✅ چک‌این موفق! روز ${data.challenge.currentDays}`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'خطا در چک‌این';
      setError(msg);
      setTimeout(() => setError(''), 3000);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: challengeService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: challengeService.reactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: challengeService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      emoji: '🎯',
      type: 'CUSTOM',
      targetDays: 30,
    });
    setShowForm(false);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('عنوان الزامی است');
      return;
    }
    if (form.targetDays < 1 || form.targetDays > 365) {
      setError('تعداد روز باید بین ۱ تا ۳۶۵ باشه');
      return;
    }

    createMutation.mutate({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      emoji: form.emoji,
      type: form.type,
      targetDays: Number(form.targetDays),
    });
  };

  const handleUsePreset = (preset: typeof PRESETS[0]) => {
    createMutation.mutate(preset);
  };

  const isTodayCheckedIn = (challenge: Challenge): boolean => {
    if (!challenge.checkInDates) return false;
    const today = new Date().toISOString().slice(0, 10);
    return challenge.checkInDates.split(',').includes(today);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          چالش‌ها 🥇
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-44 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const list = challenges ?? [];
  const filtered =
    filter === 'ALL'
      ? list
      : list.filter((c) => c.status === filter);

  const activeCount = list.filter((c) => c.status === 'ACTIVE').length;
  const completedCount = list.filter((c) => c.status === 'COMPLETED').length;

  const FILTERS: { value: Filter; label: string; count: number }[] = [
    { value: 'ALL', label: 'همه', count: list.length },
    { value: 'ACTIVE', label: 'فعال', count: activeCount },
    { value: 'COMPLETED', label: 'تکمیل‌شده', count: completedCount },
    { value: 'CANCELLED', label: 'لغو‌شده', count: list.filter((c) => c.status === 'CANCELLED').length },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            چالش‌ها 🥇
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeCount} فعال • {completedCount} تکمیل‌شده
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all hover:scale-105 ${
            showForm
              ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              : 'bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/30'
          }`}
        >
          <span className="text-lg">{showForm ? '✕' : '+'}</span>
          <span>{showForm ? 'بستن' : 'چالش جدید'}</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm animate-bounce-in">
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            ➕ چالش جدید
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  عنوان *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثلاً: چالش ۳۰ روزه آب"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  ایموجی
                </label>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  maxLength={4}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-center text-2xl text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                توضیحات (اختیاری)
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="مثلاً: هر روز ۸ لیوان آب بنوش"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                نوع
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(Object.keys(TYPE_INFO) as ChallengeType[]).map((type) => {
                  const info = TYPE_INFO[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, type })}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 hover:scale-105 ${
                        form.type === type
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl">{info.emoji}</span>
                      <span className="text-xs font-medium">{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                تعداد روزها *
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
                {[7, 14, 21, 30, 60, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm({ ...form, targetDays: d })}
                    className={`py-2 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105 ${
                      form.targetDays === d
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {d} روز
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                max={365}
                value={form.targetDays}
                onChange={(e) =>
                  setForm({ ...form, targetDays: Number(e.target.value) })
                }
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {createMutation.isPending ? 'در حال ساخت...' : 'ساخت چالش'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all hover:scale-105"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      {list.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 animate-fade-in-up">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all hover:scale-105 ${
                filter === f.value
                  ? 'bg-gradient-to-l from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md ${
                  filter === f.value
                    ? 'bg-white/20'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Challenges List */}
      {list.length === 0 && !showForm ? (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in mb-6">
            <div className="text-6xl mb-4 animate-float">🥇</div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              هنوز چالشی نداری
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              با قبول کردن یه چالش، انگیزه‌ت رو چند برابر کن
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all hover:scale-105"
            >
              ساخت چالش
            </button>
          </div>

          {/* Presets */}
          <div className="animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>⚡</span> چالش‌های آماده
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handleUsePreset(preset)}
                  disabled={createMutation.isPending}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-right hover:scale-[1.02] disabled:opacity-50 card-hover"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{preset.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {preset.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {preset.description}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                        {preset.targetDays} روز
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((challenge, index) => {
              const statusInfo = STATUS_INFO[challenge.status];
              const progress = Math.min(
                100,
                Math.round((challenge.currentDays / challenge.targetDays) * 100)
              );
              const checkedToday = isTodayCheckedIn(challenge);
              const isActive = challenge.status === 'ACTIVE';

              return (
                <div
                  key={challenge.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-all animate-fade-in-up card-hover"
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/40 dark:to-cyan-900/40 flex items-center justify-center text-2xl shrink-0">
                        {challenge.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {challenge.title}
                        </h3>
                        {challenge.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {challenge.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusInfo.color} flex items-center gap-1.5 shrink-0`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        پیشرفت
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {challenge.currentDays} / {challenge.targetDays}
                        <span className="text-xs text-slate-400 mr-1">
                          ({progress}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ease-out ${
                          challenge.status === 'COMPLETED'
                            ? 'bg-gradient-to-l from-blue-400 to-blue-600'
                            : challenge.status === 'CANCELLED'
                            ? 'bg-slate-400'
                            : 'bg-gradient-to-l from-emerald-400 to-cyan-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Check-in Button */}
                  {isActive && (
                    <button
                      onClick={() => checkInMutation.mutate(challenge.id)}
                      disabled={checkedToday || checkInMutation.isPending}
                      className={`w-full py-3 rounded-xl font-medium text-sm transition-all mb-3 flex items-center justify-center gap-2 ${
                        checkedToday
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 cursor-not-allowed'
                          : 'bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/30 hover:scale-[1.02]'
                      }`}
                    >
                      {checkedToday ? (
                        <>
                          <span>✅</span>
                          <span>امروز چک‌این کردی</span>
                        </>
                      ) : (
                        <>
                          <span>👆</span>
                          <span>چک‌این امروز</span>
                        </>
                      )}
                    </button>
                  )}

                  {challenge.status === 'COMPLETED' && (
                    <div className="w-full py-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium text-center mb-3 flex items-center justify-center gap-2">
                      <span>🎉</span>
                      <span>چالش تکمیل شد!</span>
                    </div>
                  )}

                  {challenge.status === 'CANCELLED' && (
                    <button
                      onClick={() => reactivateMutation.mutate(challenge.id)}
                      disabled={reactivateMutation.isPending}
                      className="w-full py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium transition-all mb-3 hover:scale-[1.02]"
                    >
                      🔄 فعال‌سازی مجدد
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {challenge.status === 'ACTIVE' && (
                      <button
                        onClick={() => {
                          if (confirm('این چالش لغو بشه؟')) {
                            cancelMutation.mutate(challenge.id);
                          }
                        }}
                        disabled={cancelMutation.isPending}
                        className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-all disabled:opacity-50"
                      >
                        لغو
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('این چالش کاملاً حذف بشه؟')) {
                          deleteMutation.mutate(challenge.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium transition-all hover:scale-110 disabled:opacity-50"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Presets (when challenges exist) */}
          <div className="mt-8 animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>⚡</span> چالش‌های آماده
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              با یه کلیک اضافه کن
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handleUsePreset(preset)}
                  disabled={createMutation.isPending}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-right hover:scale-[1.02] disabled:opacity-50 flex items-center gap-3"
                >
                  <span className="text-2xl">{preset.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {preset.title}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                      {preset.targetDays} روز
                    </p>
                  </div>
                  <span className="text-emerald-500 text-lg shrink-0">+</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}