import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Sparkles, Key, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, firstName: string, userId?: string) => void;
  onSwitchToDemo: () => void;
  isDemoMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToDemo,
  isDemoMode,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Optional direct Supabase connection toggle
  const [showDirectConfig, setShowDirectConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState(localStorage.getItem('mw_supabase_url') || '');
  const [customKey, setCustomKey] = useState(localStorage.getItem('mw_supabase_key') || '');
  const [configSaved, setConfigSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveDirectConfig = () => {
    if (customUrl && customKey) {
      localStorage.setItem('mw_supabase_url', customUrl.trim());
      localStorage.setItem('mw_supabase_key', customKey.trim());
      setConfigSaved(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // If Supabase credentials are not connected yet, create a persistent local user
        setTimeout(() => {
          setLoading(false);
          const firstName = fullName ? fullName.split(' ')[0] : email.split('@')[0];
          const uid = `usr_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
          onSuccess(email, firstName, uid);
          onClose();
        }, 500);
        return;
      }

      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              first_name: fullName.split(' ')[0],
            },
          },
        });
        if (error) throw error;
        setInfoMessage('Account created! Checking verification...');
        if (data.user) {
          onSuccess(email, fullName.split(' ')[0], data.user.id);
          setTimeout(onClose, 800);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          const name = data.user.user_metadata?.first_name || data.user.email?.split('@')[0] || 'User';
          onSuccess(data.user.email || email, name, data.user.id);
          onClose();
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Authentication failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl glass-card p-6 sm:p-7 shadow-2xl border border-white/80 dark:border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {mode === 'signin' ? 'Sign In to My Wealth' : 'Create Encrypted Account'}
              </h3>
              <p className="text-xs text-slate-500">Row-Level Security user isolation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {errorMessage}
          </div>
        )}

        {infoMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In Securely' : 'Create My Account'}
          </button>
        </form>

        {/* Demo Mode & Mode Switch */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2 text-center text-xs">
          <p className="text-slate-500">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          <button
            type="button"
            onClick={() => {
              onSwitchToDemo();
              onClose();
            }}
            className="w-full py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Explore Demo Template Data
          </button>
        </div>

        {/* Optional Direct Supabase Credential Input */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-left">
          <button
            type="button"
            onClick={() => setShowDirectConfig(!showDirectConfig)}
            className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 font-semibold"
          >
            <Key className="w-3 h-3" />
            <span>{showDirectConfig ? 'Hide Supabase Keys' : 'Direct Supabase Connection (Optional)'}</span>
          </button>

          {showDirectConfig && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
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
                onClick={handleSaveDirectConfig}
                className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                {configSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{configSaved ? 'Connected!' : 'Connect Keys'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
