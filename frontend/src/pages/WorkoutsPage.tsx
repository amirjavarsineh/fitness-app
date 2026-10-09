import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/workout.service';

const WORKOUT_TYPE_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  CARDIO: { label: 'هوازی', emoji: '🏃', color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' },
  STRENGTH: { label: 'قدرتی', emoji: '💪', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
  FLEXIBILITY: { label: 'انعطاف', emoji: '🤸', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' },
  HIIT: { label: 'HIIT', emoji: '🔥', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' },
  YOGA: { label: 'یوگا', emoji: '🧘', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
  OTHER: { label: 'سایر', emoji: '⭐', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
};

export default function WorkoutsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: workouts, isLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: workoutService.getWorkouts,
  });

  const deleteMutation = useMutation({
    mutationFn: workoutService.deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">تمرینات من</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-52 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse-soft"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">تمرینات من</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {workouts?.length ?? 0} تمرین ثبت شده
          </p>
        </div>
        <button
          onClick={() => navigate('/workouts/new')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
        >
          <span className="text-lg">+</span>
          <span>تمرین جدید</span>
        </button>
      </div>

      {/* Empty State */}
      {!workouts || workouts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-float">🏋️</div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            هنوز تمرینی ثبت نکردی
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            اولین تمرینت رو بساز و مسیر تناسب اندام رو شروع کن
          </p>
          <button
            onClick={() => navigate('/workouts/new')}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all hover:scale-105"
          >
            شروع کن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map((workout, index) => {
            const typeInfo =
              WORKOUT_TYPE_LABELS[workout.type] ?? WORKOUT_TYPE_LABELS.OTHER;

            const exerciseNames = workout.exercises
              .map((ex) => ex.name)
              .filter(Boolean);

            return (
              <div
                key={workout.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group animate-fade-in-up card-hover"
                style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${typeInfo.color} flex items-center gap-1 transition-transform group-hover:scale-105`}
                  >
                    <span>{typeInfo.emoji}</span>
                    <span>{typeInfo.label}</span>
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {workout.exercises.length} حرکت
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 truncate">
                  {workout.name ?? 'بدون نام'}
                </h3>

                {/* Exercise names */}
                {exerciseNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {exerciseNames.slice(0, 4).map((name, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs transition-transform hover:scale-105"
                      >
                        <span className="text-slate-400 dark:text-slate-500">•</span>
                        <span>{name}</span>
                      </span>
                    ))}
                    {exerciseNames.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        +{exerciseNames.length - 4} حرکت
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                {workout.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                    {workout.description}
                  </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{workout.duration} دقیقه</span>
                  </div>
                  {workout.caloriesBurned && (
                    <div className="flex items-center gap-1">
                      <span>🔥</span>
                      <span>{workout.caloriesBurned} کالری</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/workouts/${workout.id}/edit`)}
                    className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('آیا از حذف این تمرین مطمئنی؟')) {
                        deleteMutation.mutate(workout.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}