import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Settings,
  RotateCcw,
  Droplets,
  GlassWater,
  CupSoda,
  Milk,
  Beaker,
  TrendingUp,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { waterService } from '../services/water.service';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Data ====================

const QUICK_ADD = [
  { amount: 200, labelKey: 'water.glass', Icon: GlassWater, gradient: 'from-cyan-400 to-blue-500' },
  { amount: 330, labelKey: 'water.can', Icon: CupSoda, gradient: 'from-sky-400 to-cyan-500' },
  { amount: 500, labelKey: 'water.bottle', Icon: Droplets, gradient: 'from-blue-400 to-indigo-500' },
  { amount: 750, labelKey: 'water.bigBottle', Icon: Milk, gradient: 'from-indigo-400 to-violet-500' },
];

const GOAL_PRESETS = [
  { value: 1500, label: '1.5', descKey: 'water.light' },
  { value: 2000, label: '2', descKey: 'water.normal' },
  { value: 2500, label: '2.5', descKey: 'water.athlete' },
  { value: 3000, label: '3', descKey: 'water.active' },
];

// ==================== Page ====================

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
  const fmt = (n: number): string => n.toLocaleString(locale);

  if (todayLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Droplets size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('water.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t('water.dailyGoal')}: {(dailyGoal / 1000).toFixed(1)}{' '}
              {t('water.liters')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowGoalEdit(!showGoalEdit)}
          className={`btn-shine flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all hover:scale-105 ${
            showGoalEdit
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              : 'bg-gradient-to-l from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
          }`}
        >
          <Settings size={18} strokeWidth={2.2} />
          <span>{t('water.changeGoal')}</span>
        </button>
      </div>

      {/* ===== Goal Edit Panel ===== */}
      {showGoalEdit && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-scale-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
              <Settings size={22} strokeWidth={2.2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('water.pickGoal')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {GOAL_PRESETS.map((preset) => {
              const isActive = dailyGoal === preset.value;
              return (
                <button
                  key={preset.value}
                  onClick={() => goalMutation.mutate(preset.value)}
                  disabled={goalMutation.isPending}
                  className={`relative overflow-hidden p-4 rounded-2xl transition-all disabled:opacity-50 ${
                    isActive
                      ? 'text-white shadow-lg scale-105'
                      : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600" />
                  )}
                  <div className="relative flex flex-col items-center gap-1">
                    <Droplets size={22} strokeWidth={2.2} />
                    <span className="text-lg font-bold">
                      {preset.label} {t('water.liters')}
                    </span>
                    <span className="text-xs opacity-80">
                      {t(preset.descKey as never)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
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
                className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10"
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
                className="px-6 h-12 rounded-xl bg-gradient-to-l from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
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

      {/* ===== Main Progress Card ===== */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft p-8 animate-fade-in-up delay-1">
        <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center">
          <div className="relative" style={{ width: 220, height: 220 }}>
            <svg
              width="220"
              height="220"
              className="-rotate-90"
              viewBox="0 0 220 220"
            >
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="16"
              />
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="url(#waterGradient)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{
                  transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))',
                }}
              />
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-cyan-500 dark:text-cyan-400 mb-1 animate-float">
                <Droplets size={44} strokeWidth={2} />
              </div>
              <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                {fmt(currentAmount)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {t('water.from')} {fmt(dailyGoal)} ml
              </span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/30">
                {percent}%
              </span>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-400 text-center">
            {remaining > 0 ? (
              <>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 text-lg">
                  {fmt(remaining)} ml
                </span>{' '}
                {t('water.remaining')} 💪
              </>
            ) : (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 animate-bounce-in inline-block">
                {t('water.goalReached')}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ===== Quick Add ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-2 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
            <Plus size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('water.quickAdd')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ADD.map((item, i) => {
            const ItemIcon = item.Icon;
            return (
              <button
                key={item.amount}
                onClick={() => addMutation.mutate(item.amount)}
                disabled={addMutation.isPending}
                className="group relative overflow-hidden p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-transparent transition-all disabled:opacity-50 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${0.03 * i}s` }}
              >
                <div
                  className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
                />
                <div className="relative flex flex-col items-center gap-1.5">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <ItemIcon size={26} strokeWidth={2.2} />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    {t(item.labelKey as never)}
                  </span>
                  <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                    +{fmt(item.amount)} ml
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <CustomAmountForm onAdd={(amt) => addMutation.mutate(amt)} t={t} />
      </div>

      {/* ===== Weekly Stats ===== */}
      {stats && stats.logs.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-3 card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
              <BarChart3 size={22} strokeWidth={2.2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('water.thisWeek')}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <StatBubble
              Icon={TrendingUp}
              label={t('water.weekTotal')}
              value={fmt(stats.totalWeek)}
              unit="ml"
              gradient="from-cyan-500 to-blue-600"
            />
            <StatBubble
              Icon={BarChart3}
              label={t('water.dailyAvg')}
              value={fmt(stats.avgDaily)}
              unit="ml"
              gradient="from-sky-500 to-indigo-600"
            />
            <StatBubble
              Icon={CheckCircle2}
              label={t('water.daysLogged')}
              value={fmt(stats.logs.length)}
              unit={t('water.days')}
              gradient="from-emerald-500 to-teal-600"
            />
          </div>

          <div className="space-y-2">
            {stats.logs.map((log, i) => {
              const dayPercent = Math.min(100, Math.round((log.amount / stats.goal) * 100));
              return (
                <div
                  key={log.id ?? log.date}
                  className="flex items-center gap-3 text-xs animate-fade-in"
                  style={{ animationDelay: `${0.05 * i}s` }}
                >
                  <span className="w-20 text-slate-500 dark:text-slate-400 font-medium">
                    {new Date(log.date).toLocaleDateString(locale, { weekday: 'short' })}
                  </span>
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-l from-cyan-400 via-sky-500 to-blue-600 transition-all duration-1000 ease-out rounded-full shadow-sm"
                      style={{ width: `${dayPercent}%` }}
                    />
                  </div>
                  <span className="w-20 text-end text-slate-700 dark:text-slate-300 font-semibold">
                    {fmt(log.amount)} ml
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== Reset Button ===== */}
      <button
        onClick={() => {
          if (confirm(t('water.resetConfirm'))) {
            resetMutation.mutate();
          }
        }}
        disabled={resetMutation.isPending || currentAmount === 0}
        className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 text-slate-600 dark:text-slate-400 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up delay-4 flex items-center justify-center gap-2"
      >
        <RotateCcw size={18} strokeWidth={2.2} />
        {t('water.resetToday')}
      </button>
    </div>
  );
}

// ==================== Sub Components ====================

function StatBubble({
  Icon,
  label,
  value,
  unit,
  gradient,
}: {
  Icon: typeof Droplets;
  label: string;
  value: string;
  unit: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl p-3 text-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform">
      <div
        className={`absolute -top-8 -end-8 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mx-auto mb-2 shadow-lg`}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {value}
          <span className="text-[10px] text-slate-400 dark:text-slate-500 ms-1 font-normal">
            {unit}
          </span>
        </p>
      </div>
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
    <form onSubmit={handleSubmit} className="mt-5 flex gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('water.customAmount2' as never)}
        className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10"
      />
      <button
        type="submit"
        disabled={!value || Number(value) <= 0}
        className="px-6 h-12 rounded-xl bg-gradient-to-l from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
      >
        {t('water.add' as never)}
      </button>
    </form>
  );
}