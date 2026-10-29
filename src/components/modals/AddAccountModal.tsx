import React, { useState } from 'react';
import { X, Landmark, Plus } from 'lucide-react';
import { AccountType, AssetCategory, FinancialAccount } from '../../types';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (acc: Partial<FinancialAccount>) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState('');
  const [isLiability, setIsLiability] = useState(false);
  const [interestRate, setInterestRate] = useState('');
  const [accountMask, setAccountMask] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !institution || !balance) return;

    let category: AssetCategory = 'cash_bank';
    if (isLiability || accountType === 'loan' || accountType === 'credit_card' || accountType === 'liability') {
      category = 'liabilities';
    } else if (accountType === 'stocks' || accountType === 'etf' || accountType === 'mutual_fund') {
      category = 'equity';
    } else if (accountType === 'epf' || accountType === 'ppf' || accountType === 'nps' || accountType === 'fixed_deposit') {
      category = 'debt_retirement';
    } else if (accountType === 'gold') {
      category = 'precious_metals';
    } else if (accountType === 'real_estate') {
      category = 'real_estate';
    }

    onAddAccount({
      name,
      institution,
      account_type: accountType,
      category,
      currency: 'INR',
      initial_balance: parseFloat(balance),
      current_balance: parseFloat(balance),
      is_liability: isLiability,
      interest_rate: interestRate ? parseFloat(interestRate) : undefined,
      account_number_mask: accountMask ? `•••• ${accountMask.slice(-4)}` : undefined,
      opening_date: new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 shadow-2xl border border-white/80 dark:border-white/20">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Add New Account</h3>
              <p className="text-xs text-slate-500">Track an asset or liability in your net worth</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Account Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Salary Account, Kite Demat"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Institution / Provider *
              </label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. HDFC Bank, Zerodha, EPFO"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => {
                  const val = e.target.value as AccountType;
                  setAccountType(val);
                  setIsLiability(val === 'loan' || val === 'credit_card' || val === 'liability');
                }}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="bank">Bank Account</option>
                <option value="cash">Cash / Liquid</option>
                <option value="stocks">Stock Broker (Demat)</option>
                <option value="mutual_fund">Mutual Funds (Direct/AMC)</option>
                <option value="epf">EPF / PF (Provident Fund)</option>
                <option value="ppf">PPF (Public Provident Fund)</option>
                <option value="nps">NPS (National Pension Scheme)</option>
                <option value="fixed_deposit">Fixed Deposit (FD)</option>
                <option value="recurring_deposit">Recurring Deposit (RD)</option>
                <option value="gold">SGB / Gold</option>
                <option value="real_estate">Real Estate</option>
                <option value="loan">Loan / EMI (Liability)</option>
                <option value="credit_card">Credit Card (Liability)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Current Balance (INR ₹) *
              </label>
              <input
                type="number"
                step="any"
                required
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Interest Rate (% p.a. optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g. 7.1"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Last 4 Digits of Account
              </label>
              <input
                type="text"
                maxLength={4}
                value={accountMask}
                onChange={(e) => setAccountMask(e.target.value)}
                placeholder="e.g. 4092"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isLiability"
              checked={isLiability}
              onChange={(e) => setIsLiability(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <label htmlFor="isLiability" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              This is a liability / debt (subtracts from Net Worth)
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-full shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
