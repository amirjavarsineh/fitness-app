import {
  Activity,
  Heart,
  Flame,
  Trophy,
  Sparkles,
  Crown,
  Zap,
  User,
  Award,
  Ruler,
  Dumbbell,
} from 'lucide-react';
import type {
  AdvancedCalculation,
  CategoryInfo,
} from '../services/calculations.service';
import { useTranslation } from '../i18n/useTranslation';

// =====================================================
//              Color Map
// =====================================================

const COLOR_MAP: Record<
  string,
  { gradient: string; bg: string; text: string; border: string }
> = {
  emerald: {
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/50',
  },
  blue: {
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800/50',
  },
  amber: {
    gradient: 'from-amber-500 to-orange-600',
    bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800/50',
  },
  orange: {
    gradient: 'from-orange-500 to-red-600',
    bg: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800/50',
  },
  red: {
    gradient: 'from-red-500 to-rose-600',
    bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800/50',
  },
  purple: {
    gradient: 'from-purple-500 to-fuchsia-600',
    bg: 'from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800/50',
  },
  slate: {
    gradient: 'from-slate-500 to-slate-700',
    bg: 'from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
  },
  rose: {
    gradient: 'from-rose-500 to-pink-600',
    bg: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800/50',
  },
  cyan: {
    gradient: 'from-cyan-500 to-sky-600',
    bg: 'from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800/50',
  },
};

function getColors(color: string) {
  return COLOR_MAP[color] ?? COLOR_MAP.emerald;
}

// =====================================================
//              Component
// =====================================================

interface Props {
  advanced: AdvancedCalculation;
  hasMeasurements: boolean;
}

export default function AdvancedCalculations({ advanced, hasMeasurements }: Props) {
  const { t, fmt } = useTranslation();

  const tt = (key: string): string => t(key as never);

  return (
    <div className="space-y-6">
      {/* ===== Health Score Hero ===== */}
      <HealthScoreHero
        score={advanced.healthScore}
        category={advanced.healthScoreCategory}
        metabolicAge={advanced.metabolicAge}
        tt={tt}
        fmt={fmt}
      />

      {/* ===== Section: Body Composition ===== */}
      <SectionHeader
        Icon={Dumbbell}
        title={tt('calculations.sectionBodyComposition')}
        subtitle={tt('calculations.sectionBodyCompositionDesc')}
        gradient="from-blue-500 to-indigo-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdvancedCard
          Icon={Activity}
          label={tt('calculations.leanBodyMass')}
          description={tt('calculations.leanBodyMassDesc')}
          value={fmt(advanced.leanBodyMass)}
          unit="kg"
          gradient="from-blue-500 to-indigo-600"
          tt={tt}
          delay={1}
        />
        <AdvancedCard
          Icon={Dumbbell}
          label={tt('calculations.skeletalMuscleMass')}
          description={tt('calculations.skeletalMuscleMassDesc')}
          value={fmt(advanced.skeletalMuscleMass)}
          unit="kg"
          gradient="from-cyan-500 to-blue-600"
          tt={tt}
          delay={2}
        />
        <AdvancedCard
          Icon={Trophy}
          label={tt('calculations.ffmi')}
          description={tt('calculations.ffmiDesc')}
          value={fmt(advanced.ffmi)}
          unit=""
          gradient={getColors(advanced.ffmiCategory.color).gradient}
          badge={advanced.ffmiCategory}
          tt={tt}
          delay={3}
        />
      </div>

      {/* ===== Section: Health Ratios ===== */}
      <SectionHeader
        Icon={Heart}
        title={tt('calculations.sectionHealthRatios')}
        subtitle={tt('calculations.sectionHealthRatiosDesc')}
        gradient="from-rose-500 to-pink-600"
      />

      {!hasMeasurements ? (
        <NoMeasurementsWarning tt={tt} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {advanced.whr !== null && advanced.whrRisk && (
            <AdvancedCard
              Icon={Activity}
              label={tt('calculations.whr')}
              description={tt('calculations.whrDesc')}
              value={fmt(advanced.whr)}
              unit=""
              gradient={getColors(advanced.whrRisk.color).gradient}
              badge={advanced.whrRisk}
              tt={tt}
              delay={1}
            />
          )}
          {advanced.whtr !== null && advanced.whtrCategory && (
            <AdvancedCard
              Icon={Ruler}
              label={tt('calculations.whtr')}
              description={tt('calculations.whtrDesc')}
              value={fmt(advanced.whtr)}
              unit=""
              gradient={getColors(advanced.whtrCategory.color).gradient}
              badge={advanced.whtrCategory}
              tt={tt}
              delay={2}
            />
          )}
          {advanced.visceralFat !== null && advanced.visceralFatCategory && (
            <AdvancedCard
              Icon={Flame}
              label={tt('calculations.visceralFat')}
              description={tt('calculations.visceralFatDesc')}
              value={`\u200E${fmt(advanced.visceralFat)} / ${fmt(12)}`}
              unit=""
              gradient={getColors(advanced.visceralFatCategory.color).gradient}
              badge={advanced.visceralFatCategory}
              tt={tt}
              delay={3}
            />
          )}
        </div>
      )}

      {/* ===== Section: Fitness & Symmetry ===== */}
      {advanced.vTaper !== null && advanced.vTaperCategory && (
        <>
          <SectionHeader
            Icon={Crown}
            title={tt('calculations.sectionFitness')}
            subtitle={tt('calculations.sectionFitnessDesc')}
            gradient="from-amber-500 to-orange-600"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdvancedCard
              Icon={Crown}
              label={tt('calculations.vTaper')}
              description={tt('calculations.vTaperDesc')}
              value={fmt(advanced.vTaper)}
              unit=""
              gradient={getColors(advanced.vTaperCategory.color).gradient}
              badge={advanced.vTaperCategory}
              tt={tt}
              delay={1}
            />
            {advanced.symmetry !== null && (
              <AdvancedCard
                Icon={Sparkles}
                label={tt('calculations.symmetry')}
                description={tt('calculations.symmetryDesc')}
                value={fmt(advanced.symmetry)}
                unit=""
                gradient="from-violet-500 to-purple-600"
                tt={tt}
                delay={2}
              />
            )}
          </div>
        </>
      )}

      {/* ===== Section: Somatotype & Frame Size ===== */}
      <SectionHeader
        Icon={User}
        title={tt('calculations.sectionBodyType')}
        subtitle={tt('calculations.sectionBodyTypeDesc')}
        gradient="from-emerald-500 to-teal-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BodyTypeCard
          title={tt('calculations.somatotype')}
          type={tt(`calculations.somatotypeNames.${advanced.somatotype.typeKey}`)}
          description={tt(`calculations.${advanced.somatotype.descriptionKey}`)}
          color={advanced.somatotype.color}
          delay={1}
        />
        {advanced.frameSize && (
          <BodyTypeCard
            title={tt('calculations.frameSize')}
            type={tt(`calculations.frameSizeNames.${advanced.frameSize.sizeKey}`)}
            description={tt(`calculations.${advanced.frameSize.descriptionKey}`)}
            color="blue"
            delay={2}
          />
        )}
      </div>
    </div>
  );
}

