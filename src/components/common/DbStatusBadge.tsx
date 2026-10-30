import React from 'react';
import { Database, CheckCircle2, AlertTriangle, AlertCircle, HardDrive, RefreshCw } from 'lucide-react';
import { DbHealthStatus } from '../../services/supabase';

interface DbStatusBadgeProps {
  status: DbHealthStatus;
  onClick?: () => void;
  variant?: 'compact' | 'full';
  className?: string;
}

export const DbStatusBadge: React.FC<DbStatusBadgeProps> = ({
  status,
  onClick,
  variant = 'compact',
  className = '',
}) => {
  const isConnected = status.state === 'connected';
  const isWarning = status.state === 'needs_migration';
  const isError = status.state === 'error';
  const isLocal = status.state === 'local_vault';
  const isChecking = status.state === 'checking';

  const dotColor = isConnected
    ? 'bg-emerald-500'
    : isWarning
    ? 'bg-amber-500'
    : isError
    ? 'bg-rose-500'
    : isChecking
    ? 'bg-blue-500'
    : 'bg-slate-400';

  const pulseColor = isConnected
    ? 'bg-emerald-400'
    : isWarning
    ? 'bg-amber-400'
    : isError
    ? 'bg-rose-400'
    : isChecking
    ? 'bg-blue-400'
    : 'bg-slate-300';

  const textColor = isConnected
    ? 'text-emerald-700 dark:text-emerald-300'
    : isWarning
    ? 'text-amber-700 dark:text-amber-300'
    : isError
    ? 'text-rose-700 dark:text-rose-300'
    : 'text-slate-600 dark:text-slate-300';

  const borderColor = isConnected
    ? 'border-emerald-200/60 dark:border-emerald-800/40'
    : isWarning
    ? 'border-amber-300/60 dark:border-amber-800/40'
    : isError
    ? 'border-rose-200/60 dark:border-rose-800/40'
    : 'border-white/70 dark:border-white/10';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/55 dark:bg-slate-800/60 border ${borderColor} shadow-sm backdrop-blur-md text-xs font-semibold hover:bg-white/90 dark:hover:bg-slate-800 transition-all cursor-pointer ${className}`}
      title={`${status.label}: ${status.message}. Click to test or configure database connection.`}
    >
      {/* Pulsing Status Dot */}
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColor}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>

      {/* Icon */}
      {isChecking ? (
        <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
      ) : isLocal ? (
        <HardDrive className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
      ) : (
        <Database className={`w-3.5 h-3.5 ${textColor} transition-colors`} />
      )}

      {/* Label */}
      <span className={`${textColor} font-bold tracking-tight whitespace-nowrap`}>
        {status.label}
      </span>

      {variant === 'full' && status.latencyMs !== undefined && (
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
          {status.latencyMs}ms
        </span>
      )}
    </button>
  );
};
