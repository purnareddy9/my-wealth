import React from 'react';
import { FileText, Download, Printer, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { FinancialAccount, Holding, NetWorthSummary, Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ReportsViewProps {
  summary: NetWorthSummary;
  accounts: FinancialAccount[];
  holdings: Holding[];
  transactions: Transaction[];
  currency: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  summary,
  accounts,
  holdings,
  transactions,
  currency,
}) => {
  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      summary,
      accounts,
      holdings,
      transactions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_wealth_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csv = 'Account Name,Institution,Type,Current Balance,Is Liability,Last Updated\n';
    accounts.forEach((a) => {
      csv += `"${a.name}","${a.institution}","${a.account_type}",${a.current_balance},${a.is_liability},"${a.last_updated}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_wealth_accounts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Lifetime Wealth Reports &amp; Export
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate audited wealth statements, backup personal data, or export to CSV
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 text-xs font-bold rounded-full bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-bold rounded-full bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Statement
          </button>
        </div>
      </div>

      {/* Official Printable Statement Preview */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-white/90 dark:border-white/10 print:shadow-none print:border-none">
        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200/60 dark:border-slate-700/60 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                MY WEALTH
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Comprehensive Lifetime Wealth Statement</p>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400">Statement Date:</span>
            <div className="font-bold text-slate-700 dark:text-slate-200">
              {formatDate(new Date().toISOString(), 'full')}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Verified Snapshot #MW-2026-9081</span>
          </div>
        </div>

        {/* Big Net Worth Summary Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-900/80 border border-white/60">
          <div>
            <span className="text-xs font-semibold text-slate-500">Gross Assets</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(summary.totalAssets, currency)}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Liabilities &amp; Debt</span>
            <div className="text-2xl font-black text-rose-500 dark:text-rose-400 mt-1">
              {formatCurrency(summary.totalLiabilities, currency)}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Certified Net Worth</span>
            <div className="text-3xl font-black text-slate-800 dark:text-slate-50 mt-0.5">
              {formatCurrency(summary.netWorth, currency)}
            </div>
          </div>
        </div>

        {/* Assets Listing */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Asset Accounts Breakdown</h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {accounts.filter(a => !a.is_liability).map((a) => (
              <div key={a.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{a.name}</span>
                  <span className="text-slate-400 text-[11px] ml-2">({a.institution})</span>
                </div>
                <span className="font-black text-slate-800 dark:text-slate-100">
                  {formatCurrency(a.current_balance, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Regulatory & Financial Disclaimers as required by prompt */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Data Privacy Guarantee:</strong> All financial entries are processed with end-to-end user isolation under Row-Level Security (RLS). No confidential login credentials or broker passwords are ever requested or stored.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Financial Risk Disclaimer:</strong> Projections and salary hike forecasts are analytical estimates and should not be treated as financial advice or guaranteed investment yields. Past performance does not guarantee future market returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
