import React from 'react';
import { 
  Home, 
  Zap, 
  Wallet, 
  ReceiptText, 
  PieChart, 
  FileText, 
  Settings, 
  ChevronDown,
  LineChart
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'salary' 
  | 'accounts' 
  | 'investments'
  | 'transactions' 
  | 'analytics' 
  | 'reports' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'salary', label: 'Salary & Hike Forecast', icon: Zap },
    { id: 'accounts', label: 'Accounts & Liabilities', icon: Wallet },
    { id: 'investments', label: 'Stock & MF Holdings', icon: LineChart },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'analytics', label: 'Wealth Allocation & Analytics', icon: PieChart },
    { id: 'reports', label: 'Lifetime Wealth Reports', icon: FileText },
    { id: 'settings', label: 'Settings & Assumptions', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Vertical Floating Dock (matches the screenshot exactly) */}
      <aside className="hidden lg:flex flex-col items-center py-4 px-2 my-auto rounded-[32px] glass-sidebar transition-all z-20">
        <div className="flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                aria-label={item.label}
                className={`relative group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />

                {/* Floating tooltip on hover */}
                <span className="absolute left-14 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/90 text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg backdrop-blur-sm">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom subtle indicator chevron as in screenshot */}
        <div className="mt-4 pt-2 border-t border-white/40 dark:border-white/10 text-slate-400">
          <ChevronDown className="w-4 h-4 opacity-60" />
        </div>
      </aside>

      {/* Mobile / Tablet Bottom Navigation Dock */}
      <nav className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md px-3 py-2 rounded-full glass-sidebar shadow-2xl flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`p-2 rounded-full transition-all flex flex-col items-center justify-center ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm scale-110'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
        {/* Overflow menu for extra tabs */}
        <button
          onClick={() => onSelectTab(currentTab === 'reports' ? 'settings' : 'reports')}
          className={`p-2 rounded-full transition-all ${
            currentTab === 'reports' || currentTab === 'settings'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500'
          }`}
          title="More options"
        >
          <Settings className="w-5 h-5" />
        </button>
      </nav>
    </>
  );
};
