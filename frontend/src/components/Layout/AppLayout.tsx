import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Dumbbell,
  Apple,
  Droplets,
  Scale,
  Ruler,
  Medal,
  Bell,
  BarChart3,
  Award,
  Target,
  Download,
  User,
  LogOut,
  Sun,
  Moon,
  Globe,
  X,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useThemeStore } from '../../store/theme.store';
import { useLanguageStore } from '../../store/language.store';
import { useTranslation } from '../../i18n/useTranslation';

// ==================== Nav Items ====================

const NAV_ITEMS = [
  { to: '/dashboard', labelKey: 'nav.dashboard', Icon: LayoutDashboard, gradient: 'from-emerald-400 to-teal-500' },
  { to: '/level', labelKey: 'nav.level', Icon: Sparkles, gradient: 'from-amber-400 to-orange-500' },
  { to: '/prediction', labelKey: 'nav.prediction', Icon: TrendingUp, gradient: 'from-violet-400 to-purple-500' },
  { to: '/workouts', labelKey: 'nav.workouts', Icon: Dumbbell, gradient: 'from-blue-400 to-indigo-500' },
  { to: '/nutrition', labelKey: 'nav.nutrition', Icon: Apple, gradient: 'from-emerald-400 to-green-500' },
  { to: '/water', labelKey: 'nav.water', Icon: Droplets, gradient: 'from-cyan-400 to-blue-500' },
  { to: '/progress', labelKey: 'nav.weight', Icon: Scale, gradient: 'from-violet-400 to-fuchsia-500' },
  { to: '/measurements', labelKey: 'nav.measurements', Icon: Ruler, gradient: 'from-teal-400 to-cyan-500' },
  { to: '/challenges', labelKey: 'nav.challenges', Icon: Medal, gradient: 'from-yellow-400 to-orange-500' },
  { to: '/reminders', labelKey: 'nav.reminders', Icon: Bell, gradient: 'from-pink-400 to-rose-500' },
  { to: '/report', labelKey: 'nav.report', Icon: BarChart3, gradient: 'from-indigo-400 to-blue-500' },
  { to: '/achievements', labelKey: 'nav.achievements', Icon: Award, gradient: 'from-amber-400 to-yellow-500' },
  { to: '/goals', labelKey: 'nav.goals', Icon: Target, gradient: 'from-rose-400 to-pink-500' },
  { to: '/export', labelKey: 'nav.export', Icon: Download, gradient: 'from-slate-400 to-slate-500' },
  { to: '/profile', labelKey: 'nav.profile', Icon: User, gradient: 'from-emerald-400 to-cyan-500' },
] as const;

// ==================== Component ====================

export default function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const language = useLanguageStore((s) => s.language);
  const toggleLanguage = useLanguageStore((s) => s.toggle);
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    if (confirm(t('nav.logout') + '?')) {
      logout();
      navigate('/login');
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 right-0 rtl:right-0 ltr:left-0 ltr:right-auto z-50 lg:z-auto
          h-screen w-72
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
          dark:from-slate-950 dark:via-slate-950 dark:to-black
          text-white flex flex-col shadow-2xl
          transition-transform duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 rtl:translate-x-full ltr:-translate-x-full rtl:lg:translate-x-0 ltr:lg:translate-x-0'}
        `}
      >
        {/* Decorative glow */}
        <div className="absolute -top-32 -end-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -start-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* ===== Header ===== */}
        <div className="relative p-5 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 blur-md opacity-60" />
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                <Dumbbell size={22} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Fitness App
              </h1>
              <p className="text-[11px] text-slate-400">{t('auth.appName')}</p>
            </div>
          </div>
          <button
            onClick={closeMobile}
            className="lg:hidden w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===== User Card ===== */}
        {user && (
          <div className="relative px-5 py-4 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-lg font-bold text-white shadow-lg shrink-0">
                {user.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  {language === 'fa' ? 'خوش آمدی' : 'Welcome'}
                </p>
                <p className="text-sm font-semibold text-white truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== Nav ===== */}
        <nav className="relative flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobile}
              style={{ animationDelay: `${i * 0.02}s` }}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all animate-fade-in ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <>
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-l ${item.gradient} opacity-90 shadow-lg`}
                      />
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-l ${item.gradient} blur-lg opacity-40 -z-10`}
                      />
                    </>
                  )}

                  <span
                    className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                      isActive
                        ? 'bg-white/20 backdrop-blur-sm'
                        : 'bg-white/5 group-hover:bg-white/10 group-hover:scale-110'
                    }`}
                  >
                    <item.Icon size={18} strokeWidth={2.2} />
                  </span>

                  <span className="relative flex-1 truncate">
                    {t(item.labelKey as never)}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ===== Footer Buttons ===== */}
        <div className="relative p-3 border-t border-white/5 space-y-1 shrink-0">
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Globe size={18} strokeWidth={2.2} />
            </span>
            <span className="flex-1 text-start">
              {language === 'fa' ? 'English' : 'فارسی'}
            </span>
          </button>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              {theme === 'dark' ? <Sun size={18} strokeWidth={2.2} /> : <Moon size={18} strokeWidth={2.2} />}
            </span>
            <span className="flex-1 text-start">
              {theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300/80 hover:text-red-200 hover:bg-red-500/10 transition-all group"
          >
            <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 group-hover:scale-110 transition-all">
              <LogOut size={18} strokeWidth={2.2} />
            </span>
            <span className="flex-1 text-start">{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* ===== Main ===== */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={2.2} className="text-slate-700 dark:text-slate-300" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Dumbbell size={16} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              Fitness App
            </span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={toggleLanguage}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={20} strokeWidth={2.2} />
            </button>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} strokeWidth={2.2} /> : <Moon size={20} strokeWidth={2.2} />}
            </button>
          </div>
        </div>

        <div className="min-h-full p-4 md:p-6 lg:p-8 animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}