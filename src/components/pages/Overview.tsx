import React from 'react';
import { TopSummaryRow } from '../dashboard/TopSummaryRow';
import { MiddleCards } from '../dashboard/MiddleCards';
import { WealthAllocationCard } from '../dashboard/WealthAllocationCard';
import { FinancialForecastCard } from '../dashboard/FinancialForecastCard';
import { BottomCategoryBar, CategoryFilter } from '../layout/BottomCategoryBar';
import { FinancialAccount, NetWorthSummary, SavingsAssumptions } from '../../types';
import { AllocationItem } from '../../utils/calculations';

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
}

export const Overview: React.FC<OverviewProps> = ({
  summary,
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
}) => {
  return (
    <div className="w-full space-y-5 lg:space-y-6">
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
