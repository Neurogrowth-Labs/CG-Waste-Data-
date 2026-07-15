import { createClient } from '@supabase/supabase-js';

// Safe check for environment variables (works in Vite and Node)
const getEnv = (key: string, fallback: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && 'env' in import.meta) {
    const env = (import.meta as any).env;
    if (env && env[key]) {
      return env[key];
    }
  }
  return fallback;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY', 'missing-anon-key');

export const isSupabaseConfigured = Boolean(
  getEnv('VITE_SUPABASE_URL', '') && getEnv('VITE_SUPABASE_ANON_KEY', '')
);

export const supabase = createClient(supabaseUrl, supabaseKey);
