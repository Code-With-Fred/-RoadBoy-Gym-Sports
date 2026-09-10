import 'server-only'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from './config'

/**
 * Service-role client. Bypasses Row Level Security, so it is confined to
 * trusted server code: the Paystack webhook and admin write paths.
 *
 * `server-only` above makes importing this from a client component a build
 * error, which is the guard that actually matters.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are required for admin operations.')
  }
  return createSupabaseClient(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
