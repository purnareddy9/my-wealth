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
import { supabase, isSupabaseConfigured } from './services/supabase';
import { storageService } from './services/storageService';

export function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Navigation state
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('overview');

  // Financial application state - Initialize from storage
  const [user, setUser] = useState<UserProfile>(() => {
    return storageService.getActiveUser() || DEMO_USER;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return storageService.isDemoMode();
  });

  const [currency, setCurrency] = useState<string>('INR');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [accounts, setAccounts] = useState<FinancialAccount[]>(() => {
    const active = storageService.getActiveUser();
    const isDemo = storageService.isDemoMode();
    return storageService.getAccounts(active?.id || DEMO_USER.id, isDemo);
  });

  const [holdings, setHoldings] = useState<Holding[]>(() => {
    const active = storageService.getActiveUser();
    const isDemo = storageService.isDemoMode();
    return storageService.getHoldings(active?.id || DEMO_USER.id, isDemo);
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const active = storageService.getActiveUser();
    const isDemo = storageService.isDemoMode();
    return storageService.getTransactions(active?.id || DEMO_USER.id, isDemo);
  });

  const [salaryHistory, setSalaryHistory] = useState<SalaryRecord[]>(() => {
    const active = storageService.getActiveUser();
    const isDemo = storageService.isDemoMode();
    return storageService.getSalaryHistory(active?.id || DEMO_USER.id, isDemo);
  });

  const [hikePlans, setHikePlans] = useState<SalaryHikePlan[]>(() => {
    const active = storageService.getActiveUser();
    const isDemo = storageService.isDemoMode();
    return storageService.getHikePlans(active?.id || DEMO_USER.id, isDemo);
  });

  const [assumptions, setAssumptions] = useState<SavingsAssumptions>(() => {
    const active = storageService.getActiveUser();
    const isDemo = storageService.isDemoMode();
    return storageService.getAssumptions(active?.id || DEMO_USER.id, isDemo);
  });

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

  // Check for Supabase session on startup & sync with cloud
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = session.user;
          const firstName = u.user_metadata?.first_name || u.email?.split('@')[0] || 'User';
          const loggedInUser: UserProfile = {
            id: u.id,
            email: u.email || '',
            full_name: u.user_metadata?.full_name || firstName,
            first_name: firstName,
            currency: 'INR',
            theme: 'light',
            created_at: u.created_at,
          };
          storageService.setActiveUser(loggedInUser, false);
          setUser(loggedInUser);
          setIsDemoMode(false);

          // Load cloud accounts
          supabase.from('financial_accounts').select('*').eq('user_id', u.id).then(({ data }) => {
            if (data) {
              setAccounts(data);
              storageService.saveAccounts(u.id, data, false);
            }
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = session.user;
          const firstName = u.user_metadata?.first_name || u.email?.split('@')[0] || 'User';
          const loggedInUser: UserProfile = {
            id: u.id,
            email: u.email || '',
            full_name: u.user_metadata?.full_name || firstName,
            first_name: firstName,
            currency: 'INR',
            theme: 'light',
            created_at: u.created_at,
          };
          storageService.setActiveUser(loggedInUser, false);
          setUser(loggedInUser);
          setIsDemoMode(false);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

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

    setAccounts((prev) => {
      const updated = [acc, ...prev];
      storageService.saveAccounts(user.id, updated, isDemoMode);
      return updated;
    });

    // Cloud sync if Supabase is active
    if (isSupabaseConfigured && supabase && !isDemoMode) {
      supabase.from('financial_accounts').insert([acc]).then(({ error }) => {
        if (error) console.error('Cloud account save error:', error);
      });
    }
  };

  const handleUpdateBalance = (id: string, newBalance: number) => {
    setAccounts((prev) => {
      const updated = prev.map((acc) =>
        acc.id === id
          ? { ...acc, current_balance: newBalance, last_updated: new Date().toISOString() }
          : acc
      );
      storageService.saveAccounts(user.id, updated, isDemoMode);
      return updated;
    });

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      supabase
        .from('financial_accounts')
        .update({ current_balance: newBalance, last_updated: new Date().toISOString() })
        .eq('id', id);
    }
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => {
      const updated = prev.filter((acc) => acc.id !== id);
      storageService.saveAccounts(user.id, updated, isDemoMode);
      return updated;
    });

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      supabase.from('financial_accounts').delete().eq('id', id);
    }
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

    setTransactions((prev) => {
      const updatedTx = [tx, ...prev];
      storageService.saveTransactions(user.id, updatedTx, isDemoMode);
      return updatedTx;
    });

    // Update account balances automatically without double-counting transfers!
    setAccounts((prev) => {
      const updatedAccs = prev.map((acc) => {
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
      });
      storageService.saveAccounts(user.id, updatedAccs, isDemoMode);
      return updatedAccs;
    });

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      supabase.from('transactions').insert([tx]);
    }
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
    storageService.setActiveUser(DEMO_USER, true);
  };

  // Switch to demo template
  const handleSwitchToDemo = () => {
    storageService.setActiveUser(DEMO_USER, true);
    setUser(DEMO_USER);
    setIsDemoMode(true);
    setAccounts(DEMO_ACCOUNTS);
    setHoldings(DEMO_HOLDINGS);
    setTransactions(DEMO_TRANSACTIONS);
    setSalaryHistory(DEMO_SALARY_HISTORY);
    setHikePlans(DEMO_HIKE_PLANS);
    setAssumptions(DEMO_ASSUMPTIONS);
  };

  // Allow loading starter sample template into personal account on demand
  const handleLoadStarterTemplate = () => {
    setAccounts(DEMO_ACCOUNTS);
    setHoldings(DEMO_HOLDINGS);
    setTransactions(DEMO_TRANSACTIONS);
    setSalaryHistory(DEMO_SALARY_HISTORY);
    setHikePlans(DEMO_HIKE_PLANS);
    setAssumptions(DEMO_ASSUMPTIONS);
    storageService.saveAccounts(user.id, DEMO_ACCOUNTS, false);
    storageService.saveHoldings(user.id, DEMO_HOLDINGS, false);
    storageService.saveTransactions(user.id, DEMO_TRANSACTIONS, false);
    storageService.saveSalaryHistory(user.id, DEMO_SALARY_HISTORY, false);
    storageService.saveHikePlans(user.id, DEMO_HIKE_PLANS, false);
    storageService.saveAssumptions(user.id, DEMO_ASSUMPTIONS, false);
  };

  // When a user successfully logs in or registers personal account
  const handleAuthSuccess = (email: string, firstName: string, userId?: string) => {
    const uid = userId || `usr_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const loggedInUser: UserProfile = {
      id: uid,
      email,
      full_name: firstName,
      first_name: firstName,
      currency: 'INR',
      theme: theme,
      created_at: new Date().toISOString(),
    };

    // Save session in localStorage so it survives refresh & new tabs!
    storageService.setActiveUser(loggedInUser, false);
    setUser(loggedInUser);
    setIsDemoMode(false);

    // Personal account starts with FRESH data!
    const storedAccounts = storageService.getAccounts(uid, false);
    setAccounts(storedAccounts);
    setHoldings(storageService.getHoldings(uid, false));
    setTransactions(storageService.getTransactions(uid, false));
    setSalaryHistory(storageService.getSalaryHistory(uid, false));
    setHikePlans(storageService.getHikePlans(uid, false));
    setAssumptions(storageService.getAssumptions(uid, false));
  };

  const handleLogout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    storageService.logout();
    handleSwitchToDemo();
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
                onLoadStarterTemplate={handleLoadStarterTemplate}
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
                onUpdateAssumptions={(newAssump) => {
                  setAssumptions(newAssump);
                  storageService.saveAssumptions(user.id, newAssump, isDemoMode);
                }}
                onAddHikePlan={(plan) => {
                  setHikePlans((prev) => {
                    const updated = [plan as SalaryHikePlan, ...prev];
                    storageService.saveHikePlans(user.id, updated, isDemoMode);
                    return updated;
                  });
                }}
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
                onLogout={handleLogout}
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
        onSwitchToDemo={handleSwitchToDemo}
        onLogout={handleLogout}
        isDemoMode={isDemoMode}
        user={user}
      />
    </div>
  );
}

export default App;
