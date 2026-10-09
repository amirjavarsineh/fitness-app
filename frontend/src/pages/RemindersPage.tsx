import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  reminderService,
  type ReminderType,
  type Reminder,
} from '../services/reminder.service';

const TYPE_INFO: Record<ReminderType, { label: string; emoji: string; color: string }> = {
  WATER: { label: 'آب', emoji: '💧', color: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300' },
  WORKOUT: { label: 'تمرین', emoji: '💪', color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' },
  WEIGHT: { label: 'وزن', emoji: '⚖️', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
  MEAL: { label: 'غذا', emoji: '🍎', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
  CUSTOM: { label: 'دلخواه', emoji: '⭐', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
};

const PRESETS: { title: string; message: string; type: ReminderType; time: string; days: string }[] = [
  { title: 'نوشیدن آب', message: 'وقتشه یه لیوان آب بخوری 💧', type: 'WATER', time: '10:00', days: 'ALL' },
  { title: 'تمرین صبحگاهی', message: 'بریم برای تمرین! 💪', type: 'WORKOUT', time: '07:00', days: 'WEEKDAYS' },
  { title: 'ثبت وزن', message: 'وزنت رو امروز ثبت کن ⚖️', type: 'WEIGHT', time: '08:00', days: 'ALL' },
  { title: 'یادآور ناهار', message: 'وقت ناهاره! 🍽️', type: 'MEAL', time: '13:00', days: 'ALL' },
  { title: 'پیاده‌روی شبانه', message: 'یه پیاده‌روی سبک بعد از شام 🚶', type: 'CUSTOM', time: '21:00', days: 'ALL' },
  { title: 'خواب کافی', message: 'وقتشه بخوابی! 😴', type: 'CUSTOM', time: '23:00', days: 'ALL' },
];

const DAYS_OPTIONS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'هر روز' },
  { value: 'WEEKDAYS', label: 'شنبه تا چهارشنبه' },
  { value: 'WEEKENDS', label: 'پنجشنبه و جمعه' },
];

export default function RemindersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'CUSTOM' as ReminderType,
    time: '08:00',
    days: 'ALL',
  });

  const { data: reminders, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: reminderService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: reminderService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      resetForm();
    },
    onError: () => setError('خطا در ذخیره‌سازی'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof form }) =>
      reminderService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      resetForm();
    },
    onError: () => setError('خطا در ویرایش'),
  });

  const toggleMutation = useMutation({
    mutationFn: reminderService.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: reminderService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const resetForm = () => {
    setForm({ title: '', message: '', type: 'CUSTOM', time: '08:00', days: 'ALL' });
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('عنوان الزامی است');
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(form.time)) {
      setError('ساعت باید به فرمت HH:MM باشه');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate({
        title: form.title.trim(),
        message: form.message.trim() || undefined,
        type: form.type,
        time: form.time,
        days: form.days,
        enabled: true,
      });
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setForm({
      title: reminder.title,
      message: reminder.message ?? '',
      type: reminder.type,
      time: reminder.time,
      days: reminder.days,
    });
    setEditingId(reminder.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUsePreset = (preset: typeof PRESETS[0]) => {
    createMutation.mutate({
      title: preset.title,
      message: preset.message,
      type: preset.type,
      time: preset.time,
      days: preset.days,
      enabled: true,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          یادآورها 🔔
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const list = reminders ?? [];
  const enabledCount = list.filter((r) => r.enabled).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">یادآورها 🔔</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {list.length} یادآور • {enabledCount} فعال
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all hover:scale-105 ${
            showForm
              ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              : 'bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/30'
          }`}
        >
          <span className="text-lg">{showForm ? '✕' : '+'}</span>
          <span>{showForm ? 'بستن' : 'یادآور جدید'}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            {editingId ? '✏️ ویرایش یادآور' : '➕ یادآور جدید'}
          </h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                عنوان *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثلاً: نوشیدن آب"
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                پیام (اختیاری)
              </label>
              <input
                type="text"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="متن اعلان..."
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                نوع یادآور
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(Object.keys(TYPE_INFO) as ReminderType[]).map((type) => {
                  const info = TYPE_INFO[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, type })}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 hover:scale-105 ${
                        form.type === type
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl">{info.emoji}</span>
                      <span className="text-xs font-medium">{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time & Days */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  ساعت *
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  روزها
                </label>
                <select
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: e.target.value })}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {DAYS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'در حال ذخیره...'
                  : editingId
                  ? 'ذخیره تغییرات'
                  : 'ساخت یادآور'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all hover:scale-105"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders List */}
      {list.length === 0 && !showForm ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-float">🔔</div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            هنوز یادآوری نداری
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            با ساخت یادآور، کارهای روزانه‌ت رو فراموش نکن
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
          <div className="space-y-3">
            {list.map((reminder, index) => {
              const info = TYPE_INFO[reminder.type];
              return (
                <div
                  key={reminder.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-all animate-fade-in-up card-hover ${
                    !reminder.enabled ? 'opacity-60' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center text-2xl shrink-0`}
                      >
                        {info.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {reminder.title}
                          </h3>
                          {!reminder.enabled && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              غیرفعال
                            </span>
                          )}
                        </div>

                        {reminder.message && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                            {reminder.message}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <span>🕐</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {reminder.time}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📅</span>
                            <span>
                              {DAYS_OPTIONS.find((d) => d.value === reminder.days)?.label ??
                                reminder.days}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {/* Toggle */}
                      <button
                        onClick={() => toggleMutation.mutate(reminder.id)}
                        disabled={toggleMutation.isPending}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          reminder.enabled
                            ? 'bg-emerald-500'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label={reminder.enabled ? 'غیرفعال کن' : 'فعال کن'}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                            reminder.enabled ? 'right-0.5' : 'right-6'
                          }`}
                        />
                      </button>

                      {/* Edit + Delete */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs transition-all hover:scale-110"
                          title="ویرایش"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('این یادآور حذف بشه؟')) {
                              deleteMutation.mutate(reminder.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 text-xs transition-all hover:scale-110 disabled:opacity-50"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Presets */}
          <div className="mt-8 animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>⚡</span> یادآورهای آماده
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              با یه کلیک اضافه کن
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map((preset, i) => {
                const info = TYPE_INFO[preset.type];
                return (
                  <button
                    key={i}
                    onClick={() => handleUsePreset(preset)}
                    disabled={createMutation.isPending}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-right hover:scale-[1.02] disabled:opacity-50 flex items-center gap-3"
                  >
                    <span className="text-2xl">{info.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {preset.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>🕐 {preset.time}</span>
                        <span>•</span>
                        <span>
                          {DAYS_OPTIONS.find((d) => d.value === preset.days)?.label}
                        </span>
                      </p>
                    </div>
                    <span className="text-emerald-500 text-lg">+</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}