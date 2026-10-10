import { useState } from 'react';
import {
  Download,
  Info,
  Dumbbell,
  Apple,
  Scale,
  Droplets,
  Target,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import api from '../services/api';
import { useTranslation } from '../i18n/useTranslation';

// ==================== Exports Data ====================

const EXPORTS = [
  {
    id: 'workouts',
    labelKey: 'export.workoutsLabel',
    descKey: 'export.workoutsDesc',
    Icon: Dumbbell,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'nutrition',
    labelKey: 'export.nutritionLabel',
    descKey: 'export.nutritionDesc',
    Icon: Apple,
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    id: 'weight',
    labelKey: 'export.weightLabel',
    descKey: 'export.weightDesc',
    Icon: Scale,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'water',
    labelKey: 'export.waterLabel',
    descKey: 'export.waterDesc',
    Icon: Droplets,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'goals',
    labelKey: 'export.goalsLabel',
    descKey: 'export.goalsDesc',
    Icon: Target,
    gradient: 'from-orange-500 to-rose-500',
  },
] as const;

// ==================== Page ====================

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 blur-lg opacity-40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Download size={28} strokeWidth={2.2} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('export.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('export.subtitle')}
          </p>
        </div>
      </div>

      {/* ===== Info Box ===== */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-200/50 dark:border-sky-900/50 bg-gradient-to-br from-sky-50 via-cyan-50 to-indigo-50 dark:from-sky-950/30 dark:via-cyan-950/20 dark:to-indigo-950/30 p-5 shadow-soft animate-fade-in-up delay-1">
        <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shrink-0">
            <Info size={22} strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              {t('export.infoTitle')}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('export.infoDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Export Cards ===== */}
      <div className="space-y-3">
        {EXPORTS.map((item, index) => {
          const label = t(item.labelKey as never);
          const isDownloading = downloading === item.id;
          const ItemIcon = item.Icon;

          return (
            <div
              key={item.id}
              className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-elevated transition-all animate-fade-in-up card-hover flex items-center justify-between gap-4"
              style={{ animationDelay: `${0.05 + index * 0.05}s` }}
            >
              <div
                className={`absolute -top-16 -end-16 w-40 h-40 rounded-full bg-gradient-to-br ${item.gradient} opacity-[0.08] group-hover:opacity-[0.15] blur-3xl transition-opacity pointer-events-none`}
              />

              <div className="relative flex items-center gap-4 min-w-0 flex-1">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <ItemIcon size={26} strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {t(item.descKey as never)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleExport(item.id, label)}
                disabled={isDownloading}
                className={`btn-shine relative flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all shrink-0 ${
                  isDownloading
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                    : `bg-gradient-to-l ${item.gradient} text-white hover:scale-105`
                }`}
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                    <span className="hidden sm:inline">
                      {t('export.downloading')}
                    </span>
                  </>
                ) : (
                  <>
                    <Download size={18} strokeWidth={2.5} />
                    <span>{t('export.download')}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ===== Footer Tip ===== */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 animate-fade-in-up delay-6">
        <FileSpreadsheet size={14} strokeWidth={2.2} />
        <p>CSV files are compatible with Excel, Google Sheets, and Numbers</p>
      </div>
    </div>
  );
}