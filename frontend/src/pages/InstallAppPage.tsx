import { useState } from 'react';
import {
  Download,
  Smartphone,
  Share,
  MoreVertical,
  Plus,
  CheckCircle2,
  Zap,
  WifiOff,
  Bell,
  Monitor,
  Lightbulb,
  Apple,
  Shield,
} from 'lucide-react';
import { usePWAInstall, type Platform } from '../hooks/usePWAInstall';
import { useTranslation } from '../i18n/useTranslation';

export default function InstallAppPage() {
  const { t } = useTranslation();
  const { canAutoInstall, isInstalled, platform, isInstalling, install } =
    usePWAInstall();

  const [activeTab, setActiveTab] = useState<Exclude<Platform, 'unknown'>>(
    platform === 'unknown' ? 'android' : platform
  );

  const features = [
    {
      Icon: WifiOff,
      titleKey: 'installApp.features.offline',
      descKey: 'installApp.features.offlineDesc',
      gradient: 'from-slate-500 to-slate-700',
    },
    {
      Icon: Zap,
      titleKey: 'installApp.features.fast',
      descKey: 'installApp.features.fastDesc',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      Icon: Smartphone,
      titleKey: 'installApp.features.icon',
      descKey: 'installApp.features.iconDesc',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      Icon: Bell,
      titleKey: 'installApp.features.notify',
      descKey: 'installApp.features.notifyDesc',
      gradient: 'from-pink-500 to-rose-600',
    },
  ];

  const tabs: { value: Exclude<Platform, 'unknown'>; labelKey: string; Icon: typeof Smartphone }[] = [
    { value: 'ios', labelKey: 'installApp.platformIos', Icon: Apple },
    { value: 'android', labelKey: 'installApp.platformAndroid', Icon: Smartphone },
    { value: 'desktop', labelKey: 'installApp.platformDesktop', Icon: Monitor },
  ];

  const stepsByTab: Record<Exclude<Platform, 'unknown'>, { textKey: string; Icon: typeof Share }[]> = {
    ios: [
      { textKey: 'installApp.ios.step1', Icon: Share },
      { textKey: 'installApp.ios.step2', Icon: Plus },
      { textKey: 'installApp.ios.step3', Icon: CheckCircle2 },
    ],
    android: [
      { textKey: 'installApp.android.step1', Icon: MoreVertical },
      { textKey: 'installApp.android.step2', Icon: Plus },
      { textKey: 'installApp.android.step3', Icon: CheckCircle2 },
    ],
    desktop: [
      { textKey: 'installApp.desktop.step1', Icon: Plus },
      { textKey: 'installApp.desktop.step2', Icon: Monitor },
      { textKey: 'installApp.desktop.step3', Icon: CheckCircle2 },
    ],
  };

  const notesByTab: Record<Exclude<Platform, 'unknown'>, string> = {
    ios: 'installApp.ios.note',
    android: 'installApp.android.note',
    desktop: 'installApp.desktop.note',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
            <Download size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('installApp.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('installApp.subtitle')}
          </p>
        </div>
      </div>

      {/* ===== Already Installed ===== */}
      {isInstalled && (
        <div className="flex items-start gap-3 p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 animate-bounce-in">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <CheckCircle2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-emerald-700 dark:text-emerald-300">
              {t('installApp.alreadyInstalled')}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
              {t('installApp.alreadyInstalledDesc')}
            </p>
          </div>
        </div>
      )}

      {/* ===== Auto Install Hero ===== */}
      {!isInstalled && canAutoInstall && (
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 animate-fade-in-up delay-1">
          <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shrink-0 animate-float">
                <Zap size={32} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">
                  {t('installApp.autoInstallAvailable')}
                </h2>
                <p className="text-white/85 text-sm">
                  {t('installApp.autoInstallDesc')}
                </p>
              </div>
            </div>
            <button
              onClick={install}
              disabled={isInstalling}
              className="btn-shine w-full md:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-emerald-600 font-bold shadow-lg hover:bg-emerald-50 transition-all disabled:opacity-60 hover:scale-105 shrink-0 text-base"
            >
              <Download size={20} strokeWidth={2.5} />
              {isInstalling ? t('installApp.installing') : t('installApp.installButton')}
            </button>
          </div>
        </div>
      )}

      {/* ===== Features ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-2 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Lightbulb size={22} strokeWidth={2.2} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('installApp.features.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f, i) => {
            const FeatureIcon = f.Icon;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 border border-slate-200 dark:border-slate-700 card-hover"
              >
                <div
                  className={`absolute -top-8 -end-8 w-24 h-24 rounded-full bg-gradient-to-br ${f.gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity pointer-events-none`}
                />
                <div className="relative flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <FeatureIcon size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {t(f.titleKey as never)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t(f.descKey as never)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Guide ===== */}
      {!isInstalled && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft animate-fade-in-up delay-3 card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
              <Shield size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('installApp.guideTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('installApp.guideSubtitle')}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {tabs.map((tab) => {
              const TabIcon = tab.Icon;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`relative overflow-hidden p-3 rounded-2xl transition-all flex flex-col items-center gap-1.5 ${
                    isActive
                      ? 'text-white shadow-lg scale-105'
                      : 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-600" />
                  )}
                  <TabIcon size={20} strokeWidth={2.5} className="relative" />
                  <span className="relative text-xs font-semibold">
                    {t(tab.labelKey as never)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {stepsByTab[activeTab].map((step, i) => {
              const StepIcon = step.Icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-l from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 border border-slate-100 dark:border-slate-700 animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
                      <StepIcon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="absolute -top-1.5 -end-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center shadow-md">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
                    {t(step.textKey as never)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs">
            <Lightbulb size={16} strokeWidth={2.5} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t('installApp.tip')}: </span>
              <span>{t(notesByTab[activeTab] as never)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}