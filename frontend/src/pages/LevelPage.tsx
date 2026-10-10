import { useQuery } from '@tanstack/react-query';
import {
  Trophy,
  Sparkles,
  Dumbbell,
  Apple,
  Droplets,
  Scale,
  Ruler,
  Medal,
  Target,
  BarChart3,
  Crown,
  Award,
  Diamond,
  Zap,
  Flame,
  Rocket,
  Lightbulb,
  Star,
} from 'lucide-react';
import { xpService } from '../services/xp.service';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Data ====================

const BREAKDOWN_INFO: {
  key: string;
  labelKey: string;
  Icon: typeof Dumbbell;
  gradient: string;
  xpKey: string;
  countKey: string;
}[] = [
  { key: 'workouts', labelKey: 'level.activities.workouts', Icon: Dumbbell, gradient: 'from-rose-500 to-orange-500', xpKey: 'WORKOUT', countKey: 'workouts' },
  { key: 'nutrition', labelKey: 'level.activities.nutrition', Icon: Apple, gradient: 'from-emerald-500 to-green-500', xpKey: 'NUTRITION', countKey: 'nutrition' },
  { key: 'water', labelKey: 'level.activities.water', Icon: Droplets, gradient: 'from-cyan-500 to-blue-500', xpKey: 'WATER_DAY', countKey: 'waterDays' },
  { key: 'weight', labelKey: 'level.activities.weight', Icon: Scale, gradient: 'from-violet-500 to-fuchsia-500', xpKey: 'WEIGHT', countKey: 'weight' },
  { key: 'measurements', labelKey: 'level.activities.measurements', Icon: Ruler, gradient: 'from-blue-500 to-indigo-500', xpKey: 'MEASUREMENT', countKey: 'measurements' },
  { key: 'challenges', labelKey: 'level.activities.challenges', Icon: Medal, gradient: 'from-amber-500 to-yellow-500', xpKey: 'CHALLENGE_CHECKIN', countKey: 'challengeCheckIns' },
  { key: 'goals', labelKey: 'level.activities.goals', Icon: Target, gradient: 'from-pink-500 to-rose-500', xpKey: 'GOAL_COMPLETED', countKey: 'goalsCompleted' },
];

const LEVEL_REWARDS: {
  level: number;
  titleKey: string;
  Icon: typeof Star;
  gradient: string;
}[] = [
  { level: 5, titleKey: 'level.ranks.amateur', Icon: Star, gradient: 'from-blue-500 to-emerald-500' },
  { level: 10, titleKey: 'level.ranks.pro', Icon: Rocket, gradient: 'from-emerald-500 to-cyan-500' },
  { level: 15, titleKey: 'level.ranks.master', Icon: Trophy, gradient: 'from-purple-500 to-pink-500' },
  { level: 20, titleKey: 'level.ranks.legend', Icon: Diamond, gradient: 'from-cyan-500 to-blue-600' },
  { level: 30, titleKey: 'level.ranks.superhero', Icon: Zap, gradient: 'from-amber-500 to-orange-500' },
];

function getRankKey(level: number): string {
  if (level >= 30) return 'level.ranks.superhero';
  if (level >= 20) return 'level.ranks.legend';
  if (level >= 15) return 'level.ranks.master';
  if (level >= 10) return 'level.ranks.pro';
  if (level >= 5) return 'level.ranks.amateur';
  return 'level.ranks.beginner';
}

// ==================== Page ====================

