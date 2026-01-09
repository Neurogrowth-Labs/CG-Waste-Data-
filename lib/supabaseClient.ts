
import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials as per user request to resolve environment variable issues
const supabaseUrl = 'https://qtgfhipgzizridykdplr.supabase.co';
const supabaseAnonKey = 'sb_publishable_oMqznbytDbgrzqOx-Td4CA_mBC2vz_i';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Key is missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
