import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { exerciseService, type Exercise } from '../services/exercise.service';
import { useTranslation } from '../i18n/useTranslation';

interface Props {
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  CARDIO: '🏃',
  STRENGTH: '💪',
  FLEXIBILITY: '🤸',
  HIIT: '🔥',
  YOGA: '🧘',
  OTHER: '⭐',
};

export default function ExercisePicker({ value, onChange, placeholder }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: exercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => exerciseService.getAll(),
    enabled: open,
  });

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const muscleLabel = (group: string): string => {
    const key = `muscleGroups.${group}`;
    const translated = t(key as never);
    return translated === key ? group : translated;
  };

  const filtered = (exercises ?? []).filter((ex) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      ex.nameFa.toLowerCase().includes(q) ||
      ex.name.toLowerCase().includes(q)
    );
  });

  const handleSelect = (ex: Exercise) => {
    onChange(ex.nameFa);
    setSearch(ex.nameFa);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder ?? t('exercisePicker.placeholder')}
        className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400 dark:text-slate-500">
              {t('exercisePicker.noResults')}
            </div>
          ) : (
            <div className="py-1">
              {filtered.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleSelect(ex)}
                  className="w-full text-right px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">
                      {CATEGORY_EMOJI[ex.category] ?? '⭐'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {ex.nameFa}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {ex.name}
                        {ex.muscleGroup && ` • ${muscleLabel(ex.muscleGroup)}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                    MET {ex.metValue}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}