import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Trophy,
  Dumbbell,
  Flame,
  Droplets,
  Scale,
  Apple,
  Target,
  Award,
  Lock,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  achievementsService,
  type Achievement,
  type AchievementCategory,
} from '../services/achievements.service';
import { useTranslation } from '../i18n/useTranslation';
import { useLanguageStore } from '../store/language.store';
import { translations } from '../i18n/translations';

// ==================== Categories ====================

const CATEGORIES: {
  value: AchievementCategory | 'all';
  labelKey: string;
  Icon: typeof Trophy;
}[] = [
  { value: 'all', labelKey: 'achievements.filterAll', Icon: Trophy },
  { value: 'workout', labelKey: 'achievements.filterWorkout', Icon: Dumbbell },
  { value: 'streak', labelKey: 'achievements.filterStreak', Icon: Flame },
  { value: 'water', labelKey: 'achievements.filterWater', Icon: Droplets },
  { value: 'weight', labelKey: 'achievements.filterWeight', Icon: Scale },
  { value: 'nutrition', labelKey: 'achievements.filterNutrition', Icon: Apple },
  { value: 'goal', labelKey: 'achievements.filterGoal', Icon: Target },
];

// ==================== Color Map ====================

const COLOR_MAP: Record<
  string,
  {
    gradient: string;
    glow: string;
    ring: string;
    bgSoft: string;
    text: string;
    border: string;
  }
> = {
  bronze: {
    gradient: 'from-amber-600 via-amber-700 to-amber-900',
    glow: 'shadow-amber-700/50',
    ring: 'ring-amber-300',
    bgSoft: 'from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700',
  },
  silver: {
    gradient: 'from-slate-300 via-slate-400 to-slate-600',
    glow: 'shadow-slate-500/50',
    ring: 'ring-slate-300',
    bgSoft: 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700',
    text: 'text-slate-600 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-600',
  },
  gold: {
    gradient: 'from-yellow-300 via-amber-400 to-amber-600',
    glow: 'shadow-amber-500/60',
    ring: 'ring-yellow-300',
    bgSoft: 'from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-yellow-400 dark:border-yellow-700',
  },
  diamond: {
    gradient: 'from-cyan-300 via-cyan-400 to-blue-600',
    glow: 'shadow-cyan-500/60',
    ring: 'ring-cyan-300',
    bgSoft: 'from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-400 dark:border-cyan-700',
  },
  orange: {
    gradient: 'from-orange-400 via-orange-500 to-red-500',
    glow: 'shadow-orange-500/50',
    ring: 'ring-orange-300',
    bgSoft: 'from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-400 dark:border-orange-700',
  },
  red: {
    gradient: 'from-red-500 via-red-600 to-red-800',
    glow: 'shadow-red-500/60',
    ring: 'ring-red-300',
    bgSoft: 'from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-400 dark:border-red-700',
  },
  cyan: {
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    glow: 'shadow-cyan-500/50',
    ring: 'ring-cyan-300',
    bgSoft: 'from-cyan-100 to-sky-100 dark:from-cyan-900/20 dark:to-sky-900/20',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-400 dark:border-cyan-700',
  },
  blue: {
    gradient: 'from-blue-400 via-blue-500 to-indigo-700',
    glow: 'shadow-blue-500/50',
    ring: 'ring-blue-300',
    bgSoft: 'from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-400 dark:border-blue-700',
  },
  purple: {
    gradient: 'from-purple-400 via-purple-500 to-fuchsia-700',
    glow: 'shadow-purple-500/50',
    ring: 'ring-purple-300',
    bgSoft: 'from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-400 dark:border-purple-700',
  },
  emerald: {
    gradient: 'from-emerald-400 via-emerald-500 to-teal-700',
    glow: 'shadow-emerald-500/50',
    ring: 'ring-emerald-300',
    bgSoft: 'from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-400 dark:border-emerald-700',
  },
  green: {
    gradient: 'from-green-400 via-green-500 to-emerald-700',
    glow: 'shadow-green-500/50',
    ring: 'ring-green-300',
    bgSoft: 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-400 dark:border-green-700',
  },
  pink: {
    gradient: 'from-pink-400 via-pink-500 to-rose-700',
    glow: 'shadow-pink-500/50',
    ring: 'ring-pink-300',
    bgSoft: 'from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-400 dark:border-pink-700',
  },
  amber: {
    gradient: 'from-amber-400 via-orange-500 to-orange-700',
    glow: 'shadow-amber-500/60',
    ring: 'ring-amber-300',
    bgSoft: 'from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-400 dark:border-amber-700',
  },
};