export default function LevelPage() {
  const { t, language } = useTranslation();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['xpProfile'],
    queryFn: xpService.getProfile,
  });

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';
  const fmt = (n: number): string => n.toLocaleString(locale);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-64 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-2xl">
          {t('common.error')}
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(
    100,
    Math.round((profile.xpInLevel / profile.xpForNextLevel) * 100)
  );

  const remainingXp = profile.xpForNextLevel - profile.xpInLevel;
  const rankTitle = t(getRankKey(profile.level) as never);

  // ایموجی رتبه رو نگه می‌داریم چون به رنگ‌بندی بهتر کمک می‌کنه
  const rankEmoji = profile.rank.emoji;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Hero Card ===== */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl animate-fade-in-up bg-gradient-to-br ${profile.rank.color}`}
      >
        <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 end-1/4 w-32 h-32 rounded-full bg-white/15 blur-2xl pointer-events-none animate-float" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
                <Sparkles size={14} strokeWidth={2.5} />
                <span>{t('level.currentRank')}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-6xl md:text-7xl drop-shadow-2xl animate-float">
                  {rankEmoji}
                </span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                    {rankTitle}
                  </h1>
                  <p className="text-white/80 text-sm font-medium">
                    {t('level.level')} {fmt(profile.level)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-end shrink-0">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
                {t('level.totalXp')}
              </p>
              <p className="text-4xl md:text-5xl font-bold tracking-tight">
                {fmt(profile.totalXp)}
              </p>
              <p className="text-white/70 text-xs font-bold tracking-widest mt-1">
                XP
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3 text-sm font-medium">
              <span className="text-white/90">
                {fmt(profile.xpInLevel)} / {fmt(profile.xpForNextLevel)} XP
              </span>
              <span className="text-lg font-bold">{progressPercent}%</span>
            </div>

            <div className="relative w-full h-5 rounded-full bg-black/25 backdrop-blur-sm overflow-hidden shadow-inner border border-white/10">
              <div
                className="relative h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background:
                    'linear-gradient(90deg, #fbbf24 0%, #f59e0b 30%, #fbbf24 50%, #fde68a 70%, #fbbf24 100%)',
                  boxShadow:
                    '0 0 20px rgba(251, 191, 36, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer rounded-full" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-sm">
              <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Target size={14} strokeWidth={2.5} />
              </div>
              <span className="text-white/90 font-medium">
                {fmt(remainingXp)} {t('level.xpToNext')} {fmt(profile.level + 1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== XP Breakdown ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-1 card-hover">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <BarChart3 size={22} strokeWidth={2.2} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('level.xpBreakdown')}
          </h2>
        </div>

        <div className="space-y-4">
          {BREAKDOWN_INFO.map((item, index) => {
            const xpValue =
              profile.breakdown[item.key as keyof typeof profile.breakdown];
            const count =
              profile.counts[item.countKey as keyof typeof profile.counts];
            const xpPerItem =
              profile.xpValues[item.xpKey as keyof typeof profile.xpValues];
            const percent =
              profile.totalXp > 0 ? Math.round((xpValue / profile.totalXp) * 100) : 0;
            const ItemIcon = item.Icon;

            return (
              <div
                key={item.key}
                className="animate-fade-in group"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <ItemIcon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {t(item.labelKey as never)}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {fmt(count)} × {fmt(xpPerItem)} XP
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {fmt(xpValue)}
                      <span className="text-xs text-slate-400 dark:text-slate-500 ms-1 font-normal">
                        XP
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      {percent}%
                    </p>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-l ${item.gradient} transition-all duration-1000 ease-out rounded-full shadow-sm`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {t('level.total')}
          </span>
          <span className="text-xl font-bold bg-gradient-to-l from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
            {fmt(profile.totalXp)} XP
          </span>
        </div>
      </div>

      {/* ===== Rank Roadmap ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-2 card-hover">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
            <Trophy size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('level.rankRoadmap')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('level.rankRoadmapDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {LEVEL_REWARDS.map((reward) => {
            const unlocked = profile.level >= reward.level;
            const RewardIcon = reward.Icon;
            return (
              <div
                key={reward.level}
                className={`group relative overflow-hidden rounded-2xl p-4 text-center transition-all duration-300 ${
                  unlocked
                    ? `bg-gradient-to-br ${reward.gradient} text-white shadow-lg hover:scale-105 hover:shadow-2xl cursor-pointer`
                    : 'bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 opacity-70'
                }`}
              >
                {unlocked && (
                  <div className="absolute -top-8 -end-8 w-20 h-20 rounded-full bg-white/20 blur-2xl pointer-events-none" />
                )}

                <div className="relative">
                  <div
                    className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform ${
                      unlocked
                        ? 'bg-white/20 backdrop-blur-sm shadow-lg group-hover:scale-110'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <RewardIcon
                      size={26}
                      strokeWidth={2.2}
                      className={unlocked ? 'text-white' : 'text-slate-400 dark:text-slate-500'}
                    />
                  </div>
                  <p
                    className={`text-xs font-bold mb-0.5 ${
                      unlocked ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {t(reward.titleKey as never)}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${
                      unlocked ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {t('level.level')} {fmt(reward.level)}
                  </p>
                  {unlocked && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm">
                      <Award size={10} strokeWidth={2.5} />
                      <span className="text-[10px] font-bold">
                        {t('level.unlocked')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== How to Gain XP ===== */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200/50 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/30 p-6 shadow-soft animate-fade-in-up delay-3">
        <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Lightbulb size={22} strokeWidth={2.2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('level.howToGain')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BREAKDOWN_INFO.map((item) => {
              const ItemIcon = item.Icon;
              return (
                <div
                  key={item.key}
                  className="group relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl p-3 border border-white dark:border-slate-800 flex items-center gap-3 hover:scale-105 transition-all shadow-sm"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <ItemIcon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate font-medium">
                      {t(item.labelKey as never)}
                    </p>
                    <p className="text-sm font-bold bg-gradient-to-l from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                      +{fmt(profile.xpValues[item.xpKey as keyof typeof profile.xpValues])}{' '}
                      XP
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}