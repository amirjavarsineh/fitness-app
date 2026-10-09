import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { reportService } from '../services/report.service';

export default function ReportPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['weeklyReport'],
    queryFn: reportService.getWeekly,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">گزارش هفتگی</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
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
    date: new Date(d.date).toLocaleDateString('fa-IR', {
      weekday: 'short',
    }),
    کالری_دریافتی: d.caloriesConsumed,
    کالری_سوزانده: d.caloriesBurned,
    مدت_تمرین: d.workoutsDuration,
    تعداد_تمرین: d.workoutsCount,
    آب: d.water,
    وزن: d.weight,
    پروتئین: d.protein,
    کربوهیدرات: d.carbs,
    چربی: d.fat,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">گزارش هفتگی</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          ۷ روز اخیر — {new Date(days[0]?.date).toLocaleDateString('fa-IR')} تا{' '}
          {new Date(days[6]?.date).toLocaleDateString('fa-IR')}
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="animate-fade-in-up delay-1">
            <SummaryCard
              icon="🏋️"
              label="تمرینات"
              value={`${summary.totalWorkouts}`}
              subtitle={`${summary.daysWithWorkouts} روز فعال`}
              color="blue"
            />
          </div>
          <div className="animate-fade-in-up delay-2">
            <SummaryCard
              icon="⏱️"
              label="زمان تمرین"
              value={`${summary.totalDuration}`}
              subtitle="دقیقه در هفته"
              color="purple"
            />
          </div>
          <div className="animate-fade-in-up delay-3">
            <SummaryCard
              icon="🔥"
              label="کالری سوزانده"
              value={`${summary.totalCaloriesBurned}`}
              subtitle={`دریافتی: ${summary.totalCaloriesConsumed}`}
              color="orange"
            />
          </div>
          <div className="animate-fade-in-up delay-4">
            <SummaryCard
              icon="💧"
              label="آب"
              value={`${(summary.totalWater / 1000).toFixed(1)}`}
              subtitle={`میانگین: ${summary.avgWater} ml`}
              color="cyan"
              unit="لیتر"
            />
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calories Chart */}
        <ChartCard title="کالری روزانه" emoji="🔥" delay="delay-1">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="کالری_دریافتی"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="کالری_سوزانده"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Workouts Chart */}
        <ChartCard title="مدت تمرین" emoji="⏱️" delay="delay-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 13,
                }}
                formatter={(value) => [`${value} دقیقه`, 'مدت زمان']}
              />
              <Bar dataKey="مدت_تمرین" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Water Chart */}
        <ChartCard title="مصرف آب" emoji="💧" delay="delay-3">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 13,
                }}
                formatter={(value) => [`${value} ml`, 'آب']}
              />
              <Bar dataKey="آب" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weight Chart */}
        <ChartCard title="روند وزن" emoji="⚖️" delay="delay-4">
          {days.filter((d) => d.weight !== null).length < 2 ? (
            <div className="flex items-center justify-center h-[260px] text-slate-400 dark:text-slate-500 text-sm">
              برای دیدن نمودار وزن، حداقل ۲ روز وزن ثبت کن
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={chartData.filter((d) => d.وزن !== null)}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 12 }} />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: 12 }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                  formatter={(value) => [`${value} kg`, 'وزن']}
                />
                <Line
                  type="monotone"
                  dataKey="وزن"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Macros Chart */}
      <ChartCard title="درشت‌مغذی‌ها (میانگین ۷ روز)" emoji="🥗" delay="delay-5">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: 13,
              }}
              formatter={(value) => [`${value} g`]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="پروتئین" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="کربوهیدرات" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="چربی" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

// --- Sub Components ---

function SummaryCard({
  icon,
  label,
  value,
  subtitle,
  color,
  unit,
}: {
  icon: string;
  label: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'orange' | 'purple' | 'cyan';
  unit?: string;
}) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  }[color];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm card-hover h-full">
      <div className={`w-12 h-12 rounded-xl ${colors} flex items-center justify-center text-2xl mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
        {unit && <span className="text-sm text-slate-400 dark:text-slate-500 mr-1">{unit}</span>}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

function ChartCard({
  title,
  emoji,
  children,
  delay = '',
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
  delay?: string;
}) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up card-hover ${delay}`}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h2>
      {children}
    </div>
  );
}