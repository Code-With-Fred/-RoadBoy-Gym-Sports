'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_ANON_KEY, SUPABASE_URL, assertSupabase } from './config'

/** Browser client. Only ever sees the publishable anon key. */
export function createClient() {
  assertSupabase()
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
