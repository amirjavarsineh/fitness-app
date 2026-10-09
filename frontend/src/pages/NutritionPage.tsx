import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  nutritionService,
  type MealType,
  type CreateNutritionInput,
} from '../services/nutrition.service';

const MEAL_TYPES: { value: MealType; label: string; emoji: string; color: string }[] = [
  { value: 'BREAKFAST', label: 'صبحانه', emoji: '🌅', color: 'from-orange-400 to-yellow-400' },
  { value: 'LUNCH', label: 'ناهار', emoji: '☀️', color: 'from-amber-400 to-orange-400' },
  { value: 'DINNER', label: 'شام', emoji: '🌙', color: 'from-indigo-400 to-purple-400' },
  { value: 'SNACK', label: 'میان‌وعده', emoji: '🍎', color: 'from-pink-400 to-red-400' },
];

export default function NutritionPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateNutritionInput>({
    foodName: '',
    calories: 0,
    protein: undefined,
    carbs: undefined,
    fat: undefined,
    mealType: 'BREAKFAST',
  });
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['nutrition'],
    queryFn: () => nutritionService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: nutritionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });
      setForm({ foodName: '', calories: 0, mealType: 'BREAKFAST' });
      setShowForm(false);
      setError('');
    },
    onError: () => setError('خطا در ذخیره‌سازی'),
  });

  const deleteMutation = useMutation({
    mutationFn: nutritionService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.foodName.trim()) {
      setError('نام غذا الزامی است');
      return;
    }
    if (form.calories <= 0) {
      setError('کالری باید بزرگ‌تر از صفر باشد');
      return;
    }
    createMutation.mutate({
      foodName: form.foodName.trim(),
      calories: Number(form.calories),
      protein: form.protein !== undefined ? Number(form.protein) : undefined,
      carbs: form.carbs !== undefined ? Number(form.carbs) : undefined,
      fat: form.fat !== undefined ? Number(form.fat) : undefined,
      mealType: form.mealType,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">تغذیه امروز</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const logs = data?.logs ?? [];
  const totals = data?.totals ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">تغذیه امروز</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {logs.length} آیتم ثبت شده
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
          <span>{showForm ? 'بستن فرم' : 'افزودن غذا'}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="animate-fade-in-up delay-1">
          <SummaryCard label="کالری" value={totals.calories} unit="kcal" icon="🔥" color="red" />
        </div>
        <div className="animate-fade-in-up delay-2">
          <SummaryCard label="پروتئین" value={totals.protein} unit="g" icon="🥩" color="blue" decimals />
        </div>
        <div className="animate-fade-in-up delay-3">
          <SummaryCard label="کربوهیدرات" value={totals.carbs} unit="g" icon="🍞" color="yellow" decimals />
        </div>
        <div className="animate-fade-in-up delay-4">
          <SummaryCard label="چربی" value={totals.fat} unit="g" icon="🥑" color="purple" decimals />
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">افزودن غذا</h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                نام غذا *
              </label>
              <input
                type="text"
                value={form.foodName}
                onChange={(e) => setForm({ ...form, foodName: e.target.value })}
                placeholder="مثلاً برنج با مرغ"
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Meal Type Buttons */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                وعده *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MEAL_TYPES.map((meal) => (
                  <button
                    key={meal.value}
                    type="button"
                    onClick={() => setForm({ ...form, mealType: meal.value })}
                    className={`p-3 rounded-xl border-2 transition-all text-sm font-medium flex flex-col items-center gap-1 hover:scale-105 ${
                      form.mealType === meal.value
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xl">{meal.emoji}</span>
                    <span className="text-xs">{meal.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Calories + Macros */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  کالری *
                </label>
                <input
                  type="number"
                  value={form.calories || ''}
                  onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })}
                  placeholder="450"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  پروتئین (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.protein ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      protein: e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                  placeholder="35"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  کربوهیدرات (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.carbs ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      carbs: e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                  placeholder="50"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  چربی (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.fat ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fat: e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                  placeholder="8"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Meals List */}
      <div className="space-y-3">
        {MEAL_TYPES.map((meal, index) => {
          const mealLogs = logs.filter((l) => l.mealType === meal.value);
          const mealCalories = mealLogs.reduce((sum, l) => sum + l.calories, 0);

          return (
            <div
              key={meal.value}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-fade-in-up card-hover"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              {/* Meal Header */}
              <div
                className={`bg-gradient-to-l ${meal.color} px-5 py-3 flex items-center justify-between`}
              >
                <div className="flex items-center gap-2 text-white">
                  <span className="text-xl">{meal.emoji}</span>
                  <span className="font-semibold">{meal.label}</span>
                  <span className="text-xs opacity-90">
                    ({mealLogs.length} آیتم)
                  </span>
                </div>
                <div className="text-white font-bold">
                  {mealCalories} <span className="text-xs font-normal">kcal</span>
                </div>
              </div>

              {/* Meal Items */}
              <div className="p-4">
                {mealLogs.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-3">
                    چیزی ثبت نشده
                  </p>
                ) : (
                  <div className="space-y-2">
                    {mealLogs.map((log, i) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors animate-fade-in"
                        style={{ animationDelay: `${0.03 * i}s` }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {log.foodName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                            <span className="font-semibold text-red-500 dark:text-red-400">
                              {log.calories} kcal
                            </span>
                            {log.protein != null && (
                              <span className="text-blue-500 dark:text-blue-400">
                                P: {log.protein}g
                              </span>
                            )}
                            {log.carbs != null && (
                              <span className="text-yellow-600 dark:text-yellow-400">
                                C: {log.carbs}g
                              </span>
                            )}
                            {log.fat != null && (
                              <span className="text-purple-500 dark:text-purple-400">
                                F: {log.fat}g
                              </span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('این آیتم حذف بشه؟')) {
                              deleteMutation.mutate(log.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 text-sm transition-colors shrink-0 mr-2 hover:scale-110"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Sub Components ---

function SummaryCard({
  label,
  value,
  unit,
  icon,
  color,
  decimals = false,
}: {
  label: string;
  value: number;
  unit: string;
  icon: string;
  color: 'red' | 'blue' | 'yellow' | 'purple';
  decimals?: boolean;
}) {
  const colors = {
    red: 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400',
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400',
  }[color];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm card-hover">
      <div
        className={`w-10 h-10 rounded-xl ${colors} flex items-center justify-center text-lg mx-auto mb-2`}
      >
        {icon}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white">
        {decimals ? value.toFixed(1) : value}
        <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">{unit}</span>
      </p>
    </div>
  );
}