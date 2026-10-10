import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Bell,
  Clock,
  Calendar,
  Droplets,
  Dumbbell,
  Scale,
  Apple,
  Star,
  Zap,
} from 'lucide-react';
import {
  reminderService,
  type ReminderType,
  type Reminder,
} from '../services/reminder.service';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Data ====================

const TYPE_INFO: Record<
  ReminderType,
  { labelKey: string; Icon: typeof Droplets; gradient: string }
> = {
  WATER: { labelKey: 'reminders.typeWater', Icon: Droplets, gradient: 'from-cyan-500 to-blue-600' },
  WORKOUT: { labelKey: 'reminders.typeWorkout', Icon: Dumbbell, gradient: 'from-rose-500 to-orange-500' },
  WEIGHT: { labelKey: 'reminders.typeWeight', Icon: Scale, gradient: 'from-violet-500 to-fuchsia-500' },
  MEAL: { labelKey: 'reminders.typeMeal', Icon: Apple, gradient: 'from-emerald-500 to-green-600' },
  CUSTOM: { labelKey: 'reminders.typeCustom', Icon: Star, gradient: 'from-amber-500 to-orange-500' },
};

const PRESETS: {
  titleKey: string;
  messageKey: string;
  type: ReminderType;
  time: string;
  days: string;
  Icon: typeof Droplets;
}[] = [
  { titleKey: 'reminders.presetWater', messageKey: 'reminders.presetWaterMsg', type: 'WATER', time: '10:00', days: 'ALL', Icon: Droplets },
  { titleKey: 'reminders.presetWorkout', messageKey: 'reminders.presetWorkoutMsg', type: 'WORKOUT', time: '07:00', days: 'WEEKDAYS', Icon: Dumbbell },
  { titleKey: 'reminders.presetWeight', messageKey: 'reminders.presetWeightMsg', type: 'WEIGHT', time: '08:00', days: 'ALL', Icon: Scale },
  { titleKey: 'reminders.presetLunch', messageKey: 'reminders.presetLunchMsg', type: 'MEAL', time: '13:00', days: 'ALL', Icon: Apple },
  { titleKey: 'reminders.presetWalk', messageKey: 'reminders.presetWalkMsg', type: 'CUSTOM', time: '21:00', days: 'ALL', Icon: Star },
  { titleKey: 'reminders.presetSleep', messageKey: 'reminders.presetSleepMsg', type: 'CUSTOM', time: '23:00', days: 'ALL', Icon: Star },
];

const DAYS_OPTIONS: { value: string; labelKey: string }[] = [
  { value: 'ALL', labelKey: 'reminders.everyDay' },
  { value: 'WEEKDAYS', labelKey: 'reminders.weekdays' },
  { value: 'WEEKENDS', labelKey: 'reminders.weekends' },
];

