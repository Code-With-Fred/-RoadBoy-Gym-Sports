import { IMAGES } from '@/lib/images'
import type { Category, Facility, MembershipPlan, Service } from '@/lib/types'

/** Membership tiers sold at the door and online. */
export const MEMBERSHIPS: MembershipPlan[] = [
  {
    id: 'basic',
    slug: 'basic',
    name: 'Basic',
    priceNaira: 20000,
    interval: 'month',
    summary: 'Full access to the floor, on your own schedule.',
    features: [
      'Unrestricted gym access, all opening hours',
      'Locker and changing room access',
      'Full strength and cardio equipment',
      'Free induction session with a coach',
    ],
    highlight: false,
  },
  {
    id: 'standard',
    slug: 'standard',
    name: 'Standard',
    priceNaira: 35000,
    interval: 'month',
    summary: 'Everything in Basic, plus the classes and the guidance.',
    features: [
      'Everything in Basic',
      'Unlimited group classes — 50+ a week',
      'Quarterly fitness assessment',
      'Structured workout guidance from the coaching team',
      'Recovery area access',
    ],
    highlight: true,
    badge: 'Most popular',
  },
  {
    id: 'premium',
    slug: 'premium',
    name: 'Premium',
    priceNaira: 60000,
    interval: 'month',
    summary: 'Coached training with nutrition and progress tracking.',
    features: [
      'Everything in Standard',
      'Four personal training sessions a month',
      'Nutrition consultation with our dietitian',
      'Monthly progress tracking and body composition',
      'One digital program of your choice included',
      'Priority class booking',
    ],
    highlight: false,
  },
]

export const MEMBERSHIP_BY_SLUG: Record<string, MembershipPlan> = Object.fromEntries(
  MEMBERSHIPS.map((plan) => [plan.slug, plan]),
)

/** Home page "Train your way" services. Icon names map to lucide-react. */
export const SERVICES: Service[] = [
  {
    slug: 'personal-training',
    title: 'Personal Training',
    description:
      'One coach, your goals, and a plan that adjusts every week. Sessions are 60 minutes and booked directly with your trainer.',
    icon: 'UserRound',
    href: '/trainers',
  },
  {
    slug: 'strength-training',
    title: 'Strength Training',
    description:
      'Barbells, platforms and calibrated plates, with coaching on the floor whenever you want a set watched.',
    icon: 'Dumbbell',
    href: '/facilities',
  },
  {
    slug: 'group-training',
    title: 'Group Training',
    description:
      'Over fifty classes a week — conditioning, strength circuits and mobility. Capped at sixteen so you still get coached.',
    icon: 'Users',
    href: '/membership',
  },
  {
    slug: 'cardio-conditioning',
    title: 'Cardio & Conditioning',
    description:
      'Rowers, bikes, skis and a turf lane for sleds and sprints. Structured intervals, not aimless treadmill time.',
    icon: 'HeartPulse',
    href: '/facilities',
  },
  {
    slug: 'nutrition-guidance',
    title: 'Nutrition Guidance',
    description:
      'Practical, non-restrictive nutrition support from a registered dietitian. Included with Premium membership.',
    icon: 'Apple',
    href: '/membership',
  },
  {
    slug: 'online-training',
    title: 'Online Training',
    description:
      'Buy a structured program and follow it anywhere. Progress tracking, demonstrations and substitutions built in.',
    icon: 'MonitorSmartphone',
    href: '/programs',
  },
]

/** Muscle group entry points — these deep-link into the filtered library. */
export const CATEGORIES: Category[] = [
  { slug: 'chest', name: 'Chest', blurb: 'Press, fly, repeat', image: IMAGES.categories.chest },
  { slug: 'back', name: 'Back', blurb: 'Width and thickness', image: IMAGES.categories.back },
  { slug: 'legs', name: 'Legs', blurb: 'Where progress starts', image: IMAGES.categories.legs },
  { slug: 'shoulders', name: 'Shoulders', blurb: 'Overhead strength', image: IMAGES.categories.shoulders },
  { slug: 'arms', name: 'Arms', blurb: 'Curls count too', image: IMAGES.categories.arms },
  { slug: 'core', name: 'Core', blurb: 'Brace, do not crunch', image: IMAGES.categories.core },
  { slug: 'full-body', name: 'Full Body', blurb: 'Everything, one session', image: IMAGES.categories['full-body'] },
  { slug: 'hiit', name: 'HIIT', blurb: 'Short, hard, honest', image: IMAGES.categories.hiit },
]

