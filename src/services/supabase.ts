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
