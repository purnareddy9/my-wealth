import React, { useState } from 'react';
import { 
  Zap, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Calculator, 
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { SalaryRecord, SalaryHikePlan, SavingsAssumptions } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface SalaryForecastViewProps {
  salaryHistory: SalaryRecord[];
  hikePlans: SalaryHikePlan[];
  assumptions: SavingsAssumptions;
  currency: string;
  onUpdateAssumptions: (newAssumptions: SavingsAssumptions) => void;
  onAddHikePlan: (plan: Partial<SalaryHikePlan>) => void;
}

// Custom Glassmorphic Tooltip for the Salary Trajectory Chart
const CustomSalaryTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isProjected = data.type === 'projected';
    const monthlyGross = Math.round(data.ctc / 12);

    return (
      <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-2xl text-xs z-50 pointer-events-none min-w-[210px] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="font-extrabold text-slate-800 dark:text-slate-100">
            {data.year}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
              isProjected
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300/40'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40'
            }`}
          >
            {isProjected ? 'Projected Scenario' : 'Historical Actual'}
          </span>
        </div>

        <div className="pt-2.5 space-y-2">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block">Annual CTC:</span>
            <span className="text-base font-black text-amber-600 dark:text-amber-400 tracking-tight">
              {formatCurrency(data.ctc, currency)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-medium text-slate-400 block">Monthly Gross:</span>
              <span className="font-bold text-xs text-slate-700 dark:text-slate-200">
                {formatCurrency(monthlyGross, currency, true)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-slate-400 block">Est. Take-Home:</span>
              <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                {formatCurrency(data.takeHome, currency, true)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const SalaryForecastView: React.FC<SalaryForecastViewProps> = ({
  salaryHistory,
  hikePlans,
  assumptions,
  currency,
  onUpdateAssumptions,
  onAddHikePlan,
}) => {
  // Scenario state
  const hasHistory = salaryHistory.length > 0;
  const currentJob = salaryHistory.find(s => s.is_current) || (hasHistory ? salaryHistory[0] : null);
  const [currentCTC, setCurrentCTC] = useState<number>(
    currentJob ? currentJob.annual_ctc : (assumptions.monthly_take_home ? assumptions.monthly_take_home * 14 : 1200000)
  );
  const [hikePercentage, setHikePercentage] = useState<number>(18);
  const [isJobChange, setIsJobChange] = useState<boolean>(false);
  const [targetEmployer, setTargetEmployer] = useState<string>('Tier-1 Tech Unicorn');
  const [selectedHorizon, setSelectedHorizon] = useState<number>(12); // months

  // Editable savings inputs
  const [takeHome, setTakeHome] = useState(assumptions.monthly_take_home);
  const [livingExpenses, setLivingExpenses] = useState(assumptions.monthly_living_expenses);
  const [emis, setEmis] = useState(assumptions.monthly_emis);
  const [investments, setInvestments] = useState(assumptions.monthly_investments);
  const [expectedBonus, setExpectedBonus] = useState(assumptions.expected_annual_bonus);
  const [returnRate, setReturnRate] = useState(assumptions.expected_investment_return_rate);

  // Recalculate scenario output
  const effectiveHike = isJobChange ? Math.max(hikePercentage, 30) : hikePercentage;
  const projectedCTC = currentCTC * (1 + effectiveHike / 100);
  const projectedMonthlyGross = projectedCTC / 12;
  const projectedMonthlyTakeHome = Math.round(projectedMonthlyGross * 0.78); // Approx post-tax ratio

  // Monthly net surplus
  const totalMonthlyCommitments = livingExpenses + emis;
  const netRemainingCash = Math.max(0, takeHome - totalMonthlyCommitments - investments);
  const totalMonthlySavings = netRemainingCash + investments;

  // Chart data: Salary progression over time (Historical Actuals + Future Projection)
  const salaryProgressionData = hasHistory
    ? [
        ...salaryHistory.map((s) => ({
          year: `${s.start_date.split('-')[0]} (${s.employer})`,
          ctc: s.annual_ctc,
          takeHome: s.monthly_take_home,
          type: 'actual',
        })),
        { year: 'Next Hike (Projected)', ctc: Math.round(projectedCTC), takeHome: projectedMonthlyTakeHome, type: 'projected' },
      ]
    : [
        { year: 'Current Estimate', ctc: currentCTC, takeHome: Math.round((currentCTC / 12) * 0.78), type: 'actual' },
        { year: 'Next Hike (Projected)', ctc: Math.round(projectedCTC), takeHome: projectedMonthlyTakeHome, type: 'projected' },
      ];

  // Multi-horizon savings projection data
  const savingsProjectionData = [
    { label: '3 Months', months: 3 },
    { label: '6 Months', months: 6 },
    { label: '12 Months', months: 12 },
    { label: '3 Years', months: 36 },
    { label: '5 Years', months: 60 },
  ].map((item) => {
    const monthlyRate = Math.pow(1 + returnRate / 100, 1 / 12) - 1;
    let accumulated = 0;
    for (let m = 1; m <= item.months; m++) {
      accumulated = accumulated * (1 + monthlyRate) + totalMonthlySavings;
    }
    const bonusAdd = Math.floor(item.months / 12) * expectedBonus;
    return {
      period: item.label,
      months: item.months,
      cumulativeSavings: Math.round(accumulated + bonusAdd),
      baseSavingsOnly: totalMonthlySavings * item.months,
    };
  });

  return (
    <div className="w-full space-y-7 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
          <Zap className="w-4 h-4" />
          <span>CAREER &amp; WEALTH ENGINE</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">
          Salary &amp; Savings Forecasting
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Simulate appraisal hikes, job switches, and project lifetime savings across multiple horizons
        </p>
      </div>

      {/* Career History Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-amber-500" />
          Employment &amp; Compensation History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {salaryHistory.map((job) => (
            <div
              key={job.id}
              className={`glass-card rounded-2xl p-4 sm:p-5 relative ${
                job.is_current ? 'ring-2 ring-amber-400/70 bg-white/80 dark:bg-slate-800/90' : ''
              }`}
            >
              {job.is_current && (
                <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-amber-500 text-white shadow-xs">
                  CURRENT ROLE
                </span>
              )}

              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{job.employer}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">{job.role}</div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Annual CTC:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {formatCurrency(job.annual_ctc, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Fixed Pay:</span>
                  <span>{formatCurrency(job.fixed_compensation, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Monthly Take-Home:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(job.monthly_take_home, currency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Hike Scenario Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 glass-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Appraisal / Job Change Simulator
            </h3>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Current Annual CTC</span>
              <span className="font-bold">{formatCurrency(currentCTC, currency)}</span>
            </div>
            <input
              type="range"
              min="1000000"
              max="6000000"
              step="100000"
              value={currentCTC}
              onChange={(e) => setCurrentCTC(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Expected Hike Percentage</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{effectiveHike}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={hikePercentage}
              onChange={(e) => setHikePercentage(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-white/60 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="jobChangeToggle" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Switching Employers (Job Change)
              </label>
              <input
                id="jobChangeToggle"
                type="checkbox"
                checked={isJobChange}
                onChange={(e) => setIsJobChange(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </div>

            {isJobChange && (
              <input
                type="text"
                placeholder="Target company / industry"
                value={targetEmployer}
                onChange={(e) => setTargetEmployer(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              />
            )}
          </div>

          {/* Scenario Result Output Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border border-amber-200/60 dark:border-amber-400/20 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-300 tracking-wider">
              PROJECTED COMPENSATION
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Projected CTC:</span>
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                {formatCurrency(projectedCTC, currency)}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Est. Monthly Take-Home:</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(projectedMonthlyTakeHome, currency)}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-amber-200/40">
              +{formatCurrency(projectedMonthlyTakeHome - takeHome, currency)} additional monthly savings capacity!
            </div>
          </div>
        </div>

        {/* Salary Progression Chart with Rich Hover Tooltip */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Salary Growth Trajectory (Historical vs Projected)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                Hover chart for compensation breakdown
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salaryProgressionData}>
                  <defs>
                    <linearGradient id="colorCtc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F99D20" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#F99D20" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis 
                    tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    content={<CustomSalaryTooltip currency={currency} />}
                    wrapperStyle={{ outline: 'none', zIndex: 100 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ctc"
                    stroke="#F99D20"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCtc)"
                    activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#F99D20' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Salary projections are illustrative estimates. Taxes may vary based on deductions.</span>
          </div>
        </div>
      </div>

      {/* Savings Calculator & Multi-Horizon Forecast */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Multi-Horizon Lifetime Savings Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Adjust your monthly budget to see compounding wealth accumulation over 3M, 6M, 1Y, 3Y, and 5Y
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/50">
            Monthly Surplus: {formatCurrency(totalMonthlySavings, currency)}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/60">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Monthly Take-Home: {formatCurrency(takeHome, currency)}
            </label>
            <input
              type="range"
              min="50000"
              max="300000"
              step="5000"
              value={takeHome}
              onChange={(e) => setTakeHome(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Living Expenses: {formatCurrency(livingExpenses, currency)}
            </label>
            <input
              type="range"
              min="10000"
              max="150000"
              step="2000"
              value={livingExpenses}
              onChange={(e) => setLivingExpenses(parseFloat(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Monthly EMIs &amp; Debt: {formatCurrency(emis, currency)}
            </label>
            <input
              type="range"
              min="0"
              max="80000"
              step="2000"
              value={emis}
              onChange={(e) => setEmis(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Expected Return: {returnRate}% p.a.
            </label>
            <input
              type="range"
              min="6"
              max="18"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Forecast Periods Table / Horizontal Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {savingsProjectionData.map((p) => (
            <div key={p.period} className="glass-card rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold text-slate-400 block">{p.period}</span>
              <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1">
                {formatCurrency(p.cumulativeSavings, currency, true)}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                Surplus + Compound
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
