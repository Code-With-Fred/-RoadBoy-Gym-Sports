import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Clock } from 'lucide-react'
import { ButtonLink, Section } from '@/components/ui'
import { payments, paymentsEnabled } from '@/lib/payments'
import { buildMetadata } from '@/lib/seo'
import { getUser } from '@/lib/supabase/server'

export const metadata: Metadata = buildMetadata({
  title: 'Payment complete',
  description: 'Your RoadBoy Gym&Sports program is ready.',
  path: '/checkout/success',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

/**
 * Return page.
 *
 * This only *reads* the payment status to tell the customer what happened —
 * access is granted by the webhook. If the webhook has not landed yet the page
 * says so honestly rather than pretending, and points at the dashboard.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>
}) {
  const params = await searchParams
  const reference = params.reference ?? params.trxref ?? null

  const user = await getUser()

  let state: 'paid' | 'pending' | 'unknown' = 'unknown'
  if (reference && paymentsEnabled()) {
    try {
      const verified = await payments.verifyPayment(reference)
      state = verified.status === 'paid' ? 'paid' : 'pending'
    } catch {
      state = 'unknown'
    }
  }

  const paid = state === 'paid'

  return (
    <Section className="!pt-[calc(var(--nav-h)+4rem)]">
      <div className="container">
        <div className="mx-auto max-w-2xl border border-line bg-steel p-10 text-center md:p-14">
          <span
            className={`mx-auto flex h-16 w-16 items-center justify-center border ${
              paid ? 'border-ember text-ember' : 'border-line text-ash'
            }`}
          >
            {paid ? <CheckCircle2 className="h-7 w-7" aria-hidden /> : <Clock className="h-7 w-7" aria-hidden />}
          </span>

          <h1 className="mt-8 text-display-md">{paid ? 'Payment complete.' : 'Payment received.'}</h1>

          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ash">
            {paid
              ? 'Your program is unlocked. Open your dashboard, start week one, and tick the sets off as you go.'
              : 'We are waiting for the final confirmation from the payment provider. This usually takes a few seconds — your program will appear in your dashboard automatically.'}
          </p>

          {reference ? (
            <p className="mt-6 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-slate2">
              Reference: <span className="text-ash">{reference}</span>
            </p>
          ) : null}

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            {user ? (
              <ButtonLink href="/dashboard" size="lg">
                Go to my dashboard
              </ButtonLink>
            ) : (
              <ButtonLink href="/signup" size="lg">
                Create your account
              </ButtonLink>
            )}
            <ButtonLink href="/programs" variant="outline" size="lg">
              Browse more programs
            </ButtonLink>
          </div>

          {!user ? (
            <p className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-ash">
              Sign up with the same email address you paid with and your program will be waiting in the dashboard.
              Already have an account?{' '}
              <Link href="/login" className="text-ember link-underline">
                Log in
              </Link>
              .
            </p>
          ) : null}

          <p className="mt-8 text-xs leading-relaxed text-slate2">
            A receipt is on its way to your email. Any problem at all, reply to it or message us on WhatsApp and we
            will sort it out.
          </p>
        </div>
      </div>
    </Section>
  )
}
