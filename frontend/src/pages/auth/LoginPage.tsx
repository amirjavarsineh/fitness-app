import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { extractErrorMessage } from '../../utils/errorMessages';
import { useTranslation } from '../../i18n/useTranslation';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { t } = useTranslation();

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('auth.email') + ' ' + t('common.required'));
      return;
    }
    if (!password) {
      setError(t('auth.password') + ' ' + t('common.required'));
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 mb-4 text-3xl shadow-lg shadow-emerald-500/30 animate-float">
            💪
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fitness App</h1>
          <p className="text-sm text-slate-400">{t('auth.appName')}</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-transparent dark:border-slate-800 animate-fade-in-up delay-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {t('auth.welcomeBack')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('auth.loginSubtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-wiggle">
              <span className="text-lg shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="example@email.com"
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {loading ? t('auth.loggingIn') : t('auth.loginButton')}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors"
            >
              {t('auth.registerLink')}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">{t('auth.madeWith')}</p>
      </div>
    </div>
  );
}