import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  reminderService,
  type ReminderType,
  type Reminder,
} from '../services/reminder.service';
import { useTranslation } from '../i18n/useTranslation';

const TYPE_INFO: Record<ReminderType, { labelKey: string; emoji: string; color: string }> = {
  WATER: { labelKey: 'reminders.typeWater', emoji: '💧', color: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300' },
  WORKOUT: { labelKey: 'reminders.typeWorkout', emoji: '💪', color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' },
  WEIGHT: { labelKey: 'reminders.typeWeight', emoji: '⚖️', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
  MEAL: { labelKey: 'reminders.typeMeal', emoji: '🍎', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
  CUSTOM: { labelKey: 'reminders.typeCustom', emoji: '⭐', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
};

const PRESETS: {
  titleKey: string;
  messageKey: string;
  type: ReminderType;
  time: string;
  days: string;
}[] = [
  { titleKey: 'reminders.presetWater', messageKey: 'reminders.presetWaterMsg', type: 'WATER', time: '10:00', days: 'ALL' },
  { titleKey: 'reminders.presetWorkout', messageKey: 'reminders.presetWorkoutMsg', type: 'WORKOUT', time: '07:00', days: 'WEEKDAYS' },
  { titleKey: 'reminders.presetWeight', messageKey: 'reminders.presetWeightMsg', type: 'WEIGHT', time: '08:00', days: 'ALL' },
  { titleKey: 'reminders.presetLunch', messageKey: 'reminders.presetLunchMsg', type: 'MEAL', time: '13:00', days: 'ALL' },
  { titleKey: 'reminders.presetWalk', messageKey: 'reminders.presetWalkMsg', type: 'CUSTOM', time: '21:00', days: 'ALL' },
  { titleKey: 'reminders.presetSleep', messageKey: 'reminders.presetSleepMsg', type: 'CUSTOM', time: '23:00', days: 'ALL' },
];

const DAYS_OPTIONS: { value: string; labelKey: string }[] = [
  { value: 'ALL', labelKey: 'reminders.everyDay' },
  { value: 'WEEKDAYS', labelKey: 'reminders.weekdays' },
  { value: 'WEEKENDS', labelKey: 'reminders.weekends' },
];

export default function RemindersPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
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
    onError: () => setError(t('reminders.saveError')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof form }) =>
      reminderService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      resetForm();
    },
    onError: () => setError(t('reminders.editError')),
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
      setError(t('reminders.titleRequired'));
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(form.time)) {
      setError(t('reminders.timeInvalid'));
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
      title: t(preset.titleKey as never),
      message: t(preset.messageKey as never),
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
          {t('reminders.title')} 🔔
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('reminders.title')} 🔔
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {list.length} {t('reminders.count')} • {enabledCount} {t('reminders.activeCount')}
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
          <span>{showForm ? t('reminders.close') : t('reminders.newReminder')}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            {editingId ? '✏️ ' + t('reminders.formEditTitle') : '➕ ' + t('reminders.formTitle')}
          </h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('reminders.titleLabel')} *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t('reminders.titlePlaceholder')}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('reminders.messageLabel')}
              </label>
              <input
                type="text"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t('reminders.messagePlaceholder')}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('reminders.typeLabel')}
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
                      <span className="text-xs font-medium">{t(info.labelKey as never)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('reminders.timeLabel')} *
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
                  {t('reminders.daysLabel')}
                </label>
                <select
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: e.target.value })}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {DAYS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.labelKey as never)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? t('common.saving')
                  : editingId
                  ? t('reminders.saveChanges')
                  : t('reminders.saveReminder')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all hover:scale-105"
              >
                {t('common.cancel')}
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
            {t('reminders.noReminders')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t('reminders.noRemindersDesc')}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all hover:scale-105"
          >
            {t('reminders.createReminder')}
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {list.map((reminder, index) => {
              const info = TYPE_INFO[reminder.type];
              const daysOption = DAYS_OPTIONS.find((d) => d.value === reminder.days);
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
                              {t('reminders.inactive')}
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
                            <span>{daysOption ? t(daysOption.labelKey as never) : reminder.days}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => toggleMutation.mutate(reminder.id)}
                        disabled={toggleMutation.isPending}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          reminder.enabled
                            ? 'bg-emerald-500'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label={reminder.enabled ? 'Disable' : 'Enable'}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                            reminder.enabled ? 'right-0.5' : 'right-6'
                          }`}
                        />
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs transition-all hover:scale-110"
                          title={t('reminders.edit')}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(t('reminders.deleteConfirm'))) {
                              deleteMutation.mutate(reminder.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 text-xs transition-all hover:scale-110 disabled:opacity-50"
                          title={t('reminders.delete')}
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
              <span>⚡</span> {t('reminders.presets')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {t('reminders.presetsDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map((preset, i) => {
                const info = TYPE_INFO[preset.type];
                const dayOption = DAYS_OPTIONS.find((d) => d.value === preset.days);
                return (
                  <button
                    key={i}
                    onClick={() => handleUsePreset(preset)}
                    disabled={createMutation.isPending}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-start hover:scale-[1.02] disabled:opacity-50 flex items-center gap-3"
                  >
                    <span className="text-2xl">{info.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {t(preset.titleKey as never)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>🕐 {preset.time}</span>
                        <span>•</span>
                        <span>{dayOption ? t(dayOption.labelKey as never) : preset.days}</span>
                      </p>
                    </div>
                    <span className="text-emerald-500 text-lg shrink-0">+</span>
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