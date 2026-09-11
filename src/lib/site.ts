/**
 * Single source of truth for the brand, the WhatsApp line and the navigation.
 *
 * This is the file the owner edits first: change the phone number here and
 * every button, the floating bubble, the footer and the structured data all
 * follow.
 */

/**
 * Resolve the canonical origin.
 *
 * `??` is not enough here: an env var that is *defined but empty* — which is
 * what an empty field in the Vercel dashboard produces — passes straight
 * through `??` and reaches `new URL('')`, which throws ERR_INVALID_URL and
 * fails the production build. So test for truthiness after trimming, not for
 * null.
 *
 * Order: an explicit URL, then the deployment's own URL (so preview builds get
 * correct canonicals instead of pointing at production), then the default.
 */
const DEFAULT_SITE_URL = 'https://roadboygym.ng'

function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    // Set automatically on Vercel. Absent locally and in the browser bundle,
    // where the default below is correct anyway.
    process.env.NEXT_PUBLIC_VERCEL_URL,
    process.env.VERCEL_URL,
  ]

  for (const candidate of candidates) {
    const parsed = normalise(candidate)
    if (parsed) return parsed
  }

  return DEFAULT_SITE_URL
}

/**
 * Returns a valid origin, or null for anything unusable. Adds a missing scheme
 * and drops a trailing slash. Parsing is what decides validity — a typo in the
 * dashboard should fall back to the default, never break the build.
 */
function normalise(value: string | undefined): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const url = new URL(withScheme)
    if (!url.hostname || !url.hostname.includes('.')) return null
    return `${url.protocol}//${url.host}`
  } catch {
    return null
  }
}

export const SITE = {
  name: 'RoadBoy Gym&Sports Equipments',
  shortName: 'RoadBoy',
  tagline: 'Quality gym equipment. Delivered to your door.',
  description:
    'Buy quality gym and sports equipment with free nationwide delivery, free installation and payment on delivery from RoadBoy Gym&Sports Equipments.',
  url: resolveSiteUrl(),
  locale: 'en_NG',
  country: 'NG',
  countryName: 'Nigeria',

  contact: {
    /** How the number is shown to Nigerian customers. */
    phoneDisplay: '0805 359 4533',
    /** E.164, for tel: links and structured data. */
    phoneIntl: '+2348053594533',
    /** Digits only, for wa.me links. */
    whatsapp: '2348053594533',
  },

  /**
   * The promises this page repeats. Order matters — it drives the hero strip
   * and the benefits grid.
   */
  promises: [
    'Free nationwide delivery',
    'Free installation',
    'Pay on delivery',
    'Delivery within 3 days',
  ],

  /**
   * Social profiles are intentionally empty. Nothing renders until real URLs
   * are added here — an invented handle is worse than no link at all.
   */
  socials: [] as Array<{ name: 'Instagram' | 'Facebook' | 'TikTok'; href: string; handle: string }>,
} as const

/** Anchors on the single landing page — there are no other routes. */
export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Equipment', href: '#equipment' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
] as const
