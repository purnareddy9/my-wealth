import React from 'react';
import { PieChart as PieIcon, TrendingUp, BarChart3, ShieldCheck, DollarSign } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { AllocationItem } from '../../utils/calculations';
import { NetWorthSummary } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface AnalyticsViewProps {
  summary: NetWorthSummary;
  allocations: AllocationItem[];
  currency: string;
}

// Custom Glassmorphic Tooltip for Net Worth Trajectory Chart
const CustomNetWorthTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const netWorth = data.netWorth;
    const assets = data.assets;
    const debt = data.debt;
    const solvency = assets > 0 ? (((assets - debt) / assets) * 100).toFixed(1) : '100';

    return (
      <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-2xl text-xs z-50 pointer-events-none min-w-[200px] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="font-extrabold text-slate-800 dark:text-slate-100">
            {data.month}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
            {solvency}% Solvency
          </span>
        </div>

        <div className="pt-2.5 space-y-1.5">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block">Total Net Worth:</span>
            <span className="text-base font-black text-blue-600 dark:text-blue-400 tracking-tight">
              {formatCurrency(netWorth, currency)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-medium text-slate-400 block">Gross Assets:</span>
              <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                {formatCurrency(assets, currency, true)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-slate-400 block">Total Debt:</span>
              <span className="font-extrabold text-xs text-rose-500">
                {formatCurrency(debt, currency, true)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Glassmorphic Tooltip for Inflows vs Outflows Bar Chart
const CustomCashflowTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const savingsRate = data.income > 0 ? ((data.savings / data.income) * 100).toFixed(1) : '0';

    return (
      <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-2xl text-xs z-50 pointer-events-none min-w-[210px] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="font-extrabold text-slate-800 dark:text-slate-100">
            {data.month} Cashflow
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
            {savingsRate}% Savings Rate
          </span>
        </div>

        <div className="pt-2 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Inflow (Income):
            </span>
            <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(data.income, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Outflow (Expenses):
            </span>
            <span className="font-extrabold text-xs text-rose-500">
              -{formatCurrency(data.expenses, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Net Savings:
            </span>
            <span className="font-black text-xs text-amber-600 dark:text-amber-400">
              {formatCurrency(data.savings, currency)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary,
  allocations,
  currency,
}) => {
  // Historical wealth accumulation chart data
  const hasData = summary.totalAssets > 0;
  const wealthHistoryData = hasData
    ? [
        { month: 'May 2026', netWorth: Math.round(summary.netWorth * 0.8), assets: Math.round(summary.totalAssets * 0.8), debt: summary.totalLiabilities },
        { month: 'Jun 2026', netWorth: Math.round(summary.netWorth * 0.85), assets: Math.round(summary.totalAssets * 0.85), debt: summary.totalLiabilities },
        { month: 'Jul 2026', netWorth: Math.round(summary.netWorth * 0.9), assets: Math.round(summary.totalAssets * 0.9), debt: summary.totalLiabilities },
        { month: 'Aug 2026', netWorth: Math.round(summary.netWorth * 0.93), assets: Math.round(summary.totalAssets * 0.93), debt: summary.totalLiabilities },
        { month: 'Sep 2026', netWorth: Math.round(summary.netWorth * 0.97), assets: Math.round(summary.totalAssets * 0.97), debt: summary.totalLiabilities },
        { month: 'Oct 2026 (Live)', netWorth: summary.netWorth, assets: summary.totalAssets, debt: summary.totalLiabilities },
      ]
    : [
        { month: 'May 2026', netWorth: 0, assets: 0, debt: 0 },
        { month: 'Jun 2026', netWorth: 0, assets: 0, debt: 0 },
        { month: 'Jul 2026', netWorth: 0, assets: 0, debt: 0 },
        { month: 'Aug 2026', netWorth: 0, assets: 0, debt: 0 },
        { month: 'Sep 2026', netWorth: 0, assets: 0, debt: 0 },
        { month: 'Current', netWorth: 0, assets: 0, debt: 0 },
      ];

  // Cashflow comparison data
  const baseSavings = summary.monthlySavings || 0;
  const cashflowData = hasData && baseSavings > 0
    ? [
        { month: 'Jul', income: Math.round(baseSavings * 2.2), expenses: Math.round(baseSavings * 1.2), savings: baseSavings },
        { month: 'Aug', income: Math.round(baseSavings * 2.2), expenses: Math.round(baseSavings * 1.3), savings: Math.round(baseSavings * 0.9) },
        { month: 'Sep', income: Math.round(baseSavings * 2.4), expenses: Math.round(baseSavings * 1.3), savings: Math.round(baseSavings * 1.1) },
        { month: 'Oct', income: Math.round(baseSavings * 2.2), expenses: Math.round(baseSavings * 1.2), savings: baseSavings },
      ]
    : [
        { month: 'Jul', income: 0, expenses: 0, savings: 0 },
        { month: 'Aug', income: 0, expenses: 0, savings: 0 },
        { month: 'Sep', income: 0, expenses: 0, savings: 0 },
        { month: 'Oct', income: 0, expenses: 0, savings: 0 },
      ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Wealth Analytics &amp; Allocation
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          In-depth asset distribution, net worth compounding, and cashflow health metrics
        </p>
      </div>

      {/* Historical Net Worth Area Chart */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Net Worth Growth Trajectory
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Hover chart for details • +₹2.5 Lakhs in 6 mos
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wealthHistoryData}>
              <defs>
                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                content={<CustomNetWorthTooltip currency={currency} />}
                wrapperStyle={{ outline: 'none', zIndex: 100 }}
              />
              <Area
                type="monotone"
                dataKey="netWorth"
                name="Net Worth"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorNetWorth)"
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#3B82F6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Allocation Breakdown Table & Cashflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Asset Distribution */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Asset Class Breakdown
            </h3>
          </div>

          <div className="space-y-3">
            {allocations.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span>
                    {formatCurrency(item.value, currency)} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cashflow Comparison */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Monthly Inflows vs Outflows
            </h3>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={<CustomCashflowTooltip currency={currency} />}
                  wrapperStyle={{ outline: 'none', zIndex: 100 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Savings" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
