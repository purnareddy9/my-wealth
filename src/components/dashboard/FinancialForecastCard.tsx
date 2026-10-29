import React, { useState } from 'react';
import { Target, Sparkles, ChevronRight, Lock, TrendingUp } from 'lucide-react';
import { ForecastHorizon, calculateForecast } from '../../utils/calculations';
import { SavingsAssumptions } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface FinancialForecastCardProps {
  currentNetWorth: number;
  assumptions: SavingsAssumptions;
  currency: string;
  onOpenForecasts: () => void;
}

export const FinancialForecastCard: React.FC<FinancialForecastCardProps> = ({
  currentNetWorth,
  assumptions,
  currency,
  onOpenForecasts,
}) => {
  const [horizon, setHorizon] = useState<ForecastHorizon>('1Y');
  const [includeCompounding, setIncludeCompounding] = useState(true);
  const [autoHikes, setAutoHikes] = useState(true);

  // Adjusted assumptions based on toggles
  const effectiveAssumptions = {
    ...assumptions,
    expected_investment_return_rate: includeCompounding ? assumptions.expected_investment_return_rate : 0,
    expected_salary_growth_rate: autoHikes ? assumptions.expected_salary_growth_rate : 0,
  };

  const forecast = calculateForecast(currentNetWorth, effectiveAssumptions, horizon, 2500000);

  // Calculate arc angles for the dial (mimicking thermostat 18° to 30°)
  // SVG arc calculation for semi-circle dial
  const percentage = Math.min(100, Math.max(10, forecast.completionPercentage));
  const strokeDashoffset = 180 - (percentage / 100) * 180;

  return (
    <div className="glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full relative overflow-hidden">
      <div>
        {/* Header matching Thermostat card in reference */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 shadow-sm border border-amber-200/40">
              <Target className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-base font-bold text-slate-800 dark:text-slate-100">
              Financial Forecast
            </span>
          </div>

          {/* Top-right pill lock/slider indicator matching reference */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-white/60 dark:border-white/10 text-[10px] text-slate-500 font-semibold shadow-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-slate-900">
              <Lock className="w-2 h-2" />
            </div>
            <span>&gt;&gt;&gt;</span>
          </div>
        </div>

        {/* Horizon selector buttons (3M, 6M, 1Y, 3Y, 5Y) */}
        <div className="mt-3 flex items-center justify-center gap-1 p-1 rounded-full bg-slate-100/70 dark:bg-slate-800/70 border border-white/50">
          {(['3M', '6M', '1Y', '3Y', '5Y'] as ForecastHorizon[]).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`flex-1 py-1 rounded-full text-[11px] font-bold transition-all ${
                horizon === h
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {h}
            </button>
          ))}
        </div>

        {/* Circular Dial matching the Thermostat temperature dial */}
        <div className="mt-3 relative w-full h-44 flex flex-col items-center justify-center">
          <svg className="w-44 h-44" viewBox="0 0 100 100">
            {/* Background arc track */}
            <path
              d="M 20 80 A 40 40 0 1 1 80 80"
              fill="none"
              stroke="rgba(203, 213, 225, 0.45)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Active filled arc with vibrant gradient */}
            <path
              d="M 20 80 A 40 40 0 1 1 80 80"
              fill="none"
              stroke="#F99D20"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray="180"
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Graphic & Reading (replaces cloud with diamond & target net worth) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-1">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-amber-500 shadow-md border border-white/80 dark:border-white/10 mb-1">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">
                {formatCurrency(forecast.projectedNetWorth, currency, true)}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              Projected ({horizon})
            </span>
          </div>

          {/* Min & Max Range Labels (18° & 30° in ref) */}
          <div className="absolute bottom-1 w-full px-6 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>₹15L Now</span>
            <span className="text-amber-600 dark:text-amber-400">₹25L Goal</span>
          </div>
        </div>

        {/* Toggles row matching 'Swing | Auto' in reference */}
        <div className="mt-3 pt-2 flex items-center justify-around text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span>Compound</span>
            <button
              onClick={() => setIncludeCompounding(!includeCompounding)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                includeCompounding ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  includeCompounding ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-2">
            <span>Hikes</span>
            <button
              onClick={() => setAutoHikes(!autoHikes)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                autoHikes ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoHikes ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Subcard matching '600 W Active since 2 hour ago >' */}
      <div
        onClick={onOpenForecasts}
        className="mt-4 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-white/80 dark:border-white/10 flex items-center justify-between cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all shadow-xs group"
      >
        <div>
          <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <span>{formatCurrency(forecast.monthlySurplus, currency)}</span>
            <span className="text-xs text-slate-400 font-medium">/ month</span>
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>Target milestone: {forecast.estimatedCompletionDate}</span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
