// src/integrations/supabase/client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Create and export a singleton Supabase client instance,
 * initialized from Vite env vars.
 */
export const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
)
