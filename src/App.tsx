import React, { useState, useEffect } from 'react';
import { BackgroundPastel } from './components/layout/BackgroundPastel';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { CategoryFilter } from './components/layout/BottomCategoryBar';

// Views
import { Overview } from './components/pages/Overview';
import { AccountsView } from './components/pages/AccountsView';
import { InvestmentsView } from './components/pages/InvestmentsView';
import { TransactionsView } from './components/pages/TransactionsView';
import { SalaryForecastView } from './components/pages/SalaryForecastView';
import { AnalyticsView } from './components/pages/AnalyticsView';
import { ReportsView } from './components/pages/ReportsView';
import { SettingsView } from './components/pages/SettingsView';

// Modals
import { AddAccountModal } from './components/modals/AddAccountModal';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { CsvImportModal } from './components/modals/CsvImportModal';
import { AuthModal } from './components/auth/AuthModal';

// Types & Services
import {
  FinancialAccount,
  Holding,
  Transaction,
  SalaryRecord,
  SalaryHikePlan,
  SavingsAssumptions,
  UserProfile,
} from './types';
import {
  DEMO_ACCOUNTS,
  DEMO_HOLDINGS,
  DEMO_TRANSACTIONS,
  DEMO_SALARY_HISTORY,
  DEMO_HIKE_PLANS,
  DEMO_ASSUMPTIONS,
  DEMO_USER,
} from './services/demoData';
import {
  calculateNetWorthSummary,
  calculateAssetAllocation,
} from './utils/calculations';

