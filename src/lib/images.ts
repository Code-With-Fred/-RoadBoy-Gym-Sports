/**
 * Central image registry.
 *
 * Every photograph on the page is referenced here, so swapping in RoadBoy's own
 * photography never means touching a component.
 *
 * Product photos live in /public/images/products and are illustrative public
 * domain images (sources in public/images/products/SOURCES.md). They show the
 * right *kind* of product, not the exact model — which is why each is marked
 * `representative: true` and the card labels it "Similar model shown". When
 * the owner sends a real photo: drop it in the same folder under the product's
 * id, and set `representative: false`.
 *
 * Products with no entry below show a designed "photo on WhatsApp" tile. That is
 * on purpose: a stock photo of a *different* machine would mislead the buyer.
 */

const UNSPLASH = 'https://images.unsplash.com'

function u(id: string): string {
  return `${UNSPLASH}/${id}`
}

/**
 * Caps the source rendition of remote stock photos. next/image still generates
 * the responsive srcset; this stops us pulling a 5000px original over a mobile
 * connection. Local files pass straight through.
 */
export function sized(src: string, width = 1400, quality = 72): string {
  if (!src.startsWith(UNSPLASH)) return src
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export type SiteImage = { src: string; alt: string }
export type ProductImage = SiteImage & { representative: boolean }

export const IMAGES = {
  hero: {
    src: u('photo-1534438327276-14e5300c3a48'),
    alt: 'Rows of dumbbells and training equipment in a modern gym',
  },
  commercial: {
    src: u('photo-1540497077202-7c8a3999166f'),
    alt: 'A bright commercial gym floor fitted with exercise bikes and strength machines',
  },
  delivery: {
    src: u('photo-1586528116311-ad8dd3c8310d'),
    alt: 'Warehouse with packed orders ready for dispatch',
  },
  finalCta: {
    src: u('photo-1623874514711-0f321325f318'),
    alt: 'A large industrial-style gym hall with benches and equipment',
  },
  whyUs: {
    src: u('photo-1553413077-190dd305871c'),
    alt: 'Warehouse aisle stacked with stock',
  },
  og: { src: u('photo-1534438327276-14e5300c3a48'), alt: 'RoadBoy Gym&Sports Equipments' },
} as const

/**
 * Product photos, keyed by the product id in products.ts. Only products whose
 * photo is genuinely the same type of item appear here.
 */
const PRODUCT_IMAGES: Record<string, ProductImage> = {
  'treadmill-2-5hp': { src: '/images/products/treadmill-2-5hp.jpg', alt: 'Runner training on a treadmill', representative: true },
  'platform-treadmill': { src: '/images/products/platform-treadmill.jpg', alt: 'Person running on a treadmill', representative: true },
  'joola-table-tennis': { src: '/images/products/joola-table-tennis.jpg', alt: 'Players at a table tennis table', representative: true },
  'smc-table-tennis': { src: '/images/products/smc-table-tennis.jpg', alt: 'A player at a table tennis table', representative: true },
  'soccer-board-6ft': { src: '/images/products/soccer-board-6ft.jpg', alt: 'A wooden soccer board (table football)', representative: true },
  'snooker-8ft': { src: '/images/products/snooker-8ft.jpg', alt: 'Red snooker balls on a green snooker table', representative: true },
  'snooker-4-in-1-6ft': { src: '/images/products/snooker-4-in-1-6ft.jpg', alt: 'A snooker table set up on a terrace', representative: true },
  'rowing-machine': { src: '/images/products/rowing-machine.jpg', alt: 'Person training on a rowing machine', representative: true },
  'spinning-bike': { src: '/images/products/spinning-bike.jpg', alt: 'Indoor spinning bikes', representative: true },
  'three-station-gym': { src: '/images/products/three-station-gym.jpg', alt: 'Multi-station gym machines', representative: true },
  'big-ab-crunch': { src: '/images/products/big-ab-crunch.jpg', alt: 'An ab crunch machine', representative: true },
  'power-tower': { src: '/images/products/power-tower.jpg', alt: 'A pull-up and dip station', representative: true },
}

/** The photo for a product, or null to show the "photo on WhatsApp" tile. */
export function productImage(id: string): ProductImage | null {
  return PRODUCT_IMAGES[id] ?? null
}
