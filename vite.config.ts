import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load local .env files
  const env = loadEnv(mode, process.cwd(), '');

  // Merge Vercel runtime environment (process.env) with local .env files
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  const GEMINI_KEY = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Direct string replacement for Gemini
      'process.env.API_KEY': JSON.stringify(GEMINI_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(GEMINI_KEY),
      
      // Explicit fallback bindings for Supabase in production builds
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            charts: ['recharts'],
            maps: ['leaflet', 'react-leaflet'],
            supabase: ['@supabase/supabase-js'],
            ai: ['@google/genai'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