export function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Navigation state
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('overview');

  // Financial application state
  const [user, setUser] = useState<UserProfile>(DEMO_USER);
  const [currency, setCurrency] = useState<string>('INR');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [accounts, setAccounts] = useState<FinancialAccount[]>(DEMO_ACCOUNTS);
  const [holdings, setHoldings] = useState<Holding[]>(DEMO_HOLDINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [salaryHistory, setSalaryHistory] = useState<SalaryRecord[]>(DEMO_SALARY_HISTORY);
  const [hikePlans, setHikePlans] = useState<SalaryHikePlan[]>(DEMO_HIKE_PLANS);
  const [assumptions, setAssumptions] = useState<SavingsAssumptions>(DEMO_ASSUMPTIONS);

  // Modals state
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Synchronize dark mode class on document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Derived calculations
  const summary = calculateNetWorthSummary(accounts, transactions, assumptions);
  const allocations = calculateAssetAllocation(accounts);

  // Category filter synchronizer (bottom bar)
  const handleSelectCategory = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    if (cat === 'overview') setCurrentTab('overview');
    else if (cat === 'investments') setCurrentTab('investments');
    else if (cat === 'savings') setCurrentTab('salary');
    else if (cat === 'salary') setCurrentTab('salary');
    else if (cat === 'expenses') setCurrentTab('transactions');
  };

  // Account management handlers
  const handleAddAccount = (newAcc: Partial<FinancialAccount>) => {
    const acc: FinancialAccount = {
      id: `acc_${Date.now()}`,
      user_id: user.id,
      name: newAcc.name || 'Account',
      institution: newAcc.institution || 'Bank',
      account_type: newAcc.account_type || 'bank',
      category: newAcc.category || 'cash_bank',
      currency: currency,
      opening_date: newAcc.opening_date || new Date().toISOString().split('T')[0],
      initial_balance: newAcc.initial_balance || 0,
      current_balance: newAcc.current_balance || 0,
      is_liability: Boolean(newAcc.is_liability),
      interest_rate: newAcc.interest_rate,
      account_number_mask: newAcc.account_number_mask,
      last_updated: new Date().toISOString(),
    };
    setAccounts((prev) => [acc, ...prev]);
  };

  const handleUpdateBalance = (id: string, newBalance: number) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? { ...acc, current_balance: newBalance, last_updated: new Date().toISOString() }
          : acc
      )
    );
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  // Transaction management handler (with double counting prevention!)
  const handleAddTransaction = (newTx: Partial<Transaction>) => {
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      user_id: user.id,
      account_id: newTx.account_id || accounts[0]?.id || '',
      to_account_id: newTx.to_account_id,
      type: newTx.type || 'expense',
      amount: newTx.amount || 0,
      currency: currency,
      category: newTx.category || 'General',
      description: newTx.description || 'Transaction',
      transaction_date: newTx.transaction_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      is_internal_transfer: Boolean(newTx.is_internal_transfer),
    };

    setTransactions((prev) => [tx, ...prev]);

    // Update account balances automatically without double-counting transfers!
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === tx.account_id) {
          // Source account
          if (tx.type === 'expense' || tx.type === 'transfer' || tx.type === 'investment_contribution') {
            return { ...acc, current_balance: acc.current_balance - tx.amount };
          } else if (tx.type === 'income' || tx.type === 'dividend') {
            return { ...acc, current_balance: acc.current_balance + tx.amount };
          }
        } else if (tx.to_account_id && acc.id === tx.to_account_id) {
          // Destination account (Internal Transfer)
          return { ...acc, current_balance: acc.current_balance + tx.amount };
        }
        return acc;
      })
    );
  };

  const handleResetData = () => {
    setAccounts(DEMO_ACCOUNTS);
    setHoldings(DEMO_HOLDINGS);
    setTransactions(DEMO_TRANSACTIONS);
    setSalaryHistory(DEMO_SALARY_HISTORY);
    setHikePlans(DEMO_HIKE_PLANS);
    setAssumptions(DEMO_ASSUMPTIONS);
    setUser(DEMO_USER);
    setIsDemoMode(true);
  };

  const handleAuthSuccess = (email: string, firstName: string) => {
    setUser((prev) => ({
      ...prev,
      email,
      first_name: firstName,
      full_name: firstName,
    }));
    setIsDemoMode(false);
  };

  return (
    <div className="relative min-h-screen py-4 sm:py-8 px-2 sm:px-6 lg:px-10 flex flex-col justify-center">
      {/* Background Pastel Blobs matching the reference screenshot */}
      <BackgroundPastel />

      {/* Main Glass Outer Container */}
      <main className="w-full max-w-[1440px] mx-auto glass-outer rounded-[34px] sm:rounded-[42px] p-4 sm:p-6 lg:p-8 transition-all duration-300">
        {/* Top Header */}
        <Header
          user={user}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNotifications={() => alert('All accounts synchronized. No security alerts pending.')}
          onOpenAuth={() => setIsAuthOpen(true)}
          isDemoMode={isDemoMode}
        />

        {/* Dashboard Body: Sidebar + Main Inner Panel */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 pt-2">
          {/* Vertical Slim Floating Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              if (tab === 'overview') setActiveCategory('overview');
              else if (tab === 'investments') setActiveCategory('investments');
              else if (tab === 'salary') setActiveCategory('salary');
              else if (tab === 'transactions') setActiveCategory('expenses');
            }}
          />

          {/* Large Inner Frosted Glass Dashboard Panel */}
          <section className="flex-1 glass-inner-panel rounded-[28px] sm:rounded-[36px] p-4 sm:p-6 lg:p-7 transition-all overflow-hidden min-h-[640px] flex flex-col justify-between">
            {currentTab === 'overview' && (
              <Overview
                summary={summary}
                accounts={accounts}
                allocations={allocations}
                assumptions={assumptions}
                currency={currency}
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
                onQuickAdd={() => setIsAddTransactionOpen(true)}
                onOpenAccounts={() => setCurrentTab('accounts')}
                onOpenHoldings={() => setCurrentTab('investments')}
                onOpenSavings={() => setCurrentTab('salary')}
                onOpenForecasts={() => setCurrentTab('salary')}
                onOpenAnalytics={() => setCurrentTab('analytics')}
              />
            )}

            {currentTab === 'accounts' && (
              <AccountsView
                accounts={accounts}
                currency={currency}
                onAddAccount={() => setIsAddAccountOpen(true)}
                onOpenCsvImport={() => setIsCsvImportOpen(true)}
                onUpdateBalance={handleUpdateBalance}
                onDeleteAccount={handleDeleteAccount}
              />
            )}

            {currentTab === 'investments' && (
              <InvestmentsView
                holdings={holdings}
                currency={currency}
                onOpenCsvImport={() => setIsCsvImportOpen(true)}
              />
            )}

            {currentTab === 'salary' && (
              <SalaryForecastView
                salaryHistory={salaryHistory}
                hikePlans={hikePlans}
                assumptions={assumptions}
                currency={currency}
                onUpdateAssumptions={setAssumptions}
                onAddHikePlan={(plan) => setHikePlans((prev) => [plan as SalaryHikePlan, ...prev])}
              />
            )}

            {currentTab === 'transactions' && (
              <TransactionsView
                transactions={transactions}
                accounts={accounts}
                currency={currency}
                onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView
                summary={summary}
                allocations={allocations}
                currency={currency}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                summary={summary}
                accounts={accounts}
                holdings={holdings}
                transactions={transactions}
                currency={currency}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                user={user}
                currency={currency}
                onUpdateCurrency={setCurrency}
                onResetData={handleResetData}
                onOpenAuth={() => setIsAuthOpen(true)}
                isDemoMode={isDemoMode}
              />
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAddAccount={handleAddAccount}
      />

      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        accounts={accounts}
        onAddTransaction={handleAddTransaction}
      />

      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
        onImportSuccess={(count) => alert(`Successfully processed statement with ${count} entries!`)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        onSwitchToDemo={() => {
          setIsDemoMode(true);
          setUser(DEMO_USER);
        }}
        isDemoMode={isDemoMode}
      />
    </div>
  );
}

export default App;
