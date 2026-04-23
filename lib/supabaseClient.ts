import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise fallback to the provided credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iljssldkokqjsnjwxrlz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsanNzbGRrb2txanNuand4cmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjAxNzMsImV4cCI6MjA5MjUzNjE3M30.S2XQNTEvyUHZOvnhFPYTWFquub9aaX19DrYDcXV9fso';

export const supabase = createClient(supabaseUrl, supabaseKey);
