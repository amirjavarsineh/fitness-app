import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Plus,
  X,
  Trash2,
  Scale,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  LineChart as LineChartIcon,
  Lightbulb,
  Star,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { progressService } from '../services/progress.service';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Page ====================

export default function ProgressPage() {
  const queryClient = useQueryClient();
  const { t, language } = useTranslation();
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
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setWeight('');
      setNote('');
      setShowForm(false);
      setError('');
    },
    onError: () => setError(t('progress.saveError')),
  });

  const deleteMutation = useMutation({
    mutationFn: progressService.removeWeight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightLogs'] });
      queryClient.invalidateQueries({ queryKey: ['weightStats'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = Number(weight);
    if (!weight || isNaN(w) || w <= 0) {
      setError(t('progress.weightInvalid'));
      return;
    }
    upsertMutation.mutate({
      weight: w,
      note: note.trim() || undefined,
    });
  };

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';
  const fmt = (n: number): string => n.toLocaleString(locale);

  if (logsLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  const chartData = (logs ?? []).map((log) => ({
    date: new Date(log.date).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
    }),
    weight: log.weight,
  }));

  const tooltipStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    fontSize: 13,
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
  } as const;

  const changeIsDown = (stats?.change ?? 0) < 0;
  const changeIsUp = (stats?.change ?? 0) > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg">
              <Scale size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('progress.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {fmt(stats?.count ?? 0)} {t('progress.count')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setWeight('');
              setNote('');
              setError('');
            } else {
              setShowForm(true);
            }
          }}
          className={`btn-shine flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all hover:scale-105 ${
            showForm
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              : 'bg-gradient-to-l from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
          }`}
        >
          {showForm ? <X size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
          <span>{showForm ? t('progress.close') : t('progress.logWeight')}</span>
        </button>
      </div>

      {/* ===== Stats Cards ===== */}
      {stats && stats.count > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="animate-fade-in-up delay-1">
            <StatCard
              Icon={Scale}
              label={t('progress.currentWeight')}
              value={stats.current?.toFixed(1) ?? '—'}
              unit="kg"
              gradient="from-violet-500 to-fuchsia-500"
            />
          </div>
          <div className="animate-fade-in-up delay-2">
            <StatCard
              Icon={Target}
              label={t('progress.startWeight')}
              value={stats.start?.toFixed(1) ?? '—'}
              unit="kg"
              gradient="from-blue-500 to-indigo-500"
            />
          </div>
          <div className="animate-fade-in-up delay-3">
            <StatCard
              Icon={changeIsDown ? TrendingDown : changeIsUp ? TrendingUp : Minus}
              label={t('progress.change')}
              value={
                stats.change === 0
                  ? '0'
                  : stats.change > 0
                  ? `+${stats.change}`
                  : `${stats.change}`
              }
              unit="kg"
              gradient={
                changeIsDown
                  ? 'from-emerald-500 to-teal-500'
                  : changeIsUp
                  ? 'from-red-500 to-rose-500'
                  : 'from-slate-500 to-slate-600'
              }
            />
          </div>
          <div className="animate-fade-in-up delay-4">
            <StatCard
              Icon={BarChart3}
              label={t('progress.range')}
              value={`${stats.min?.toFixed(1)} - ${stats.max?.toFixed(1)}`}
              unit="kg"
              gradient="from-orange-500 to-amber-500"
              isText
            />
          </div>
        </div>
      )}

      {/* ===== Form ===== */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-scale-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
              <Scale size={22} strokeWidth={2.2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('progress.newWeightTitle')}
            </h2>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <X size={18} strokeWidth={2.5} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('progress.weightLabel')} *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={t('progress.weightPlaceholder')}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-violet-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('progress.noteLabel')}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t('progress.notePlaceholder')}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-violet-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Lightbulb size={14} strokeWidth={2.5} />
              <span>{t('progress.hint')}</span>
            </div>

            <button
              type="submit"
              disabled={upsertMutation.isPending}
              className="btn-shine w-full h-12 rounded-2xl bg-gradient-to-l from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {upsertMutation.isPending ? t('common.saving') : t('common.save')}
            </button>
          </form>
        </div>
      )}

      {/* ===== Empty State ===== */}
      {chartData.length === 0 ? (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-violet-500/30 animate-float">
              <LineChartIcon size={48} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('progress.noWeight')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {t('progress.noWeightDesc')}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:scale-105 transition-all"
            >
              <Plus size={20} strokeWidth={2.5} />
              {t('progress.start')}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ===== Chart ===== */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up card-hover">
            <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
                  <LineChartIcon size={22} strokeWidth={2.2} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('progress.weightChart')}
                </h2>
              </div>

              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
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
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#weightGradient)"
                      dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ===== History ===== */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-2 card-hover">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center text-white shadow-lg">
                <BarChart3 size={22} strokeWidth={2.2} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('progress.history')}
              </h2>
            </div>

            <div className="space-y-2">
              {[...(logs ?? [])].reverse().map((log, i) => {
                const isFirst = i === 0;
                const prevLog = [...(logs ?? [])].reverse()[i + 1];
                const diff = prevLog ? log.weight - prevLog.weight : 0;
                const isDown = diff < 0;
                const isUp = diff > 0;

                return (
                  <div
                    key={log.id}
                    className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-l from-slate-50 to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:from-violet-50 hover:to-fuchsia-50/50 dark:hover:from-slate-700 dark:hover:to-slate-700/50 transition-all gap-3 animate-fade-in"
                    style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                        {isFirst && (
                          <Star
                            size={14}
                            strokeWidth={2.5}
                            className="absolute -top-1 -end-1 text-amber-400 fill-amber-400"
                          />
                        )}
                        <Scale size={20} strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {fmt(log.weight)} kg
                          </p>
                          {!isFirst && diff !== 0 && (
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-lg ${
                                isDown
                                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              }`}
                            >
                              {isDown ? (
                                <ArrowDown size={11} strokeWidth={3} />
                              ) : (
                                <ArrowUp size={11} strokeWidth={3} />
                              )}
                              {Math.abs(diff).toFixed(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {new Date(log.date).toLocaleDateString(locale)}
                          {log.note && ` • ${log.note}`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(t('progress.deleteConfirm'))) {
                          deleteMutation.mutate(log.id);
                        }
                      }}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-all hover:scale-110 shrink-0 flex items-center justify-center shadow-sm"
                    >
                      <Trash2 size={16} strokeWidth={2.2} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== Sub Components ====================

function StatCard({
  Icon,
  label,
  value,
  unit,
  gradient,
  isText = false,
}: {
  Icon: typeof Scale;
  label: string;
  value: string;
  unit: string;
  gradient: string;
  isText?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-soft hover:shadow-elevated transition-all card-hover">
      <div
        className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}
        >
          <Icon size={24} strokeWidth={2.2} />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1">
          {label}
        </p>
        <p
          className={`${
            isText ? 'text-base' : 'text-2xl'
          } font-bold text-slate-900 dark:text-white tracking-tight`}
        >
          {value}
          {!isText && (
            <span className="text-xs text-slate-400 dark:text-slate-500 ms-1 font-normal">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}