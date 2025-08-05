// src/pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function MyApp({
  Component,
  pageProps,
}: AppProps & { pageProps: { initialSession: any } }) {
<<<<<<< HEAD
  // we only need to call this once
=======
>>>>>>> e5a7b77cb743877b495daa3d8c70ca754fb373b8
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
