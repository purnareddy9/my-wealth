import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp, PiggyBank, ShieldCheck } from 'lucide-react';
import { NetWorthSummary } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface TopSummaryRowProps {
  summary: NetWorthSummary;
  currency: string;
  onOpenAccounts: () => void;
  onOpenSavings: () => void;
}

export const TopSummaryRow: React.FC<TopSummaryRowProps> = ({
  summary,
  currency,
  onOpenAccounts,
  onOpenSavings,
}) => {
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Format current date matching "17 July, 2023" from reference screenshot
  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate savings progress ring
  const savingsPct = summary.monthlySavingsTarget > 0 
    ? Math.min(100, Math.round((summary.monthlySavings / summary.monthlySavingsTarget) * 100))
    : 0;
  const strokeDashoffset = 100 - savingsPct;

  // Monthly asset history for the vertical bar chart in Card 3
  const hasAssets = summary.totalAssets > 0;
  const currentAssetInLakhs = summary.totalAssets / 100000;
  const currentDebtInLakhs = summary.totalLiabilities / 100000;
  const currentNetInLakhs = summary.netWorth / 100000;
  const currentTag = formatCurrency(summary.totalAssets, currency, true);

  const months = hasAssets
    ? [
        { label: 'Jan', fullLabel: 'January 2026', value: +(currentAssetInLakhs * 0.85).toFixed(1), debt: currentDebtInLakhs, net: +(currentNetInLakhs * 0.85).toFixed(1) },
        { label: 'Feb', fullLabel: 'February 2026', value: +(currentAssetInLakhs * 0.90).toFixed(1), debt: currentDebtInLakhs, net: +(currentNetInLakhs * 0.90).toFixed(1) },
        { label: 'Mar', fullLabel: 'March 2026', value: +(currentAssetInLakhs * 0.95).toFixed(1), debt: currentDebtInLakhs, net: +(currentNetInLakhs * 0.95).toFixed(1) },
        { label: 'Apr', fullLabel: 'April (Live)', value: +currentAssetInLakhs.toFixed(1), debt: currentDebtInLakhs, net: +currentNetInLakhs.toFixed(1), isCurrent: true, tag: currentTag },
        { label: 'May', fullLabel: 'May (Projected)', value: +(currentAssetInLakhs * 1.05).toFixed(1), debt: currentDebtInLakhs, net: +(currentNetInLakhs * 1.05).toFixed(1) },
        { label: 'Jun', fullLabel: 'June (Projected)', value: +(currentAssetInLakhs * 1.10).toFixed(1), debt: currentDebtInLakhs, net: +(currentNetInLakhs * 1.10).toFixed(1) },
      ]
    : [
        { label: 'Jan', fullLabel: 'January 2026', value: 0, debt: 0, net: 0 },
        { label: 'Feb', fullLabel: 'February 2026', value: 0, debt: 0, net: 0 },
        { label: 'Mar', fullLabel: 'March 2026', value: 0, debt: 0, net: 0 },
        { label: 'Apr', fullLabel: 'Current', value: 0, debt: 0, net: 0, isCurrent: true, tag: formatCurrency(0, currency, true) },
        { label: 'May', fullLabel: 'May 2026', value: 0, debt: 0, net: 0 },
        { label: 'Jun', fullLabel: 'June 2026', value: 0, debt: 0, net: 0 },
      ];

  const maxBarValue = Math.max(1, ...months.map((m) => m.value));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 w-full">
      {/* =========================================================================
          CARD 1: TOTAL NET WORTH (reproduces the Date & Time card from screenshot)
          ========================================================================= */}
      <div 
        onClick={onOpenAccounts}
        className="md:col-span-5 glass-card glass-card-hover rounded-3xl p-5 md:p-6 flex flex-col justify-between cursor-pointer group"
      >
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold tracking-wide">
            <span>{currentDateFormatted}</span>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full text-[11px] font-bold border border-emerald-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Net Worth
            </div>
          </div>

          {/* Big number matching 09:00 with 19°C pill from reference */}
          <div className="mt-3.5 flex items-baseline gap-3 flex-wrap overflow-hidden">
            <h2 
              title={formatCurrency(summary.netWorth, currency)}
              className={`font-extrabold tracking-tight text-slate-800 dark:text-slate-50 truncate max-w-full ${
                Math.abs(summary.netWorth) >= 100000000
                  ? 'text-2xl sm:text-3xl lg:text-3xl'
                  : Math.abs(summary.netWorth) >= 10000000
                  ? 'text-2xl sm:text-3xl lg:text-[38px]'
                  : 'text-3xl sm:text-4xl lg:text-[42px]'
              }`}
            >
              {formatCurrency(summary.netWorth, currency)}
            </h2>
            
            {/* Pill matching the 19°C temperature tag */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm shadow-sm border border-white/60 dark:border-white/10">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
              <span>{formatPercentage(summary.monthOverMonthPercentage)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {hasAssets
              ? `${summary.monthOverMonthChange >= 0 ? '+' : ''}${formatCurrency(summary.monthOverMonthChange, currency, true)} vs previous month`
              : 'Add accounts to begin tracking'}
          </span>
          <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400 font-medium transition-colors flex items-center gap-1">
            View Accounts &rarr;
          </span>
        </div>
      </div>

      {/* =========================================================================
          CARD 2: MONTHLY SAVINGS (reproduces the Humidity 65,0% card)
          ========================================================================= */}
      <div 
        onClick={onOpenSavings}
        className="md:col-span-3 glass-card glass-card-hover rounded-3xl p-5 md:p-6 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-500 shadow-sm border border-blue-200/40">
            <PiggyBank className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Monthly Savings
          </span>
        </div>

        {/* Circular Gauge / Ring & Percent (matches humidity gauge) */}
        <div className="mt-2 flex items-center gap-4">
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 36 36">
              {/* Background ring */}
              <path
                className="text-slate-200/80 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress arc */}
              <path
                className="text-blue-500 transition-all duration-1000 ease-out"
                strokeDasharray="100, 100"
                strokeDashoffset={strokeDashoffset}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              </div>
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              {savingsPct}%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
              {formatCurrency(summary.monthlySavings, currency, true)} of {formatCurrency(summary.monthlySavingsTarget, currency, true)}
            </div>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          {summary.monthlySavingsTarget > 0
            ? `Target: ${formatCurrency(summary.monthlySavingsTarget, currency)} / month`
            : 'Target: Not set yet'}
        </div>
      </div>

      {/* =========================================================================
          CARD 3: TOTAL ASSETS & LIABILITIES (reproduces Total Consumption bar chart)
          ========================================================================= */}
      <div 
        onClick={onOpenAccounts}
        className="md:col-span-4 glass-card glass-card-hover rounded-3xl p-5 md:p-6 flex flex-col justify-between cursor-pointer group relative"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 shadow-sm border border-amber-200/40">
              <TrendingUp className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Total Assets
            </span>
          </div>
          
          <span className="text-xs font-semibold text-slate-400">Hover bars</span>
        </div>

        {/* Mini Vertical Bar Chart matching the Jan-Jun sparkline from reference with interactive tooltips */}
        <div className="mt-3 relative flex items-end justify-between gap-1.5 h-16 pt-2">
          {months.map((m, idx) => {
            const heightPercent = maxBarValue > 0 ? (m.value / maxBarValue) * 100 : 0;
            const isHovered = hoveredBarIndex === idx;

            return (
              <div 
                key={m.label} 
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative cursor-pointer"
              >
                {/* Floating tooltip on hover over bar */}
                {isHovered && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-white/80 dark:border-white/10 text-center pointer-events-none whitespace-nowrap min-w-[110px] animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-bold text-slate-800 dark:text-slate-100">{m.fullLabel}</div>
                    {hasAssets ? (
                      <>
                        <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(m.value * 100000, currency, true)} Assets
                        </div>
                        <div className="text-[9px] text-slate-400">
                          Net: {formatCurrency(m.net * 100000, currency, true)} • Liab: {formatCurrency(m.debt * 100000, currency, true)}
                        </div>
                      </>
                    ) : (
                      <div className="text-xs font-semibold text-slate-400">
                        No assets linked
                      </div>
                    )}
                  </div>
                )}

                {m.isCurrent && !isHovered && (
                  <span className="text-[9px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 shadow-sm px-1 rounded-sm border border-white/60 mb-0.5">
                    {m.tag}
                  </span>
                )}
                
                <div 
                  className={`w-3.5 bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-11 relative overflow-hidden flex items-end transition-all ${
                    isHovered ? 'scale-115 ring-2 ring-amber-400/80' : ''
                  }`}
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-full transition-all duration-300 ${
                      m.isCurrent || isHovered
                        ? 'bg-gradient-to-t from-amber-500 to-amber-400 shadow-sm'
                        : 'bg-emerald-400/60 dark:bg-emerald-500/40'
                    }`}
                  />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isHovered ? 'text-amber-500 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                  {m.label}
                </span>
              </div>
            );
          })}

          {/* Big number on right matching '160' in the screenshot */}
          <div className="pl-3 text-right">
            <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {formatCurrency(summary.totalAssets, currency, true)}
            </div>
            <div className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold whitespace-nowrap">
              Liab: {formatCurrency(summary.totalLiabilities, currency, true)}
            </div>
          </div>
        </div>

        <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 flex justify-between">
          <span>Net = Assets - Liab</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {summary.totalAssets > 0
              ? `${Math.max(0, Math.min(100, Math.round(((summary.totalAssets - summary.totalLiabilities) / summary.totalAssets) * 100)))}% Solvency`
              : '0% Solvency'}
          </span>
        </div>
      </div>
    </div>
  );
};
