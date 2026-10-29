import React, { useState } from 'react';
import { Plus, Search, ArrowUpRight, ArrowDownRight, ArrowLeftRight, Coins, Filter } from 'lucide-react';
import { Transaction, FinancialAccount, TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: FinancialAccount[];
  currency: string;
  onOpenAddTransaction: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  accounts,
  currency,
  onOpenAddTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Financial Ledger &amp; Transactions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time record of all inflows, expenses, SIP contributions, and transfers
          </p>
        </div>

        <button
          onClick={onOpenAddTransaction}
          className="px-4 py-2 text-xs font-bold rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1.5 shadow-md transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          Record Transaction
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold w-full sm:w-auto pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'income', label: 'Income' },
            { id: 'expense', label: 'Expenses' },
            { id: 'transfer', label: 'Transfers' },
            { id: 'dividend', label: 'Dividends' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm border border-white/80 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/60 dark:border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Transaction / Description</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((tx) => {
                const acc = accountMap.get(tx.account_id);
                const toAcc = tx.to_account_id ? accountMap.get(tx.to_account_id) : null;

                const isIncome = tx.type === 'income' || tx.type === 'dividend';
                const isExpense = tx.type === 'expense';
                const isTransfer = tx.type === 'transfer';

                return (
                  <tr key={tx.id} className="hover:bg-white/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                              : isExpense
                              ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/40'
                              : 'bg-blue-50 text-blue-500 dark:bg-blue-950/40'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
                          ) : isExpense ? (
                            <ArrowDownRight className="w-4 h-4 stroke-[2.2]" />
                          ) : (
                            <ArrowLeftRight className="w-4 h-4 stroke-[2.2]" />
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            {tx.description}
                            {tx.is_internal_transfer && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-sm bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                INTERNAL TRANSFER
                              </span>
                            )}
                          </div>
                          {toAcc && (
                            <div className="text-[10px] text-slate-400">
                              Transferred to {toAcc.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                      {acc ? acc.name : 'Unknown Account'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(tx.transaction_date, 'short')}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div
                        className={`font-black text-sm ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isExpense
                            ? 'text-rose-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {isIncome ? '+' : isExpense ? '-' : '⇄ '}
                        {formatCurrency(tx.amount, currency)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
