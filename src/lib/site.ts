/**
 * Single source of truth for brand, contact and navigation.
 * Update the address / phone / socials here once the gym's real details land —
 * the footer, contact page, schema.org markup and WhatsApp links all read this.
 */

export const SITE = {
  name: 'RoadBoy Gym&Sports',
  shortName: 'RoadBoy',
  tagline: 'Build your strongest self.',
  description:
    'RoadBoy Gym&Sports is a strength, conditioning and sports performance gym in Lekki, Lagos, and a home for structured online workout programs. Train with expert coaches, follow proven plans, and build real, measurable results.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://roadboygym.ng',
  locale: 'en_NG',
  currency: 'NGN',

  contact: {
    email: 'train@roadboygym.ng',
    supportEmail: 'support@roadboygym.ng',
    phone: '+234 812 000 4567',
    phoneHref: '+2348120004567',
    whatsapp: '2348120004567',
    whatsappMessage: 'Hi RoadBoy — I would like to know more about training with you.',
  },

  address: {
    line1: '14B Admiralty Way',
    line2: 'Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos State',
    postalCode: '106104',
    country: 'NG',
    countryName: 'Nigeria',
    // Swap for the gym's real coordinates — these drive the map + local SEO.
    lat: 6.4413,
    lng: 3.4726,
  },

  hours: [
    { days: 'Monday — Friday', open: '05:00', close: '22:00' },
    { days: 'Saturday', open: '06:00', close: '20:00' },
    { days: 'Sunday', open: '08:00', close: '18:00' },
  ],

  /** Used by schema.org openingHoursSpecification. */
  hoursSchema: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '05:00', closes: '22:00' },
    { days: ['Saturday'], opens: '06:00', closes: '20:00' },
    { days: ['Sunday'], opens: '08:00', closes: '18:00' },
  ],

  socials: [
    { name: 'Instagram', href: 'https://instagram.com/roadboygym', handle: '@roadboygym' },
    { name: 'TikTok', href: 'https://tiktok.com/@roadboygym', handle: '@roadboygym' },
    { name: 'YouTube', href: 'https://youtube.com/@roadboygym', handle: '@roadboygym' },
    { name: 'Facebook', href: 'https://facebook.com/roadboygym', handle: '/roadboygym' },
  ],

  stats: [
    { value: 500, suffix: '+', label: 'Active members' },
    { value: 15, suffix: '+', label: 'Expert trainers' },
    { value: 50, suffix: '+', label: 'Weekly classes' },
    { value: 10, suffix: '+', label: 'Years experience' },
  ],
} as const

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Workouts', href: '/workouts' },
  { label: 'Trainers', href: '/trainers' },
  { label: 'Membership', href: '/membership' },
] as const

export const FOOTER_NAV = [
  {
    title: 'Gym',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Facilities', href: '/facilities' },
      { label: 'Trainers', href: '/trainers' },
      { label: 'Transformations', href: '/transformations' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Train online',
    links: [
      { label: 'All programs', href: '/programs' },
      { label: 'Workout library', href: '/workouts' },
      { label: 'Beginner strength', href: '/programs/beginner-strength' },
      { label: 'Fat loss & conditioning', href: '/programs/fat-loss-conditioning' },
      { label: 'Muscle building', href: '/programs/muscle-building' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Membership plans', href: '/membership' },
      { label: 'My dashboard', href: '/dashboard' },
      { label: 'Log in', href: '/login' },
      { label: 'Create account', href: '/signup' },
    ],
  },
] as const

export function whatsappLink(message: string = SITE.contact.whatsappMessage): string {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`
}

export function mapsLink(): string {
  const { line1, line2, city, countryName } = SITE.address
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${line1}, ${line2}, ${city}, ${countryName}`,
  )}`
}
