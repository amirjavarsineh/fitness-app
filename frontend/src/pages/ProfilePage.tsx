import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import {
  ClipboardList,
  User,
  Save,
  Footprints,
  Activity,
  Target,
  Flame,
  Armchair,
  Bike,
  Dumbbell,
  TrendingDown,
  Scale,
  Mars,
  Venus,
} from 'lucide-react';
import {
  profileService,
  type UpsertProfileDto,
  type ActivityLevel,
  type GoalType,
} from '../services/profile.service';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Data ====================

const ACTIVITY_LEVELS: {
  value: ActivityLevel;
  labelKey: string;
  Icon: typeof Footprints;
  gradient: string;
}[] = [
  { value: 'SEDENTARY', labelKey: 'profile.activitySedentary', Icon: Armchair, gradient: 'from-slate-500 to-slate-700' },
  { value: 'LIGHTLY_ACTIVE', labelKey: 'profile.activityLightly', Icon: Footprints, gradient: 'from-blue-500 to-cyan-500' },
  { value: 'MODERATELY_ACTIVE', labelKey: 'profile.activityModerately', Icon: Bike, gradient: 'from-cyan-500 to-teal-500' },
  { value: 'VERY_ACTIVE', labelKey: 'profile.activityVery', Icon: Dumbbell, gradient: 'from-emerald-500 to-green-500' },
  { value: 'EXTRA_ACTIVE', labelKey: 'profile.activityExtra', Icon: Flame, gradient: 'from-orange-500 to-red-500' },
];

const GOALS: {
  value: GoalType;
  labelKey: string;
  Icon: typeof TrendingDown;
  gradient: string;
}[] = [
  { value: 'LOSE_WEIGHT', labelKey: 'profile.goalLoseWeight', Icon: TrendingDown, gradient: 'from-emerald-500 to-teal-500' },
  { value: 'MAINTAIN_WEIGHT', labelKey: 'profile.goalMaintainWeight', Icon: Scale, gradient: 'from-blue-500 to-indigo-500' },
  { value: 'GAIN_MUSCLE', labelKey: 'profile.goalGainMuscle', Icon: Dumbbell, gradient: 'from-orange-500 to-rose-500' },
];

