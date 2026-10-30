import { createClient } from '@supabase/supabase-js';

// Read from localStorage or Vite environment variables
const supabaseUrl = 
  (typeof window !== 'undefined' ? localStorage.getItem('mw_supabase_url') : null) || 
  import.meta.env.VITE_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  (typeof window !== 'undefined' ? localStorage.getItem('mw_supabase_key') : null) || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

// Fallback client so app never crashes
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);

export function isValidUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
    isConfigured: isSupabaseConfigured,
  };
}

export interface DbHealthStatus {
  state: 'connected' | 'needs_migration' | 'error' | 'local_vault' | 'checking';
  label: string;
  sublabel: string;
  color: 'emerald' | 'amber' | 'rose' | 'slate';
  message: string;
  tablesExist: boolean;
  latencyMs?: number;
  url?: string;
}

export async function testDatabaseConnection(): Promise<DbHealthStatus> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      state: 'local_vault',
      label: 'Local Vault',
      sublabel: 'Offline Storage',
      color: 'slate',
      message: 'Supabase URL/Key not set. Using secure browser storage vault.',
      tablesExist: false,
      url: supabaseUrl || undefined,
    };
  }

  const startTime = Date.now();
  try {
    const { error } = await supabase.from('financial_accounts').select('id').limit(1);
    const latency = Date.now() - startTime;

    if (error) {
      if (
        error.code === '42P01' || 
        error.message?.includes('relation "public.financial_accounts" does not exist') ||
        error.message?.includes('does not exist')
      ) {
        return { 
          state: 'needs_migration',
          label: 'DB: Tables Missing',
          sublabel: 'Run Migration SQL',
          color: 'amber',
          message: 'Connected to Supabase, but PostgreSQL tables are not created yet. Run the SQL script in your Supabase SQL Editor.', 
          tablesExist: false,
          latencyMs: latency,
          url: supabaseUrl,
        };
      }
      return { 
        state: 'error',
        label: 'DB: Error',
        sublabel: 'Auth / Permission Issue',
        color: 'rose',
        message: error.message || 'Database query error occurred', 
        tablesExist: false,
        latencyMs: latency,
        url: supabaseUrl,
      };
    }

    return { 
      state: 'connected',
      label: 'Cloud DB Connected',
      sublabel: 'Supabase Synced',
      color: 'emerald',
      message: `Successfully connected to Supabase PostgreSQL in ${latency}ms! Tables verified.`, 
      tablesExist: true,
      latencyMs: latency,
      url: supabaseUrl,
    };
  } catch (e: unknown) {
    return { 
      state: 'error',
      label: 'DB: Disconnected',
      sublabel: 'Network Error',
      color: 'rose',
      message: e instanceof Error ? e.message : 'Database connection failed', 
      tablesExist: false,
      url: supabaseUrl,
    };
  }
}
