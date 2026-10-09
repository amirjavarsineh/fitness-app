import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  goalService,
  type CreateGoalInput,
  type GoalCategory,
} from '../../services/goal.service';

const GOAL_CATEGORIES: { value: GoalCategory; label: string; emoji: string }[] = [
  { value: 'WEIGHT', label: 'وزن', emoji: '⚖️' },
  { value: 'WORKOUT_FREQUENCY', label: 'تعداد تمرین', emoji: '🏋️' },
  { value: 'CALORIE_INTAKE', label: 'کالری دریافتی', emoji: '🔥' },
  { value: 'MUSCLE_GAIN', label: 'عضله‌سازی', emoji: '💪' },
  { value: 'ENDURANCE', label: 'استقامت', emoji: '🏃' },
  { value: 'OTHER', label: 'سایر', emoji: '⭐' },
];

export default function GoalFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

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
      .catch(() => setError('دریافت هدف با خطا مواجه شد'));
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('عنوان الزامی است');
      return;
    }
    if (form.targetValue <= 0) {
      setError('مقدار هدف باید بزرگ‌تر از صفر باشد');
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
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <button
          onClick={() => navigate('/goals')}
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-3 flex items-center gap-1 transition-all hover:translate-x-[-3px]"
        >
          <span>→</span>
          <span>بازگشت به اهداف</span>
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEdit ? 'ویرایش هدف' : 'هدف جدید'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isEdit ? 'تغییرات رو اعمال کن' : 'یه هدف جدید برای خودت تعیین کن'}
        </p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-1 card-hover">
        {error && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
            <span className="text-lg shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              عنوان هدف *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="مثلاً کاهش ۵ کیلو وزن"
              className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              دسته‌بندی هدف
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GOAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, goalType: cat.value })}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-2 justify-center hover:scale-105 ${
                    form.goalType === cat.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                مقدار هدف *
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.targetValue || ''}
                onChange={(e) => setForm({ ...form, targetValue: Number(e.target.value) })}
                placeholder="75"
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                مقدار فعلی
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.currentValue ?? 0}
                onChange={(e) => setForm({ ...form, currentValue: Number(e.target.value) })}
                placeholder="80"
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              مهلت (اختیاری)
            </label>
            <input
              type="date"
              value={form.deadline ?? ''}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              توضیحات (اختیاری)
            </label>
            <textarea
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="توضیحات بیشتر..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {loading ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'ثبت هدف'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/goals')}
              className="px-6 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all hover:scale-105"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}