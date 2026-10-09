import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import {
  profileService,
  type UpsertProfileDto,
  type ActivityLevel,
  type GoalType,
} from '../services/profile.service';
import { useTranslation } from '../i18n/useTranslation';

const ACTIVITY_LEVELS: {
  value: ActivityLevel;
  labelKey: string;
  emoji: string;
}[] = [
  { value: 'SEDENTARY', labelKey: 'profile.activitySedentary', emoji: '🪑' },
  { value: 'LIGHTLY_ACTIVE', labelKey: 'profile.activityLightly', emoji: '🚶' },
  { value: 'MODERATELY_ACTIVE', labelKey: 'profile.activityModerately', emoji: '🏃' },
  { value: 'VERY_ACTIVE', labelKey: 'profile.activityVery', emoji: '🏋️' },
  { value: 'EXTRA_ACTIVE', labelKey: 'profile.activityExtra', emoji: '🔥' },
];

const GOALS: { value: GoalType; labelKey: string; emoji: string }[] = [
  { value: 'LOSE_WEIGHT', labelKey: 'profile.goalLoseWeight', emoji: '⬇️' },
  { value: 'MAINTAIN_WEIGHT', labelKey: 'profile.goalMaintainWeight', emoji: '⚖️' },
  { value: 'GAIN_MUSCLE', labelKey: 'profile.goalGainMuscle', emoji: '💪' },
];

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpsertProfileDto>();

  const gender = watch('gender');
  const activityLevel = watch('activityLevel');
  const goal = watch('goal');

  useEffect(() => {
    if (profile) reset(profile);
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: profileService.upsertProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t('profile.title')}
        </h1>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-pulse-soft h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('profile.title')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('profile.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} noValidate>
        {/* Body Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-fade-in-up delay-1 card-hover">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📋</span> {t('profile.bodyInfo')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('profile.ageLabel')}
              </label>
              <input
                type="number"
                {...register('age', {
                  required: t('profile.ageRequired'),
                  valueAsNumber: true,
                  min: { value: 1, message: t('profile.invalid') },
                })}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.age && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.age.message}
                </span>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('profile.weightLabel')}
              </label>
              <input
                type="number"
                step="0.1"
                {...register('weight', {
                  required: t('profile.weightRequired'),
                  valueAsNumber: true,
                  min: { value: 1, message: t('profile.invalid') },
                })}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.weight && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.weight.message}
                </span>
              )}
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('profile.heightLabel')}
              </label>
              <input
                type="number"
                step="0.1"
                {...register('height', {
                  required: t('profile.heightRequired'),
                  valueAsNumber: true,
                  min: { value: 1, message: t('profile.invalid') },
                })}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.height && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.height.message}
                </span>
              )}
            </div>

            {/* Target Weight */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('profile.targetWeightLabel')}
              </label>
              <input
                type="number"
                step="0.1"
                {...register('targetWeight', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
                placeholder={t('profile.targetWeightPlaceholder')}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Gender */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-fade-in-up delay-2 card-hover">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>👤</span> {t('profile.genderSection')}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('gender', 'MALE', { shouldValidate: true })}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:scale-105 ${
                gender === 'MALE'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <span className="text-2xl">👨</span>
              <span className="text-sm font-medium">{t('profile.male')}</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('gender', 'FEMALE', { shouldValidate: true })}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:scale-105 ${
                gender === 'FEMALE'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <span className="text-2xl">👩</span>
              <span className="text-sm font-medium">{t('profile.female')}</span>
            </button>
          </div>

          <input
            type="hidden"
            {...register('gender', { required: t('profile.genderRequired') })}
          />

          {errors.gender && (
            <span className="text-xs text-red-500 mt-2 block animate-wiggle">
              {errors.gender.message}
            </span>
          )}
        </div>

        {/* Activity Level */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-fade-in-up delay-3 card-hover">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🏃</span> {t('profile.activitySection')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {ACTIVITY_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() =>
                  setValue('activityLevel', level.value, { shouldValidate: true })
                }
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 hover:scale-105 ${
                  activityLevel === level.value
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className="text-xl">{level.emoji}</span>
                <span className="text-xs font-medium text-center">
                  {t(level.labelKey as never)}
                </span>
              </button>
            ))}
          </div>

          <input
            type="hidden"
            {...register('activityLevel', { required: t('profile.activityRequired') })}
          />

          {errors.activityLevel && (
            <span className="text-xs text-red-500 mt-2 block animate-wiggle">
              {errors.activityLevel.message}
            </span>
          )}
        </div>

        {/* Goal */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-4 animate-fade-in-up delay-4 card-hover">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🎯</span> {t('profile.goalSection')}
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {GOALS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setValue('goal', g.value, { shouldValidate: true })}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:scale-105 ${
                  goal === g.value
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className="text-sm font-medium text-center">
                  {t(g.labelKey as never)}
                </span>
              </button>
            ))}
          </div>

          <input
            type="hidden"
            {...register('goal', { required: t('profile.goalRequired') })}
          />

          {errors.goal && (
            <span className="text-xs text-red-500 mt-2 block animate-wiggle">
              {errors.goal.message}
            </span>
          )}
        </div>

        {/* Feedback */}
        {mutation.isSuccess && (
          <div className="mb-4 flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm animate-bounce-in">
            <span className="text-lg">✅</span>
            <span>{t('profile.saveSuccess')}</span>
          </div>
        )}
        {mutation.isError && (
          <div className="mb-4 flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
            <span className="text-lg">⚠️</span>
            <span>{t('profile.saveError')}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-14 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] animate-fade-in-up delay-5"
        >
          {mutation.isPending
            ? t('common.saving')
            : `💾 ${t('profile.saveButton')}`}
        </button>
      </form>
    </div>
  );
}