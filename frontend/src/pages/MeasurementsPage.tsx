import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { measurementService } from '../services/measurement.service';

const FIELDS: { key: string; label: string; emoji: string; color: string }[] = [
  { key: 'neck', label: 'گردن', emoji: '🧣', color: 'text-purple-600 dark:text-purple-400' },
  { key: 'chest', label: 'سینه', emoji: '🫁', color: 'text-blue-600 dark:text-blue-400' },
  { key: 'waist', label: 'کمر', emoji: '📏', color: 'text-orange-600 dark:text-orange-400' },
  { key: 'hips', label: 'باسن', emoji: '🍑', color: 'text-pink-600 dark:text-pink-400' },
  { key: 'bicep', label: 'بازو', emoji: '💪', color: 'text-red-600 dark:text-red-400' },
  { key: 'forearm', label: 'ساعد', emoji: '🦾', color: 'text-yellow-600 dark:text-yellow-400' },
  { key: 'thigh', label: 'ران', emoji: '🦵', color: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'calf', label: 'ساق', emoji: '🦶', color: 'text-cyan-600 dark:text-cyan-400' },
];

export default function MeasurementsPage() {
  const queryClient = useQueryClient();
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
    onError: () => setError('خطا در ذخیره‌سازی'),
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
      setError('حداقل یکی از اندازه‌ها رو وارد کن');
      return;
    }

    upsertMutation.mutate(payload as never);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">اندازه‌های بدن</h1>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-pulse-soft h-80" />
      </div>
    );
  }

  const list = measurements ?? [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">اندازه‌های بدن 📏</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {stats?.count ?? 0} ثبت اندازه
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
          <span>{showForm ? 'بستن' : 'ثبت اندازه'}</span>
        </button>
      </div>

      {/* Latest Measurements Cards */}
      {stats?.latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {FIELDS.map((field, i) => {
            const value = stats.latest![field.key as keyof typeof stats.latest] as number | null;
            if (value === null) return null;
            const change = stats.changes?.[field.key] ?? null;
            return (
              <div
                key={field.key}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{field.emoji}</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{field.label}</p>
                </div>
                <p className={`text-2xl font-bold ${field.color}`}>
                  {value}
                  <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">cm</span>
                </p>
                {change !== null && change !== 0 && (
                  <p
                    className={`text-xs font-medium mt-1 ${
                      change < 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {change > 0 ? '+' : ''}
                    {change} cm
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            ثبت اندازه‌های جدید
          </h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              💡 همه فیلدها اختیاری هستن. فقط چیزهایی که می‌دونی رو پر کن.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FIELDS.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {field.emoji} {field.label} (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder="—"
                    className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                یادداشت (اختیاری)
              </label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="مثلاً بعد از یک ماه تمرین"
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={upsertMutation.isPending}
              className="w-full h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {upsertMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
            </button>
          </form>
        </div>
      )}

      {/* Empty State */}
      {list.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-float">📏</div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            هنوز اندازه‌ای ثبت نکردی
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            با ثبت اندازه‌های بدن (گردن، سینه، کمر، باسن، بازو و...)، تغییرات رو دنبال کن
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all hover:scale-105"
          >
            شروع کن
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-3 card-hover">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📋</span> تاریخچه
          </h2>
          <div className="space-y-3">
            {[...list].reverse().map((m, i) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    📅 {new Date(m.date).toLocaleDateString('fa-IR')}
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('این ثبت حذف بشه؟')) {
                        deleteMutation.mutate(m.id);
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 text-xs transition-all hover:scale-110"
                  >
                    🗑️
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {FIELDS.map((field) => {
                    const v = m[field.key as keyof typeof m] as number | null;
                    if (v === null) return null;
                    return (
                      <span
                        key={field.key}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <span>{field.emoji}</span>
                        <span className="text-slate-600 dark:text-slate-300">{field.label}:</span>
                        <span className={`font-bold ${field.color}`}>
                          {v}
                          <span className="text-[10px] opacity-70 mr-0.5">cm</span>
                        </span>
                      </span>
                    );
                  })}
                </div>
                {m.note && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    💬 {m.note}
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