import { createClient } from '@supabase/supabase-js';

// Access variables statically so Vite can replace them during build
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Missing Supabase configuration. Check Vercel build environment variables.'
  );
}

// Fallback to a valid URL string structure so createClient doesn't crash app initialization
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: { eventsPerSecond: 20 },
    },
  }
);
