import 'server-only'

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type {
  InitializeCheckoutInput,
  InitializeCheckoutResult,
  PaymentProvider,
  VerifiedPayment,
  WebhookEvent,
} from './types'

const API = 'https://api.paystack.co'

/** Paystack works in kobo. This is the only place that conversion happens. */
const toKobo = (naira: number) => Math.round(naira * 100)
const toNaira = (kobo: number) => Math.round(kobo) / 100

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) {
    throw new Error('PAYSTACK_SECRET_KEY is not set. Add it to .env.local (server-side only — never NEXT_PUBLIC_).')
  }
  return key
}

function reference(): string {
  return `RBG-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  })

  const payload = (await response.json()) as { status?: boolean; message?: string; data?: T }

  if (!response.ok || payload.status === false) {
    throw new Error(`Paystack ${path} failed: ${payload.message ?? response.statusText}`)
  }
  return payload.data as T
}

export const paystack: PaymentProvider = {
  name: 'paystack',

  isConfigured() {
    return Boolean(process.env.PAYSTACK_SECRET_KEY)
  },

  async initializeCheckout(input: InitializeCheckoutInput): Promise<InitializeCheckoutResult> {
    const total = input.items.reduce((sum, item) => sum + item.priceNaira, 0)
    const ref = reference()

    const data = await call<{ authorization_url: string; reference: string }>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        amount: toKobo(total),
        currency: 'NGN',
        reference: ref,
        callback_url: input.callbackUrl,
        // Everything the webhook needs to fulfil the order without trusting
        // anything the browser sends back.
        metadata: {
          userId: input.userId,
          items: input.items.map((item) => ({ slug: item.programSlug, price: item.priceNaira })),
          ...input.metadata,
          custom_fields: input.items.map((item) => ({
            display_name: 'Program',
            variable_name: 'program',
            value: item.programName,
          })),
        },
      }),
    })

    return { authorizationUrl: data.authorization_url, reference: data.reference, provider: 'paystack' }
  },

  async verifyPayment(ref: string): Promise<VerifiedPayment> {
    const data = await call<{
      status: string
      amount: number
      paid_at: string | null
      customer: { email: string }
    }>(`/transaction/verify/${encodeURIComponent(ref)}`)

    return {
      reference: ref,
      status: data.status === 'success' ? 'paid' : data.status === 'failed' ? 'failed' : 'pending',
      amountNaira: toNaira(data.amount),
      email: data.customer?.email ?? '',
      paidAt: data.paid_at,
      raw: data,
    }
  },

  async parseWebhook(rawBody: string, signature: string | null): Promise<WebhookEvent | null> {
    const key = process.env.PAYSTACK_WEBHOOK_SECRET ?? process.env.PAYSTACK_SECRET_KEY
    if (!key || !signature) return null

    const expected = createHmac('sha512', key).update(rawBody).digest('hex')
    const received = Buffer.from(signature, 'utf8')
    const computed = Buffer.from(expected, 'utf8')

    // Length check first — timingSafeEqual throws on a length mismatch.
    if (received.length !== computed.length || !timingSafeEqual(received, computed)) return null

    const event = JSON.parse(rawBody) as {
      event: string
      data: { reference: string; amount: number; customer?: { email?: string } }
    }

    const type: WebhookEvent['type'] =
      event.event === 'charge.success'
        ? 'charge.success'
        : event.event === 'charge.failed'
          ? 'charge.failed'
          : 'unknown'

    return {
      type,
      reference: event.data.reference,
      amountNaira: toNaira(event.data.amount),
      email: event.data.customer?.email ?? '',
      raw: event,
    }
  },
}
