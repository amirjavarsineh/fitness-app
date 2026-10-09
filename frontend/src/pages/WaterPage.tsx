import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waterService } from '../services/water.service';

const QUICK_ADD = [
  { amount: 200, label: '۱ لیوان', emoji: '🥛' },
  { amount: 330, label: '۱ قوطی', emoji: '🥤' },
  { amount: 500, label: '۱ بطری', emoji: '🍶' },
  { amount: 750, label: 'بطری بزرگ', emoji: '🧴' },
];

const GOAL_PRESETS = [
  { value: 1500, label: '۱.۵ لیتر', desc: 'سبک' },
  { value: 2000, label: '۲ لیتر', desc: 'معمولی' },
  { value: 2500, label: '۲.۵ لیتر', desc: 'ورزشکار' },
  { value: 3000, label: '۳ لیتر', desc: 'فعال' },
];

export default function WaterPage() {
  const queryClient = useQueryClient();
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

  if (todayLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">مصرف آب</h1>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">مصرف آب</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            هدف روزانه: {(dailyGoal / 1000).toFixed(1)} لیتر
          </p>
        </div>
        <button
          onClick={() => setShowGoalEdit(!showGoalEdit)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:scale-105"
        >
          <span>⚙️</span>
          <span>تغییر هدف</span>
        </button>
      </div>

      {/* Goal Edit Panel */}
      {showGoalEdit && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            🎯 هدف روزانه‌ت رو انتخاب کن
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
                <span className="text-xl font-bold">{preset.label}</span>
                <span className="text-xs">{preset.desc}</span>
              </button>
            ))}
          </div>

          {/* Custom Goal */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              مقدار دلخواه (ml)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="مثلاً 2200"
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
                disabled={!customGoal || Number(customGoal) < 500 || Number(customGoal) > 10000 || goalMutation.isPending}
                className="px-6 h-12 rounded-xl bg-gradient-to-l from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ذخیره
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              💡 یه توصیه کلی: روزانه حدود ۳۵ میلی‌لیتر به ازای هر کیلوگرم وزن بدن.
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
                از {dailyGoal} ml
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
                دیگه تا رسیدن به هدف! 💪
              </>
            ) : (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 animate-bounce-in">
                🎉 عالیه! به هدف امروزت رسیدی!
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Quick Add */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-fade-in-up delay-2 card-hover">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>➕</span> افزودن سریع
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
              <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                {item.amount} ml
              </span>
            </button>
          ))}
        </div>

        <CustomAmountForm onAdd={(amt) => addMutation.mutate(amt)} />
      </div>

      {/* Weekly Stats */}
      {stats && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-fade-in-up delay-3 card-hover">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📊</span> این هفته
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 transition-transform hover:scale-105">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">مجموع هفته</p>
              <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                {stats.totalWeek}
                <span className="text-xs mr-1">ml</span>
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 transition-transform hover:scale-105">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">میانگین روزانه</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {stats.avgDaily}
                <span className="text-xs mr-1">ml</span>
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 transition-transform hover:scale-105">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">روزهای ثبت</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {stats.logs.length}
                <span className="text-xs mr-1">روز</span>
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
                    {new Date(log.date).toLocaleDateString('fa-IR', { weekday: 'short' })}
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-cyan-400 to-blue-500 transition-all duration-700 ease-out"
                      style={{ width: `${dayPercent}%` }}
                    />
                  </div>
                  <span className="w-16 text-left text-slate-600 dark:text-slate-400 font-medium">
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
          if (confirm('آب امروز ریست بشه؟')) {
            resetMutation.mutate();
          }
        }}
        disabled={resetMutation.isPending || currentAmount === 0}
        className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-slate-600 dark:text-slate-400 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up delay-4"
      >
        🔄 ریست آب امروز
      </button>
    </div>
  );
}

function CustomAmountForm({ onAdd }: { onAdd: (amount: number) => void }) {
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
        placeholder="مقدار دلخواه (ml)"
        className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
      />
      <button
        type="submit"
        disabled={!value || Number(value) <= 0}
        className="px-6 h-12 rounded-xl bg-gradient-to-l from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
      >
        افزودن
      </button>
    </form>
  );
}