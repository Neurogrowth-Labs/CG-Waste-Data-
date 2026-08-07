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

const supabaseUrl = getEnv('VITE_SUPABASE_URL', '');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY', '');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before starting the application.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: { eventsPerSecond: 20 }
  }
});
