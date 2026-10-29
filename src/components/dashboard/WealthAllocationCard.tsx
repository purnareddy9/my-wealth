import React, { useState } from 'react';
import { PieChart as PieIcon, SlidersHorizontal, ArrowUpDown, ChevronRight, Layers, Plus } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';
import { AllocationItem } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

interface WealthAllocationCardProps {
  allocations: AllocationItem[];
  currency: string;
  onOpenAnalytics: () => void;
}

// Custom Glassmorphic Tooltip for the Donut Chart
const CustomDonutTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as AllocationItem;
    return (
      <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-2xl text-xs z-50 pointer-events-none min-w-[180px] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0 shadow-xs"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
            {data.name}
          </span>
        </div>

        <div className="pt-2 space-y-1.5">
          <div className="flex justify-between items-baseline gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Market Value:</span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-slate-50">
              {formatCurrency(data.value, currency)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Portfolio Share:</span>
            <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/50">
              {data.percentage}%
            </span>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 capitalize pt-0.5">
            Class: {data.category?.replace('_', ' ')}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Render active enlarged shape on hover
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))', cursor: 'pointer' }}
      />
    </g>
  );
};

export const WealthAllocationCard: React.FC<WealthAllocationCardProps> = ({
  allocations,
  currency,
  onOpenAnalytics,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'equity' | 'liquid'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filtered allocations based on quick tag
  const filteredData = allocations.filter((item) => {
    if (filterMode === 'equity') return item.category === 'equity' || item.category === 'mutual_fund';
    if (filterMode === 'liquid') return item.category === 'cash_bank' || item.category === 'fixed_deposits';
    return true;
  });

  const hasData = filteredData.length > 0;
  const activeItem = hasData 
    ? (hoveredIndex !== null && filteredData[hoveredIndex] ? filteredData[hoveredIndex] : filteredData[0])
    : { name: 'No Assets Yet', percentage: 0, value: 0, color: '#94A3B8' };

  return (
    <div className="glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full relative overflow-hidden">
      <div>
        {/* Header matching Smart Lighting in reference */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 shadow-sm border border-amber-200/40">
              <PieIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-base font-bold text-slate-800 dark:text-slate-100">
              Wealth Allocation
            </span>
          </div>

          <button
            onClick={onOpenAnalytics}
            className="text-xs text-slate-400 hover:text-amber-500 flex items-center gap-0.5 font-semibold transition-colors"
          >
            Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Tag Pills matching 8 watt, 9 watt, 12 watt from reference */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => { setFilterMode('all'); setHoveredIndex(null); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-amber-500 text-white shadow-sm scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Assets
          </button>
          <button
            onClick={() => { setFilterMode('equity'); setHoveredIndex(null); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterMode === 'equity'
                ? 'bg-amber-500 text-white shadow-sm scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Equity &amp; MFs
          </button>
          <button
            onClick={() => { setFilterMode('liquid'); setHoveredIndex(null); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterMode === 'liquid'
                ? 'bg-amber-500 text-white shadow-sm scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Liquid &amp; Cash
          </button>
        </div>

        {/* Center Donut Dial matching the 80% Intensity dial in reference */}
        <div className="mt-2 relative w-full h-44 flex items-center justify-center">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                  activeIndex={hoveredIndex !== null ? hoveredIndex : undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth={2}
                      className="cursor-pointer transition-all"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomDonutTooltip currency={currency} />}
                  wrapperStyle={{ outline: 'none', zIndex: 100 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-36 h-36 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-3 text-center">
              <span className="text-xs font-bold text-slate-400">No Assets Yet</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Add an account to view allocation</span>
            </div>
          )}

          {/* Center text in donut dial matching "80% Intensity" */}
          {hasData && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight leading-none transition-all">
                {activeItem.percentage}%
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate max-w-[90px] mt-0.5">
                {activeItem.name}
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold">
                {formatCurrency(activeItem.value, currency, true)}
              </span>
            </div>
          )}
        </div>

        {/* Min / Max controls mimicking reference UI */}
        <div className="flex items-center justify-between px-3 text-xs text-slate-400 dark:text-slate-500 font-semibold -mt-1">
          <button 
            disabled={!hasData}
            onClick={() => setHoveredIndex((prev) => (prev === null || prev === 0 ? filteredData.length - 1 : prev - 1))}
            className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
          >
            <span>Prev</span>
          </button>
          <span className="text-[10px] text-slate-400">
            {hasData ? 'Hover slice to inspect' : 'Fresh Account'}
          </span>
          <button 
            disabled={!hasData}
            onClick={() => setHoveredIndex((prev) => (prev === null || prev >= filteredData.length - 1 ? 0 : prev + 1))}
            className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
          >
            <span>Next</span>
          </button>
        </div>
      </div>

      {/* Bottom 3 Mode Buttons matching Auto, Day, Night from screenshot */}
      <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-around">
        <button
          onClick={onOpenAnalytics}
          className="flex flex-col items-center gap-1 group text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-900 transition-all shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-semibold">Rebalance</span>
        </button>

        <button
          onClick={onOpenAnalytics}
          className="flex flex-col items-center gap-1 group text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-400 group-hover:text-slate-900 transition-all shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-semibold">SIP Flow</span>
        </button>

        <button
          onClick={onOpenAnalytics}
          className="flex flex-col items-center gap-1 group text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-400 group-hover:text-slate-900 transition-all shadow-sm">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-semibold">Asset Mix</span>
        </button>
      </div>
    </div>
  );
};
