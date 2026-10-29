import React, { useState } from 'react';
import { LineChart as ChartIcon, ArrowUpRight, ArrowDownRight, Upload, Search, Plus } from 'lucide-react';
import { Holding } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface InvestmentsViewProps {
  holdings: Holding[];
  currency: string;
  onOpenCsvImport: () => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({
  holdings,
  currency,
  onOpenCsvImport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'stock' | 'mutual_fund'>('all');

  const filteredHoldings = holdings.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || h.asset_type === filterType;
    return matchesSearch && matchesType;
  });

  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.current_value, 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.cost_basis, 0);
  const totalUnrealizedPnL = totalCurrentValue - totalCostBasis;
  const totalReturnPercentage = totalCostBasis > 0 ? (totalUnrealizedPnL / totalCostBasis) * 100 : 0;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Investments &amp; Portfolio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time equity holdings, mutual fund SIPs, cost basis, and unrealized profit/loss
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCsvImport}
            className="px-4 py-2 text-xs font-bold rounded-full bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            Import Broker CSV
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400">Total Portfolio Value</span>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {formatCurrency(totalCurrentValue, currency)}
          </div>
          <span className="text-[10px] text-slate-400">{holdings.length} tracked holdings</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400">Total Invested (Cost Basis)</span>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-200 mt-0.5">
            {formatCurrency(totalCostBasis, currency)}
          </div>
          <span className="text-[10px] text-slate-400">Original purchase cost</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400">Unrealized Profit/Loss</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            {formatCurrency(totalUnrealizedPnL, currency)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Net portfolio gain</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400">Total All-Time Return</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatPercentage(totalReturnPercentage)}
          </div>
          <span className="text-[10px] text-slate-400">Outperforming benchmark</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock symbol or fund name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full transition-all ${
              filterType === 'all' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/50 dark:bg-slate-800 text-slate-600'
            }`}
          >
            All ({holdings.length})
          </button>
          <button
            onClick={() => setFilterType('stock')}
            className={`px-3 py-1 rounded-full transition-all ${
              filterType === 'stock' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/50 dark:bg-slate-800 text-slate-600'
            }`}
          >
            Stocks (4)
          </button>
          <button
            onClick={() => setFilterType('mutual_fund')}
            className={`px-3 py-1 rounded-full transition-all ${
              filterType === 'mutual_fund' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/50 dark:bg-slate-800 text-slate-600'
            }`}
          >
            Mutual Funds (2)
          </button>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm border border-white/80 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/60 dark:border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Instrument / Symbol</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Avg Price</th>
                <th className="py-3 px-4 text-right">Market Price</th>
                <th className="py-3 px-4 text-right">Current Value</th>
                <th className="py-3 px-4 text-right">Unrealized P&amp;L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredHoldings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">No investment holdings recorded</p>
                    <p className="text-xs mt-1">Import a broker CSV or link your Demat/SIP accounts to see your portfolio breakdown.</p>
                  </td>
                </tr>
              ) : (
                filteredHoldings.map((h) => {
                const isPositive = h.unrealized_pnl >= 0;

                return (
                  <tr key={h.id} className="hover:bg-white/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100">{h.symbol}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{h.name}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {h.asset_type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                      {h.quantity}
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-600 dark:text-slate-400">
                      {formatCurrency(h.average_buy_price, currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800 dark:text-slate-100">
                      {formatCurrency(h.current_market_price, currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-800 dark:text-slate-50">
                      {formatCurrency(h.current_value, currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div
                        className={`font-bold flex items-center justify-end gap-0.5 ${
                          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                        }`}
                      >
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {formatCurrency(h.unrealized_pnl, currency)}
                      </div>
                      <div
                        className={`text-[10px] font-semibold ${
                          isPositive ? 'text-emerald-500' : 'text-rose-400'
                        }`}
                      >
                        {formatPercentage(h.unrealized_pnl_percentage)}
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
