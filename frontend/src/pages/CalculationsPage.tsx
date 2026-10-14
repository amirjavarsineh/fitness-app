import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Calculator,
  Activity,
  Flame,
  Target,
  Droplets,
  Scale,
  Utensils,
  TrendingDown,
  TrendingUp,
  Minus,
  Info,
  Dumbbell,
  Heart,
  Lightbulb,
  Ruler,
} from 'lucide-react';
import {
  calculationsService,
  type BodyFatResult,
} from '../services/calculations.service';
import { useTranslation } from '../i18n/useTranslation';
import AdvancedCalculations from '../components/AdvancedCalculations';
import { useNavigate } from 'react-router-dom';

export default function CalculationsPage() {
  const { t, language, fmt } = useTranslation();
  const navigate = useNavigate();
  const [showBodyFat, setShowBodyFat] = useState(false);
  const [bodyFatForm, setBodyFatForm] = useState({
    waist: '',
    neck: '',
    hip: '',
  });
  const [bodyFatResult, setBodyFatResult] = useState<BodyFatResult | null>(null);
  const [bodyFatError, setBodyFatError] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['calculations'],
    queryFn: calculationsService.getCalculations,
    retry: false,
  });

  const bodyFatMutation = useMutation({
    mutationFn: calculationsService.calculateBodyFat,
    onSuccess: (result) => {
      setBodyFatResult(result);
      setBodyFatError('');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t('calculations.bodyFatError' as never);
      setBodyFatError(msg as string);
    },
  });

  const handleBodyFatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBodyFatError('');
    if (!bodyFatForm.waist || !bodyFatForm.neck) {
      setBodyFatError(t('calculations.bodyFatRequired' as never) as string);
      return;
    }
    bodyFatMutation.mutate({
      waist: Number(bodyFatForm.waist),
      neck: Number(bodyFatForm.neck),
      hip: bodyFatForm.hip ? Number(bodyFatForm.hip) : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // اگه پروفایل نداری
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 animate-fade-in-up">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg">
              <Calculator size={28} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('calculations.title' as never)}
            </h1>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white mx-auto mb-5 shadow-2xl shadow-violet-500/30 animate-float">
              <Ruler size={40} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('calculations.noProfile' as never)}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {t('calculations.noProfileDesc' as never)}
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-violet-500 to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:scale-105 transition-all"
            >
              <Ruler size={20} strokeWidth={2.5} />
              {t('calculations.goToProfile' as never)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // محاسبه‌ی درصد BMI نسبت به بازه
  const bmiMin = 15;
  const bmiMax = 40;
  const bmiPercent = Math.min(
    100,
    Math.max(0, ((data.bmi - bmiMin) / (bmiMax - bmiMin)) * 100)
  );

  const goalIcon =
    data.profile.goal === 'LOSE_WEIGHT'
      ? TrendingDown
      : data.profile.goal === 'GAIN_MUSCLE'
      ? TrendingUp
      : Minus;

  const GoalIcon = goalIcon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg">
            <Calculator size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('calculations.title' as never)}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('calculations.subtitle' as never)}
          </p>
        </div>
      </div>

      {/* ===== BMI Hero ===== */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 animate-fade-in-up delay-1">
        <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-violet-300/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <Scale size={28} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                  BMI — {t('calculations.bmi' as never)}
                </p>
                <p className="text-sm text-white/80 mt-0.5">
                  {t('calculations.bmiDesc' as never)}
                </p>
              </div>
            </div>

            <div className="text-end">
              <p className="text-5xl md:text-6xl font-bold tracking-tight">
                {fmt(data.bmi)}
              </p>
              <p className="text-sm text-white/85 mt-1 font-semibold">
                {data.bmiCategory}
              </p>
            </div>
          </div>

          {/* BMI Ruler */}
          <div className="relative">
            <div className="w-full h-3 rounded-full overflow-hidden flex shadow-inner border border-white/20">
              <div className="flex-[18.5] bg-blue-400" />
              <div className="flex-[6.5] bg-emerald-400" />
              <div className="flex-[5] bg-amber-400" />
              <div className="flex-[10] bg-red-400" />
            </div>

            <div
              className="absolute -top-1.5 transition-all duration-700 ease-out"
              style={{
                left: `${bmiPercent}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-lg border-2 border-violet-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-violet-600" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-[10px] text-white/80">
              <span>۱۵</span>
              <span>۱۸.۵</span>
              <span>۲۵</span>
              <span>۳۰</span>
              <span>۴۰</span>
            </div>

            <div className="flex items-center justify-between mt-1 text-[10px] text-white/70 font-medium">
              <span className="text-blue-200">
                {t('calculations.bmiUnderweight' as never)}
              </span>
              <span className="text-emerald-200">
                {t('calculations.bmiNormal' as never)}
              </span>
              <span className="text-amber-200">
                {t('calculations.bmiOverweight' as never)}
              </span>
              <span className="text-red-200">
                {t('calculations.bmiObese' as never)}
              </span>
            </div>
          </div>

          {/* Ideal Weight */}
          <div className="mt-6 p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
            <p className="text-xs text-white/80 mb-1">
              {t('calculations.idealWeightRange' as never)}
            </p>
            <p className="text-xl font-bold">
              {fmt(data.idealWeightRange.min)}
              <span className="text-sm font-normal mx-2 opacity-80">—</span>
              {fmt(data.idealWeightRange.max)}
              <span className="text-sm font-normal ms-2 opacity-80">kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* ===== BMR + TDEE ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="animate-fade-in-up delay-2">
          <MetricCard
            Icon={Heart}
            label={t('calculations.bmr' as never)}
            description={t('calculations.bmrDesc' as never)}
            value={fmt(data.bmr)}
            unit="kcal"
            gradient="from-rose-500 to-pink-600"
          />
        </div>
        <div className="animate-fade-in-up delay-3">
          <MetricCard
            Icon={Flame}
            label={t('calculations.tdee' as never)}
            description={t('calculations.tdeeDesc' as never)}
            value={fmt(data.tdee)}
            unit="kcal"
            gradient="from-orange-500 to-red-600"
          />
        </div>
      </div>

      {/* ===== Target Calories ===== */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 animate-fade-in-up delay-4">
        <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <Target size={28} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                  {t('calculations.targetCalories' as never)}
                </p>
                <p className="text-sm text-white/80 mt-0.5">
                  {t('calculations.targetCaloriesDesc' as never)}
                </p>
              </div>
            </div>

            <div className="text-end">
              <p className="text-5xl md:text-6xl font-bold tracking-tight">
                {fmt(data.targetCalories)}
              </p>
              <p className="text-sm text-white/85 mt-1 font-semibold">kcal</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-xs font-bold">
              <GoalIcon size={14} strokeWidth={2.5} />
              {data.profile.goal === 'LOSE_WEIGHT'
                ? t('calculations.goalLoseWeight' as never)
                : data.profile.goal === 'GAIN_MUSCLE'
                ? t('calculations.goalGainMuscle' as never)
                : t('calculations.goalMaintain' as never)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-xs font-bold">
              <Activity size={14} strokeWidth={2.5} />
              ×{data.activityMultiplier}
            </span>
          </div>
        </div>
      </div>

      {/* ===== Macros ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-5 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
            <Utensils size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('calculations.macros' as never)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('calculations.macrosDesc' as never)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <MacroBubble
            label={t('calculations.protein' as never)}
            value={data.macros.protein}
            percent={data.macros.proteinPercent}
            calories={data.macros.proteinCalories}
            gradient="from-blue-500 to-indigo-600"
          />
          <MacroBubble
            label={t('calculations.carbs' as never)}
            value={data.macros.carbs}
            percent={data.macros.carbsPercent}
            calories={data.macros.carbsCalories}
            gradient="from-amber-500 to-orange-600"
          />
          <MacroBubble
            label={t('calculations.fat' as never)}
            value={data.macros.fat}
            percent={data.macros.fatPercent}
            calories={data.macros.fatCalories}
            gradient="from-purple-500 to-pink-600"
          />
        </div>

        {/* Macro Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-gradient-to-l from-blue-500 to-indigo-600"
            style={{ width: `${data.macros.proteinPercent}%` }}
          />
          <div
            className="bg-gradient-to-l from-amber-500 to-orange-600"
            style={{ width: `${data.macros.carbsPercent}%` }}
          />
          <div
            className="bg-gradient-to-l from-purple-500 to-pink-600"
            style={{ width: `${data.macros.fatPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {data.macros.proteinPercent}%
          </span>
          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {data.macros.carbsPercent}%
          </span>
          <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            {data.macros.fatPercent}%
          </span>
        </div>

        {/* ===== Explanation ===== */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Info size={14} strokeWidth={2.5} />
            {t('calculations.macrosHint' as never)}
          </p>

          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-blue-700 dark:text-blue-300">
                  {t('calculations.protein' as never)}:
                </span>{' '}
                {t('calculations.proteinHint' as never)}
              </p>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {t('calculations.carbs' as never)}:
                </span>{' '}
                {t('calculations.carbsHint' as never)}
              </p>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {t('calculations.fat' as never)}:
                </span>{' '}
                {t('calculations.fatHint' as never)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/50">
            <Lightbulb size={16} strokeWidth={2.5} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              {t('calculations.macrosNote' as never)}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Water Goal ===== */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-6 card-hover">
        <div className="absolute -top-16 -end-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Droplets size={26} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('calculations.waterGoal' as never)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {t('calculations.waterGoalDesc' as never)}
              </p>
            </div>
          </div>
          <div className="text-end">
            <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              {fmt(data.waterGoal)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              ml
            </p>
          </div>
        </div>
      </div>

      {/* ===== Body Fat Calculator ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-7">
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
              <Activity size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('calculations.bodyFat' as never)}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('calculations.bodyFatDesc' as never)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBodyFat(!showBodyFat)}
            className={`btn-shine px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              showBodyFat
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                : 'bg-gradient-to-l from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:scale-105'
            }`}
          >
            {showBodyFat
              ? t('common.cancel' as never)
              : t('calculations.calculate' as never)}
          </button>
        </div>

        {showBodyFat && (
          <form onSubmit={handleBodyFatSubmit} className="space-y-4 animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('calculations.waist' as never)} (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFatForm.waist}
                  onChange={(e) =>
                    setBodyFatForm({ ...bodyFatForm, waist: e.target.value })
                  }
                  placeholder="85"
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('calculations.neck' as never)} (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFatForm.neck}
                  onChange={(e) =>
                    setBodyFatForm({ ...bodyFatForm, neck: e.target.value })
                  }
                  placeholder="38"
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                />
              </div>
              {data.profile.gender === 'FEMALE' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('calculations.hip' as never)} (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFatForm.hip}
                    onChange={(e) =>
                      setBodyFatForm({ ...bodyFatForm, hip: e.target.value })
                    }
                    placeholder="95"
                    className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              )}
            </div>

            {bodyFatError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <Info size={14} strokeWidth={2.5} />
                {bodyFatError}
              </p>
            )}

            <button
              type="submit"
              disabled={bodyFatMutation.isPending}
              className="btn-shine w-full h-11 rounded-xl bg-gradient-to-l from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-rose-500/30 transition-all disabled:opacity-50"
            >
              {bodyFatMutation.isPending
                ? t('common.saving' as never)
                : t('calculations.calculate' as never)}
            </button>

            {bodyFatResult && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800/50 animate-scale-in">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                  {t('calculations.yourBodyFat' as never)}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                    {fmt(bodyFatResult.bodyFat)}%
                  </p>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {bodyFatResult.category}
                  </span>
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {/* ===== Advanced Calculations ===== */}
      <AdvancedCalculations
        advanced={data.advanced}
        hasMeasurements={data.hasMeasurements}
      />


      {/* ===== Tip ===== */}
      <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs animate-fade-in-up delay-8">
        <Lightbulb size={16} strokeWidth={2.5} className="shrink-0 mt-0.5" />
        <span>{t('calculations.tip' as never)}</span>
      </div>
    </div>
  );
}

// ==================== Sub Components ====================

function MetricCard({
  Icon,
  label,
  description,
  value,
  unit,
  gradient,
}: {
  Icon: typeof Calculator;
  label: string;
  description: string;
  value: string;
  unit: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all card-hover">
      <div
        className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
          >
            <Icon size={24} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {label}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
          <span className="text-xs text-slate-400 dark:text-slate-500 ms-1.5 font-normal">
            {unit}
          </span>
        </p>
      </div>
    </div>
  );
}

function MacroBubble({
  label,
  value,
  percent,
  calories,
  gradient,
}: {
  label: string;
  value: number;
  percent: number;
  calories: number;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 p-4 text-center hover:scale-[1.03] transition-all bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50">
      <div
        className={`absolute -top-8 -end-8 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
          <span className="text-[11px] text-slate-400 dark:text-slate-500 ms-1 font-normal">
            g
          </span>
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
          {calories} kcal • {percent}%
        </p>
      </div>
    </div>
  );
}