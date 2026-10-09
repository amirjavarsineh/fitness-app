import { useQuery } from '@tanstack/react-query';
import { predictionService, type GoalPrediction } from '../services/prediction.service';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDays(days: number): string {
  if (days === 0) return '—';
  if (days < 7) return `${days} روز`;
  if (days < 30) return `${Math.round(days / 7)} هفته`;
  if (days < 365) return `${Math.round(days / 30)} ماه`;
  return `${(days / 365).toFixed(1)} سال`;
}

export default function PredictionPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: predictionService.getAll,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          پیش‌بینی 🎯
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl">
          خطا در بارگذاری پیش‌بینی‌ها
        </div>
      </div>
    );
  }

  const { predictions } = data;
  const { weight, workouts, water, calories, goals } = predictions;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🎯</span> پیش‌بینی هوشمند
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          بر اساس روند فعلی، پیش‌بینی می‌کنیم کِی به هدفت می‌رسی
        </p>
      </div>

      {/* Weight Prediction - Main Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-2xl animate-fade-in-up relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-float">⚖️</span>
              <div>
                <h2 className="text-xl font-bold">پیش‌بینی وزن</h2>
                <p className="text-emerald-50 text-xs mt-0.5">
                  {weight.dataPoints} داده ثبت‌شده
                </p>
              </div>
            </div>
          </div>

          {!weight.enoughData ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-sm">
              <p className="font-medium mb-1">📊 داده کافی نداری</p>
              <p className="text-emerald-50 text-xs">
                برای پیش‌بینی، حداقل ۳ بار وزن ثبت کن
              </p>
            </div>
          ) : !weight.target ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-sm">
              <p className="font-medium mb-1">🎯 هدف وزنی نداری</p>
              <p className="text-emerald-50 text-xs">
                توی پروفایل، وزن هدفت رو تنظیم کن
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-50 mb-1">وزن فعلی</p>
                  <p className="text-2xl font-bold">{weight.current}</p>
                  <p className="text-[10px] text-emerald-50">kg</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-50 mb-1">هدف</p>
                  <p className="text-2xl font-bold">{weight.target}</p>
                  <p className="text-[10px] text-emerald-50">kg</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-50 mb-1">روند هفتگی</p>
                  <p className="text-2xl font-bold">
                    {weight.trendPerWeek > 0 ? '+' : ''}
                    {weight.trendPerWeek}
                  </p>
                  <p className="text-[10px] text-emerald-50">kg/هفته</p>
                </div>
              </div>

              {weight.prediction ? (
                <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-sm text-emerald-50 mb-1">
                    🎉 با این روند، به هدفت می‌رسی:
                  </p>
                  <p className="text-3xl font-bold mb-1">
                    {formatDays(weight.prediction.days)}
                  </p>
                  <p className="text-xs text-emerald-50">
                    📅 حدوداً {formatDate(weight.prediction.date)}
                  </p>
                </div>
              ) : (
                <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-4 text-sm">
                  <p className="font-medium mb-1">⚠️ روند فعلی مناسب نیست</p>
                  <p className="text-emerald-50 text-xs">
                    وزن فعلی داری از هدفت دور می‌شی. رژیم یا برنامه‌ت رو بازبینی کن
                  </p>
                </div>
              )}

              {/* 30/60 Days */}
              {weight.in30Days !== null && weight.in60Days !== null && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-xs text-emerald-50">۳۰ روز دیگه</p>
                    <p className="text-lg font-bold">{weight.in30Days} kg</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-xs text-emerald-50">۶۰ روز دیگه</p>
                    <p className="text-lg font-bold">{weight.in60Days} kg</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Grid: Workouts + Water */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workouts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-1 card-hover">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🏋️</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              پیش‌بینی ورزش
            </h2>
          </div>

          {!workouts.enoughData ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              برای پیش‌بینی، حداقل ۲ تمرین ثبت کن
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  میانگین هفتگی
                </span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {workouts.avgWorkoutsPerWeek}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  تمرینات ۳۰ روز اخیر
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {workouts.last30Days}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                  🔮 پیش‌بینی ۳۰ روز آینده
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {workouts.predictedWorkoutsNext30Days} تمرین
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Water */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-2 card-hover">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💧</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              پیش‌بینی آب
            </h2>
          </div>

          {!water.enoughData ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              برای پیش‌بینی، حداقل ۳ روز آب ثبت کن
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  میانگین روزانه
                </span>
                <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                  {water.avgDaily} ml
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  رسیدن به هدف
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {water.successRate}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  روزهای موفق
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {water.metDays} / {water.totalDays}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-cyan-400 to-blue-500 transition-all duration-700"
                  style={{ width: `${water.successRate}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Calories */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-3 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔥</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            پیش‌بینی کالری
          </h2>
        </div>

        {!calories.enoughData ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            برای پیش‌بینی، حداقل ۳ روز غذا ثبت کن
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                میانگین روزانه
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {calories.avgDaily}
              </p>
              <p className="text-[10px] text-slate-500">kcal</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                بیشترین روز
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {calories.maxDay}
              </p>
              <p className="text-[10px] text-slate-500">kcal</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                کمترین روز
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {calories.minDay}
              </p>
              <p className="text-[10px] text-slate-500">kcal</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                پیش‌بینی هفته
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {calories.predictedNext7Days}
              </p>
              <p className="text-[10px] text-slate-500">kcal</p>
            </div>
          </div>
        )}
      </div>

      {/* Goals Predictions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in-up delay-4 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎯</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            پیش‌بینی اهداف
          </h2>
        </div>

        {goals.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            هنوز هدف فعالی نداری. از صفحه اهداف یه هدف جدید بساز
          </p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalPredictionCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-sm text-blue-700 dark:text-blue-300 animate-fade-in-up delay-5">
        <p className="font-medium mb-1">🧠 پیش‌بینی چطور کار می‌کنه؟</p>
        <p className="text-xs opacity-90 leading-relaxed">
          این پیش‌بینی‌ها بر اساس داده‌های گذشته‌ت با الگوریتم Linear Regression
          محاسبه می‌شن. هرچی داده بیشتری ثبت کنی، پیش‌بینی دقیق‌تر می‌شه. این
          پیش‌بینی‌ها فقط تخمین هستن و به عوامل مختلفی بستگی دارن.
        </p>
      </div>
    </div>
  );
}

function GoalPredictionCard({ goal }: { goal: GoalPrediction }) {
  const progressColor =
    goal.progress >= 100
      ? 'text-blue-600 dark:text-blue-400'
      : goal.onTrack
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-orange-600 dark:text-orange-400';

  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {goal.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {goal.currentValue} / {goal.targetValue}
          </p>
        </div>
        <span className={`text-lg font-bold ${progressColor}`}>
          {goal.progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-l from-emerald-400 to-cyan-500 transition-all duration-700"
          style={{ width: `${goal.progress}%` }}
        />
      </div>

      {/* Prediction */}
      {goal.estimatedDays > 0 && goal.estimatedDate ? (
        <div
          className={`flex items-start gap-2 p-3 rounded-lg ${
            goal.onTrack
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
          }`}
        >
          <span className="text-lg shrink-0">
            {goal.onTrack ? '✅' : '⚠️'}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium mb-0.5">
              {goal.onTrack
                ? 'با این روند، سر وقت به هدف می‌رسی'
                : `حدود ${goal.daysLate} روز دیرتر می‌رسی`}
            </p>
            <p className="text-xs opacity-90">
              تخمین: {formatDays(goal.estimatedDays)} •{' '}
              {formatDate(goal.estimatedDate)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          داده کافی برای پیش‌بینی نداری
        </p>
      )}
    </div>
  );
}