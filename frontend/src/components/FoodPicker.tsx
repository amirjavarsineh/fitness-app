import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { foodService, type FoodItem } from '../services/food.service';
import { useTranslation } from '../i18n/useTranslation';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (food: FoodItem) => void;
  placeholder?: string;
}

export default function FoodPicker({ value, onChange, onSelect, placeholder }: Props) {
  const { t, language } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: foods } = useQuery({
    queryKey: ['foods'],
    queryFn: () => foodService.getAll(),
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

  // اسم اصلی و فرعی بر اساس زبان فعلی
  const primaryName = (food: FoodItem) => (language === 'fa' ? food.nameFa : food.name);
  const secondaryName = (food: FoodItem) => (language === 'fa' ? food.name : food.nameFa);

  const filtered = (foods ?? []).filter((food) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      food.nameFa.toLowerCase().includes(q) ||
      food.name.toLowerCase().includes(q)
    );
  });

  const handleSelect = (food: FoodItem) => {
    const name = primaryName(food);
    onChange(name);
    setSearch(name);
    onSelect(food);
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
        placeholder={placeholder ?? t('nutrition.searchCatalogPlaceholder')}
        className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl animate-scale-in">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400 dark:text-slate-500">
              {t('nutrition.foodNotFound')}
            </div>
          ) : (
            <div className="py-1">
              <div className="px-4 py-2 text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                {filtered.length} {t('nutrition.foodsAvailable')}
              </div>
              {filtered.map((food) => (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => handleSelect(food)}
                  className="w-full text-start px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {primaryName(food)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {secondaryName(food)}
                      {food.brand && ` • ${food.brand}`}
                    </p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-xs font-bold text-orange-500">
                      {food.calories}
                      <span className="text-slate-400 dark:text-slate-500 font-normal mr-1">
                        kcal
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      P: {food.protein} • C: {food.carbs} • F: {food.fat}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}