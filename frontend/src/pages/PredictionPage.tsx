import { useQuery } from '@tanstack/react-query';
import {
  Brain,
  Scale,
  Target,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Dumbbell,
  Droplets,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Info,
  Lightbulb,
  Activity,
} from 'lucide-react';
import { predictionService, type GoalPrediction } from '../services/prediction.service';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Page ====================

export default function PredictionPage() {
  const { t, language } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: predictionService.getAll,
  });

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';
  const fmt = (n: number): string => n.toLocaleString(locale);

  const formatDate = (iso: string | null): string => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDays = (days: number): string => {
    if (days === 0) return '—';
    if (days < 7) return `${fmt(days)} ${language === 'fa' ? 'روز' : 'days'}`;
    if (days < 30)
      return `${fmt(Math.round(days / 7))} ${language === 'fa' ? 'هفته' : 'weeks'}`;
    if (days < 365)
      return `${fmt(Math.round(days / 30))} ${language === 'fa' ? 'ماه' : 'months'}`;
    return `${(days / 365).toFixed(1)} ${language === 'fa' ? 'سال' : 'years'}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-72 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 p-4 rounded-2xl">
          {t('common.error')}
        </div>
      </div>
    );
  }

  const { predictions } = data;
  const { weight, workouts, water, calories, goals } = predictions;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg">
            <Brain size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('prediction.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('prediction.subtitle')}
          </p>
        </div>
      </div>

      {/* ===== Weight Prediction Hero ===== */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 animate-fade-in-up delay-1">
        <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-20 w-64 h-64 rounded-full bg-violet-300/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 end-1/4 w-32 h-32 rounded-full bg-white/15 blur-2xl pointer-events-none animate-float" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <Scale size={30} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{t('prediction.weightPrediction')}</h2>
                <p className="text-white/70 text-xs mt-0.5">
                  {fmt(weight.dataPoints)} {t('prediction.dataPoints')}
                </p>
              </div>
            </div>
            <Sparkles size={20} strokeWidth={2.5} />
          </div>

          {!weight.enoughData ? (
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <p className="font-bold mb-1 flex items-center gap-2">
                <Info size={18} strokeWidth={2.2} />
                {t('prediction.noData')}
              </p>
              <p className="text-white/80 text-sm">{t('prediction.noDataDesc')}</p>
            </div>
          ) : !weight.target ? (
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <p className="font-bold mb-1 flex items-center gap-2">
                <Target size={18} strokeWidth={2.2} />
                {t('prediction.noTarget')}
              </p>
              <p className="text-white/80 text-sm">{t('prediction.noTargetDesc')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <StatBox
                  label={t('prediction.currentWeight')}
                  value={fmt(weight.current ?? 0)}
                  unit="kg"
                />
                <StatBox
                  label={t('prediction.target')}
                  value={fmt(weight.target)}
                  unit="kg"
                />
                <StatBox
                  label={t('prediction.weeklyTrend')}
                  value={`${weight.trendPerWeek > 0 ? '+' : ''}${weight.trendPerWeek}`}
                  unit="kg"
                />
              </div>

              {weight.prediction ? (
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/25">
                  <p className="text-sm text-white/90 font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                    {t('prediction.willReach')}
                  </p>
                  <p className="text-4xl font-bold mb-2">
                    {formatDays(weight.prediction.days)}
                  </p>
                  <p className="text-xs text-white/80 flex items-center gap-1.5">
                    <Calendar size={12} strokeWidth={2.5} />
                    <span>
                      {t('prediction.about')} {formatDate(weight.prediction.date)}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/25">
                  <p className="font-bold mb-1 flex items-center gap-2">
                    <AlertTriangle size={18} strokeWidth={2.2} />
                    {t('prediction.badTrend')}
                  </p>
                  <p className="text-white/80 text-sm">
                    {t('prediction.badTrendDesc')}
                  </p>
                </div>
              )}

              {weight.in30Days !== null && weight.in60Days !== null && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                    <p className="text-xs text-white/70 font-semibold mb-1">
                      {t('prediction.in30Days')}
                    </p>
                    <p className="text-2xl font-bold">
                      {fmt(weight.in30Days)}{' '}
                      <span className="text-sm font-normal">kg</span>
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                    <p className="text-xs text-white/70 font-semibold mb-1">
                      {t('prediction.in60Days')}
                    </p>
                    <p className="text-2xl font-bold">
                      {fmt(weight.in60Days)}{' '}
                      <span className="text-sm font-normal">kg</span>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ===== Workouts + Water ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PredictionCard
          Icon={Dumbbell}
          title={t('prediction.workoutsPrediction')}
          gradient="from-rose-500 to-orange-500"
          delay="delay-2"
        >
          {!workouts.enoughData ? (
            <EmptyState t={t} />
          ) : (
            <div className="space-y-3">
              <Row
                Icon={Activity}
                label={t('prediction.weeklyAvg')}
                value={fmt(workouts.avgWorkoutsPerWeek)}
                color="text-rose-600 dark:text-rose-400"
              />
              <Row
                Icon={Calendar}
                label={t('prediction.last30Days')}
                value={fmt(workouts.last30Days)}
                color="text-slate-900 dark:text-white"
              />

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 border border-rose-200 dark:border-rose-800/50 p-4">
                <div className="absolute -top-12 -end-12 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
                <div className="relative">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                    <Sparkles size={12} strokeWidth={2.5} />
                    {t('prediction.next30Days')}
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-l from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 bg-clip-text text-transparent">
                    {fmt(workouts.predictedWorkoutsNext30Days)}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ms-2">
                      {t('prediction.workoutsUnit')}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </PredictionCard>

        <PredictionCard
          Icon={Droplets}
          title={t('prediction.waterPrediction')}
          gradient="from-cyan-500 to-blue-500"
          delay="delay-3"
        >
          {!water.enoughData ? (
            <EmptyState t={t} />
          ) : (
            <div className="space-y-3">
              <Row
                Icon={Droplets}
                label={t('prediction.dailyAvg')}
                value={`${fmt(water.avgDaily)} ml`}
                color="text-cyan-600 dark:text-cyan-400"
              />
              <Row
                Icon={Target}
                label={t('prediction.reachingGoal')}
                value={`${fmt(water.successRate)}%`}
                color="text-emerald-600 dark:text-emerald-400"
              />
              <Row
                Icon={CheckCircle2}
                label={t('prediction.successfulDays')}
                value={`${fmt(water.metDays)} / ${fmt(water.totalDays)}`}
                color="text-slate-900 dark:text-white"
              />

              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-l from-cyan-400 via-sky-500 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${water.successRate}%` }}
                />
              </div>
            </div>
          )}
        </PredictionCard>
      </div>

      {/* ===== Calories ===== */}
      <PredictionCard
        Icon={Flame}
        title={t('prediction.caloriesPrediction')}
        gradient="from-orange-500 to-red-500"
        delay="delay-4"
      >
        {!calories.enoughData ? (
          <EmptyState t={t} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Bubble
              Icon={Flame}
              label={t('prediction.dailyAvg')}
              value={fmt(calories.avgDaily)}
              unit="kcal"
              gradient="from-orange-500 to-red-500"
            />
            <Bubble
              Icon={TrendingUp}
              label={t('prediction.maxDay')}
              value={fmt(calories.maxDay)}
              unit="kcal"
              gradient="from-red-500 to-rose-600"
            />
            <Bubble
              Icon={TrendingDown}
              label={t('prediction.minDay')}
              value={fmt(calories.minDay)}
              unit="kcal"
              gradient="from-emerald-500 to-teal-500"
            />
            <Bubble
              Icon={Sparkles}
              label={t('prediction.weekPrediction')}
              value={fmt(calories.predictedNext7Days)}
              unit="kcal"
              gradient="from-violet-500 to-purple-600"
            />
          </div>
        )}
      </PredictionCard>

      {/* ===== Goals ===== */}
      <PredictionCard
        Icon={Target}
        title={t('prediction.goalsPrediction')}
        gradient="from-pink-500 to-rose-500"
        delay="delay-5"
      >
        {goals.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
            {t('prediction.noActiveGoals')}
          </p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalPredictionCard
                key={goal.id}
                goal={goal}
                t={t}
                formatDays={formatDays}
                formatDate={formatDate}
                fmt={fmt}
              />
            ))}
          </div>
        )}
      </PredictionCard>

      {/* ===== How it works ===== */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-200/50 dark:border-violet-900/50 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-violet-950/30 dark:via-fuchsia-950/20 dark:to-pink-950/30 p-6 shadow-soft animate-fade-in-up delay-6">
        <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-pink-400/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
              <Lightbulb size={22} strokeWidth={2.2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('prediction.howItWorks')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('prediction.howItWorksDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== Sub Components ====================

function StatBox({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 text-center border border-white/15">
      <p className="text-[11px] text-white/80 font-medium mb-1">{label}</p>
      <p className="text-xl font-bold">
        {value}
        <span className="text-[10px] font-normal ms-1 opacity-80">{unit}</span>
      </p>
    </div>
  );
}

function PredictionCard({
  Icon,
  title,
  gradient,
  delay,
  children,
}: {
  Icon: typeof Brain;
  title: string;
  gradient: string;
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up ${delay} card-hover`}
    >
      <div
        className={`absolute -top-20 -end-20 w-64 h-64 rounded-full bg-gradient-to-br ${gradient} opacity-[0.05] group-hover:opacity-[0.1] blur-3xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
          >
            <Icon size={22} strokeWidth={2.2} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({
  Icon,
  label,
  value,
  color,
}: {
  Icon: typeof Brain;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
      <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
        <Icon size={14} strokeWidth={2.5} />
        {label}
      </span>
      <span className={`text-base font-bold ${color}`}>{value}</span>
    </div>
  );
}

function Bubble({
  Icon,
  label,
  value,
  unit,
  gradient,
}: {
  Icon: typeof Brain;
  label: string;
  value: string;
  unit: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 p-4 text-center hover:scale-105 transition-transform">
      <div
        className={`absolute -top-8 -end-8 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-15 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mx-auto mb-2 shadow-lg`}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-2">
          {label}
        </p>
        <p className="text-xl font-bold text-slate-900 dark:text-white">
          {value}
          <span className="text-[10px] text-slate-400 dark:text-slate-500 ms-1 font-normal">
            {unit}
          </span>
        </p>
      </div>
    </div>
  );
}

function EmptyState({ t }: { t: (key: never) => string }) {
  return (
    <div className="text-center py-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-slate-500">
        <Activity size={26} strokeWidth={2} />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t('prediction.notEnoughData' as never)}
      </p>
    </div>
  );
}

function GoalPredictionCard({
  goal,
  t,
  formatDays,
  formatDate,
  fmt,
}: {
  goal: GoalPrediction;
  t: (key: never) => string;
  formatDays: (days: number) => string;
  formatDate: (iso: string | null) => string;
  fmt: (n: number) => string;
}) {
  const progressColor = goal.onTrack
    ? 'from-emerald-500 to-teal-500'
    : 'from-orange-500 to-red-500';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {goal.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {fmt(goal.currentValue)} / {fmt(goal.targetValue)}
          </p>
        </div>
        <div
          className={`text-lg font-bold bg-gradient-to-l ${progressColor} bg-clip-text text-transparent`}
        >
          {fmt(goal.progress)}%
        </div>
      </div>

      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-l ${progressColor} transition-all duration-1000 ease-out`}
          style={{ width: `${goal.progress}%` }}
        />
      </div>

      {goal.estimatedDays > 0 && goal.estimatedDate ? (
        <div
          className={`flex items-start gap-3 p-3 rounded-xl ${
            goal.onTrack
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50'
              : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              goal.onTrack ? 'bg-emerald-500' : 'bg-orange-500'
            } text-white shadow-lg`}
          >
            {goal.onTrack ? (
              <CheckCircle2 size={18} strokeWidth={2.5} />
            ) : (
              <AlertTriangle size={18} strokeWidth={2.5} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-bold mb-0.5 ${
                goal.onTrack
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-orange-700 dark:text-orange-300'
              }`}
            >
              {goal.onTrack
                ? t('prediction.onTrack' as never)
                : `${t('prediction.lateBy' as never)} ${fmt(goal.daysLate)} ${t(
                    'prediction.daysLater' as never
                  )}`}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {t('prediction.estimate' as never)}: {formatDays(goal.estimatedDays)} •{' '}
              {formatDate(goal.estimatedDate)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">
          {t('prediction.notEnoughData' as never)}
        </p>
      )}
    </div>
  );
}