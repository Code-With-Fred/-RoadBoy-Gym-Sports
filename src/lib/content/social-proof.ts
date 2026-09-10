import { IMAGES } from '@/lib/images'
import type { Testimonial, Transformation } from '@/lib/types'

/**
 * Member testimonials and transformations.
 *
 * Deliberately specific and conversational — vague praise reads as invented.
 * Results are described in terms of training and behaviour rather than medical
 * claims, and no timeline is presented as typical or guaranteed.
 */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Kemi A.',
    role: 'Product designer, Lekki',
    rating: 5,
    quote:
      'I had a gym membership for two years and used it maybe eleven times. The difference here is that someone actually noticed when I stopped coming. Adaeze messaged me. That is the entire reason I am still training.',
    trainingDuration: 'Member for 14 months',
    image: IMAGES.members['kemi-a'],
  },
  {
    id: 't2',
    name: 'Seyi O.',
    role: 'Logistics manager, Victoria Island',
    rating: 5,
    quote:
      'I bought the Muscle Building program expecting a PDF. It is a proper app — I tick off sets on my phone between rests and it remembers exactly where I stopped. Worth every naira.',
    trainingDuration: 'Ran the 12-week block twice',
    image: IMAGES.members['seyi-o'],
  },
  {
    id: 't3',
    name: 'Grace N.',
    role: 'Doctor, Ikoyi',
    rating: 5,
    quote:
      'My shifts are unpredictable so I train at home more often than not. The Home Workout program is the first thing I have followed that assumed I might only have dumbbells and forty minutes.',
    trainingDuration: 'Member for 8 months',
    image: IMAGES.members['grace-n'],
  },
  {
    id: 't4',
    name: 'Daniel M.',
    role: 'Semi-pro footballer',
    rating: 5,
    quote:
      'Marcus rebuilt how I train in the off-season. First time in four years I have gone into pre-season without a hamstring problem. The sprint work is the difference.',
    trainingDuration: 'Two seasons with RoadBoy',
    image: IMAGES.members['daniel-m'],
  },
  {
    id: 't5',
    name: 'Ibrahim S.',
    role: 'Software engineer, Yaba',
    rating: 4,
    quote:
      'Beginner Strength did what it said. I walked in not knowing what a hinge was and finished four weeks later deadlifting properly. My only complaint is that the gym is busy at 6pm — go earlier.',
    trainingDuration: 'Member for 6 months',
    image: IMAGES.members['ibrahim-s'],
  },
  {
    id: 't6',
    name: 'Tola F.',
    role: 'Teacher, Surulere',
    rating: 5,
    quote:
      'What sold me was the retest week. Seeing the actual numbers from week one next to week eight made it impossible to pretend nothing had changed.',
    trainingDuration: 'Member for 11 months',
    image: IMAGES.members['tola-f'],
  },
]

export const TRANSFORMATIONS: Transformation[] = [
  {
    id: 'tr1',
    slug: 'seyi-o',
    name: 'Seyi O.',
    age: 31,
    startingPoint: 'Trained on and off for years without a plan, plateaued on every lift.',
    goal: 'Add size and finally move past a stalled bench press',
    programSlug: 'muscle-building',
    programName: 'Muscle Building',
    duration: '12 weeks',
    result: 'Bench press up 17.5kg, squat up 30kg, and the first set of arms he has been happy with.',
    quote:
      '12 weeks changed more than my body. It changed my confidence. I stopped negotiating with myself about whether I was going to train.',
    before: IMAGES.transformations.beforeA,
    after: IMAGES.transformations.afterA,
    featured: true,
  },
  {
    id: 'tr2',
    slug: 'kemi-a',
    name: 'Kemi A.',
    age: 34,
    startingPoint: 'Two years of paid-for, unused gym membership. Had never lifted a barbell.',
    goal: 'Build strength and actually stick with training',
    programSlug: 'strong-foundations',
    programName: 'Strong Foundations',
    duration: '6 weeks, then stayed',
    result: 'First unassisted pull-up in month five. Has not missed a training week since February.',
    quote:
      'I came in thinking I would be the least fit person in the room. Nobody looked twice. That was all I needed.',
    before: IMAGES.transformations.beforeB,
    after: IMAGES.transformations.afterB,
    featured: true,
  },
  {
    id: 'tr3',
    slug: 'ibrahim-s',
    name: 'Ibrahim S.',
    age: 28,
    startingPoint: 'Desk job, no structured training, low energy through the afternoon.',
    goal: 'Lose fat and build a conditioning base',
    programSlug: 'fat-loss-conditioning',
    programName: 'Fat Loss & Conditioning',
    duration: '8 weeks',
    result: 'Down two belt notches, 2km row time cut by 41 seconds, and strength held throughout.',
    quote:
      'The conditioning days were the ones I dreaded and the ones that changed the most. My rowing split at week eight was not even close to week one.',
    before: IMAGES.transformations.beforeC,
    after: IMAGES.transformations.afterC,
    featured: true,
  },
  {
    id: 'tr4',
    slug: 'grace-n',
    name: 'Grace N.',
    age: 37,
    startingPoint: 'Returning to training after an 18-month break and a demanding shift pattern.',
    goal: 'Rebuild strength around an unpredictable schedule',
    programSlug: 'home-workout',
    programName: 'Home Workout',
    duration: '6 weeks',
    result: 'Trained 22 of 24 scheduled sessions — the most consistent block she has ever run.',
    quote:
      'I stopped waiting for a perfect week. Four short sessions I actually do beat five perfect ones I plan and skip.',
    before: IMAGES.transformations.beforeD,
    after: IMAGES.transformations.afterD,
    featured: false,
  },
]

export const FEATURED_TRANSFORMATIONS = TRANSFORMATIONS.filter((item) => item.featured)

export function getTransformation(slug: string): Transformation | undefined {
  return TRANSFORMATIONS.find((item) => item.slug === slug)
}
