
import { createClient } from '@supabase/supabase-js';

// Configuration: Direct connection to your specific Supabase instance.
// We prioritize these values to ensure the app connects properly.
const supabaseUrl: string = 'https://qtgfhipgzizridykdplr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Z2ZoaXBneml6cmlkeWtkcGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NDI0MjgsImV4cCI6MjA4MzUxODQyOH0.aJpnB-B7puQOUvcBOisrNuotZjlx_5tGmiTgZ4m4zU4';

// Flag to check if credentials are valid (used for UI fallback logic)
export const isOffline = !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co';

if (isOffline) {
  console.warn("Supabase URL is missing or invalid. App is running in offline/demo mode.");
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
