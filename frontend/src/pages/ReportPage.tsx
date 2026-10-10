import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Dumbbell,
  Clock,
  Flame,
  Droplets,
  Scale,
  Salad,
  TrendingUp,
  Calendar,
  UtensilsCrossed,
} from 'lucide-react';
import { reportService } from '../services/report.service';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Page ====================

export default function ReportPage() {
  const { t, language } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['weeklyReport'],
    queryFn: reportService.getWeekly,
  });

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';
  const fmt = (n: number): string => n.toLocaleString(locale);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const report = data;
  const days = report?.days ?? [];
  const summary = report?.summary;

  const chartData = days.map((d) => ({
    date: new Date(d.date).toLocaleDateString(locale, { weekday: 'short' }),
    caloriesConsumed: d.caloriesConsumed,
    caloriesBurned: d.caloriesBurned,
    workoutDuration: d.workoutsDuration,
    workoutsCount: d.workoutsCount,
    water: d.water,
    weight: d.weight,
    protein: d.protein,
    carbs: d.carbs,
    fat: d.fat,
  }));

  const weightPoints = chartData.filter((d) => d.weight !== null);

  const tooltipStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    fontSize: 13,
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
  } as const;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up flex-wrap">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
            <BarChart3 size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('report.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
            <Calendar size={14} strokeWidth={2.5} />
            <span>
              {t('report.subtitle')} —{' '}
              {days[0]?.date
                ? new Date(days[0].date).toLocaleDateString(locale)
                : ''}{' '}
              {t('report.to')}{' '}
              {days[6]?.date
                ? new Date(days[6].date).toLocaleDateString(locale)
                : ''}
            </span>
          </p>
        </div>
      </div>

      {/* ===== Summary Cards ===== */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="animate-fade-in-up delay-1">
            <SummaryCard
              Icon={Dumbbell}
              label={t('report.summaryWorkouts')}
              value={fmt(summary.totalWorkouts)}
              subtitle={`${fmt(summary.daysWithWorkouts)} ${t('report.activeDays')}`}
              gradient="from-blue-500 to-indigo-600"
            />
          </div>
          <div className="animate-fade-in-up delay-2">
            <SummaryCard
              Icon={Clock}
              label={t('report.summaryDuration')}
              value={fmt(summary.totalDuration)}
              subtitle={t('report.minutesPerWeek')}
              gradient="from-violet-500 to-purple-600"
            />
          </div>
          <div className="animate-fade-in-up delay-3">
            <SummaryCard
              Icon={Flame}
              label={t('report.summaryCaloriesBurned')}
              value={fmt(summary.totalCaloriesBurned)}
              subtitle={`${t('report.consumed')}: ${fmt(summary.totalCaloriesConsumed)}`}
              gradient="from-orange-500 to-rose-500"
            />
          </div>
          <div className="animate-fade-in-up delay-4">
            <SummaryCard
              Icon={Droplets}
              label={t('report.summaryWater')}
              value={`${(summary.totalWater / 1000).toFixed(1)}`}
              subtitle={`${t('report.avg')}: ${fmt(summary.avgWater)} ${t('report.ml')}`}
              gradient="from-cyan-500 to-blue-600"
              unit={t('report.liters')}
            />
          </div>
        </div>
      )}

      {/* ===== Charts Grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calories Chart */}
        <ChartCard
          Icon={Flame}
          title={t('report.dailyCalories')}
          gradient="from-orange-500 to-rose-500"
          delay="delay-1"
        >
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="consumedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="burnedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="caloriesConsumed"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fill="url(#consumedGrad)"
                  name={t('report.caloriesConsumed')}
                />
                <Area
                  type="monotone"
                  dataKey="caloriesBurned"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="url(#burnedGrad)"
                  name={t('report.caloriesBurned')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Workouts Chart */}
        <ChartCard
          Icon={Clock}
          title={t('report.workoutDuration')}
          gradient="from-violet-500 to-purple-600"
          delay="delay-2"
        >
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="workoutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    `${value} ${t('report.minutes')}`,
                    t('report.duration'),
                  ]}
                />
                <Bar
                  dataKey="workoutDuration"
                  fill="url(#workoutGrad)"
                  radius={[8, 8, 0, 0]}
                  name={t('report.duration')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Water Chart */}
        <ChartCard
          Icon={Droplets}
          title={t('report.waterIntake')}
          gradient="from-cyan-500 to-blue-600"
          delay="delay-3"
        >
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value} ${t('report.ml')}`, t('report.water')]}
                />
                <Bar
                  dataKey="water"
                  fill="url(#waterGrad)"
                  radius={[8, 8, 0, 0]}
                  name={t('report.water')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Weight Chart */}
        <ChartCard
          Icon={Scale}
          title={t('report.weightTrend')}
          gradient="from-emerald-500 to-teal-600"
          delay="delay-4"
        >
          {weightPoints.length < 2 ? (
            <div className="flex items-center justify-center h-[260px] text-slate-400 dark:text-slate-500 text-sm px-4 text-center">
              {t('report.notEnoughWeightData')}
            </div>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={weightPoints}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="weightReportGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: 11 }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} ${t('report.kg')}`, t('report.weight')]}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#weightReportGrad)"
                    dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                    name={t('report.weight')}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* ===== Macros Chart ===== */}
      <ChartCard
        Icon={Salad}
        title={t('report.macrosAvg7Days')}
        gradient="from-emerald-500 to-green-600"
        delay="delay-5"
      >
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="proteinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="carbsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value} g`]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="protein"
                fill="url(#proteinGrad)"
                radius={[6, 6, 0, 0]}
                name={t('report.protein')}
              />
              <Bar
                dataKey="carbs"
                fill="url(#carbsGrad)"
                radius={[6, 6, 0, 0]}
                name={t('report.carbs')}
              />
              <Bar
                dataKey="fat"
                fill="url(#fatGrad)"
                radius={[6, 6, 0, 0]}
                name={t('report.fat')}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}

// ==================== Sub Components ====================

function SummaryCard({
  Icon,
  label,
  value,
  subtitle,
  gradient,
  unit,
}: {
  Icon: typeof BarChart3;
  label: string;
  value: string;
  subtitle: string;
  gradient: string;
  unit?: string;
}) {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all card-hover">
      <div
        className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}
        >
          <Icon size={24} strokeWidth={2.2} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
          {unit && (
            <span className="text-xs text-slate-400 dark:text-slate-500 ms-1 font-normal">
              {unit}
            </span>
          )}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function ChartCard({
  Icon,
  title,
  gradient,
  delay,
  children,
}: {
  Icon: typeof BarChart3;
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
        className={`absolute -top-20 -end-20 w-64 h-64 rounded-full bg-gradient-to-br ${gradient} opacity-[0.04] group-hover:opacity-[0.08] blur-3xl transition-opacity pointer-events-none`}
      />

      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
          >
            <Icon size={22} strokeWidth={2.2} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}