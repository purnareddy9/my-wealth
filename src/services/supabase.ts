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

export async function testDatabaseConnection(): Promise<{ ok: boolean; message: string; tablesExist: boolean }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: 'Supabase URL or Anon Key not configured (using local vault)', tablesExist: false };
  }
  try {
    const { error } = await supabase.from('financial_accounts').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation "public.financial_accounts" does not exist')) {
        return { 
          ok: true, 
          message: 'Connected to Supabase, but tables are not created yet! Copy and run the migration SQL in your Supabase SQL Editor.', 
          tablesExist: false 
        };
      }
      return { ok: false, message: error.message || 'Database error occurred', tablesExist: false };
    }
    return { ok: true, message: 'Database connected and tables verified!', tablesExist: true };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : 'Connection failed', tablesExist: false };
  }
}
