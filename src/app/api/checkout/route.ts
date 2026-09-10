import { NextResponse } from 'next/server'
import { PROGRAMS } from '@/lib/content'
import { payments, paymentsEnabled } from '@/lib/payments'
import { SITE } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Starts a checkout.
 *
 * The price is looked up server-side from the catalogue — the browser sends a
 * program slug and nothing else, so a tampered request cannot change what is
 * charged. A pending order is written before redirecting, and the webhook is
 * what promotes it to paid.
 */
export async function POST(request: Request) {
  let body: { slug?: string; email?: string }

  try {
    body = (await request.json()) as { slug?: string; email?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const program = PROGRAMS.find((item) => item.slug === body.slug)
  if (!program) return NextResponse.json({ error: 'Unknown program.' }, { status: 404 })

  const supabase = await createClient()
  const { data: auth } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  const user = auth?.user ?? null

  const email = (user?.email ?? body.email ?? '').trim()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }

  if (!paymentsEnabled()) {
    return NextResponse.json(
      {
        error:
          'Payments are not connected yet. Add PAYSTACK_SECRET_KEY to the server environment to take live payments.',
        code: 'payments_disabled',
      },
      { status: 503 },
    )
  }

  try {
    const result = await payments.initializeCheckout({
      email,
      userId: user?.id ?? null,
      items: [{ programSlug: program.slug, programName: program.name, priceNaira: program.priceNaira }],
      callbackUrl: `${SITE.url}/checkout/success`,
      metadata: { source: 'web' },
    })

    // Record the intent so an abandoned payment is still visible in admin.
    if (supabase) {
      const { error } = await supabase.from('orders').insert({
        reference: result.reference,
        user_id: user?.id ?? null,
        email,
        status: 'pending',
        amount_naira: program.priceNaira,
        provider: result.provider,
      })
      if (error) console.error('[checkout] could not record pending order:', error.message)
    }

    return NextResponse.json({ authorizationUrl: result.authorizationUrl, reference: result.reference })
  } catch (error) {
    console.error('[checkout] initialize failed:', error)
    return NextResponse.json({ error: 'We could not start the payment. Please try again.' }, { status: 502 })
  }
}
