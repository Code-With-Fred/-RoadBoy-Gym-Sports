import { SITE } from './site'

/**
 * WhatsApp is the checkout. Every link on this site is built here so no button
 * can ever open a blank conversation — the message always tells RoadBoy exactly
 * which product the customer is asking about.
 */

function link(message: string): string {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`
}

/** General enquiry — hero, navigation, floating bubble. */
export function waGeneral(): string {
  return link(
    `Hello ${SITE.name}, I'm interested in your gym equipment. I'd like to make an inquiry.`,
  )
}

/** Product enquiry. The product name is what makes this useful to the seller. */
export function waProduct(productName: string): string {
  return link(
    `Hello ${SITE.name}, I'm interested in the ${productName}. Please send me the price, specifications and availability.`,
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
  return link(
    `Hello ${SITE.name}, please send me a quote for gym equipment with delivery and installation.`,
  )
}
