/**
 * Supabase is optional at build time.
 *
 * The marketing site renders entirely from the static content modules, so the
 * project builds and runs with no credentials at all. Auth, checkout and the
 * dashboard light up the moment the two public env vars are set.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

/** Thrown rather than returning a half-working client, so failures are loud. */
export function assertSupabase(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local — see .env.example.',
    )
  }
}
