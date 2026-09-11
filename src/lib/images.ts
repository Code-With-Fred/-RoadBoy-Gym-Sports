/**
 * Central image registry.
 *
 * IMPORTANT — these are stock placeholders, not RoadBoy's stock. Replace every
 * `src` below with photographs of the equipment you actually sell and the jobs
 * you have actually installed. For an equipment retailer that is not polish, it
 * is the single biggest trust factor on the page: buyers want to see the exact
 * machine that will arrive at their door.
 *
 * Upload to /public/images (or any host added to `images.remotePatterns` in
 * next.config.mjs), paste the URL here, and keep the keys unchanged.
 */

const UNSPLASH = 'https://images.unsplash.com'

function u(id: string): string {
  return `${UNSPLASH}/${id}`
}

/**
 * Caps the source rendition. next/image still generates the responsive srcset;
 * this stops us pulling a 5000px original over a Nigerian mobile connection.
 * Once the photos are local this can be reduced to `return src`.
 */
export function sized(src: string, width = 1400, quality = 72): string {
  if (!src.startsWith(UNSPLASH)) return src
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export type SiteImage = { src: string; alt: string }

export const IMAGES = {
  hero: {
    src: u('photo-1534438327276-14e5300c3a48'),
    alt: 'Commercial gym equipment installed in a modern training space',
  },
  commercial: {
    src: u('photo-1517836357463-d25dfeac3438'),
    alt: 'A fully equipped commercial gym floor with racks and cardio machines',
  },
  delivery: {
    src: u('photo-1546483875-ad9014c88eba'),
    alt: 'Power racks set up and ready for use after installation',
  },
  finalCta: {
    src: u('photo-1579758629938-03607ccdbaba'),
    alt: 'Weight plates and lifting platforms in a finished gym',
  },
  whyUs: {
    src: u('photo-1550345332-09e3ac987658'),
    alt: 'Equipment being set up on a gym floor',
  },

  /** One image per catalogue entry. Keys match the ids in products.ts. */
  products: {
    treadmill: { src: u('photo-1517344884509-a0c97ec11bcc'), alt: 'Treadmills in a gym cardio area' },
    bike: { src: u('photo-1534258936925-c58bed479fcb'), alt: 'Exercise bike in a training space' },
    dumbbells: { src: u('photo-1519085360753-af0119f7cbe7'), alt: 'A full dumbbell rack' },
    plates: { src: u('photo-1581009146145-b5ef050c2e1e'), alt: 'Olympic weight plates loaded on a barbell' },
    bench: { src: u('photo-1532384748853-8f54a8f476e2'), alt: 'An adjustable gym bench set up for pressing' },
    multiGym: { src: u('photo-1571019613454-1cb2f99b2d8b'), alt: 'A multi-station gym machine' },
    powerRack: { src: u('photo-1546483875-ad9014c88eba'), alt: 'A power rack with safety catches' },
    pullUpBar: { src: u('photo-1598268030450-7a476f602bf6'), alt: 'A pull-up bar station' },
    kettlebells: { src: u('photo-1558611848-73f7eb4001a1'), alt: 'Cast iron kettlebells' },
    cableMachine: { src: u('photo-1517838277536-f5f99be501cd'), alt: 'A cable pulley machine' },
    legMachine: { src: u('photo-1541534741688-6078c6bfb5c5'), alt: 'A leg training machine' },
    accessories: { src: u('photo-1571902943202-507ec2618e8f'), alt: 'Gym mats, bands and training accessories' },
  } satisfies Record<string, SiteImage>,

  og: { src: u('photo-1534438327276-14e5300c3a48'), alt: 'RoadBoy Gym&Sports Equipments' },
} as const
