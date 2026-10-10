import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  X,
  Check,
  Trash2,
  RotateCcw,
  Zap,
  Trophy,
  Medal,
  Target,
  Flame,
  Dumbbell,
  Droplets,
  Scale,
  Apple,
  Star,
  Clock,
  RefreshCw,
} from 'lucide-react';
import {
  challengeService,
  type Challenge,
  type ChallengeStatus,
  type ChallengeType,
} from '../services/challenge.service';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Data ====================

const TYPE_INFO: Record<
  ChallengeType,
  { labelKey: string; Icon: typeof Droplets; gradient: string }
> = {
  WATER: { labelKey: 'challenges.typeWater', Icon: Droplets, gradient: 'from-cyan-500 to-blue-600' },
  WORKOUT: { labelKey: 'challenges.typeWorkout', Icon: Dumbbell, gradient: 'from-rose-500 to-orange-500' },
  WEIGHT: { labelKey: 'challenges.typeWeight', Icon: Scale, gradient: 'from-violet-500 to-fuchsia-500' },
  MEAL: { labelKey: 'challenges.typeMeal', Icon: Apple, gradient: 'from-emerald-500 to-green-600' },
  CUSTOM: { labelKey: 'challenges.typeCustom', Icon: Target, gradient: 'from-amber-500 to-orange-500' },
};

const STATUS_INFO: Record<
  ChallengeStatus,
  { labelKey: string; gradient: string; dot: string; Icon: typeof Flame }
> = {
  ACTIVE: { labelKey: 'challenges.active', gradient: 'from-emerald-500 to-teal-500', dot: 'bg-emerald-400', Icon: Zap },
  COMPLETED: { labelKey: 'challenges.completed', gradient: 'from-blue-500 to-indigo-500', dot: 'bg-blue-400', Icon: Trophy },
  FAILED: { labelKey: 'challenges.cancelled', gradient: 'from-red-500 to-rose-500', dot: 'bg-red-400', Icon: X },
  CANCELLED: { labelKey: 'challenges.cancelled', gradient: 'from-slate-500 to-slate-600', dot: 'bg-slate-400', Icon: X },
};

const PRESETS: {
  titleKey: string;
  descKey: string;
  Icon: typeof Droplets;
  type: ChallengeType;
  targetDays: number;
}[] = [
  { titleKey: 'challenges.presetWater30', descKey: 'challenges.presetWater30Desc', Icon: Droplets, type: 'WATER', targetDays: 30 },
  { titleKey: 'challenges.presetWorkout7', descKey: 'challenges.presetWorkout7Desc', Icon: Dumbbell, type: 'WORKOUT', targetDays: 7 },
  { titleKey: 'challenges.presetWorkout14', descKey: 'challenges.presetWorkout14Desc', Icon: Dumbbell, type: 'WORKOUT', targetDays: 14 },
  { titleKey: 'challenges.presetHabit21', descKey: 'challenges.presetHabit21Desc', Icon: Star, type: 'CUSTOM', targetDays: 21 },
  { titleKey: 'challenges.presetEndurance60', descKey: 'challenges.presetEndurance60Desc', Icon: Flame, type: 'WORKOUT', targetDays: 60 },
  { titleKey: 'challenges.presetNutrition10', descKey: 'challenges.presetNutrition10Desc', Icon: Apple, type: 'MEAL', targetDays: 10 },
];

type Filter = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

// ==================== Page ====================

