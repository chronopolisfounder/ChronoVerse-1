// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

<<<<<<< HEAD
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnon)
=======
<<<<<<< HEAD
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnon)
=======
// these must already be in your .env or Vercel env-vars
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

// fallback to your current hostname (e.g. my-app.vercel.app)
const cookieDomain = import.meta.env.VITE_COOKIE_DOMAIN || window.location.hostname

export const supabase = createClient(
  supabaseUrl,
  supabaseAnon,
  {
    auth: {
      // store the session in a cookie
      persistSession: true,
      // don’t try to parse `#access_token` on page load
      detectSessionInUrl: false,
      // this key will be used in localStorage & cookie—match them!
      storageKey: 'sb:token',
      cookieOptions: {
        name: 'sb:token',      // cookie name
        domain: cookieDomain,  // your Vercel domain
        path: '/',             // root of the site
        sameSite: 'lax',       // safe default
        secure: true           // must be https
      }
    }
  }
)
>>>>>>> b48370fd28be94b666d23e8c349f60322336ffc5
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14
