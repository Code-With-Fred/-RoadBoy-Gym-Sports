import { IMAGES } from '@/lib/images'
import type { Trainer } from '@/lib/types'

export const TRAINERS: Trainer[] = [
  {
    id: 'tunde-bakare',
    slug: 'tunde-bakare',
    name: 'Tunde Bakare',
    role: 'Head of Strength',
    specialty: 'Powerlifting & Strength',
    yearsExperience: 12,
    shortBio:
      'Twelve years under a barbell and a decade coaching other people to get under one. Tunde writes the strength programs the rest of the floor follows.',
    bio: [
      'Tunde came to coaching the long way round — six years competing in raw powerlifting, two national meets, and one badly managed back injury that taught him more than any certification did.',
      'He now runs the strength side of RoadBoy, writing the barbell programming for members and coaching the small group of competitive lifters who train out of the back platforms on Saturday mornings.',
      'If you want to know why your squat has not moved in eight months, he is the person to ask. Bring your training log.',
    ],
    philosophy:
      'Most people do not need a more complicated program. They need to run a simple one for longer than six weeks.',
    certifications: [
      'NSCA Certified Strength & Conditioning Specialist (CSCS)',
      'British Weight Lifting Level 2 Coach',
      'Precision Nutrition Level 1',
    ],
    programSlugs: ['beginner-strength', 'muscle-building'],
    image: IMAGES.trainers['tunde-bakare'],
    socials: { instagram: 'https://instagram.com/roadboygym', youtube: 'https://youtube.com/@roadboygym' },
  },
  {
    id: 'adaeze-okonkwo',
    slug: 'adaeze-okonkwo',
    name: 'Adaeze Okonkwo',
    role: 'Strength & Conditioning Coach',
    specialty: 'Foundational Strength',
    yearsExperience: 8,
    shortBio:
      'Adaeze specialises in first sessions — the nervous ones. She has coached several hundred people through their first three months of training.',
    bio: [
      'Adaeze started as a physiotherapy assistant, which is where she learned that most gym injuries are not accidents but the predictable end of a slow build-up.',
      'She coaches the beginner intake at RoadBoy and wrote Strong Foundations, the six-week block we hand to anyone returning to training after a long gap.',
      'Her sessions are calm, specific and unhurried. She will stop you mid-set to fix a foot position and she will not apologise for it.',
    ],
    philosophy:
      'Confidence is a training outcome. Build it deliberately and the rest of the work gets much easier.',
    certifications: [
      'NASM Certified Personal Trainer',
      'Functional Range Conditioning Mobility Specialist',
      'Level 3 Diploma in Exercise Referral',
    ],
    programSlugs: ['strong-foundations'],
    image: IMAGES.trainers['adaeze-okonkwo'],
    socials: { instagram: 'https://instagram.com/roadboygym' },
  },
  {
    id: 'marcus-idowu',
    slug: 'marcus-idowu',
    name: 'Marcus Idowu',
    role: 'Performance Coach',
    specialty: 'Speed & Power',
    yearsExperience: 10,
    shortBio:
      'Former sprinter, now the person responsible for every jump, sled and sprint that happens on the turf lane.',
    bio: [
      'Marcus spent nine years as a competitive 200m sprinter before moving into coaching full time. He works with the semi-professional footballers and combat athletes who train at RoadBoy around their seasons.',
      'His Athletic Performance block is the same in-season structure he uses with those athletes, stripped of the sport-specific work.',
      'He is genuinely strict about one thing: power work happens first, or it does not happen.',
    ],
    philosophy: 'Speed is a skill. You practise it fresh, in small doses, and you stop before it gets ugly.',
    certifications: [
      'UKSCA Accredited Strength & Conditioning Coach',
      'Athletics Nigeria Level 3 Sprints Coach',
      'Certified Functional Strength Coach',
    ],
    programSlugs: ['athletic-performance'],
    image: IMAGES.trainers['marcus-idowu'],
    socials: { instagram: 'https://instagram.com/roadboygym', x: 'https://x.com/roadboygym' },
  },
  {
    id: 'david-eze',
    slug: 'david-eze',
    name: 'David Eze',
    role: 'Conditioning Coach',
    specialty: 'Conditioning & Fat Loss',
    yearsExperience: 9,
    shortBio:
      'David runs the conditioning classes and wrote the eight-week Fat Loss block that has become the busiest program we sell.',
    bio: [
      'David came out of a rowing background, which shows in how he programs conditioning — repeatable, measurable efforts rather than random exhaustion.',
      'He leads the Tuesday and Thursday evening conditioning classes and coaches the members working through structured fat loss phases.',
      'He will ask you what your split was. He expects you to know.',
    ],
    philosophy:
      'If you cannot repeat the effort, it was not conditioning. It was just a hard day you will need three days to recover from.',
    certifications: [
      'ACE Certified Personal Trainer',
      'Concept2 Indoor Rowing Instructor',
      'Precision Nutrition Level 1',
    ],
    programSlugs: ['fat-loss-conditioning'],
    image: IMAGES.trainers['david-eze'],
    socials: { instagram: 'https://instagram.com/roadboygym' },
  },
  {
    id: 'zainab-yusuf',
    slug: 'zainab-yusuf',
    name: 'Zainab Yusuf',
    role: 'Nutrition Lead',
    specialty: 'Nutrition & Body Composition',
    yearsExperience: 7,
    shortBio:
      'Registered dietitian. Handles the nutrition guidance attached to Premium memberships and every body composition phase on the floor.',
    bio: [
      'Zainab is a registered dietitian who moved into performance nutrition after several years in clinical practice.',
      'She runs the nutrition consultations for Premium members and works alongside the coaching team on any member going through a deliberate gaining or cutting phase.',
      'Her advice is unglamorous on purpose: protein, sleep, and a plan you can follow on a bad week.',
    ],
    philosophy: 'The best diet is the boring one you are still following in March.',
    certifications: [
      'BSc Dietetics, Registered Dietitian',
      'International Society of Sports Nutrition (CISSN)',
      'Precision Nutrition Level 2',
    ],
    programSlugs: [],
    image: IMAGES.trainers['zainab-yusuf'],
    socials: { instagram: 'https://instagram.com/roadboygym' },
  },
  {
    id: 'chloe-adeyemi',
    slug: 'chloe-adeyemi',
    name: 'Chloe Adeyemi',
    role: 'Mobility & Recovery Coach',
    specialty: 'Mobility & Online Training',
    yearsExperience: 6,
    shortBio:
      'Chloe coaches the online roster and runs the recovery area. She wrote the Home Workout program for members who train away from the gym.',
    bio: [
      'Chloe manages RoadBoy Online — the members we coach remotely across Nigeria and beyond — and looks after the mobility and recovery side of the floor.',
      'Her Home Workout block came directly out of that work: four sessions a week, one pair of dumbbells, and a bodyweight fallback for every movement.',
      'She is the reason the recovery area has a booking sheet instead of a queue.',
    ],
    philosophy: 'Training at home is not a downgrade. It is just a different set of constraints to program around.',
    certifications: [
      'NASM Certified Personal Trainer',
      'Functional Range Conditioning Mobility Specialist',
      'Level 3 Sports Massage Therapy',
    ],
    programSlugs: ['home-workout'],
    image: IMAGES.trainers['chloe-adeyemi'],
    socials: { instagram: 'https://instagram.com/roadboygym', youtube: 'https://youtube.com/@roadboygym' },
  },
]

export const TRAINER_BY_SLUG: Record<string, Trainer> = Object.fromEntries(
  TRAINERS.map((trainer) => [trainer.slug, trainer]),
)

export function getTrainer(slug: string): Trainer | undefined {
  return TRAINER_BY_SLUG[slug]
}
