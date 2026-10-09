import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  achievementsService,
  type Achievement,
  type AchievementCategory,
} from '../services/achievements.service';
import { useTranslation } from '../i18n/useTranslation';
import { useLanguageStore } from '../store/language.store';
import { translations } from '../i18n/translations';

const CATEGORIES: { value: AchievementCategory | 'all'; labelKey: string; emoji: string }[] = [
  { value: 'all', labelKey: 'achievements.filterAll', emoji: '🏆' },
  { value: 'workout', labelKey: 'achievements.filterWorkout', emoji: '💪' },
  { value: 'streak', labelKey: 'achievements.filterStreak', emoji: '🔥' },
  { value: 'water', labelKey: 'achievements.filterWater', emoji: '💧' },
  { value: 'weight', labelKey: 'achievements.filterWeight', emoji: '⚖️' },
  { value: 'nutrition', labelKey: 'achievements.filterNutrition', emoji: '🍎' },
  { value: 'goal', labelKey: 'achievements.filterGoal', emoji: '🎯' },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  bronze: {
    bg: 'bg-gradient-to-br from-amber-700 to-amber-900',
    text: 'text-amber-100',
    border: 'border-amber-500',
    ring: 'ring-amber-300',
  },
  silver: {
    bg: 'bg-gradient-to-br from-slate-400 to-slate-600',
    text: 'text-white',
    border: 'border-slate-300',
    ring: 'ring-slate-300',
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-400 to-amber-600',
    text: 'text-white',
    border: 'border-yellow-300',
    ring: 'ring-yellow-300',
  },
  diamond: {
    bg: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    text: 'text-white',
    border: 'border-cyan-300',
    ring: 'ring-cyan-300',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-400 to-red-500',
    text: 'text-white',
    border: 'border-orange-300',
    ring: 'ring-orange-300',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-500 to-red-700',
    text: 'text-white',
    border: 'border-red-300',
    ring: 'ring-red-300',
  },
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    text: 'text-white',
    border: 'border-cyan-300',
    ring: 'ring-cyan-300',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-400 to-blue-700',
    text: 'text-white',
    border: 'border-blue-300',
    ring: 'ring-blue-300',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-400 to-purple-700',
    text: 'text-white',
    border: 'border-purple-300',
    ring: 'ring-purple-300',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-400 to-emerald-700',
    text: 'text-white',
    border: 'border-emerald-300',
    ring: 'ring-emerald-300',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-400 to-green-700',
    text: 'text-white',
    border: 'border-green-300',
    ring: 'ring-green-300',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-400 to-pink-700',
    text: 'text-white',
    border: 'border-pink-300',
    ring: 'ring-pink-300',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-400 to-orange-600',
    text: 'text-white',
    border: 'border-amber-300',
    ring: 'ring-amber-300',
  },
};

export default function AchievementsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<AchievementCategory | 'all'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: achievementsService.getAll,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t('achievements.title')} 🏆
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const achievements = data?.achievements ?? [];
  const summary = data?.summary ?? { unlocked: 0, total: 0, percent: 0 };

  const filtered =
    filter === 'all' ? achievements : achievements.filter((a) => a.category === filter);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('achievements.title')} 🏆
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('achievements.subtitle')}
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-l from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 mb-6 animate-fade-in-up delay-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-emerald-50 text-sm mb-1">
              {t('achievements.unlockedCount')}
            </p>
            <p className="text-3xl font-bold">
              {summary.unlocked}{' '}
              <span className="text-lg font-normal opacity-75">/ {summary.total}</span>
            </p>
          </div>
          <div className="text-6xl animate-float">🏆</div>
        </div>

        <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-700 ease-out"
            style={{ width: `${summary.percent}%` }}
          />
        </div>
        <p className="text-xs text-emerald-50 mt-2">
          {summary.percent}% {t('achievements.percentComplete')}
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 animate-fade-in-up delay-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all hover:scale-105 ${
              filter === cat.value
                ? 'bg-gradient-to-l from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{t(cat.labelKey as never)}</span>
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-float">🏆</div>
          <p className="text-slate-500 dark:text-slate-400">
            {t('achievements.noAchievement')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              delay={Math.min(index * 0.04, 0.5)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AchievementCard({
  achievement,
  delay,
}: {
  achievement: Achievement;
  delay: number;
}) {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);

  // === دسترسی مستقیم به translations (بدون t) ===
  const achT = translations[language].achievements as unknown as {
    items?: Record<string, { title: string; description: string }>;
    units?: Record<string, string>;
  };

  const itemsMap = achT.items ?? {};
  const unitsMap = achT.units ?? {};

  const textItem = itemsMap[achievement.id];
  const title = textItem?.title ?? achievement.id;
  const description = textItem?.description ?? '';
  const unit = unitsMap[achievement.unitKey] ?? achievement.unitKey;

  const colors = COLOR_MAP[achievement.color] ?? COLOR_MAP.bronze;
  const progressPercent = Math.min(
    100,
    Math.round((achievement.progress / achievement.requirement) * 100)
  );

  if (achievement.unlocked) {
    return (
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm card-hover text-center animate-fade-in-up relative overflow-hidden"
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/40 to-transparent dark:from-yellow-900/10 pointer-events-none" />

        <div
          className={`relative w-20 h-20 mx-auto mb-3 rounded-full ${colors.bg} flex items-center justify-center text-4xl shadow-lg ring-4 ${colors.ring} ring-opacity-30 animate-bounce-in`}
        >
          {achievement.emoji}
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          {title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 min-h-[32px]">
          {description}
        </p>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <span>✓</span>
          <span>{t('achievements.unlocked')}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center opacity-70 hover:opacity-100 transition-all animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative w-20 h-20 mx-auto mb-3 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-4xl grayscale">
        {achievement.emoji}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 rounded-full">
          <span className="text-2xl">🔒</span>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">
        {title}
      </h3>

      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 min-h-[32px]">
        {description}
      </p>

      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-l from-emerald-400 to-cyan-500 transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {achievement.progress} / {achievement.requirement} {unit}
      </p>
    </div>
  );
}