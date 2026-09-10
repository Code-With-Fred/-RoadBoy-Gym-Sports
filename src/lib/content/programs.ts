import { IMAGES } from '@/lib/images'
import type { Program, ProgramWeek } from '@/lib/types'
import { workoutsForProgram } from './workouts'

/**
 * The digital products. Prices are in whole Naira.
 *
 * Weeks are expanded from phases: a real training block repeats the same named
 * sessions while the loading and intent change, so each phase describes what
 * changes and `expand()` turns that into the week-by-week breakdown shown on the
 * sales page.
 */

type Phase = { weeks: number; title: string; focus: string; description: string }

function expand(programSlug: string, phases: Phase[]): ProgramWeek[] {
  const sessions = workoutsForProgram(programSlug).map((workout) => workout.slug)
  const out: ProgramWeek[] = []
  let week = 1
  for (const phase of phases) {
    for (let i = 0; i < phase.weeks; i += 1) {
      out.push({
        number: week,
        title: phase.title,
        focus: phase.focus,
        description: phase.description,
        workoutSlugs: sessions,
      })
      week += 1
    }
  }
  return out
}

type ProgramSeed = Omit<Program, 'breakdown' | 'totalWorkouts' | 'image' | 'includes'> & { phases: Phase[] }

const SEEDS: ProgramSeed[] = [
  {
    id: 'beginner-strength',
    slug: 'beginner-strength',
    name: 'Beginner Strength',
    tagline: 'Learn the lifts. Build the habit.',
    description:
      'Four weeks to turn "I do not know what I am doing in here" into a routine you can run on autopilot. Three full-body sessions a week, each built around a movement pattern you will use for the rest of your training life. Nothing is rushed, nothing is ego-driven, and every session is short enough that you will actually finish it.',
    goal: 'Beginner',
    secondaryGoals: ['Strength'],
    difficulty: 'Beginner',
    weeks: 4,
    sessionsPerWeek: 3,
    equipment: 'Full Gym',
    priceNaira: 25000,
    compareAtNaira: 35000,
    rating: 4.9,
    reviewCount: 214,
    coachSlug: 'tunde-bakare',
    featured: true,
    bestSeller: false,
    outcomes: [
      'Squat, hinge, press and pull with confident, coachable technique',
      'A repeatable three-day-a-week routine that fits around work',
      'Measurable strength gains on every main lift by week four',
      'Enough gym literacy to walk in and train without second-guessing yourself',
    ],
    phases: [
      {
        weeks: 1,
        title: 'Foundation',
        focus: 'Learn the patterns',
        description:
          'Deliberately light. You are grooving technique and finding your working weights, not testing yourself.',
      },
      {
        weeks: 1,
        title: 'Progression',
        focus: 'Add load',
        description:
          'Same sessions, slightly heavier. Add the smallest jump available on each lift you completed cleanly.',
      },
      {
        weeks: 1,
        title: 'Intensity',
        focus: 'Push the top sets',
        description:
          'One hard set per main lift, taken close to your limit while keeping the bar path honest.',
      },
      {
        weeks: 1,
        title: 'Performance',
        focus: 'Test the progress',
        description:
          'Retest the numbers you started with. Almost everyone finishes this week stronger on all four main lifts.',
      },
    ],
  },
  {
    id: 'fat-loss-conditioning',
    slug: 'fat-loss-conditioning',
    name: 'Fat Loss & Conditioning',
    tagline: 'Train hard. Move better. Breathe easier.',
    description:
      'Eight weeks of strength training and structured conditioning, run five days a week. Two lifting days protect the muscle you already have, two conditioning days build a genuine engine, and a full-body circuit closes the week. Pair it with sensible eating and the results take care of themselves.',
    goal: 'Fat Loss',
    secondaryGoals: ['Conditioning', 'Strength'],
    difficulty: 'Intermediate',
    weeks: 8,
    sessionsPerWeek: 5,
    equipment: 'Full Gym',
    priceNaira: 40000,
    compareAtNaira: null,
    rating: 4.8,
    reviewCount: 386,
    coachSlug: 'david-eze',
    featured: true,
    bestSeller: true,
    outcomes: [
      'Noticeably better work capacity — stairs, sprints and long sessions stop hurting',
      'Strength maintained or improved while training in a calorie deficit',
      'A conditioning framework you can keep running long after week eight',
      'Clear weekly structure so you never have to decide what to do that day',
    ],
    phases: [
      {
        weeks: 2,
        title: 'Foundation',
        focus: 'Build the base',
        description:
          'Establish your working loads and your conditioning pace. Everything here should feel sustainable.',
      },
      {
        weeks: 2,
        title: 'Progression',
        focus: 'Raise the volume',
        description: 'An extra set on the main lifts and one more round on the conditioning pieces.',
      },
      {
        weeks: 2,
        title: 'Intensity',
        focus: 'Shorten the rest',
        description:
          'Same work, less recovery between sets. This is where the conditioning gains show up.',
      },
      {
        weeks: 2,
        title: 'Performance',
        focus: 'Peak and retest',
        description:
          'One hard week, then a lighter retest week to see exactly how far the engine has come.',
      },
    ],
  },
  {
    id: 'muscle-building',
    slug: 'muscle-building',
    name: 'Muscle Building',
    tagline: 'Twelve weeks. One rep at a time.',
    description:
      'A twelve week push-pull-legs block written for people who are past the beginner stage and want visible size. Five sessions a week split between heavy strength work and higher-rep volume, with progressive overload built into every phase. This is the program our members run in the off-season, published exactly as we coach it.',
    goal: 'Muscle Building',
    secondaryGoals: ['Strength'],
    difficulty: 'Intermediate',
    weeks: 12,
    sessionsPerWeek: 5,
    equipment: 'Full Gym',
    priceNaira: 60000,
    compareAtNaira: 75000,
    rating: 4.9,
    reviewCount: 512,
    coachSlug: 'tunde-bakare',
    featured: true,
    bestSeller: true,
    outcomes: [
      'Meaningful size added across the chest, back, shoulders and legs',
      'Bigger numbers on the bench, squat, deadlift and overhead press',
      'A clear progression rule for every lift, so you always know what to load',
      'A deload built in at the right time so you finish fresh rather than broken',
    ],
    phases: [
      {
        weeks: 3,
        title: 'Foundation',
        focus: 'Accumulate quality volume',
        description:
          'Moderate loads, strict tempo. Bank the technique and the volume that the later blocks are built on.',
      },
      {
        weeks: 3,
        title: 'Progression',
        focus: 'Add weight weekly',
        description:
          'Add the smallest available increment on every main lift you completed in full the week before.',
      },
      {
        weeks: 2,
        title: 'Deload',
        focus: 'Recover to grow',
        description:
          'Two-thirds of the volume at the same weights. Skipping this week is the most common mistake people make.',
      },
      {
        weeks: 3,
        title: 'Intensity',
        focus: 'Heaviest working sets',
        description:
          'The hardest block of the program. Top sets are taken to within one or two reps of failure.',
      },
      {
        weeks: 1,
        title: 'Performance',
        focus: 'Retest and record',
        description:
          'Retest your main lifts, log the numbers, and use them as the starting point for your next block.',
      },
    ],
  },
  {
    id: 'home-workout',
    slug: 'home-workout',
    name: 'Home Workout',
    tagline: 'No gym. No excuses.',
    description:
      'Six weeks, four sessions a week, one pair of adjustable dumbbells. Written for people who travel, work long hours, or simply train better at home. Every session runs in under forty minutes and every exercise has a bodyweight substitution if you have nothing at all.',
    goal: 'Home Workout',
    secondaryGoals: ['Fat Loss', 'Conditioning'],
    difficulty: 'All Levels',
    weeks: 6,
    sessionsPerWeek: 4,
    equipment: 'Dumbbells',
    priceNaira: 30000,
    compareAtNaira: null,
    rating: 4.7,
    reviewCount: 298,
    coachSlug: 'chloe-adeyemi',
    featured: true,
    bestSeller: false,
    outcomes: [
      'A complete training week that fits in a living room',
      'Strength and conditioning progress without a gym membership',
      'Bodyweight-only substitutions for every single exercise',
      'Sessions short enough to finish before the motivation runs out',
    ],
    phases: [
      {
        weeks: 2,
        title: 'Foundation',
        focus: 'Set the routine',
        description: 'Fix your four training days and hit them. Consistency beats intensity in weeks one and two.',
      },
      {
        weeks: 2,
        title: 'Progression',
        focus: 'More reps, more control',
        description: 'Add two reps per set or slow the lowering phase to three seconds.',
      },
      {
        weeks: 2,
        title: 'Intensity',
        focus: 'Density work',
        description: 'Same sessions, less rest, finishing sets closer to failure.',
      },
    ],
  },
  {
    id: 'athletic-performance',
    slug: 'athletic-performance',
    name: 'Athletic Performance',
    tagline: 'Faster. Sharper. Harder to tire out.',
    description:
      'Eight weeks of power, speed and engine work for people who play a sport or simply want to move like an athlete again. Jumps and sprints come first while you are fresh, strength work follows, and one dedicated aerobic session a week builds the base that lets you recover between efforts.',
    goal: 'Conditioning',
    secondaryGoals: ['Strength'],
    difficulty: 'Advanced',
    weeks: 8,
    sessionsPerWeek: 4,
    equipment: 'Full Gym',
    priceNaira: 50000,
    compareAtNaira: null,
    rating: 4.8,
    reviewCount: 147,
    coachSlug: 'marcus-idowu',
    featured: false,
    bestSeller: false,
    outcomes: [
      'Higher jumps and quicker first steps from dedicated power work',
      'Better repeat-effort ability so the fourth sprint matches the first',
      'A stronger squat, bench and pull-up alongside the speed work',
      'A structure you can run in-season without burning out',
    ],
    phases: [
      {
        weeks: 2,
        title: 'Foundation',
        focus: 'Rebuild the base',
        description: 'Aerobic volume and technical jump work at low intensity. Resist going hard early.',
      },
      {
        weeks: 3,
        title: 'Progression',
        focus: 'Power development',
        description: 'Jump and sprint volume climbs while strength work stays heavy and low-rep.',
      },
      {
        weeks: 2,
        title: 'Intensity',
        focus: 'Peak output',
        description: 'Maximum quality on every effort with full recovery between them.',
      },
      {
        weeks: 1,
        title: 'Performance',
        focus: 'Taper and test',
        description: 'Volume drops sharply. Retest your jump, your sprint and your main lifts.',
      },
    ],
  },
  {
    id: 'strong-foundations',
    slug: 'strong-foundations',
    name: 'Strong Foundations',
    tagline: 'Strength that lasts longer than a season.',
    description:
      'Six weeks, three sessions a week, built for anyone returning to training after a long break or starting seriously for the first time. Lower body work is glute and hamstring led, upper body work builds toward your first unassisted pull-up, and everything is loaded conservatively so you finish the block wanting more.',
    goal: 'Strength',
    secondaryGoals: ['Beginner'],
    difficulty: 'Beginner',
    weeks: 6,
    sessionsPerWeek: 3,
    equipment: 'Full Gym',
    priceNaira: 28000,
    compareAtNaira: null,
    rating: 4.9,
    reviewCount: 176,
    coachSlug: 'adaeze-okonkwo',
    featured: false,
    bestSeller: false,
    outcomes: [
      'Confident, controlled technique on every foundational lift',
      'Real progress toward a first unassisted pull-up',
      'Stronger glutes and hamstrings, which is where most back complaints start',
      'A training habit that survives a busy week',
    ],
    phases: [
      {
        weeks: 2,
        title: 'Foundation',
        focus: 'Groove the patterns',
        description: 'Light, strict and unhurried. Finish every session feeling like you could do one more set.',
      },
      {
        weeks: 2,
        title: 'Progression',
        focus: 'Load the patterns',
        description: 'Add weight on the hinge and squat. Reduce pull-up assistance one band at a time.',
      },
      {
        weeks: 2,
        title: 'Performance',
        focus: 'Consolidate',
        description: 'Heaviest sets of the block, then a retest to see what six weeks of consistency bought you.',
      },
    ],
  },
]

const INCLUDES_BASE = [
  'Exercise demonstrations for every movement',
  'A printable weekly workout schedule',
  'In-app progress tracking, set by set',
  'Warm-up and cool-down instructions',
  'Substitutions for every exercise',
  'Lifetime access, including future updates',
]

export const PROGRAMS: Program[] = SEEDS.map((seed) => {
  const breakdown = expand(seed.slug, seed.phases)
  const totalWorkouts = seed.weeks * seed.sessionsPerWeek
  return {
    ...seed,
    image: IMAGES.programs[seed.slug as keyof typeof IMAGES.programs],
    totalWorkouts,
    breakdown,
    includes: [`${totalWorkouts} structured workouts`, ...INCLUDES_BASE],
  }
})

export const PROGRAM_BY_SLUG: Record<string, Program> = Object.fromEntries(
  PROGRAMS.map((program) => [program.slug, program]),
)

export const FEATURED_PROGRAMS = PROGRAMS.filter((program) => program.featured)

export function getProgram(slug: string): Program | undefined {
  return PROGRAM_BY_SLUG[slug]
}
