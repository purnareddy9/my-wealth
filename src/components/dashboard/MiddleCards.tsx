import React from 'react';
import { Landmark, TrendingUp, Layers, Award, ChevronRight, Lock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface MiddleCardsProps {
  currency: string;
  onOpenAccounts: () => void;
  onOpenHoldings: () => void;
}

export const MiddleCards: React.FC<MiddleCardsProps> = ({
  currency,
  onOpenAccounts,
  onOpenHoldings,
}) => {
  const cards = [
    {
      id: 'bank',
      title: 'Bank Accounts',
      amount: 200000,
      institution: 'HDFC + ICICI',
      icon: Landmark,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      onClick: onOpenAccounts,
      status: 'Liquid Cash',
    },
    {
      id: 'stocks',
      title: 'Stock Portfolio',
      amount: 450000,
      institution: 'Zerodha Kite',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      onClick: onOpenHoldings,
      status: '+17.9% Returns',
    },
    {
      id: 'mutual_funds',
      title: 'Mutual Funds',
      amount: 300000,
      institution: 'Groww Direct SIP',
      icon: Layers,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      onClick: onOpenHoldings,
      status: '2 SIPs Active',
    },
    {
      id: 'epf',
      title: 'EPF / PF Fund',
      amount: 250000,
      institution: 'EPFO UAN Portal',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      onClick: onOpenAccounts,
      status: '8.25% p.a.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-4 h-full">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer group min-h-[148px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {card.title}
                </span>
                <div className={`w-7 h-7 rounded-full ${card.bgColor} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">
                  {formatCurrency(card.amount, currency)}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                  {card.institution}
                </div>
              </div>
            </div>

            {/* Pill slider interaction matching the reference screenshot's slider pill */}
            <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-white/60 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm">
              <div className="flex items-center gap-1.5 font-semibold text-[10px] text-slate-600 dark:text-slate-300">
                <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 shadow-xs">
                  <Lock className="w-2.5 h-2.5" />
                </div>
                <span>{card.status}</span>
              </div>
              <div className="flex items-center text-slate-400 group-hover:text-amber-500 transition-colors">
                <span className="text-[10px] font-mono opacity-60 mr-0.5">&gt;&gt;&gt;</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
