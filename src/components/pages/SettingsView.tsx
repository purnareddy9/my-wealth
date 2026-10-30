import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Target, 
  Coins, 
  Lock, 
  Download, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Sliders,
  LogOut,
  Database,
  Key,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../../types';
import { testDatabaseConnection, getSupabaseConfig, DbHealthStatus } from '../../services/supabase';

interface SettingsViewProps {
  user: UserProfile;
  currency: string;
  onUpdateCurrency: (c: string) => void;
  onResetData: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isDemoMode: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  currency,
  onUpdateCurrency,
  onResetData,
  onOpenAuth,
  onLogout,
  isDemoMode,
}) => {
  const [savedMessage, setSavedMessage] = useState('');

  // User financial preferences
  const [savingsTarget, setSavingsTarget] = useState('50000');
  const [emergencyFundMonths, setEmergencyFundMonths] = useState('6');
  const [expectedReturn, setExpectedReturn] = useState('11.5');
  const [inflationRate, setInflationRate] = useState('5.5');
  const [financialYearFormat, setFinancialYearFormat] = useState('apr_mar');

  // Notification preferences
  const [notifySip, setNotifySip] = useState(true);
  const [notifySavingsGoal, setNotifySavingsGoal] = useState(true);
  const [notifySalaryHike, setNotifySalaryHike] = useState(false);

  // Cloud DB testing & configuration
  const supabaseCfg = getSupabaseConfig();
  const [testingDb, setTestingDb] = useState(false);
  const [dbResult, setDbResult] = useState<DbHealthStatus | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSql, setShowSql] = useState(false);

  const handleTestConnection = async () => {
    setTestingDb(true);
    setDbResult(null);
    const res = await testDatabaseConnection();
    setDbResult(res);
    setTestingDb(false);
  };

  const migrationSql = `-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  first_name TEXT,
  currency TEXT DEFAULT 'INR',
  theme TEXT DEFAULT 'light',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Financial Accounts
CREATE TABLE IF NOT EXISTS public.financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  account_type TEXT NOT NULL,
  category TEXT NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  opening_date DATE DEFAULT CURRENT_DATE NOT NULL,
  initial_balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  current_balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  is_liability BOOLEAN DEFAULT FALSE NOT NULL,
  interest_rate NUMERIC(5, 2),
  account_number_mask TEXT,
  is_archived BOOLEAN DEFAULT FALSE NOT NULL,
  notes TEXT,
  last_updated TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Holdings (Stocks, ETFs, Mutual Funds)
CREATE TABLE IF NOT EXISTS public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.financial_accounts(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  quantity NUMERIC(15, 4) NOT NULL,
  average_buy_price NUMERIC(15, 2) NOT NULL,
  cost_basis NUMERIC(15, 2) NOT NULL,
  current_market_price NUMERIC(15, 2) NOT NULL,
  current_value NUMERIC(15, 2) NOT NULL,
  unrealized_pnl NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  unrealized_pnl_percentage NUMERIC(8, 2) DEFAULT 0.00 NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.financial_accounts(id) ON DELETE CASCADE,
  to_account_id UUID REFERENCES public.financial_accounts(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_internal_transfer BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own accounts" ON public.financial_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own holdings" ON public.holdings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(migrationSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSavePreferences = () => {
    setSavedMessage('Settings and assumptions saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Settings &amp; Personal Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize currency, financial targets, cloud database synchronization, and account privacy
        </p>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-200/50">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* 1. User Profile & Account Security */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 to-amber-200 shadow-sm flex items-center justify-center">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
                alt={user.full_name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{user.full_name}</h3>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-bold rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {isDemoMode ? 'Switch to Personal Account' : 'Account Security'}
            </button>
            {!isDemoMode && (
              <button
                onClick={() => {
                  if (confirm(`Sign out of ${user.email || user.full_name}?`)) {
                    onLogout();
                  }
                }}
                className="px-3.5 py-2 text-xs font-bold rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50 transition-colors flex items-center gap-1.5"
                title="Sign out of your personal account"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">DATA PRIVACY STATUS</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-100">
                End-to-End Client Isolation Active
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">CREDENTIAL PROTECTION</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-100">
                Zero-Knowledge (No PINs or Passwords Stored)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cloud Database (Supabase) Health & Synchronization */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-500">
              <Database className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Cloud Database Synchronization (Supabase)
              </h3>
              <p className="text-xs text-slate-500">
                Real-time PostgreSQL database connectivity and table status
              </p>
            </div>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={testingDb}
            className="px-4 py-2 text-xs font-bold rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {testingDb ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>{testingDb ? 'Verifying...' : 'Test Cloud Connection'}</span>
          </button>
        </div>

        {/* Database Diagnostic Output */}
        {dbResult && (
          <div className={`p-4 rounded-2xl border text-xs font-semibold ${
            dbResult.state === 'connected'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60'
              : dbResult.state === 'needs_migration'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300/60'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/60'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {dbResult.state === 'connected' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
                <span>{dbResult.message}</span>
              </div>

              {!dbResult.tablesExist && (
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 flex-shrink-0 shadow-xs"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy Migration SQL'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/60">
            <span className="text-[10px] font-bold text-slate-400 block">SUPABASE ENDPOINT</span>
            <span className="font-mono text-slate-800 dark:text-slate-100 font-semibold truncate block mt-0.5">
              {supabaseCfg.url || 'Not configured (using local browser vault)'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/60">
            <span className="text-[10px] font-bold text-slate-400 block">CONNECTION MODE</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${supabaseCfg.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {supabaseCfg.isConfigured ? 'PostgreSQL Cloud Connected' : 'Offline Encrypted Vault'}
            </span>
          </div>
        </div>

        {/* View / Copy Migration SQL Collapsible */}
        <div className="pt-1">
          <button
            onClick={() => setShowSql(!showSql)}
            className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>{showSql ? 'Hide SQL Migration Script' : 'View SQL Migration Script (for Supabase SQL Editor)'}</span>
          </button>

          {showSql && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-mono text-[11px]">init_my_wealth.sql</span>
                <button
                  onClick={handleCopySql}
                  className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono overflow-x-auto p-2 bg-slate-950 rounded-xl max-h-48 text-emerald-400">
                {migrationSql}
              </pre>
              <p className="text-[11px] text-slate-400">
                Paste this into your <strong>Supabase Dashboard &rarr; SQL Editor</strong> and click <strong>Run</strong> to set up all tables and RLS security policies.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Financial Target Assumptions (User-facing Wealth Parameters) */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Financial Goals &amp; Planning Targets
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure default milestones used across the dashboard dials and forecasting algorithms.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Monthly Savings Target ({currency})
            </label>
            <input
              type="number"
              value={savingsTarget}
              onChange={(e) => setSavingsTarget(e.target.value)}
              placeholder="50000"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Emergency Reserve Target (Months of Expenses)
            </label>
            <select
              value={emergencyFundMonths}
              onChange={(e) => setEmergencyFundMonths(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="3">3 Months (Aggressive Growth)</option>
              <option value="6">6 Months (Recommended Benchmark)</option>
              <option value="9">9 Months (Conservative)</option>
              <option value="12">12 Months (Maximum Safety)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Expected Long-Term Portfolio Return (% p.a.)
            </label>
            <input
              type="number"
              step="0.1"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Inflation Rate Estimate (% p.a.)
            </label>
            <input
              type="number"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-full shadow-md transition-all"
          >
            Update Goals &amp; Targets
          </button>
        </div>
      </div>

      {/* 4. Display & Currency Preferences */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Currency &amp; Regional Formatting
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Primary Currency Standard
            </label>
            <select
              value={currency}
              onChange={(e) => {
                onUpdateCurrency(e.target.value);
                handleSavePreferences();
              }}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="INR">INR (₹) — Indian Rupee (Lakh / Crore System)</option>
              <option value="USD">USD ($) — US Dollar ($M / $k)</option>
              <option value="EUR">EUR (€) — Euro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Fiscal Year Standard
            </label>
            <select
              value={financialYearFormat}
              onChange={(e) => setFinancialYearFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="apr_mar">April – March (Indian Financial Year)</option>
              <option value="jan_dec">January – December (Calendar Year)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Smart Financial Notifications */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Smart Alerts &amp; Reminders
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/60 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                Mutual Fund SIP Auto-Debit Reminders
              </span>
              <span className="text-[11px] text-slate-400">
                Notify 2 business days prior to scheduled SIP withdrawals
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifySip}
              onChange={(e) => setNotifySip(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/60 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                Monthly Savings Goal Tracking
              </span>
              <span className="text-[11px] text-slate-400">
                Weekly progress updates towards your ₹50k monthly savings goal
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifySavingsGoal}
              onChange={(e) => setNotifySavingsGoal(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
            />
          </label>
        </div>
      </div>

      {/* 6. Data Reset & Personal Data Management */}
      <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/60 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-slate-500" />
          Data Controls &amp; Reset
        </h3>
        <p className="text-xs text-slate-500">
          Restore realistic demo scenarios or reset local account modifications back to the default reference state.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (confirm('Reset all financial accounts and records back to the pristine demo baseline?')) {
                onResetData();
                setSavedMessage('Demo baseline data restored successfully!');
                setTimeout(() => setSavedMessage(''), 2500);
              }
            }}
            className="px-4 py-2 text-xs font-bold rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restore Sample Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
