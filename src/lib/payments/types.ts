/**
 * Payment provider abstraction.
 *
 * Nothing in the app talks to Paystack directly — it talks to a
 * `PaymentProvider`. Swapping to Flutterwave, Stripe or adding a second
 * provider means writing one more implementation of this interface and
 * changing the single export in ./index.ts.
 */

export interface CheckoutLineItem {
  programSlug: string
  programName: string
  /** Whole Naira. Providers that need kobo convert at the boundary. */
  priceNaira: number
}

export interface InitializeCheckoutInput {
  email: string
  /** Supabase auth user id, when the buyer is signed in. */
  userId: string | null
  items: CheckoutLineItem[]
  /** Absolute URL the provider returns the customer to. */
  callbackUrl: string
  metadata?: Record<string, unknown>
}

export interface InitializeCheckoutResult {
  /** Where to send the browser to complete payment. */
  authorizationUrl: string
  /** Our order reference — also the provider's transaction reference. */
  reference: string
  provider: string
}

export interface VerifiedPayment {
  reference: string
  status: 'paid' | 'failed' | 'pending'
  amountNaira: number
  email: string
  paidAt: string | null
  raw: unknown
}

export interface PaymentProvider {
  readonly name: string
  /** True when the provider has the secrets it needs to actually charge. */
  isConfigured(): boolean
  initializeCheckout(input: InitializeCheckoutInput): Promise<InitializeCheckoutResult>
  verifyPayment(reference: string): Promise<VerifiedPayment>
  /**
   * Validate an inbound webhook. Returns the parsed event only if the
   * signature checks out, so callers cannot forget to verify.
   */
  parseWebhook(rawBody: string, signature: string | null): Promise<WebhookEvent | null>
}

export interface WebhookEvent {
  type: 'charge.success' | 'charge.failed' | 'unknown'
  reference: string
  amountNaira: number
  email: string
  raw: unknown
}
