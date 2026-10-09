import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { useThemeStore } from './store/theme.store';

// اعمال theme ذخیره‌شده قبل از رندر
const savedTheme = useThemeStore.getState().theme;
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);