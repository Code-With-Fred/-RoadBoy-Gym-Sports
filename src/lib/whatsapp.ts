import { SITE } from './site'
import { formatNaira } from './utils'

/**
 * WhatsApp is the checkout. Every link on this site is built here so no button
 * can ever open a blank conversation — the message always tells RoadBoy exactly
 * which product the customer is asking about.
 */

function link(message: string): string {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`
}

/** Any fully custom message, e.g. a per-product override. */
export function waCustom(message: string): string {
  return link(message)
}

/** General enquiry — hero, navigation, floating bubble. */
export function waGeneral(): string {
  return link(`Hello ${SITE.name}, I'm interested in your gym equipment. I'd like to make an inquiry.`)
}

/**
 * Product order. The product name and the price the customer saw are both in
 * the message, so RoadBoy can reply with availability and delivery straight
 * away instead of asking "which one?".
 */
export function waProduct(productName: string, priceNaira: number | null = null): string {
  if (priceNaira === null) {
    return link(
      `Hello ${SITE.name}, I'm interested in the ${productName}. Please send me the price, specifications and availability.`,
    )
  }
  return link(
    `Hello ${SITE.name}, I'd like to order the ${productName} (${formatNaira(priceNaira)}). Please confirm availability and delivery to my location.`,
  )
}

/** Someone kitting out a room at home. */
export function waHomeGym(): string {
  return link(
    `Hello ${SITE.name}, I want to set up a home gym. Please help me choose the right equipment for my space and budget.`,
  )
}

/** Commercial buyer — gym, hotel, office. Worth routing differently. */
export function waCommercial(): string {
  return link(
    `Hello ${SITE.name}, I want to outfit a commercial gym. Please send me a quote for a full equipment setup.`,
  )
}

/** "Not sure what I need" — the advice route. */
export function waAdvice(): string {
  return link(
    `Hello ${SITE.name}, I need help choosing equipment. I'll tell you my available space, budget and the kind of training I want to do.`,
  )
}

/** Quote request from the final call to action. */
export function waQuote(): string {
  return link(`Hello ${SITE.name}, please send me a quote for gym equipment with delivery and installation.`)
}
