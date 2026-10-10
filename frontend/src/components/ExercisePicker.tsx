import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Play,
  Dumbbell,
  Sparkles,
  Flame,
  Star,
} from 'lucide-react';
import { exerciseService, type Exercise } from '../services/exercise.service';
import { useTranslation } from '../i18n/useTranslation';

interface Props {
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
}

// آیکون مخصوص هر دسته ورزشی
const CATEGORY_INFO: Record<
  string,
  { Icon: typeof Play; gradient: string }
> = {
  CARDIO: { Icon: Play, gradient: 'from-rose-500 to-orange-500' },
  STRENGTH: { Icon: Dumbbell, gradient: 'from-blue-500 to-indigo-600' },
  FLEXIBILITY: { Icon: Sparkles, gradient: 'from-emerald-500 to-teal-500' },
  HIIT: { Icon: Flame, gradient: 'from-orange-500 to-red-600' },
  YOGA: { Icon: Sparkles, gradient: 'from-purple-500 to-pink-500' },
  OTHER: { Icon: Star, gradient: 'from-slate-500 to-slate-700' },
};

export default function ExercisePicker({ value, onChange, placeholder }: Props) {
  const { t, language } = useTranslation();
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

  const primaryName = (ex: Exercise) => (language === 'fa' ? ex.nameFa : ex.name);
  const secondaryName = (ex: Exercise) => (language === 'fa' ? ex.name : ex.nameFa);

  const filtered = (exercises ?? []).filter((ex) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      ex.nameFa.toLowerCase().includes(q) ||
      ex.name.toLowerCase().includes(q)
    );
  });

  const handleSelect = (ex: Exercise) => {
    const name = primaryName(ex);
    onChange(name);
    setSearch(name);
    setOpen(false);
  };

  const getCatInfo = (category: string) =>
    CATEGORY_INFO[category] ?? CATEGORY_INFO.OTHER;

  return (
    <div ref={wrapperRef} className="relative">
      {/* Input */}
      <div className="relative">
        <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400 pointer-events-none">
          <Search size={16} strokeWidth={2.5} />
        </span>
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
          className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 ps-9 pe-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl animate-scale-in">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400 dark:text-slate-500">
              {t('exercisePicker.noResults')}
            </div>
          ) : (
            <div className="py-1">
              {filtered.map((ex) => {
                const catInfo = getCatInfo(ex.category);
                const CatIcon = catInfo.Icon;

                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => handleSelect(ex)}
                    className="w-full text-start px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group"
                  >
                    {/* Category icon */}
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${catInfo.gradient} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <CatIcon size={18} strokeWidth={2.5} />
                    </div>

                    {/* Names */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {primaryName(ex)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {secondaryName(ex)}
                        {ex.muscleGroup && ` • ${muscleLabel(ex.muscleGroup)}`}
                      </p>
                    </div>

                    {/* MET badge */}
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg shrink-0">
                      MET {ex.metValue}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}