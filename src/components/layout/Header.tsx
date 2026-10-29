import React from 'react';
import { Search, Sun, Moon, Bell } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  isDemoMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  onOpenAuth,
}) => {
  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-6 pt-2">
      {/* Left: User Profile greeting */}
      <div className="flex items-center gap-3.5 w-full md:w-auto">
        <div 
          onClick={onOpenAuth}
          className="relative cursor-pointer group flex-shrink-0"
          title="Click to view profile or sign in / switch account"
        >
          <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-300 to-amber-200 shadow-sm transition-transform group-hover:scale-105">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
              alt={user.full_name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Welcome, {user.first_name || 'James'}!
          </h1>
        </div>
      </div>

      {/* Center: Wide rounded search bar */}
      <div className="w-full md:max-w-md lg:max-w-lg">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search accounts, investments, transactions..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full text-xs md:text-sm bg-white/55 dark:bg-slate-800/60 border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:bg-white/90 dark:focus:bg-slate-800/90 transition-all backdrop-blur-md"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Theme Toggle pill & Notifications */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* Exact Light/Dark Toggle Pill from reference */}
        <div className="flex items-center bg-white/45 dark:bg-slate-800/55 p-1 rounded-full border border-white/70 dark:border-white/10 shadow-sm backdrop-blur-md text-xs font-medium">
          <button
            onClick={() => theme === 'dark' && onToggleTheme()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              theme === 'light'
                ? 'bg-white text-slate-800 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
            <span>Light</span>
          </button>
          <button
            onClick={() => theme === 'light' && onToggleTheme()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              theme === 'dark'
                ? 'bg-slate-700 text-white shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-amber-300 fill-amber-300' : 'text-slate-400'}`} />
            <span>Dark</span>
          </button>
        </div>

        {/* Notification Bell Circle Button */}
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white/50 dark:bg-slate-800/60 border border-white/75 dark:border-white/10 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800 transition-all backdrop-blur-md"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-800 animate-pulse" />
        </button>
      </div>
    </header>
  );
};
