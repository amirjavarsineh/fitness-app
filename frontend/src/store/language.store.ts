import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../i18n/translations';

interface LanguageState {
  language: Language;
  toggle: () => void;
  set: (lang: Language) => void;
}

function applyDirection(language: Language) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  if (language === 'fa') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'fa');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
  }
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'fa',
      toggle: () => {
        const next = get().language === 'fa' ? 'en' : 'fa';
        applyDirection(next);
        set({ language: next });
      },
      set: (language) => {
        applyDirection(language);
        set({ language });
      },
    }),
    {
      name: 'language-storage',
      onRehydrateStorage: () => (state) => {
        if (state) applyDirection(state.language);
      },
    }
  )
);