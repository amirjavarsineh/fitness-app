import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Save,
  X,
  Weight,
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
  Star,
  Pencil,
} from 'lucide-react';
import {
  goalService,
  type CreateGoalInput,
  type GoalCategory,
} from '../../services/goal.service';
import { useTranslation } from '../../i18n/useTranslation';

// ==================== Data ====================

const GOAL_CATEGORIES: {
  value: GoalCategory;
  labelKey: string;
  Icon: typeof Weight;
  gradient: string;
}[] = [
  { value: 'WEIGHT', labelKey: 'goals.categoryWeight', Icon: Weight, gradient: 'from-blue-500 to-indigo-600' },
  { value: 'WORKOUT_FREQUENCY', labelKey: 'goals.categoryWorkoutFrequency', Icon: Dumbbell, gradient: 'from-purple-500 to-fuchsia-600' },
  { value: 'CALORIE_INTAKE', labelKey: 'goals.categoryCalorieIntake', Icon: Flame, gradient: 'from-orange-500 to-red-500' },
  { value: 'MUSCLE_GAIN', labelKey: 'goals.categoryMuscleGain', Icon: TrendingUp, gradient: 'from-rose-500 to-pink-600' },
  { value: 'ENDURANCE', labelKey: 'goals.categoryEndurance', Icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600' },
  { value: 'OTHER', labelKey: 'goals.categoryOther', Icon: Star, gradient: 'from-slate-500 to-slate-700' },
];

// ==================== Page ====================

export default function GoalFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  const [form, setForm] = useState<CreateGoalInput>({
    title: '',
    description: '',
    goalType: 'WEIGHT',
    targetValue: 0,
    currentValue: 0,
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    goalService
      .getById(id!)
      .then((goal) => {
        setForm({
          title: goal.title,
          description: goal.description ?? '',
          goalType: goal.goalType,
          targetValue: goal.targetValue,
          currentValue: goal.currentValue,
          deadline: goal.deadline ? goal.deadline.slice(0, 10) : '',
        });
      })
      .catch(() => setError(t('goals.errorLoading')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError(t('goals.errorTitle'));
      return;
    }
    if (form.targetValue <= 0) {
      setError(t('goals.errorTarget'));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || undefined,
        goalType: form.goalType,
        targetValue: Number(form.targetValue),
        currentValue: form.currentValue !== undefined ? Number(form.currentValue) : 0,
        deadline: form.deadline || undefined,
      };

      if (isEdit) {
        await goalService.update(id!, payload);
      } else {
        await goalService.create(payload);
      }
      navigate('/goals');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t('goals.errorGeneric');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="animate-fade-in-up">
        <button
          onClick={() => navigate('/goals')}
          className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 mb-4 transition-all"
        >
          <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 flex items-center justify-center transition-colors rtl:rotate-0 ltr:rotate-180">
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
          <span className="font-semibold">{t('goals.backToGoals')}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
              {isEdit ? <Pencil size={26} strokeWidth={2.2} /> : <Target size={26} strokeWidth={2.2} />}
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isEdit ? t('goals.formEditTitle') : t('goals.formTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isEdit ? t('goals.formEditDesc') : t('goals.formNewDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Form Card ===== */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-1 card-hover">
        <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />

        <div className="relative">
          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <X size={20} strokeWidth={2.5} className="shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('goals.titleLabel')} *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t('goals.titlePlaceholder')}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-pink-500/10"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('goals.categoryLabel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GOAL_CATEGORIES.map((cat) => {
                  const isActive = form.goalType === cat.value;
                  const CatIcon = cat.Icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setForm({ ...form, goalType: cat.value })}
                      className={`relative overflow-hidden p-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                        isActive
                          ? 'text-white shadow-lg scale-105'
                          : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
                      }`}
                    >
                      {isActive && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`}
                        />
                      )}
                      <CatIcon size={18} strokeWidth={2.5} className="relative" />
                      <span className="relative text-xs font-semibold">
                        {t(cat.labelKey as never)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('goals.targetValueLabel')} *
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={form.targetValue || ''}
                  onChange={(e) => setForm({ ...form, targetValue: Number(e.target.value) })}
                  placeholder="75"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-pink-500/10"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('goals.currentValueLabel')}
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={form.currentValue ?? 0}
                  onChange={(e) => setForm({ ...form, currentValue: Number(e.target.value) })}
                  placeholder="80"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-pink-500/10"
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('goals.deadlineLabel')}
              </label>
              <input
                type="date"
                value={form.deadline ?? ''}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-pink-500/10"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('goals.descriptionLabel')}
              </label>
              <textarea
                rows={3}
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={t('goals.descriptionPlaceholder')}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-pink-500/10 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-shine flex-1 h-12 rounded-2xl bg-gradient-to-l from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Save size={18} strokeWidth={2.5} />
                {loading
                  ? t('common.saving')
                  : isEdit
                  ? t('goals.saveChanges')
                  : t('goals.saveGoal')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/goals')}
                className="px-6 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all hover:scale-105 flex items-center gap-2"
              >
                <X size={18} strokeWidth={2.5} />
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}