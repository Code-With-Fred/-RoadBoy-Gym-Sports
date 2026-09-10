import { NextResponse } from 'next/server'
import { payments } from '@/lib/payments'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
// Fulfilment must never be served from a cache.
export const dynamic = 'force-dynamic'

/**
 * Payment webhook — the only place an order becomes `paid` and a program is
 * granted to a user.
 *
 * The browser is never trusted for fulfilment: the success page only *reads*
 * state. This handler verifies the provider's signature over the raw body, then
 * writes with the service-role client because it is acting as the system rather
 * than as any signed-in user.
 */
export async function POST(request: Request) {
  // Signature is computed over the exact bytes sent, so read text, not json.
  const raw = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  const event = await payments.parseWebhook(raw, signature)
  if (!event) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  if (event.type !== 'charge.success') {
    // Acknowledge everything else so the provider stops retrying.
    return NextResponse.json({ ok: true, ignored: event.type })
  }

  let supabase: ReturnType<typeof createAdminClient>
  try {
    supabase = createAdminClient()
  } catch (error) {
    console.error('[webhook] admin client unavailable:', error)
    // 500 makes the provider retry once the environment is fixed.
    return NextResponse.json({ error: 'Fulfilment unavailable.' }, { status: 500 })
  }

  // Re-verify with the provider rather than trusting the payload's amount.
  const verified = await payments.verifyPayment(event.reference)
  if (verified.status !== 'paid') {
    return NextResponse.json({ ok: true, ignored: 'not_paid' })
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, user_id, email, status, amount_naira')
    .eq('reference', event.reference)
    .maybeSingle()

  if (orderError) {
    console.error('[webhook] order lookup failed:', orderError.message)
    return NextResponse.json({ error: 'Lookup failed.' }, { status: 500 })
  }

  // Already fulfilled — webhooks are delivered more than once by design.
  if (order?.status === 'paid') {
    return NextResponse.json({ ok: true, duplicate: true })
  }

  const metadata = (verified.raw as { metadata?: { userId?: string | null; items?: Array<{ slug: string; price: number }> } })
    ?.metadata

  const items = metadata?.items ?? []
  const userId = order?.user_id ?? metadata?.userId ?? null
  const email = order?.email ?? verified.email

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'paid', paid_at: verified.paidAt ?? new Date().toISOString() })
    .eq('reference', event.reference)

  if (updateError) console.error('[webhook] order update failed:', updateError.message)

  await supabase.from('payments').insert({
    order_reference: event.reference,
    provider: 'paystack',
    status: 'success',
    amount_naira: verified.amountNaira,
    // Card details are never stored — only the provider's own reference.
    provider_reference: event.reference,
  })

  if (order?.id && items.length) {
    await supabase.from('order_items').upsert(
      items.map((item) => ({
        order_id: order.id,
        program_slug: item.slug,
        price_naira: item.price,
      })),
      { onConflict: 'order_id,program_slug' },
    )
  }

  // Grant access. Idempotent on (user_id, program_slug).
  if (userId && items.length) {
    const { error: grantError } = await supabase.from('user_programs').upsert(
      items.map((item) => ({
        user_id: userId,
        program_slug: item.slug,
        purchased_at: new Date().toISOString(),
        current_week: 1,
      })),
      { onConflict: 'user_id,program_slug' },
    )
    if (grantError) console.error('[webhook] grant failed:', grantError.message)
  } else if (items.length) {
    // Paid without an account — park the entitlement against the email so it can
    // be claimed the moment they sign up with it.
    const { error: claimError } = await supabase.from('pending_entitlements').upsert(
      items.map((item) => ({ email, program_slug: item.slug, order_reference: event.reference })),
      { onConflict: 'email,program_slug' },
    )
    if (claimError) console.error('[webhook] pending entitlement failed:', claimError.message)
  }

  return NextResponse.json({ ok: true })
}
