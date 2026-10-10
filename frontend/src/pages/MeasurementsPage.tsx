import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  X,
  Trash2,
  Ruler,
  Ribbon,
  Heart,
  Circle,
  Dumbbell,
  Zap,
  Footprints,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Calendar,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import { measurementService } from '../services/measurement.service';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Fields ====================

const FIELDS: {
  key: string;
  labelKey: string;
  Icon: typeof Ruler;
  gradient: string;
}[] = [
  { key: 'neck', labelKey: 'measurements.neck', Icon: Ribbon, gradient: 'from-purple-500 to-fuchsia-500' },
  { key: 'chest', labelKey: 'measurements.chest', Icon: Heart, gradient: 'from-blue-500 to-indigo-500' },
  { key: 'waist', labelKey: 'measurements.waist', Icon: Ruler, gradient: 'from-orange-500 to-amber-500' },
  { key: 'hips', labelKey: 'measurements.hips', Icon: Circle, gradient: 'from-pink-500 to-rose-500' },
  { key: 'bicep', labelKey: 'measurements.bicep', Icon: Dumbbell, gradient: 'from-red-500 to-orange-500' },
  { key: 'forearm', labelKey: 'measurements.forearm', Icon: Zap, gradient: 'from-amber-500 to-yellow-500' },
  { key: 'thigh', labelKey: 'measurements.thigh', Icon: Footprints, gradient: 'from-emerald-500 to-teal-500' },
  { key: 'calf', labelKey: 'measurements.calf', Icon: Footprints, gradient: 'from-cyan-500 to-blue-500' },
];

// ==================== Page ====================

