import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Exchanges the one-time code from a confirmation or password-reset email for a
 * session cookie, then forwards the visitor on.
 *
 * `next` is validated as a site-relative path — accepting an arbitrary URL here
 * would turn the callback into an open redirect.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const requested = url.searchParams.get('next') ?? '/dashboard'

  const next = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/dashboard'

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', url.origin))
  }

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.redirect(new URL('/login?error=not_configured', url.origin))
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(new URL('/login?error=expired_link', url.origin))
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