// ==================== Page ====================

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: reminderService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] }),
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
              <Bell size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('reminders.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {list.length} {t('reminders.count')} • {enabledCount}{' '}
              {t('reminders.activeCount')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`btn-shine flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all hover:scale-105 ${
            showForm
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              : 'bg-gradient-to-l from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
          }`}
        >
          {showForm ? <X size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
          <span>{showForm ? t('reminders.close') : t('reminders.newReminder')}</span>
        </button>
      </div>

      {/* ===== Form ===== */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-scale-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg">
              {editingId ? <Pencil size={22} strokeWidth={2.2} /> : <Plus size={22} strokeWidth={2.5} />}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingId ? t('reminders.formEditTitle') : t('reminders.formTitle')}
            </h2>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <X size={18} strokeWidth={2.5} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('reminders.titleLabel')} *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t('reminders.titlePlaceholder')}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-pink-500/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('reminders.messageLabel')}
              </label>
              <input
                type="text"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t('reminders.messagePlaceholder')}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-pink-500/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('reminders.typeLabel')}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(Object.keys(TYPE_INFO) as ReminderType[]).map((type) => {
                  const info = TYPE_INFO[type];
                  const isActive = form.type === type;
                  const TypeIcon = info.Icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, type })}
                      className={`relative overflow-hidden p-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${
                        isActive
                          ? 'text-white shadow-lg scale-105'
                          : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
                      }`}
                    >
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient}`} />
                      )}
                      <TypeIcon size={22} strokeWidth={2.2} className="relative" />
                      <span className="relative text-[11px] font-semibold">
                        {t(info.labelKey as never)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('reminders.timeLabel')} *
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-pink-500/10"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('reminders.daysLabel')}
                </label>
                <select
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: e.target.value })}
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-pink-500/10"
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
                className="btn-shine flex-1 h-12 rounded-2xl bg-gradient-to-l from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-6 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all hover:scale-105"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== Empty State ===== */}
      {list.length === 0 && !showForm ? (
        <>
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
            <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-pink-500/30 animate-float">
                <Bell size={48} strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {t('reminders.noReminders')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                {t('reminders.noRemindersDesc')}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/30 hover:scale-105 transition-all"
              >
                <Plus size={20} strokeWidth={2.5} />
                {t('reminders.createReminder')}
              </button>
            </div>
          </div>

          <div className="animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap size={20} strokeWidth={2.2} className="text-pink-500" />
              {t('reminders.presets')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map((preset, i) => {
                const info = TYPE_INFO[preset.type];
                const PresetIcon = preset.Icon;
                const dayOption = DAYS_OPTIONS.find((d) => d.value === preset.days);
                return (
                  <button
                    key={i}
                    onClick={() => handleUsePreset(preset)}
                    disabled={createMutation.isPending}
                    className="group relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all text-start hover:scale-[1.02] disabled:opacity-50 card-hover"
                  >
                    <div
                      className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${info.gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
                    />
                    <div className="relative flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <PresetIcon size={24} strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {t(preset.titleKey as never)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock size={11} strokeWidth={2.5} />
                            {preset.time}
                          </span>
                          <span>•</span>
                          <span>
                            {dayOption ? t(dayOption.labelKey as never) : preset.days}
                          </span>
                        </p>
                      </div>
                      <Plus size={20} strokeWidth={2.5} className="text-pink-500 shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ===== Reminders List ===== */}
          <div className="space-y-3">
            {list.map((reminder, index) => {
              const info = TYPE_INFO[reminder.type];
              const daysOption = DAYS_OPTIONS.find((d) => d.value === reminder.days);
              const TypeIcon = info.Icon;
              return (
                <div
                  key={reminder.id}
                  className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all animate-fade-in-up card-hover ${
                    !reminder.enabled ? 'opacity-60' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <div
                    className={`absolute -top-16 -end-16 w-40 h-40 rounded-full bg-gradient-to-br ${info.gradient} opacity-[0.08] group-hover:opacity-[0.15] blur-3xl transition-opacity pointer-events-none`}
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <TypeIcon size={26} strokeWidth={2.2} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {reminder.title}
                          </h3>
                          {!reminder.enabled && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                              {t('reminders.inactive')}
                            </span>
                          )}
                        </div>

                        {reminder.message && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">
                            {reminder.message}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <Clock size={12} strokeWidth={2.5} />
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {reminder.time}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <Calendar size={12} strokeWidth={2.5} />
                            <span>
                              {daysOption
                                ? t(daysOption.labelKey as never)
                                : reminder.days}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => toggleMutation.mutate(reminder.id)}
                        disabled={toggleMutation.isPending}
                        className={`relative w-12 h-7 rounded-full transition-all ${
                          reminder.enabled
                            ? 'bg-gradient-to-l from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label={reminder.enabled ? 'Disable' : 'Enable'}
                      >
                        <span
                          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                            reminder.enabled ? 'right-0.5' : 'right-[22px]'
                          }`}
                        />
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:scale-110 flex items-center justify-center"
                          title={t('reminders.edit')}
                        >
                          <Pencil size={16} strokeWidth={2.2} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(t('reminders.deleteConfirm'))) {
                              deleteMutation.mutate(reminder.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all hover:scale-110 disabled:opacity-50 flex items-center justify-center"
                          title={t('reminders.delete')}
                        >
                          <Trash2 size={16} strokeWidth={2.2} />
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
              <Zap size={20} strokeWidth={2.2} className="text-pink-500" />
              {t('reminders.presets')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {t('reminders.presetsDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map((preset, i) => {
                const info = TYPE_INFO[preset.type];
                const PresetIcon = preset.Icon;
                const dayOption = DAYS_OPTIONS.find((d) => d.value === preset.days);
                return (
                  <button
                    key={i}
                    onClick={() => handleUsePreset(preset)}
                    disabled={createMutation.isPending}
                    className="group relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all text-start hover:scale-[1.02] disabled:opacity-50 card-hover"
                  >
                    <div
                      className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${info.gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
                    />
                    <div className="relative flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <PresetIcon size={24} strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {t(preset.titleKey as never)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                          <Clock size={11} strokeWidth={2.5} />
                          {preset.time} •{' '}
                          {dayOption ? t(dayOption.labelKey as never) : preset.days}
                        </p>
                      </div>
                      <Plus size={20} strokeWidth={2.5} className="text-pink-500 shrink-0" />
                    </div>
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