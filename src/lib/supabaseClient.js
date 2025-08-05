// src/lib/supabaseClient.js
import { createBrowserSupabaseClient } from '@supabase/ssr'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createBrowserSupabaseClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
  options: {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
      storageKey: 'sb:token',
      cookieOptions: {
        name: 'sb:token',
        domain: typeof window !== 'undefined' ? window.location.hostname : '',
        path: '/',
        sameSite: 'lax',
        secure: true
      }
    }
  }
})
