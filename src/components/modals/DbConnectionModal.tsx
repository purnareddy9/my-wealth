import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Key, 
  ShieldCheck, 
  HardDrive,
  ExternalLink
} from 'lucide-react';
import { DbHealthStatus, testDatabaseConnection, getSupabaseConfig } from '../../services/supabase';

interface DbConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: DbHealthStatus;
  onRefreshStatus: () => Promise<any>;
  onTriggerSync?: () => Promise<any>;
}

export const DbConnectionModal: React.FC<DbConnectionModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshStatus,
  onTriggerSync,
}) => {
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [showCustomConfig, setShowCustomConfig] = useState(false);

  const supabaseCfg = getSupabaseConfig();
  const [customUrl, setCustomUrl] = useState(supabaseCfg.url || '');
  const [customKey, setCustomKey] = useState(supabaseCfg.key || '');
  const [configSaved, setConfigSaved] = useState(false);

  if (!isOpen) return null;

  const handleTestNow = async () => {
    setTesting(true);
    await onRefreshStatus();
    setTesting(false);
  };

  const handleSyncNow = async () => {
    if (!onTriggerSync) return;
    setSyncing(true);
    await onTriggerSync();
    setSyncing(false);
  };

  const handleSaveConfig = () => {
    if (customUrl.trim() && customKey.trim()) {
      localStorage.setItem('mw_supabase_url', customUrl.trim());
      localStorage.setItem('mw_supabase_key', customKey.trim());
      setConfigSaved(true);
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
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

  const isConnected = status.state === 'connected';
  const isWarning = status.state === 'needs_migration';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 sm:p-7 shadow-2xl border border-white/80 dark:border-white/20 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              isConnected
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                : isWarning
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Database Connection Status
              </h3>
              <p className="text-xs text-slate-500">
                PostgreSQL Cloud Sync &amp; Local Storage Isolation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Status Card */}
        <div className="mt-5 p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected ? 'bg-emerald-400' : isWarning ? 'bg-amber-400' : 'bg-slate-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isConnected ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-slate-500'
                }`} />
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {status.label}
              </span>
            </div>

            {status.latencyMs !== undefined && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-mono font-bold">
                {status.latencyMs}ms ping
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {status.message}
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleTestNow}
              disabled={testing}
              className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Check Connection'}</span>
            </button>

            {onTriggerSync && (
              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{syncing ? 'Syncing...' : 'Sync Cloud Now'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Database Diagnostic Details Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 block">CLOUD STORAGE</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              {supabaseCfg.isConfigured ? 'Supabase Active' : 'Offline Vault'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 block">TABLES VERIFIED</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
              {status.tablesExist ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Ready (RLS On)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Missing Tables</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Migration Script helper if tables need creation */}
        {(!status.tablesExist || isWarning) && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Need to create tables in Supabase?
              </span>
              <button
                onClick={handleCopySql}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
              >
                {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300">
              Paste into your <strong>Supabase Dashboard &rarr; SQL Editor</strong> and hit <strong>Run</strong>. All PostgreSQL tables and Row-Level Security policies will be established automatically.
            </p>
          </div>
        )}

        {/* Direct Supabase Credentials Config */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setShowCustomConfig(!showCustomConfig)}
            className="text-xs text-slate-500 hover:text-amber-500 font-bold flex items-center gap-1 transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{showCustomConfig ? 'Hide Supabase Keys' : 'Configure Supabase Keys in Browser'}</span>
          </button>

          {showCustomConfig && (
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs animate-in fade-in">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Anon Public Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                {configSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{configSaved ? 'Saved & Connecting...' : 'Save & Connect Supabase'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
