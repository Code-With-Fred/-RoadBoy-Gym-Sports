'use client'

import Link from 'next/link'
import { AlertTriangle, Lock, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { LabelledInput } from '@/components/ui/field'
import type { Program } from '@/lib/types'

/**
 * Checkout.
 *
 * Deliberately thin: it collects an email and asks the server to start a
 * payment. The amount is never sent from here — the server reads it from the
 * catalogue — and fulfilment happens in the webhook, not on return.
 */
export function CheckoutClient({
  program,
  signedInEmail,
  paymentsReady,
}: {
  program: Program
  signedInEmail: string | null
  paymentsReady: boolean
}) {
  const [email, setEmail] = useState(signedInEmail ?? '')
  const [status, setStatus] = useState<'idle' | 'starting' | 'error'>('idle')
  const [error, setError] = useState('')

  async function pay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email.trim())) {
      setStatus('error')
      setError('Enter the email address your program should be linked to.')
      return
    }

    setStatus('starting')
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: program.slug, email: email.trim() }),
      })

      const payload = (await response.json()) as { authorizationUrl?: string; error?: string }

      if (!response.ok || !payload.authorizationUrl) {
        throw new Error(payload.error ?? 'We could not start the payment.')
      }

      // Hand off to the provider's hosted page — card details never touch us.
      window.location.href = payload.authorizationUrl
    } catch (caught) {
      setStatus('error')
      setError(caught instanceof Error ? caught.message : 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={pay} className="space-y-7">
      {!paymentsReady ? (
        <div className="flex gap-4 border border-amber-500/40 bg-amber-500/10 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
          <div className="text-sm leading-relaxed text-amber-200/90">
            <p className="font-display uppercase tracking-[0.14em] text-amber-300">Payments not connected</p>
            <p className="mt-2">
              This store is ready for Paystack but no secret key is configured yet, so no charge can be taken. Add
              <code className="mx-1 bg-ink px-1.5 py-0.5 text-xs text-bone">PAYSTACK_SECRET_KEY</code>
              to the server environment to go live.
            </p>
          </div>
        </div>
      ) : null}

      <LabelledInput
        label="Email address"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        description="Your receipt goes here, and this is the account your program unlocks on."
        placeholder="you@example.com"
        readOnly={Boolean(signedInEmail)}
      />

      {status === 'error' ? (
        <p role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={status === 'starting'}>
        {status === 'starting' ? (
          'Redirecting to payment…'
        ) : (
          <>
            <Lock className="h-4 w-4" aria-hidden />
            Pay ₦{program.priceNaira.toLocaleString('en-NG')}
          </>
        )}
      </Button>

      <div className="flex items-start gap-3 text-xs leading-relaxed text-slate2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
        <p>
          Payment is handled by Paystack on their own secure page. We never see or store your card details. By
          continuing you agree to our{' '}
          <Link href="/terms" className="text-ash underline underline-offset-2 hover:text-ember">
            terms
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
