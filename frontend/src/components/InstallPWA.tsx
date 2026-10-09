import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = Number(dismissed);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[100] animate-fade-in-up" dir="rtl">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-2xl shrink-0 animate-float">
          💪
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">
            نصب اپلیکیشن 📱
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            اپلیکیشن رو روی گوشیت نصب کن و مثل یه اپ واقعی استفاده کن
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 py-2 rounded-lg bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-xs font-medium transition-all hover:scale-105"
            >
              نصب کن
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs transition-colors"
            >
              بعداً
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 text-xs shrink-0"
          aria-label="بستن"
        >
          ✕
        </button>
      </div>
    </div>
  );
}