export default function ChallengesPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
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
    onError: () => setError(t('challenges.errorCreate')),
  });

  const checkInMutation = useMutation({
    mutationFn: challengeService.checkIn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      if (data.completed) {
        setSuccessMsg(t('challenges.completedCelebration'));
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        setSuccessMsg(`${t('challenges.successCheckIn')} ${data.challenge.currentDays}`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t('challenges.errorCheckIn');
      setError(msg);
      setTimeout(() => setError(''), 3000);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: challengeService.cancel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['challenges'] }),
  });

  const reactivateMutation = useMutation({
    mutationFn: challengeService.reactivate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['challenges'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: challengeService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['challenges'] }),
  });

  const resetForm = () => {
    setForm({ title: '', description: '', emoji: '🎯', type: 'CUSTOM', targetDays: 30 });
    setShowForm(false);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError(t('challenges.titleRequired'));
      return;
    }
    if (form.targetDays < 1 || form.targetDays > 365) {
      setError(t('challenges.daysRange'));
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
    createMutation.mutate({
      title: t(preset.titleKey as never),
      description: t(preset.descKey as never),
      emoji: '🎯',
      type: preset.type,
      targetDays: preset.targetDays,
    });
  };

  const isTodayCheckedIn = (challenge: Challenge): boolean => {
    if (!challenge.checkInDates) return false;
    const today = new Date().toISOString().slice(0, 10);
    return challenge.checkInDates.split(',').includes(today);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
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

  const list = challenges ?? [];
  const filtered = filter === 'ALL' ? list : list.filter((c) => c.status === filter);

  const activeCount = list.filter((c) => c.status === 'ACTIVE').length;
  const completedCount = list.filter((c) => c.status === 'COMPLETED').length;
  const cancelledCount = list.filter((c) => c.status === 'CANCELLED').length;

  const FILTERS: { value: Filter; labelKey: string; count: number; Icon: typeof Flame }[] = [
    { value: 'ALL', labelKey: 'challenges.all', count: list.length, Icon: Target },
    { value: 'ACTIVE', labelKey: 'challenges.active', count: activeCount, Icon: Zap },
    { value: 'COMPLETED', labelKey: 'challenges.completed', count: completedCount, Icon: Trophy },
    { value: 'CANCELLED', labelKey: 'challenges.cancelled', count: cancelledCount, Icon: X },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
              <Medal size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('challenges.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {activeCount} {t('challenges.active')} • {completedCount}{' '}
              {t('challenges.completed')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`btn-shine flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all hover:scale-105 ${
            showForm
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              : 'bg-gradient-to-l from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
          }`}
        >
          {showForm ? <X size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
          <span>{showForm ? t('challenges.close') : t('challenges.newChallenge')}</span>
        </button>
      </div>

      {/* ===== Alerts ===== */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-sm animate-bounce-in">
          <Trophy size={22} strokeWidth={2.2} />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
          <X size={22} strokeWidth={2.5} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* ===== Form ===== */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
              <Plus size={22} strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('challenges.formTitle')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('challenges.titleLabel')} *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={t('challenges.titlePlaceholder')}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-amber-500/10"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('challenges.emojiLabel')}
                </label>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  maxLength={4}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-2xl text-center text-slate-900 dark:text-white outline-none transition-all focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('challenges.descriptionLabel')}
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={t('challenges.descriptionPlaceholder')}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-amber-500/10 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('challenges.typeLabel')}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(Object.keys(TYPE_INFO) as ChallengeType[]).map((type) => {
                  const info = TYPE_INFO[type];
                  const isActive = form.type === type;
                  const TypeIcon = info.Icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, type })}
                      className={`relative overflow-hidden p-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${
                        isActive
                          ? 'text-white shadow-lg scale-105'
                          : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
                      }`}
                    >
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient}`} />
                      )}
                      <TypeIcon size={22} strokeWidth={2.2} className="relative" />
                      <span className="relative text-[11px] font-semibold">
                        {t(info.labelKey as never)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('challenges.daysLabel')} *
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                {[7, 14, 21, 30, 60, 90].map((d) => {
                  const isActive = form.targetDays === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm({ ...form, targetDays: d })}
                      className={`relative py-2 rounded-xl text-sm font-bold transition-all overflow-hidden ${
                        isActive
                          ? 'text-white shadow-lg scale-105'
                          : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-l from-amber-500 to-orange-500" />
                      )}
                      <span className="relative">
                        {d} {t('challenges.daysUnit')}
                      </span>
                    </button>
                  );
                })}
              </div>
              <input
                type="number"
                min={1}
                max={365}
                value={form.targetDays}
                onChange={(e) => setForm({ ...form, targetDays: Number(e.target.value) })}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-shine flex-1 h-12 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending
                  ? t('common.saving')
                  : t('challenges.createChallenge')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all hover:scale-105"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== Filters ===== */}
      {list.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in-up">
          {FILTERS.map((f) => {
            const isActive = filter === f.value;
            const FilterIcon = f.Icon;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-white shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-l from-amber-500 to-orange-500" />
                )}
                <span
                  className={`relative w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <FilterIcon size={15} strokeWidth={2.5} />
                </span>
                <span className="relative">{t(f.labelKey as never)}</span>
                <span
                  className={`relative text-xs px-2 py-0.5 rounded-lg font-bold ${
                    isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ===== Empty State ===== */}
      {list.length === 0 && !showForm && (
        <>
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
            <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-amber-500/30 animate-float">
                <Medal size={48} strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {t('challenges.noChallenges')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                {t('challenges.noChallengesDesc')}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/30 hover:scale-105 transition-all"
              >
                <Plus size={20} strokeWidth={2.5} />
                {t('challenges.createChallenge')}
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap size={20} strokeWidth={2.2} className="text-amber-500" />
              {t('challenges.presets')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map((preset, i) => {
                const info = TYPE_INFO[preset.type];
                const PresetIcon = preset.Icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleUsePreset(preset)}
                    disabled={createMutation.isPending}
                    className="group relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all text-start hover:scale-[1.02] disabled:opacity-50 card-hover"
                  >
                    <div
                      className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${info.gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
                    />
                    <div className="relative flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <PresetIcon size={24} strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {t(preset.titleKey as never)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {t(preset.descKey as never)}
                        </p>
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                          <Clock size={12} strokeWidth={2.5} />
                          {preset.targetDays} {t('challenges.daysUnit')}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ===== Challenges List ===== */}
      {list.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((challenge, index) => {
              const statusInfo = STATUS_INFO[challenge.status];
              const typeInfo = TYPE_INFO[challenge.type];
              const progress = Math.min(
                100,
                Math.round((challenge.currentDays / challenge.targetDays) * 100)
              );
              const checkedToday = isTodayCheckedIn(challenge);
              const isActive = challenge.status === 'ACTIVE';
              const TypeIcon = typeInfo.Icon;
              const StatusIcon = statusInfo.Icon;

              return (
                <div
                  key={challenge.id}
                  className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up card-hover"
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
                >
                  <div
                    className={`absolute -top-16 -end-16 w-40 h-40 rounded-full bg-gradient-to-br ${typeInfo.gradient} opacity-[0.08] group-hover:opacity-[0.15] blur-3xl transition-opacity pointer-events-none`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${typeInfo.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <TypeIcon size={26} strokeWidth={2.2} />
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

                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-l ${statusInfo.gradient} text-white text-[11px] font-bold shadow-md shrink-0`}
                      >
                        <StatusIcon size={12} strokeWidth={2.5} />
                        <span>{t(statusInfo.labelKey as never)}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {t('challenges.progress')}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {challenge.currentDays} / {challenge.targetDays}
                          <span className="text-xs text-slate-400 dark:text-slate-500 ms-2 font-medium">
                            ({progress}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-l ${
                            challenge.status === 'COMPLETED'
                              ? 'from-blue-400 to-indigo-600'
                              : challenge.status === 'CANCELLED'
                              ? 'from-slate-400 to-slate-600'
                              : 'from-emerald-400 via-teal-500 to-cyan-500'
                          } shadow-sm`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {isActive && (
                      <button
                        onClick={() => checkInMutation.mutate(challenge.id)}
                        disabled={checkedToday || checkInMutation.isPending}
                        className={`btn-shine w-full py-3 rounded-2xl font-semibold text-sm transition-all mb-3 flex items-center justify-center gap-2 ${
                          checkedToday
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-not-allowed'
                            : 'bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/30 hover:scale-[1.02]'
                        }`}
                      >
                        {checkedToday ? (
                          <>
                            <Check size={18} strokeWidth={3} />
                            <span>{t('challenges.checkedToday')}</span>
                          </>
                        ) : (
                          <>
                            <Zap size={18} strokeWidth={2.5} />
                            <span>{t('challenges.checkInToday')}</span>
                          </>
                        )}
                      </button>
                    )}

                    {challenge.status === 'COMPLETED' && (
                      <div className="w-full py-3 rounded-2xl bg-gradient-to-l from-blue-500 to-indigo-500 text-white text-sm font-bold text-center mb-3 flex items-center justify-center gap-2 shadow-lg">
                        <Trophy size={18} strokeWidth={2.5} />
                        <span>{t('challenges.completedMsg')}</span>
                      </div>
                    )}

                    {challenge.status === 'CANCELLED' && (
                      <button
                        onClick={() => reactivateMutation.mutate(challenge.id)}
                        disabled={reactivateMutation.isPending}
                        className="w-full py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold transition-all mb-3 hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={16} strokeWidth={2.5} />
                        {t('challenges.reactivate')}
                      </button>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      {challenge.status === 'ACTIVE' && (
                        <button
                          onClick={() => {
                            if (confirm(t('challenges.cancelConfirm'))) {
                              cancelMutation.mutate(challenge.id);
                            }
                          }}
                          disabled={cancelMutation.isPending}
                          className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          {t('challenges.cancel')}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(t('challenges.deleteConfirm'))) {
                            deleteMutation.mutate(challenge.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold transition-all hover:scale-110 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Trash2 size={14} strokeWidth={2.2} />
                        {t('challenges.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Presets at bottom */}
          {list.length > 0 && (
            <div className="mt-8 animate-fade-in-up">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap size={20} strokeWidth={2.2} className="text-amber-500" />
                {t('challenges.presets')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {t('challenges.presetsDesc')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRESETS.map((preset, i) => {
                  const info = TYPE_INFO[preset.type];
                  const PresetIcon = preset.Icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleUsePreset(preset)}
                      disabled={createMutation.isPending}
                      className="group relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all text-start hover:scale-[1.02] disabled:opacity-50 card-hover"
                    >
                      <div
                        className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${info.gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
                      />
                      <div className="relative flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <PresetIcon size={24} strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {t(preset.titleKey as never)}
                          </p>
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                            {preset.targetDays} {t('challenges.daysUnit')}
                          </p>
                        </div>
                        <Plus size={20} strokeWidth={2.5} className="text-amber-500 shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}