// =====================================================
//              Sub Components
// =====================================================

function HealthScoreHero({
  score,
  category,
  metabolicAge,
  tt,
  fmt,
}: {
  score: number;
  category: CategoryInfo;
  metabolicAge: number;
  tt: (k: string) => string;
  fmt: (n: number) => string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 animate-fade-in-up">
      <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-32 h-32 shrink-0">
            <svg width="128" height="128" className="-rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="12"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 * (1 - score / 100)}
                style={{
                  transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{fmt(score)}</span>
                            <span className="text-[10px] opacity-80 font-semibold" dir="ltr">/ {fmt(100)}</span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold mb-2">
              <Award size={12} strokeWidth={2.5} />
              <span>{tt('calculations.healthScore')}</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {tt(`calculations.categories.${category.labelKey}`)}
            </p>
            <p className="text-xs text-white/80">{tt('calculations.healthScoreDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/20 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shrink-0">
            <Zap size={28} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[11px] opacity-80 font-semibold uppercase tracking-wider">
              {tt('calculations.metabolicAge')}
            </p>
            <p className="text-3xl font-bold">
              {fmt(metabolicAge)}
              <span className="text-sm font-normal ms-1.5 opacity-80">
                {tt('calculations.yearsOld')}
              </span>
            </p>
            <p className="text-[10px] text-white/80 mt-0.5">
              {tt('calculations.metabolicAgeDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  Icon,
  title,
  subtitle,
  gradient,
}: {
  Icon: typeof Activity;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <div className="flex items-center gap-3 animate-fade-in-up">
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg shrink-0`}
      >
        <Icon size={22} strokeWidth={2.2} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function AdvancedCard({
  Icon,
  label,
  description,
  value,
  unit,
  gradient,
  badge,
  tt,
  delay = 1,
}: {
  Icon: typeof Activity;
  label: string;
  description: string;
  value: string;
  unit: string;
  gradient: string;
  badge?: CategoryInfo;
  tt: (k: string) => string;
  delay?: number;
}) {
  return (
    <div
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all card-hover animate-fade-in-up delay-${delay}`}
    >
      <div
        className={`absolute -top-12 -end-12 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity pointer-events-none`}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform shrink-0`}
          >
            <Icon size={24} strokeWidth={2.2} />
          </div>
          {badge && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-bold bg-gradient-to-br ${getColors(
                badge.color
              ).gradient} text-white shadow-md`}
            >
              {tt(`calculations.categories.${badge.labelKey}`)}
            </span>
          )}
        </div>

        <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
          {label}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
          {description}
        </p>

        <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
          {unit && (
            <span className="text-xs text-slate-400 dark:text-slate-500 ms-1.5 font-normal">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function BodyTypeCard({
  title,
  type,
  description,
  color,
  delay = 1,
}: {
  title: string;
  type: string;
  description: string;
  color: string;
  delay?: number;
}) {
  const colors = getColors(color);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 border-2 ${colors.border} bg-gradient-to-br ${colors.bg} shadow-soft animate-fade-in-up delay-${delay}`}
    >
      <div
        className={`absolute -top-16 -end-16 w-40 h-40 rounded-full bg-gradient-to-br ${colors.gradient} opacity-10 blur-3xl pointer-events-none`}
      />
      <div className="relative">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}
          >
            <User size={26} strokeWidth={2.2} />
          </div>
          <p className={`text-2xl font-bold ${colors.text}`}>{type}</p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function NoMeasurementsWarning({ tt }: { tt: (k: string) => string }) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center animate-scale-in">
      <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white mx-auto mb-4 shadow-2xl shadow-rose-500/30 animate-float">
          <Ruler size={32} strokeWidth={2} />
        </div>
        <p className="text-base font-bold text-slate-900 dark:text-white mb-2">
          {tt('calculations.needMeasurements')}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {tt('calculations.needMeasurementsDesc')}
        </p>
      </div>
    </div>
  );
}