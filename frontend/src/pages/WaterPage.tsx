import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waterService } from '../services/water.service';
import { useTranslation } from '../i18n/useTranslation';

const QUICK_ADD = [
  { amount: 200, labelKey: 'water.glass', emoji: '🥛' },
  { amount: 330, labelKey: 'water.can', emoji: '🥤' },
  { amount: 500, labelKey: 'water.bottle', emoji: '🍶' },
  { amount: 750, labelKey: 'water.bigBottle', emoji: '🧴' },
];

const GOAL_PRESETS = [
  { value: 1500, label: '1.5', descKey: 'water.light' },
  { value: 2000, label: '2', descKey: 'water.normal' },
  { value: 2500, label: '2.5', descKey: 'water.athlete' },
  { value: 3000, label: '3', descKey: 'water.active' },
];

export default function WaterPage() {
  const queryClient = useQueryClient();
  const { t, language } = useTranslation();
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [customGoal, setCustomGoal] = useState('');

  const { data: today, isLoading: todayLoading } = useQuery({
    queryKey: ['waterToday'],
    queryFn: waterService.getToday,
  });

  const { data: stats } = useQuery({
    queryKey: ['waterStats'],
    queryFn: waterService.getStats,
  });

  const addMutation = useMutation({
    mutationFn: waterService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waterToday'] });
      queryClient.invalidateQueries({ queryKey: ['waterStats'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const resetMutation = useMutation({
    mutationFn: waterService.reset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waterToday'] });
      queryClient.invalidateQueries({ queryKey: ['waterStats'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const goalMutation = useMutation({
    mutationFn: waterService.updateGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waterToday'] });
      queryClient.invalidateQueries({ queryKey: ['waterStats'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setShowGoalEdit(false);
      setCustomGoal('');
    },
  });

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';

  if (todayLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t('water.title')}
        </h1>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 animate-pulse-soft h-80" />
      </div>
    );
  }

  const currentAmount = today?.log.amount ?? 0;
  const dailyGoal = today?.goal ?? 2000;
  const percent = Math.min(100, Math.round((currentAmount / dailyGoal) * 100));
  const remaining = Math.max(0, dailyGoal - currentAmount);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('water.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('water.dailyGoal')}: {(dailyGoal / 1000).toFixed(1)} {t('water.liters')}
          </p>
        </div>
        <button
          onClick={() => setShowGoalEdit(!showGoalEdit)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:scale-105"
        >
          <span>⚙️</span>
          <span>{t('water.changeGoal')}</span>
        </button>
      </div>

      {/* Goal Edit Panel */}
      {showGoalEdit && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            {t('water.pickGoal')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {GOAL_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => goalMutation.mutate(preset.value)}
                disabled={goalMutation.isPending}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 disabled:opacity-50 hover:scale-105 ${
                  dailyGoal === preset.value
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-300 dark:hover:border-cyan-700'
                }`}
              >
                <span className="text-xl font-bold">
                  {preset.label} {t('water.liters')}
                </span>
                <span className="text-xs">{t(preset.descKey as never)}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('water.customAmount')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder={t('water.customPlaceholder')}
                min={500}
                max={10000}
                className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
              <button
                onClick={() => {
                  const num = Number(customGoal);
                  if (num >= 500 && num <= 10000) {
                    goalMutation.mutate(num);
                  }
                }}
                disabled={
                  !customGoal ||
                  Number(customGoal) < 500 ||
                  Number(customGoal) > 10000 ||
                  goalMutation.isPending
                }
                className="px-6 h-12 rounded-xl bg-gradient-to-l from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('water.saveGoal')}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {t('water.tip')}
            </p>
          </div>
        </div>
      )}

      {/* Main Progress Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm mb-4 animate-fade-in-up delay-1">
        <div className="flex flex-col items-center">
          <div className="relative" style={{ width: 200, height: 200 }}>
            <svg width="200" height="200" className="-rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="14"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="url(#waterGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.7s ease-out' }}
              />
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl animate-float">💧</span>
              <span className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {currentAmount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('water.from')} {dailyGoal} ml
              </span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                {percent}%
              </span>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
            {remaining > 0 ? (
              <>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {remaining} ml
                </span>{' '}
                {t('water.remaining')} 💪
              </>
            ) : (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 animate-bounce-in">
                {t('water.goalReached')}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Quick Add */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-fade-in-up delay-2 card-hover">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>➕</span> {t('water.quickAdd')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ADD.map((item, i) => (
            <button
              key={item.amount}
              onClick={() => addMutation.mutate(item.amount)}
              disabled={addMutation.isPending}
              className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-400 dark:hover:border-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all flex flex-col items-center gap-1 disabled:opacity-50 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${0.03 * i}s` }}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {t(item.labelKey as never)}
              </span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                {item.amount} ml
              </span>
            </button>
          ))}
        </div>

        <CustomAmountForm onAdd={(amt) => addMutation.mutate(amt)} t={t} />
      </div>

      {/* Weekly Stats */}
      {stats && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-fade-in-up delay-3 card-hover">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📊</span> {t('water.thisWeek')}
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 transition-transform hover:scale-105">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {t('water.weekTotal')}
              </p>
              <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                {stats.totalWeek}
                <span className="text-xs mr-1">ml</span>
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 transition-transform hover:scale-105">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {t('water.dailyAvg')}
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {stats.avgDaily}
                <span className="text-xs mr-1">ml</span>
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 transition-transform hover:scale-105">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {t('water.daysLogged')}
              </p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {stats.logs.length}
                <span className="text-xs mr-1">{t('water.days')}</span>
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            {stats.logs.map((log, i) => {
              const dayPercent = Math.min(100, Math.round((log.amount / stats.goal) * 100));
              return (
                <div
                  key={log.id ?? log.date}
                  className="flex items-center gap-2 text-xs animate-fade-in"
                  style={{ animationDelay: `${0.05 * i}s` }}
                >
                  <span className="w-20 text-slate-500 dark:text-slate-400">
                    {new Date(log.date).toLocaleDateString(locale, { weekday: 'short' })}
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-cyan-400 to-blue-500 transition-all duration-700 ease-out"
                      style={{ width: `${dayPercent}%` }}
                    />
                  </div>
                  <span className="w-16 text-end text-slate-600 dark:text-slate-400 font-medium">
                    {log.amount} ml
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={() => {
          if (confirm(t('water.resetConfirm'))) {
            resetMutation.mutate();
          }
        }}
        disabled={resetMutation.isPending || currentAmount === 0}
        className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-slate-600 dark:text-slate-400 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up delay-4"
      >
        🔄 {t('water.resetToday')}
      </button>
    </div>
  );
}

function CustomAmountForm({
  onAdd,
  t,
}: {
  onAdd: (amount: number) => void;
  t: (key: never) => string;
}) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(value);
    if (num > 0) {
      onAdd(num);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('water.customAmount2' as never)}
        className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
      />
      <button
        type="submit"
        disabled={!value || Number(value) <= 0}
        className="px-6 h-12 rounded-xl bg-gradient-to-l from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
      >
        {t('water.add' as never)}
      </button>
    </form>
  );
}