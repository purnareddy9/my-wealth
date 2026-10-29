import React from 'react';
import { TopSummaryRow } from '../dashboard/TopSummaryRow';
import { MiddleCards } from '../dashboard/MiddleCards';
import { WealthAllocationCard } from '../dashboard/WealthAllocationCard';
import { FinancialForecastCard } from '../dashboard/FinancialForecastCard';
import { BottomCategoryBar, CategoryFilter } from '../layout/BottomCategoryBar';
import { FinancialAccount, NetWorthSummary, SavingsAssumptions } from '../../types';
import { AllocationItem } from '../../utils/calculations';
import { Plus, Sparkles, Landmark } from 'lucide-react';

interface OverviewProps {
  summary: NetWorthSummary;
  accounts: FinancialAccount[];
  allocations: AllocationItem[];
  assumptions: SavingsAssumptions;
  currency: string;
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  onQuickAdd: () => void;
  onOpenAccounts: () => void;
  onOpenHoldings: () => void;
  onOpenSavings: () => void;
  onOpenForecasts: () => void;
  onOpenAnalytics: () => void;
  onLoadStarterTemplate?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  summary,
  accounts,
  allocations,
  assumptions,
  currency,
  activeCategory,
  onSelectCategory,
  onQuickAdd,
  onOpenAccounts,
  onOpenHoldings,
  onOpenSavings,
  onOpenForecasts,
  onOpenAnalytics,
  onLoadStarterTemplate,
}) => {
  const isFreshAccount = accounts.length === 0;

  return (
    <div className="w-full space-y-5 lg:space-y-6">
      {/* Friendly onboarding banner if it's a completely fresh personal account */}
      {isFreshAccount && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-300/40 dark:border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Welcome to your Personal Wealth Workspace!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You're starting with clean data. Add your first bank account, investments, or salary to begin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onLoadStarterTemplate && (
              <button
                onClick={onLoadStarterTemplate}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Load Starter Template
              </button>
            )}
            <button
              onClick={onOpenAccounts}
              className="px-4 py-1.5 text-xs font-bold rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Add First Account
            </button>
          </div>
        </div>
      )}

      {/* Top 3 Summary Cards Row */}
      <TopSummaryRow
        summary={summary}
        currency={currency}
        onOpenAccounts={onOpenAccounts}
        onOpenSavings={onOpenSavings}
      />

      {/* Middle Grid Section: 4 compact cards + Wealth Allocation Donut + Thermostat Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: 4 compact cards (2x2 grid) */}
        <div className="lg:col-span-4 h-full">
          <MiddleCards
            accounts={accounts}
            currency={currency}
            onOpenAccounts={onOpenAccounts}
            onOpenHoldings={onOpenHoldings}
          />
        </div>

        {/* Center Column: Wealth Allocation Card with Donut Chart */}
        <div className="lg:col-span-4 h-full">
          <WealthAllocationCard
            allocations={allocations}
            currency={currency}
            onOpenAnalytics={onOpenAnalytics}
          />
        </div>

        {/* Right Column: Financial Forecast Dial (inspired by Thermostat) */}
        <div className="lg:col-span-4 h-full">
          <FinancialForecastCard
            currentNetWorth={summary.netWorth}
            assumptions={assumptions}
            currency={currency}
            onOpenForecasts={onOpenForecasts}
          />
        </div>
      </div>

      {/* Bottom Horizontal Category Selector */}
      <BottomCategoryBar
        activeCategory={activeCategory}
        onSelectCategory={onSelectCategory}
        onQuickAdd={onQuickAdd}
      />
    </div>
  );
};
