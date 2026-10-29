import React, { useState } from 'react';
import { Plus, Upload, Landmark, Edit3, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { FinancialAccount } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface AccountsViewProps {
  accounts: FinancialAccount[];
  currency: string;
  onAddAccount: () => void;
  onOpenCsvImport: () => void;
  onUpdateBalance: (id: string, newBalance: number) => void;
  onDeleteAccount: (id: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  currency,
  onAddAccount,
  onOpenCsvImport,
  onUpdateBalance,
  onDeleteAccount,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBalanceVal, setEditBalanceVal] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const assets = accounts.filter(a => !a.is_liability && !a.is_archived);
  const liabilities = accounts.filter(a => a.is_liability && !a.is_archived);

  const totalAssets = assets.reduce((sum, a) => sum + a.current_balance, 0);
  const totalLiab = liabilities.reduce((sum, a) => sum + Math.abs(a.current_balance), 0);
  const netWorth = totalAssets - totalLiab;

  const handleStartEdit = (acc: FinancialAccount) => {
    setEditingId(acc.id);
    setEditBalanceVal(acc.current_balance.toString());
  };

  const handleSaveBalance = (id: string) => {
    const val = parseFloat(editBalanceVal);
    if (!isNaN(val)) {
      onUpdateBalance(id, val);
    }
    setEditingId(null);
  };

  const filteredAccounts = accounts.filter(a => {
    if (filterCategory === 'assets') return !a.is_liability;
    if (filterCategory === 'liabilities') return a.is_liability;
    if (filterCategory === 'cash') return a.category === 'cash_bank';
    if (filterCategory === 'equity') return a.category === 'equity';
    if (filterCategory === 'retirement') return a.category === 'debt_retirement';
    return true;
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Accounts &amp; Liabilities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track bank balances, investments, retirement funds, and loans
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCsvImport}
            className="px-4 py-2 text-xs font-bold rounded-full bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>
          <button
            onClick={onAddAccount}
            className="px-4 py-2 text-xs font-bold rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Add Account
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400">Total Assets</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatCurrency(totalAssets, currency)}
          </div>
          <span className="text-[10px] text-slate-400">{assets.length} active asset accounts</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400">Total Liabilities</span>
          <div className="text-2xl font-black text-rose-500 dark:text-rose-400 mt-0.5">
            {formatCurrency(totalLiab, currency)}
          </div>
          <span className="text-[10px] text-slate-400">{liabilities.length} active debts / EMIs</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400">Current Net Worth</span>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {formatCurrency(netWorth, currency)}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">Assets minus Liabilities</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Accounts' },
          { id: 'assets', label: 'Assets Only' },
          { id: 'liabilities', label: 'Debts & Loans' },
          { id: 'cash', label: 'Cash & Banks' },
          { id: 'equity', label: 'Equities' },
          { id: 'retirement', label: 'Retirement' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              filterCategory === tab.id
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white/50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accounts List / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAccounts.map((acc) => {
          const isEditing = editingId === acc.id;

          return (
            <div
              key={acc.id}
              className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all border border-white/80 dark:border-white/10"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        acc.is_liability
                          ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/40'
                          : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40'
                      }`}
                    >
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {acc.name}
                        {acc.is_liability && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-sm bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                            DEBT
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {acc.institution} {acc.account_number_mask && `• ${acc.account_number_mask}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(acc)}
                      title="Update balance"
                      className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteAccount(acc.id)}
                      title="Delete account"
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400">Current Balance</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          value={editBalanceVal}
                          onChange={(e) => setEditBalanceVal(e.target.value)}
                          className="w-32 px-2 py-1 text-sm font-bold rounded-lg border border-amber-400 bg-white dark:bg-slate-800"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveBalance(acc.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`text-xl font-black tracking-tight ${
                          acc.is_liability ? 'text-rose-600' : 'text-slate-800 dark:text-slate-50'
                        }`}
                      >
                        {formatCurrency(acc.current_balance, currency)}
                      </div>
                    )}
                  </div>

                  {acc.interest_rate && (
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-slate-400">Interest</span>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {acc.interest_rate}% p.a.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Updated: {formatDate(acc.last_updated, 'short')}</span>
                <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium">
                  {acc.account_type.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