export const FACILITIES: Facility[] = [
  {
    slug: 'strength-area',
    name: 'Strength Area',
    headline: 'Eight platforms. No queue for a rack.',
    description:
      'The heart of the gym. Eight competition platforms with calibrated plates, six power racks, and enough space between them that you are not apologising to anyone mid-set.',
    features: [
      'Eight lifting platforms with calibrated plates',
      'Six power racks and two combo racks',
      'Competition and deadlift bars',
      'Chalk allowed, and expected',
    ],
    image: IMAGES.facilities.strength,
  },
  {
    slug: 'cardio-zone',
    name: 'Cardio Zone',
    headline: 'Machines that measure what you actually did.',
    description:
      'Concept2 rowers and ski ergs, air bikes and treadmills, all with output you can log. Positioned along the street-facing windows because staring at a wall for thirty minutes is nobody idea of motivation.',
    features: [
      'Six Concept2 rowers and two ski ergs',
      'Four air bikes',
      'Eight treadmills with incline programming',
      'Heart rate display integration',
    ],
    image: IMAGES.facilities.cardio,
  },
  {
    slug: 'functional-training',
    name: 'Functional Training',
    headline: 'Twenty metres of turf for sleds and sprints.',
    description:
      'A full turf lane for sled pushes, prowler work, carries and acceleration drills, plus rigs for suspension work, bands and gymnastics rings.',
    features: [
      '20m turf sprint and sled lane',
      'Prowlers, sleds and heavy ropes',
      'Rig with rings, bands and suspension trainers',
      'Plyometric boxes and hurdles',
    ],
    image: IMAGES.facilities.functional,
  },
  {
    slug: 'free-weights',
    name: 'Free Weights',
    headline: 'Dumbbells to 60kg. All of them, all the time.',
    description:
      'A complete dumbbell rack from 2.5kg to 60kg in 2.5kg increments, adjustable benches, kettlebells, cable stations and every accessory machine worth having.',
    features: [
      'Full dumbbell rack, 2.5kg to 60kg',
      'Twelve adjustable benches',
      'Kettlebells from 8kg to 48kg',
      'Four dual cable stations',
    ],
    image: IMAGES.facilities.freeweights,
  },
  {
    slug: 'changing-rooms',
    name: 'Changing Rooms',
    headline: 'Clean, private and stocked.',
    description:
      'Individual changing cubicles, full-size lockers included with every membership, hot showers and complimentary towels. Cleaned four times a day, every day.',
    features: [
      'Full-height private lockers',
      'Hot showers with complimentary towels',
      'Individual changing cubicles',
      'Cleaned four times daily',
    ],
    image: IMAGES.facilities.changing,
  },
  {
    slug: 'recovery-area',
    name: 'Recovery Area',
    headline: 'The part most gyms skip.',
    description:
      'A dedicated, quiet space for mobility and recovery work — because the session does not end when you rack the last set. Bookable in thirty minute slots.',
    features: [
      'Dedicated mobility and stretching space',
      'Percussion therapy devices and rollers',
      'Sports massage by appointment',
      'Bookable thirty minute slots',
    ],
    image: IMAGES.facilities.recovery,
  },
]

/** Home page "Why we do it different" pillars. */
export const PILLARS = [
  {
    title: 'Proven Programs',
    description:
      'Every plan we sell is one we have already coached on our own floor. Structured, progressive, and written by the coach whose name is on it.',
    icon: 'ClipboardCheck',
  },
  {
    title: 'Expert Coaching',
    description:
      'Fifteen accredited coaches with an average of nine years experience. Someone is always on the floor, and asking is never an imposition.',
    icon: 'GraduationCap',
  },
  {
    title: 'Real Community',
    description:
      'Five hundred members who notice when you stop showing up. No mirrors-only culture, no judgement about where you are starting from.',
    icon: 'Users',
  },
  {
    title: 'Measurable Results',
    description:
      'Assessments every quarter, progress tracked in the app, and a retest week built into every program so the progress is a fact, not a feeling.',
    icon: 'TrendingUp',
  },
] as const