// ==================== Page ====================

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
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-52 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
            <Trophy size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('achievements.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('achievements.subtitle')}
          </p>
        </div>
      </div>

      {/* ===== Summary Card ===== */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-amber-500/30 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 animate-fade-in-up delay-1">
        <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-20 w-64 h-64 rounded-full bg-yellow-300/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 end-1/4 w-32 h-32 rounded-full bg-white/20 blur-2xl pointer-events-none animate-float" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold mb-3">
                <Sparkles size={12} strokeWidth={2.5} />
                <span>{t('achievements.unlockedCount')}</span>
              </div>
              <p className="text-5xl md:text-6xl font-bold tracking-tight">
                {summary.unlocked}
                <span className="text-2xl font-normal opacity-75 ms-2">
                  / {summary.total}
                </span>
              </p>
            </div>
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg animate-float">
              <Trophy size={56} strokeWidth={2} />
            </div>
          </div>

          <div className="relative w-full h-4 rounded-full bg-black/20 backdrop-blur-sm overflow-hidden shadow-inner border border-white/10">
            <div
              className="relative h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${summary.percent}%`,
                background:
                  'linear-gradient(90deg, #fef3c7 0%, #fde68a 30%, #fcd34d 50%, #fbbf24 70%, #f59e0b 100%)',
                boxShadow:
                  '0 0 20px rgba(251, 191, 36, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-white/80 font-medium">
              {summary.percent}% {t('achievements.percentComplete')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              <Lock size={12} strokeWidth={2.5} />
              <span>
                {summary.total - summary.unlocked}{' '}
                {t('achievements.notUnlocked')}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ===== Filter ===== */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in-up delay-2">
        {CATEGORIES.map((cat) => {
          const isActive = filter === cat.value;
          const CatIcon = cat.Icon;
          return (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'text-white shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-700 hover:scale-105'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-l from-amber-500 to-orange-500" />
              )}
              <span
                className={`relative w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? 'bg-white/20 backdrop-blur-sm' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <CatIcon size={16} strokeWidth={2.5} />
              </span>
              <span className="relative">{t(cat.labelKey as never)}</span>
            </button>
          );
        })}
      </div>

      {/* ===== Achievements Grid ===== */}
      {filtered.length === 0 ? (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto mb-4 shadow-2xl shadow-amber-500/30 animate-float">
            <Trophy size={40} strokeWidth={2} />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
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

// ==================== Achievement Card ====================

function AchievementCard({
  achievement,
  delay,
}: {
  achievement: Achievement;
  delay: number;
}) {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);

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
        className={`group relative overflow-hidden rounded-3xl p-5 text-center animate-fade-in-up transition-all duration-300 hover:scale-[1.03] cursor-pointer border ${colors.border} bg-gradient-to-br ${colors.bgSoft} shadow-lg ${colors.glow} hover:shadow-2xl`}
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="absolute top-2 end-3 opacity-40">
          <Sparkles size={14} strokeWidth={2} className={colors.text} />
        </div>
        <div className="absolute bottom-2 start-3 opacity-40">
          <Sparkles size={14} strokeWidth={2} className={colors.text} />
        </div>

        <div className="relative w-24 h-24 mx-auto mb-4">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} blur-xl opacity-60 group-hover:opacity-90 transition-opacity`}
          />
          <div
            className={`relative w-full h-full rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-5xl shadow-2xl ring-4 ${colors.ring} ring-opacity-30 animate-bounce-in`}
          >
            <span className="drop-shadow-2xl">{achievement.emoji}</span>
          </div>
        </div>

        <h3 className={`text-sm font-bold mb-1 ${colors.text}`}>{title}</h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 min-h-[32px] leading-relaxed">
          {description}
        </p>

        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-l ${colors.gradient} text-white text-xs font-bold shadow-lg`}
        >
          <Check size={12} strokeWidth={3} />
          <span>{t('achievements.unlocked')}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden rounded-3xl p-5 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100 transition-all duration-300 animate-fade-in-up hover:scale-[1.02]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative w-24 h-24 mx-auto mb-4">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-5xl grayscale">
          <span className="opacity-40">{achievement.emoji}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Lock size={20} strokeWidth={2.5} className="text-white" />
          </div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">
        {title}
      </h3>

      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 min-h-[32px] leading-relaxed">
        {description}
      </p>

      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-l ${colors.gradient} transition-all duration-1000 ease-out`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="text-slate-900 dark:text-white">
          {achievement.progress}
        </span>
        {' / '}
        {achievement.requirement} {unit}
      </p>
    </div>
  );
}