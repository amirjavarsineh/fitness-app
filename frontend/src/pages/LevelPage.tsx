import { useQuery } from '@tanstack/react-query';
import { xpService } from '../services/xp.service';
import { useTranslation } from '../i18n/useTranslation';

const BREAKDOWN_INFO: {
  key: string;
  labelKey: string;
  emoji: string;
  color: string;
  xpKey: string;
  countKey: string;
}[] = [
  {
    key: 'workouts',
    labelKey: 'level.activities.workouts',
    emoji: '🏋️',
    color: 'from-red-400 to-orange-500',
    xpKey: 'WORKOUT',
    countKey: 'workouts',
  },
  {
    key: 'nutrition',
    labelKey: 'level.activities.nutrition',
    emoji: '🍎',
    color: 'from-emerald-400 to-green-500',
    xpKey: 'NUTRITION',
    countKey: 'nutrition',
  },
  {
    key: 'water',
    labelKey: 'level.activities.water',
    emoji: '💧',
    color: 'from-cyan-400 to-blue-500',
    xpKey: 'WATER_DAY',
    countKey: 'waterDays',
  },
  {
    key: 'weight',
    labelKey: 'level.activities.weight',
    emoji: '⚖️',
    color: 'from-purple-400 to-pink-500',
    xpKey: 'WEIGHT',
    countKey: 'weight',
  },
  {
    key: 'measurements',
    labelKey: 'level.activities.measurements',
    emoji: '📏',
    color: 'from-blue-400 to-indigo-500',
    xpKey: 'MEASUREMENT',
    countKey: 'measurements',
  },
  {
    key: 'challenges',
    labelKey: 'level.activities.challenges',
    emoji: '🥇',
    color: 'from-yellow-400 to-amber-500',
    xpKey: 'CHALLENGE_CHECKIN',
    countKey: 'challengeCheckIns',
  },
  {
    key: 'goals',
    labelKey: 'level.activities.goals',
    emoji: '🎯',
    color: 'from-pink-400 to-rose-500',
    xpKey: 'GOAL_COMPLETED',
    countKey: 'goalsCompleted',
  },
];

const LEVEL_REWARDS: { level: number; titleKey: string; emoji: string; color: string }[] = [
  { level: 5, titleKey: 'level.ranks.amateur', emoji: '🐣', color: 'from-blue-400 to-emerald-500' },
  { level: 10, titleKey: 'level.ranks.pro', emoji: '🦅', color: 'from-emerald-400 to-cyan-500' },
  { level: 15, titleKey: 'level.ranks.master', emoji: '🏆', color: 'from-purple-400 to-pink-500' },
  { level: 20, titleKey: 'level.ranks.legend', emoji: '💎', color: 'from-cyan-400 to-blue-500' },
  { level: 30, titleKey: 'level.ranks.superhero', emoji: '⚡', color: 'from-yellow-400 to-orange-500' },
];

function getRankKey(level: number): string {
  if (level >= 30) return 'level.ranks.superhero';
  if (level >= 20) return 'level.ranks.legend';
  if (level >= 15) return 'level.ranks.master';
  if (level >= 10) return 'level.ranks.pro';
  if (level >= 5) return 'level.ranks.amateur';
  return 'level.ranks.beginner';
}

export default function LevelPage() {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['xpProfile'],
    queryFn: xpService.getProfile,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t('level.title')} 💪
        </h1>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 animate-pulse-soft h-96" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl">
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Card */}
      <div
        className={`bg-gradient-to-br ${profile.rank.color} rounded-3xl p-6 md:p-8 text-white shadow-2xl animate-fade-in-up relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-sm mb-1">{t('level.currentRank')}</p>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl md:text-6xl animate-float">
                {profile.rank.emoji}
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{rankTitle}</h1>
                <p className="text-white/80 text-sm mt-0.5">
                  {t('level.level')} {profile.level}
                </p>
              </div>
            </div>
          </div>

          <div className="text-left shrink-0">
            <p className="text-white/80 text-xs mb-1">{t('level.totalXp')}</p>
            <p className="text-3xl md:text-4xl font-bold">
              {profile.totalXp.toLocaleString('fa-IR')}
            </p>
            <p className="text-white/80 text-xs mt-0.5">XP</p>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-white/90">
              {profile.xpInLevel.toLocaleString('fa-IR')} /{' '}
              {profile.xpForNextLevel.toLocaleString('fa-IR')} XP
            </span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-white/90 text-xs mt-2 flex items-center gap-1">
            <span>🎯</span>
            <span>
              {remainingXp.toLocaleString('fa-IR')} {t('level.xpToNext')}{' '}
              {profile.level + 1}
            </span>
          </p>
        </div>
      </div>

      {/* XP Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-1 card-hover">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📊</span> {t('level.xpBreakdown')}
        </h2>

        <div className="space-y-3">
          {BREAKDOWN_INFO.map((item, index) => {
            const xpValue =
              profile.breakdown[item.key as keyof typeof profile.breakdown];
            const count =
              profile.counts[item.countKey as keyof typeof profile.counts];
            const xpPerItem =
              profile.xpValues[item.xpKey as keyof typeof profile.xpValues];
            const percent =
              profile.totalXp > 0 ? Math.round((xpValue / profile.totalXp) * 100) : 0;

            return (
              <div
                key={item.key}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t(item.labelKey as never)}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      ({count} × {xpPerItem})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {xpValue.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">XP</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-l ${item.color} transition-all duration-700 ease-out`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('level.total')}
          </span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {profile.totalXp.toLocaleString('fa-IR')} XP
          </span>
        </div>
      </div>

      {/* Level Rewards Roadmap */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-2 card-hover">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🗺️</span> {t('level.rankRoadmap')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {t('level.rankRoadmapDesc')}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {LEVEL_REWARDS.map((reward) => {
            const unlocked = profile.level >= reward.level;
            return (
              <div
                key={reward.level}
                className={`rounded-xl p-4 text-center transition-all ${
                  unlocked
                    ? `bg-gradient-to-br ${reward.color} text-white shadow-lg hover:scale-105`
                    : 'bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div
                  className={`text-3xl mb-2 ${
                    unlocked ? 'animate-float' : 'grayscale opacity-50'
                  }`}
                >
                  {reward.emoji}
                </div>
                <p
                  className={`text-xs font-bold mb-0.5 ${
                    unlocked ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t(reward.titleKey as never)}
                </p>
                <p
                  className={`text-[10px] ${
                    unlocked
                      ? 'text-white/80'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {t('level.level')} {reward.level}
                </p>
                {unlocked && (
                  <p className="text-[10px] text-white/90 mt-1 font-medium">
                    ✓ {t('level.unlocked')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* How to gain XP */}
      <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/40 dark:to-cyan-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 p-6 shadow-sm animate-fade-in-up delay-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>💡</span> {t('level.howToGain')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BREAKDOWN_INFO.map((item) => (
            <div
              key={item.key}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-3 border border-white dark:border-slate-800 flex items-center gap-2"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {t(item.labelKey as never)}
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  +{profile.xpValues[item.xpKey as keyof typeof profile.xpValues]} XP
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}