export default function MeasurementsPage() {
  const queryClient = useQueryClient();
  const { t, language } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Record<string, string>>({
    neck: '', chest: '', waist: '', hips: '',
    bicep: '', forearm: '', thigh: '', calf: '',
    note: '',
  });

  const { data: measurements, isLoading } = useQuery({
    queryKey: ['measurements'],
    queryFn: measurementService.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: ['measurementStats'],
    queryFn: measurementService.getStats,
  });

  const upsertMutation = useMutation({
    mutationFn: measurementService.upsert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
      queryClient.invalidateQueries({ queryKey: ['measurementStats'] });
      setForm({
        neck: '', chest: '', waist: '', hips: '',
        bicep: '', forearm: '', thigh: '', calf: '',
        note: '',
      });
      setShowForm(false);
      setError('');
    },
    onError: () => setError(t('measurements.saveError')),
  });

  const deleteMutation = useMutation({
    mutationFn: measurementService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
      queryClient.invalidateQueries({ queryKey: ['measurementStats'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payload: Record<string, number | null | string | undefined> = {
      note: form.note || undefined,
    };

    let hasAny = false;
    for (const field of FIELDS) {
      const v = form[field.key];
      if (v !== '' && v !== undefined) {
        const n = Number(v);
        if (!isNaN(n) && n > 0) {
          payload[field.key] = n;
          hasAny = true;
        }
      }
    }

    if (!hasAny) {
      setError(t('measurements.atLeastOne'));
      return;
    }

    upsertMutation.mutate(payload as never);
  };

  const locale = language === 'fa' ? 'fa-IR' : 'en-US';
  const fmt = (n: number): string => n.toLocaleString(locale);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const list = measurements ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
              <Ruler size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('measurements.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {fmt(stats?.count ?? 0)} {t('measurements.count')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-shine flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all hover:scale-105 ${
            showForm
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              : 'bg-gradient-to-l from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
          }`}
        >
          {showForm ? <X size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
          <span>{showForm ? t('measurements.close') : t('measurements.logMeasurement')}</span>
        </button>
      </div>

      {/* ===== Latest Measurements Cards ===== */}
      {stats?.latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FIELDS.map((field, i) => {
            const value = stats.latest![field.key as keyof typeof stats.latest] as number | null;
            if (value === null) return null;
            const change = stats.changes?.[field.key] ?? null;
            const isDown = change !== null && change < 0;
            const isUp = change !== null && change > 0;
            const FieldIcon = field.Icon;

            return (
              <div
                key={field.key}
                className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-soft card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div
                  className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${field.gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity pointer-events-none`}
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${field.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <FieldIcon size={18} strokeWidth={2.5} />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      {t(field.labelKey as never)}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {fmt(value)}
                    <span className="text-xs text-slate-400 dark:text-slate-500 ms-1 font-normal">
                      {t('measurements.cm')}
                    </span>
                  </p>
                  {change !== null && change !== 0 && (
                    <div
                      className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-lg text-xs font-bold ${
                        isDown
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          : isUp
                          ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isDown ? (
                        <TrendingDown size={11} strokeWidth={3} />
                      ) : isUp ? (
                        <TrendingUp size={11} strokeWidth={3} />
                      ) : null}
                      {change > 0 ? '+' : ''}
                      {change} {t('measurements.cm')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Form ===== */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-scale-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Ruler size={22} strokeWidth={2.2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('measurements.newMeasurementTitle')}
            </h2>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <X size={18} strokeWidth={2.5} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Lightbulb size={14} strokeWidth={2.5} />
              <span>{t('measurements.hint')}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FIELDS.map((field) => {
                const FieldIcon = field.Icon;
                return (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <FieldIcon size={12} strokeWidth={2.5} />
                        <span>
                          {t(field.labelKey as never)} ({t('measurements.cm')})
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder="—"
                      className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('measurements.noteLabel')}
              </label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder={t('measurements.notePlaceholder')}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <button
              type="submit"
              disabled={upsertMutation.isPending}
              className="btn-shine w-full h-12 rounded-2xl bg-gradient-to-l from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {upsertMutation.isPending ? t('common.saving') : t('common.save')}
            </button>
          </form>
        </div>
      )}

      {/* ===== Empty State ===== */}
      {list.length === 0 ? (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-teal-500/30 animate-float">
              <Ruler size={48} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('measurements.noMeasurement')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {t('measurements.noMeasurementDesc')}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-teal-500 to-cyan-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:scale-105 transition-all"
            >
              <Plus size={20} strokeWidth={2.5} />
              {t('measurements.start')}
            </button>
          </div>
        </div>
      ) : (
        /* ===== History ===== */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-3 card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center text-white shadow-lg">
              <BarChart3 size={22} strokeWidth={2.2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('measurements.history')}
            </h2>
          </div>

          <div className="space-y-3">
            {[...list].reverse().map((m, i) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-gradient-to-l from-slate-50 to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:from-teal-50 hover:to-cyan-50/50 dark:hover:from-slate-700 dark:hover:to-slate-700/50 transition-all animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                      <Calendar size={18} strokeWidth={2.2} />
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {new Date(m.date).toLocaleDateString(locale)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(t('measurements.deleteConfirm'))) {
                        deleteMutation.mutate(m.id);
                      }
                    }}
                    className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-all hover:scale-110 flex items-center justify-center shadow-sm"
                  >
                    <Trash2 size={16} strokeWidth={2.2} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {FIELDS.map((field) => {
                    const v = m[field.key as keyof typeof m] as number | null;
                    if (v === null) return null;
                    const FieldIcon = field.Icon;
                    return (
                      <span
                        key={field.key}
                        className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs hover:scale-105 transition-transform"
                      >
                        <FieldIcon size={13} strokeWidth={2.5} />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          {t(field.labelKey as never)}:
                        </span>
                        <span
                          className={`font-bold bg-gradient-to-l ${field.gradient} bg-clip-text text-transparent`}
                        >
                          {fmt(v)}
                          <span className="text-[10px] opacity-70 ms-0.5">
                            {t('measurements.cm')}
                          </span>
                        </span>
                      </span>
                    );
                  })}
                </div>

                {m.note && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-start gap-2">
                    <MessageSquare size={13} strokeWidth={2.2} className="mt-0.5 shrink-0" />
                    <span>{m.note}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}