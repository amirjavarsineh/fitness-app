import { Download, Smartphone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTranslation } from '../i18n/useTranslation';

export default function InstallAppCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { canAutoInstall, isInstalled, isInstalling, install } = usePWAInstall();

  // اگه نصب شده، کارت رو نشون نده
  if (isInstalled) return null;

  const handleClick = async () => {
    if (canAutoInstall) {
      await install();
    } else {
      navigate('/install');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl shadow-emerald-500/30 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white animate-fade-in-up">
      <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -start-20 w-56 h-56 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shrink-0 animate-float">
            <Smartphone size={28} strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-1">
              {t('installApp.title')}
            </h3>
            <p className="text-white/85 text-sm max-w-md leading-relaxed">
              {t('installApp.subtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={handleClick}
          disabled={isInstalling}
          className="btn-shine w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-emerald-600 font-bold shadow-lg hover:bg-emerald-50 transition-all disabled:opacity-60 hover:scale-105 shrink-0"
        >
          {isInstalling ? (
            <>{t('installApp.installing')}</>
          ) : canAutoInstall ? (
            <>
              <Download size={18} strokeWidth={2.5} />
              {t('installApp.installButton')}
            </>
          ) : (
            <>
              {t('installApp.howToInstall')}
              <ArrowRight size={18} strokeWidth={2.5} className="rtl:rotate-180" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}