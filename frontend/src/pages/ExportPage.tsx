import { useState } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n/useTranslation';

const EXPORTS = [
  {
    id: 'workouts',
    labelKey: 'export.workoutsLabel',
    descKey: 'export.workoutsDesc',
    emoji: '🏋️',
    color: 'blue',
  },
  {
    id: 'nutrition',
    labelKey: 'export.nutritionLabel',
    descKey: 'export.nutritionDesc',
    emoji: '🍎',
    color: 'emerald',
  },
  {
    id: 'weight',
    labelKey: 'export.weightLabel',
    descKey: 'export.weightDesc',
    emoji: '⚖️',
    color: 'purple',
  },
  {
    id: 'water',
    labelKey: 'export.waterLabel',
    descKey: 'export.waterDesc',
    emoji: '💧',
    color: 'cyan',
  },
  {
    id: 'goals',
    labelKey: 'export.goalsLabel',
    descKey: 'export.goalsDesc',
    emoji: '🎯',
    color: 'orange',
  },
] as const;

export default function ExportPage() {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = async (id: string, filename: string) => {
    setDownloading(id);
    try {
      const res = await api.get(`/export/${id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert(t('export.downloadError'));
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('export.title')} 📥
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('export.subtitle')}
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6 animate-fade-in-up delay-1">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">{t('export.infoTitle')}</p>
            <p className="text-xs opacity-90">{t('export.infoDesc')}</p>
          </div>
        </div>
      </div>

      {/* Export Cards */}
      <div className="space-y-3">
        {EXPORTS.map((item, index) => {
          const label = t(item.labelKey as never);
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all animate-fade-in-up card-hover flex items-center justify-between gap-4"
              style={{ animationDelay: `${0.05 + index * 0.05}s` }}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    {
                      blue: 'bg-blue-50 dark:bg-blue-900/30',
                      emerald: 'bg-emerald-50 dark:bg-emerald-900/30',
                      purple: 'bg-purple-50 dark:bg-purple-900/30',
                      cyan: 'bg-cyan-50 dark:bg-cyan-900/30',
                      orange: 'bg-orange-50 dark:bg-orange-900/30',
                    }[item.color]
                  }`}
                >
                  {item.emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t(item.descKey as never)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleExport(item.id, label)}
                disabled={downloading === item.id}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shrink-0"
              >
                {downloading === item.id ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>{t('export.downloading')}</span>
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    <span>{t('export.download')}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}