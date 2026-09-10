import 'server-only'

import { paystack } from './paystack'
import type { PaymentProvider } from './types'

export * from './types'

/**
 * The active provider. To switch gateways, implement `PaymentProvider` and
 * change this one line — the checkout route, the webhook and the success page
 * all go through the interface.
 */
export const payments: PaymentProvider = paystack

/**
 * True when real payments can be taken. Until the gym adds its Paystack keys
 * the checkout runs in a clearly-labelled demo mode rather than silently
 * pretending to charge someone.
 */
export function paymentsEnabled(): boolean {
  return payments.isConfigured()
}
