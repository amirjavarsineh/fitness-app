import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Dumbbell,
  Apple,
  BarChart3,
  Trophy,
  Mail,
  Lock,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { extractErrorMessage } from '../../utils/errorMessages';
import { useTranslation } from '../../i18n/useTranslation';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { t, isRTL } = useTranslation();

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
    <div className="min-h-screen flex bg-slate-950 relative overflow-hidden">
      {/* پس‌زمینه‌ی گرادیانت مش */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />

      {/* اشکال تزئینی */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-float" />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: '1.5s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      {/* ===== سمت چپ: معرفی (فقط دسکتاپ) ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white shadow-glow">
            <Dumbbell size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-xl">Fitness App</h1>
            <p className="text-xs text-white/60">{t('auth.appName')}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
              {isRTL ? (
                <>
                  تناسب اندامت رو
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    حرفه‌ای
                  </span>{' '}
                  ردیابی کن
                </>
              ) : (
                <>
                  Track your fitness
                  <br />
                  like a{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    pro
                  </span>
                </>
              )}
            </h2>
            <p className="text-white/60 text-lg max-w-md leading-relaxed">
              {isRTL
                ? 'تمرینات، تغذیه، آب، وزن و اهدافت رو یه جا مدیریت کن و پیشرفتت رو ببین.'
                : 'Manage your workouts, nutrition, water, weight, and goals in one place.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              {
                Icon: Dumbbell,
                label: isRTL ? 'تمرینات هوشمند' : 'Smart Workouts',
                gradient: 'from-rose-500/20 to-orange-500/20',
                border: 'border-rose-400/30',
                glow: 'group-hover:shadow-rose-500/30',
              },
              {
                Icon: Apple,
                label: isRTL ? 'ردیابی تغذیه' : 'Nutrition Tracking',
                gradient: 'from-emerald-500/20 to-teal-500/20',
                border: 'border-emerald-400/30',
                glow: 'group-hover:shadow-emerald-500/30',
              },
              {
                Icon: BarChart3,
                label: isRTL ? 'نمودارهای تعاملی' : 'Interactive Charts',
                gradient: 'from-cyan-500/20 to-blue-500/20',
                border: 'border-cyan-400/30',
                glow: 'group-hover:shadow-cyan-500/30',
              },
              {
                Icon: Trophy,
                label: isRTL ? 'مدال و دستاورد' : 'Achievements',
                gradient: 'from-amber-500/20 to-yellow-500/20',
                border: 'border-amber-400/30',
                glow: 'group-hover:shadow-amber-500/30',
              },
            ].map((feat, i) => {
              const FeatIcon = feat.Icon;
              return (
                <div
                  key={i}
                  className={`group relative rounded-2xl p-4 flex items-center gap-3 animate-card-enter overflow-hidden backdrop-blur-xl bg-gradient-to-br ${feat.gradient} border ${feat.border} hover:scale-[1.03] transition-all duration-300 shadow-lg ${feat.glow}`}
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  <div className="absolute -top-8 -end-8 w-20 h-20 rounded-full bg-white/10 blur-2xl pointer-events-none" />

                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-110 transition-transform">
                    <FeatIcon size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-semibold text-white tracking-tight">
                    {feat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Fitness App. {t('auth.madeWith')}
        </p>
      </div>

      {/* ===== سمت راست: فرم ===== */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* لوگو موبایل */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 mb-4 text-white shadow-glow animate-float">
              <Dumbbell size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-white">Fitness App</h1>
            <p className="text-sm text-white/60 mt-1">{t('auth.appName')}</p>
          </div>

          {/* کارت فرم — سفید خالص */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-white/10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {t('auth.welcomeBack')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('auth.loginSubtitle')}
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm animate-wiggle">
                <AlertTriangle size={18} strokeWidth={2.5} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                >
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 start-0 flex items-center ps-4 text-slate-400 pointer-events-none">
                    <Mail size={18} strokeWidth={2.2} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="example@email.com"
                    className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ps-11 pe-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                >
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 start-0 flex items-center ps-4 text-slate-400 pointer-events-none">
                    <Lock size={18} strokeWidth={2.2} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ps-11 pe-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-shine w-full h-12 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                    {t('auth.loggingIn')}
                  </span>
                ) : (
                  t('auth.loginButton')
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('auth.noAccount')}{' '}
                <Link
                  to="/register"
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors"
                >
                  {t('auth.registerLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}