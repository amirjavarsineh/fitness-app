import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { progressService } from '../services/progress.service';

export default function ProgressPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['weightLogs'],
    queryFn: progressService.getWeightLogs,
  });

  const { data: stats } = useQuery({
    queryKey: ['weightStats'],
    queryFn: progressService.getWeightStats,
  });

  const upsertMutation = useMutation({
    mutationFn: progressService.upsertWeight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightLogs'] });
      queryClient.invalidateQueries({ queryKey: ['weightStats'] });
      setWeight('');
      setNote('');
      setShowForm(false);
      setError('');
    },
    onError: () => setError('خطا در ذخیره‌سازی'),
  });

  const deleteMutation = useMutation({
    mutationFn: progressService.removeWeight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightLogs'] });
      queryClient.invalidateQueries({ queryKey: ['weightStats'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = Number(weight);
    if (!weight || isNaN(w) || w <= 0) {
      setError('وزن باید یه عدد مثبت باشه');
      return;
    }
    upsertMutation.mutate({
      weight: w,
      note: note.trim() || undefined,
    });
  };

  if (logsLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">پیشرفت وزن</h1>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-pulse-soft h-80" />
      </div>
    );
  }

  // آماده‌سازی داده برای نمودار
  const chartData = (logs ?? []).map((log) => ({
    date: new Date(log.date).toLocaleDateString('fa-IR', {
      month: 'short',
      day: 'numeric',
    }),
    weight: log.weight,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">پیشرفت وزن</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {stats?.count ?? 0} ثبت وزن
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all hover:scale-105 ${
            showForm
              ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              : 'bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/30'
          }`}
        >
          <span className="text-lg">{showForm ? '✕' : '+'}</span>
          <span>{showForm ? 'بستن' : 'ثبت وزن'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && stats.count > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="animate-fade-in-up delay-1">
            <StatCard
              label="وزن فعلی"
              value={stats.current?.toFixed(1) ?? '—'}
              unit="kg"
              color="blue"
              icon="⚖️"
            />
          </div>
          <div className="animate-fade-in-up delay-2">
            <StatCard
              label="وزن شروع"
              value={stats.start?.toFixed(1) ?? '—'}
              unit="kg"
              color="purple"
              icon="🎯"
            />
          </div>
          <div className="animate-fade-in-up delay-3">
            <StatCard
              label="تغییر"
              value={
                stats.change === 0
                  ? '0'
                  : stats.change > 0
                  ? `+${stats.change}`
                  : `${stats.change}`
              }
              unit="kg"
              color={stats.change < 0 ? 'emerald' : stats.change > 0 ? 'red' : 'slate'}
              icon={stats.change < 0 ? '📉' : stats.change > 0 ? '📈' : '➡️'}
            />
          </div>
          <div className="animate-fade-in-up delay-4">
            <StatCard
              label="بازه"
              value={`${stats.min?.toFixed(1)} - ${stats.max?.toFixed(1)}`}
              unit="kg"
              color="orange"
              icon="📊"
              isText
            />
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">ثبت وزن جدید</h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  وزن (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="مثلاً 80.5"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  یادداشت (اختیاری)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="مثلاً بعد از ورزش"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              💡 اگه امروز قبلاً وزن ثبت کرده باشی، آپدیت می‌شه.
            </div>

            <button
              type="submit"
              disabled={upsertMutation.isPending}
              className="w-full h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {upsertMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
            </button>
          </form>
        </div>
      )}

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-float">📈</div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            هنوز وزنی ثبت نکردی
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            با ثبت وزن روزانه، روند پیشرفتت رو ببین
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all hover:scale-105"
          >
            شروع کن
          </button>
        </div>
      ) : (
        <>
          {/* Chart Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 animate-fade-in-up card-hover">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📈</span> روند وزن
            </h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    style={{ fontSize: 12 }}
                  />
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
                      fontSize: 14,
                    }}
                    labelStyle={{ color: '#475569' }}
                    formatter={(value) => [`${value} kg`, 'وزن']}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-2 card-hover">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📋</span> تاریخچه
            </h2>
            <div className="space-y-2">
              {[...(logs ?? [])].reverse().map((log, i) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors animate-fade-in"
                  style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {log.weight} kg
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {new Date(log.date).toLocaleDateString('fa-IR')}
                      {log.note && ` • ${log.note}`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('این ثبت حذف بشه؟')) {
                        deleteMutation.mutate(log.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 text-sm transition-all hover:scale-110"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Sub Components ---

function StatCard({
  label,
  value,
  unit,
  color,
  icon,
  isText = false,
}: {
  label: string;
  value: string;
  unit: string;
  color: 'blue' | 'purple' | 'emerald' | 'red' | 'slate' | 'orange';
  icon: string;
  isText?: boolean;
}) {
  const colors = {
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400',
    emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400',
    red: 'text-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-400',
    slate: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
    orange: 'text-orange-500 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400',
  }[color];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm card-hover h-full">
      <div
        className={`w-10 h-10 rounded-xl ${colors} flex items-center justify-center text-lg mx-auto mb-2`}
      >
        {icon}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className={`${isText ? 'text-sm' : 'text-xl'} font-bold text-slate-900 dark:text-white`}>
        {value}
        {!isText && <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">{unit}</span>}
      </p>
    </div>
  );
}