// src/integrations/supabase/client.ts
<<<<<<< HEAD
import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Create and export a singleton Supabase client instance,
 * initialized from Vite env vars.
 */
export const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
=======
// A simple Supabase client wrapper using your auto-generated keys

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// **Make sure this is “.supabase.co”, not “.com”**
const SUPABASE_URL       = "https://fsmfdktjhfispzgcoces.supabase.co"
const SUPABASE_ANON_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbWZka3RqaGZpc3B6Z2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDQ3ODMsImV4cCI6MjA2OTQyMDc4M30.K09xVcOBQzdMYgVj-kI94lhxcAw1aS0LXV9exX4knww"

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      // Where to persist your auth/session data
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
>>>>>>> b48370fd28be94b666d23e8c349f60322336ffc5
)
