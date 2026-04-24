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

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://iljssldkokqjsnjwxrlz.supabase.co');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsanNzbGRrb2txanNuand4cmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjAxNzMsImV4cCI6MjA5MjUzNjE3M30.S2XQNTEvyUHZOvnhFPYTWFquub9aaX19DrYDcXV9fso');

export const supabase = createClient(supabaseUrl, supabaseKey);
