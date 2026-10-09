import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { useThemeStore } from './store/theme.store';
import { useLanguageStore } from './store/language.store';

// Apply theme before render
const savedTheme = useThemeStore.getState().theme;
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

// Apply language direction before render
const savedLanguage = useLanguageStore.getState().language;
document.documentElement.setAttribute('dir', savedLanguage === 'fa' ? 'rtl' : 'ltr');
document.documentElement.setAttribute('lang', savedLanguage);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // داده‌ها تا ۳۰ ثانیه "تازه" در نظر گرفته می‌شن
      // یعنی اگه کاربر توی این مدت دوباره همون صفحه رو باز کنه
      // از cache استفاده می‌شه، درخواست جدید فرستاده نمی‌شه
      staleTime: 30_000,

      // داده‌ها تا ۵ دقیقه توی cache می‌مونن حتی اگه استفاده نشن
      gcTime: 5 * 60_000,

      // اگه کاربر رفت تب دیگه و برگشت، دوباره درخواست نده
      // (به جاش از cache استفاده کن)
      refetchOnWindowFocus: false,

      // موقع قطعی اینترنت دوباره وصل بشی، خودکار درخواست بفرست
      refetchOnReconnect: true,

      // اگه درخواست خطا داد، فقط ۱ بار دوباره تلاش کن (پیش‌فرض ۳ بار بود)
      retry: 1,
    },
    mutations: {
      // برای عملیات‌هایی مثل ذخیره/حذف، دوباره تلاش نکن
      // (چون ممکنه دو بار انجام بشه)
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);