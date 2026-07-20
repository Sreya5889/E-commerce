import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid and defined before initializing
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn(
    'EduAcademy: Supabase URL or Anon Key is missing. Falling back to local storage Mock Database mode.'
  );
}