// ==================== Page ====================

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
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
        <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse-soft" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
            <User size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('profile.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('profile.subtitle')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} noValidate className="space-y-6">
        {/* ===== Body Info ===== */}
        <SectionCard
          Icon={ClipboardList}
          title={t('profile.bodyInfo')}
          gradient="from-emerald-500 to-teal-500"
          delay="delay-1"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FieldInput
              label={t('profile.ageLabel')}
              error={errors.age?.message}
              register={register('age', {
                required: t('profile.ageRequired'),
                valueAsNumber: true,
                min: { value: 1, message: t('profile.invalid') },
              })}
            />
            <FieldInput
              label={t('profile.weightLabel')}
              error={errors.weight?.message}
              step="0.1"
              register={register('weight', {
                required: t('profile.weightRequired'),
                valueAsNumber: true,
                min: { value: 1, message: t('profile.invalid') },
              })}
            />
            <FieldInput
              label={t('profile.heightLabel')}
              error={errors.height?.message}
              step="0.1"
              register={register('height', {
                required: t('profile.heightRequired'),
                valueAsNumber: true,
                min: { value: 1, message: t('profile.invalid') },
              })}
            />
            <FieldInput
              label={t('profile.targetWeightLabel')}
              placeholder={t('profile.targetWeightPlaceholder')}
              step="0.1"
              register={register('targetWeight', {
                setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
              })}
            />
          </div>
        </SectionCard>

        {/* ===== Gender ===== */}
        <SectionCard
          Icon={User}
          title={t('profile.genderSection')}
          gradient="from-violet-500 to-fuchsia-500"
          delay="delay-2"
        >
          <div className="grid grid-cols-2 gap-3">
            <SelectTile
              Icon={Mars}
              label={t('profile.male')}
              isActive={gender === 'MALE'}
              gradient="from-blue-500 to-cyan-500"
              onClick={() => setValue('gender', 'MALE', { shouldValidate: true })}
            />
            <SelectTile
              Icon={Venus}
              label={t('profile.female')}
              isActive={gender === 'FEMALE'}
              gradient="from-pink-500 to-rose-500"
              onClick={() => setValue('gender', 'FEMALE', { shouldValidate: true })}
            />
          </div>
          <input
            type="hidden"
            {...register('gender', { required: t('profile.genderRequired') })}
          />
          {errors.gender && (
            <p className="text-xs text-red-500 mt-3 flex items-center gap-1.5 animate-wiggle">
              <span>⚠️</span>
              <span>{errors.gender.message}</span>
            </p>
          )}
        </SectionCard>

        {/* ===== Activity Level ===== */}
        <SectionCard
          Icon={Activity}
          title={t('profile.activitySection')}
          gradient="from-cyan-500 to-blue-500"
          delay="delay-3"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {ACTIVITY_LEVELS.map((level) => {
              const LevelIcon = level.Icon;
              return (
                <SelectTile
                  key={level.value}
                  Icon={LevelIcon}
                  label={t(level.labelKey as never)}
                  isActive={activityLevel === level.value}
                  gradient={level.gradient}
                  onClick={() =>
                    setValue('activityLevel', level.value, { shouldValidate: true })
                  }
                  compact
                />
              );
            })}
          </div>
          <input
            type="hidden"
            {...register('activityLevel', { required: t('profile.activityRequired') })}
          />
          {errors.activityLevel && (
            <p className="text-xs text-red-500 mt-3 flex items-center gap-1.5 animate-wiggle">
              <span>⚠️</span>
              <span>{errors.activityLevel.message}</span>
            </p>
          )}
        </SectionCard>

        {/* ===== Goal ===== */}
        <SectionCard
          Icon={Target}
          title={t('profile.goalSection')}
          gradient="from-pink-500 to-rose-500"
          delay="delay-4"
        >
          <div className="grid grid-cols-3 gap-3">
            {GOALS.map((g) => {
              const GoalIcon = g.Icon;
              return (
                <SelectTile
                  key={g.value}
                  Icon={GoalIcon}
                  label={t(g.labelKey as never)}
                  isActive={goal === g.value}
                  gradient={g.gradient}
                  onClick={() => setValue('goal', g.value, { shouldValidate: true })}
                />
              );
            })}
          </div>
          <input type="hidden" {...register('goal', { required: t('profile.goalRequired') })} />
          {errors.goal && (
            <p className="text-xs text-red-500 mt-3 flex items-center gap-1.5 animate-wiggle">
              <span>⚠️</span>
              <span>{errors.goal.message}</span>
            </p>
          )}
        </SectionCard>

        {/* ===== Feedback ===== */}
        {mutation.isSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 animate-bounce-in">
            <span className="text-2xl">✅</span>
            <span className="font-semibold">{t('profile.saveSuccess')}</span>
          </div>
        )}
        {mutation.isError && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 animate-wiggle">
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold">{t('profile.saveError')}</span>
          </div>
        )}

        {/* ===== Submit ===== */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-shine w-full h-14 rounded-2xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-2 animate-fade-in-up delay-5"
        >
          <Save size={22} strokeWidth={2.5} />
          {mutation.isPending ? t('common.saving') : t('profile.saveButton')}
        </button>
      </form>
    </div>
  );
}

// ==================== Sub Components ====================

function SectionCard({
  Icon,
  title,
  gradient,
  delay,
  children,
}: {
  Icon: typeof User;
  title: string;
  gradient: string;
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up ${delay} card-hover`}
    >
      <div
        className={`absolute -top-20 -end-20 w-64 h-64 rounded-full bg-gradient-to-br ${gradient} opacity-[0.05] group-hover:opacity-[0.1] blur-3xl transition-opacity pointer-events-none`}
      />

      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
          >
            <Icon size={22} strokeWidth={2.2} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldInput({
  label,
  placeholder,
  step,
  error,
  register,
}: {
  label: string;
  placeholder?: string;
  step?: string;
  error?: string;
  register: ReturnType<ReturnType<typeof useForm>['register']>;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <input
        type="number"
        step={step}
        placeholder={placeholder}
        {...register}
        className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
      />
      {error && (
        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function SelectTile({
  Icon,
  label,
  isActive,
  gradient,
  onClick,
  compact = false,
}: {
  Icon: typeof User;
  label: string;
  isActive: boolean;
  gradient: string;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl transition-all ${
        compact ? 'p-3' : 'p-4'
      } flex flex-col items-center gap-1.5 ${
        isActive
          ? 'text-white shadow-lg scale-105'
          : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
      }`}
    >
      {isActive && (
        <>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          />
          <div
            className={`absolute -top-8 -end-8 w-20 h-20 rounded-full bg-white/20 blur-2xl pointer-events-none`}
          />
        </>
      )}
      <Icon
        size={compact ? 20 : 22}
        strokeWidth={2.5}
        className="relative"
      />
      <span className={`relative font-semibold text-center ${compact ? 'text-[11px]' : 'text-xs'}`}>
        {label}
      </span>
    </button>
  );
}