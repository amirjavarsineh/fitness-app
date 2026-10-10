import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  X,
  Trash2,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Sunrise,
  Sun,
  Moon,
  Apple,
  UtensilsCrossed,
  Lightbulb,
} from 'lucide-react';
import {
  nutritionService,
  type MealType,
  type CreateNutritionInput,
} from '../services/nutrition.service';
import FoodPicker from '../components/FoodPicker';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Data ====================

const MEAL_TYPES: {
  value: MealType;
  labelKey: string;
  Icon: typeof Sunrise;
  gradient: string;
}[] = [
  { value: 'BREAKFAST', labelKey: 'nutrition.breakfast', Icon: Sunrise, gradient: 'from-orange-500 to-amber-500' },
  { value: 'LUNCH', labelKey: 'nutrition.lunch', Icon: Sun, gradient: 'from-amber-500 to-orange-500' },
  { value: 'DINNER', labelKey: 'nutrition.dinner', Icon: Moon, gradient: 'from-indigo-500 to-purple-600' },
  { value: 'SNACK', labelKey: 'nutrition.snack', Icon: Apple, gradient: 'from-pink-500 to-rose-500' },
];

// ==================== Page ====================

export default function NutritionPage() {
  const queryClient = useQueryClient();
  const { t, language } = useTranslation();
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
    onError: () => setError(t('nutrition.saveError')),
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
      setError(t('nutrition.foodNameRequired'));
      return;
    }
    if (form.calories <= 0) {
      setError(t('nutrition.caloriesPositive'));
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg">
              <Apple size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('nutrition.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {logs.length} {t('nutrition.itemsLogged')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-shine flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all hover:scale-105 ${
            showForm
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              : 'bg-gradient-to-l from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
          }`}
        >
          {showForm ? <X size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
          <span>{showForm ? t('nutrition.closeForm') : t('nutrition.addFood')}</span>
        </button>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="animate-fade-in-up delay-1">
          <SummaryCard
            Icon={Flame}
            label={t('nutrition.calories')}
            value={totals.calories}
            unit="kcal"
            gradient="from-red-500 to-orange-500"
          />
        </div>
        <div className="animate-fade-in-up delay-2">
          <SummaryCard
            Icon={Beef}
            label={t('nutrition.protein')}
            value={totals.protein}
            unit="g"
            gradient="from-blue-500 to-indigo-500"
            decimals
          />
        </div>
        <div className="animate-fade-in-up delay-3">
          <SummaryCard
            Icon={Wheat}
            label={t('nutrition.carbs')}
            value={totals.carbs}
            unit="g"
            gradient="from-amber-500 to-yellow-500"
            decimals
          />
        </div>
        <div className="animate-fade-in-up delay-4">
          <SummaryCard
            Icon={Droplet}
            label={t('nutrition.fat')}
            value={totals.fat}
            unit="g"
            gradient="from-purple-500 to-pink-500"
            decimals
          />
        </div>
      </div>

      {/* ===== Form ===== */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-scale-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-lg">
              <UtensilsCrossed size={22} strokeWidth={2.2} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('nutrition.addFoodTitle')}
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
                {t('nutrition.searchCatalog')}
              </label>
              <FoodPicker
                value={form.foodName}
                onChange={(name) => setForm({ ...form, foodName: name })}
                onSelect={(food) => {
                  setForm({
                    ...form,
                    foodName: language === 'fa' ? food.nameFa : food.name,
                    calories: food.calories,
                    protein: food.protein,
                    carbs: food.carbs,
                    fat: food.fat,
                  });
                }}
                placeholder={t('nutrition.searchCatalogPlaceholder')}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1.5">
                <Lightbulb size={12} strokeWidth={2.5} />
                <span>{t('nutrition.searchHint')}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('nutrition.meal')} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MEAL_TYPES.map((meal) => {
                  const isActive = form.mealType === meal.value;
                  const MealIcon = meal.Icon;
                  return (
                    <button
                      key={meal.value}
                      type="button"
                      onClick={() => setForm({ ...form, mealType: meal.value })}
                      className={`relative overflow-hidden p-3 rounded-2xl transition-all flex flex-col items-center gap-1.5 ${
                        isActive
                          ? 'text-white shadow-lg scale-105'
                          : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
                      }`}
                    >
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${meal.gradient}`} />
                      )}
                      <MealIcon size={22} strokeWidth={2.2} className="relative" />
                      <span className="relative text-xs font-semibold">
                        {t(meal.labelKey as never)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Flame size={12} strokeWidth={2.5} />
                  {t('nutrition.calories')} *
                </label>
                <input
                  type="number"
                  value={form.calories || ''}
                  onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })}
                  placeholder="450"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Beef size={12} strokeWidth={2.5} />
                  {t('nutrition.protein')}
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
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Wheat size={12} strokeWidth={2.5} />
                  {t('nutrition.carbs')}
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
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Droplet size={12} strokeWidth={2.5} />
                  {t('nutrition.fat')}
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
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-shine flex-1 h-12 rounded-2xl bg-gradient-to-l from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? t('common.saving') : t('common.save')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ foodName: '', calories: 0, mealType: 'BREAKFAST' });
                  setError('');
                }}
                className="px-6 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all hover:scale-105"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== Meals List ===== */}
      <div className="space-y-4">
        {MEAL_TYPES.map((meal, index) => {
          const mealLogs = logs.filter((l) => l.mealType === meal.value);
          const mealCalories = mealLogs.reduce((sum, l) => sum + l.calories, 0);
          const MealIcon = meal.Icon;

          return (
            <div
              key={meal.value}
              className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-elevated transition-all animate-fade-in-up card-hover"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div
                className={`relative bg-gradient-to-l ${meal.gradient} px-5 py-4 flex items-center justify-between`}
              >
                <div className="absolute -top-12 -end-12 w-32 h-32 rounded-full bg-white/20 blur-3xl pointer-events-none" />

                <div className="relative flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md">
                    <MealIcon size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="font-bold text-base">{t(meal.labelKey as never)}</p>
                    <p className="text-xs text-white/80">
                      {mealLogs.length} {t('nutrition.itemsCount')}
                    </p>
                  </div>
                </div>

                <div className="relative text-end">
                  <p className="text-2xl font-bold text-white">{mealCalories}</p>
                  <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">
                    kcal
                  </p>
                </div>
              </div>

              <div className="p-4">
                {mealLogs.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-4">
                    {t('nutrition.nothing')}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {mealLogs.map((log, i) => (
                      <div
                        key={log.id}
                        className="group/item flex items-center justify-between p-3 rounded-2xl bg-gradient-to-l from-slate-50 to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:from-emerald-50 hover:to-green-50/50 dark:hover:from-slate-700 dark:hover:to-slate-700/50 transition-all animate-fade-in"
                        style={{ animationDelay: `${0.03 * i}s` }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {log.foodName}
                          </p>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs mt-1">
                            <span className="font-bold text-red-500 dark:text-red-400 flex items-center gap-1">
                              <Flame size={11} strokeWidth={2.5} />
                              {log.calories} {t('nutrition.kcal')}
                            </span>
                            {log.protein != null && (
                              <span className="text-blue-500 dark:text-blue-400 font-medium flex items-center gap-1">
                                <Beef size={11} strokeWidth={2.5} />
                                {log.protein}g
                              </span>
                            )}
                            {log.carbs != null && (
                              <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                                <Wheat size={11} strokeWidth={2.5} />
                                {log.carbs}g
                              </span>
                            )}
                            {log.fat != null && (
                              <span className="text-purple-500 dark:text-purple-400 font-medium flex items-center gap-1">
                                <Droplet size={11} strokeWidth={2.5} />
                                {log.fat}g
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(t('nutrition.deleteConfirm'))) {
                              deleteMutation.mutate(log.id);
                            }
                          }}
                          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-all hover:scale-110 shrink-0 ms-2 flex items-center justify-center shadow-sm"
                        >
                          <Trash2 size={16} strokeWidth={2.2} />
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

// ==================== Sub Components ====================

function SummaryCard({
  Icon,
  label,
  value,
  unit,
  gradient,
  decimals = false,
}: {
  Icon: typeof Flame;
  label: string;
  value: number;
  unit: string;
  gradient: string;
  decimals?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all card-hover text-center">
      <div
        className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}
        >
          <Icon size={24} strokeWidth={2.2} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {decimals ? value.toFixed(1) : value}
          <span className="text-xs text-slate-400 dark:text-slate-500 ms-1 font-normal">
            {unit}
          </span>
        </p>
      </div>
    </div>
  );
}