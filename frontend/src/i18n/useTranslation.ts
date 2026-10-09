import { useLanguageStore } from '../store/language.store';
import { translations, type Language } from './translations';

// Type helper: gets nested keys like 'nav.dashboard'
type PathsToStrings<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends object
    ? PathsToStrings<T[K], `${Prefix}${K}.`>
    : never;
}[keyof T & string];

export type TranslationPath = PathsToStrings<typeof translations.fa>;

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);

  const t = (path: TranslationPath): string => {
    const keys = path.split('.');
    let value: unknown = translations[language];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }

    return typeof value === 'string' ? value : path;
  };

  return {
    t,
    language,
    isRTL: language === 'fa',
    setLanguage: useLanguageStore.getState().set,
    toggleLanguage: useLanguageStore.getState().toggle,
  };
}

// Alias for convenience
export type LanguageType = Language;