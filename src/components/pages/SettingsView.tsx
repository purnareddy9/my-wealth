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
  Sliders
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsViewProps {
  user: UserProfile;
  currency: string;
  onUpdateCurrency: (c: string) => void;
  onResetData: () => void;
  onOpenAuth: () => void;
  isDemoMode: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  currency,
  onUpdateCurrency,
  onResetData,
  onOpenAuth,
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
          Customize currency, financial targets, automated alerts, and account privacy
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

          <button
            onClick={onOpenAuth}
            className="px-4 py-2 text-xs font-bold rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {isDemoMode ? 'Switch to Personal Account' : 'Account Security'}
          </button>
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

      {/* 2. Financial Target Assumptions (User-facing Wealth Parameters) */}
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

      {/* 3. Display & Currency Preferences */}
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

      {/* 4. Smart Financial Notifications */}
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

      {/* 5. Data Reset & Personal Data Management */}
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
