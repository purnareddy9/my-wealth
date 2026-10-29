import React from 'react';
import { Plus } from 'lucide-react';

export type CategoryFilter = 'overview' | 'investments' | 'savings' | 'salary' | 'expenses';

interface BottomCategoryBarProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  onQuickAdd: () => void;
}

export const BottomCategoryBar: React.FC<BottomCategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  onQuickAdd,
}) => {
  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'investments', label: 'Investments' },
    { id: 'savings', label: 'Savings' },
    { id: 'salary', label: 'Salary' },
    { id: 'expenses', label: 'Expenses' },
  ];

  return (
    <div className="w-full flex items-center justify-center pt-5 pb-1">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-800/40 border border-white/70 dark:border-white/10 shadow-sm backdrop-blur-md overflow-x-auto max-w-full">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-md scale-102 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-slate-700/40'
              }`}
            >
              {cat.label}
            </button>
          );
        })}

        {/* The circular '+' button from the reference screenshot */}
        <button
          onClick={onQuickAdd}
          title="Quick Add (Transaction, Account, Hike)"
          className="w-9 h-9 sm:w-10 sm:h-10 ml-1 rounded-full flex items-center justify-center bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm hover:scale-105 active:scale-95 transition-transform border border-white/80 dark:border-white/10 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
