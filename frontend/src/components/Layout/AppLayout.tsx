import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useThemeStore } from '../../store/theme.store';

const navItems = [
  { to: '/dashboard', label: 'داشبورد', icon: '📊' },
  { to: '/level', label: 'سطح و امتیاز', icon: '⭐' },
  { to: '/workouts', label: 'تمرینات', icon: '💪' },
  { to: '/nutrition', label: 'تغذیه', icon: '🍎' },
  { to: '/water', label: 'آب', icon: '💧' },
  { to: '/progress', label: 'وزن', icon: '⚖️' },
  { to: '/measurements', label: 'اندازه‌های بدن', icon: '📏' },
  { to: '/challenges', label: 'چالش‌ها', icon: '🥇' },
  { to: '/reminders', label: 'یادآورها', icon: '🔔' },
  { to: '/report', label: 'گزارش هفتگی', icon: '📉' },
  { to: '/achievements', label: 'مدال‌ها', icon: '🏆' },
  { to: '/goals', label: 'اهداف', icon: '🎯' },
  { to: '/export', label: 'دانلود داده‌ها', icon: '📥' },
  { to: '/profile', label: 'پروفایل', icon: '👤' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('از حساب خارج می‌شی؟')) {
      logout();
      navigate('/login');
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950" dir="rtl">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 right-0 z-50 lg:z-auto
          h-screen w-64
          bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900
          text-white flex flex-col shadow-xl
          transition-transform duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-slate-700 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl animate-float">
              💪
            </div>
            <div>
              <h1 className="font-bold text-lg">Fitness App</h1>
              <p className="text-xs text-slate-400">اپلیکیشن تناسب اندام</p>
            </div>
          </div>
          <button
            onClick={closeMobile}
            className="lg:hidden w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400"
          >
            ✕
          </button>
        </div>

        {user && (
          <div className="px-6 py-4 border-b border-slate-700 dark:border-slate-800">
            <p className="text-xs text-slate-400 mb-1">خوش آمدی</p>
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobile}
              style={{ animationDelay: `${i * 0.03}s` }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all animate-fade-in ${
                  isActive
                    ? 'bg-gradient-to-l from-emerald-500/20 to-cyan-500/20 text-emerald-300 border-r-4 border-emerald-400'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-[-2px]'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 dark:border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all"
          >
            <span>🚪</span>
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto min-w-0">
        <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center"
            aria-label="باز کردن منو"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-slate-700 dark:text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-sm">
              💪
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Fitness App</span>
          </div>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-lg"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="min-h-full p-4 md:p-6 lg:p-8 animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}