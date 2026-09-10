import { IMAGES } from '@/lib/images'
import type { Difficulty, Equipment, MuscleGroup, Workout, WorkoutExercise } from '@/lib/types'
import { getExercise } from './exercises'

/**
 * Workout sessions.
 *
 * A program's week repeats the same named sessions with a different loading
 * prescription — that is how the plans are actually written and coached — so we
 * author each distinct session once and the program breakdown schedules it.
 * Sessions with `programSlug` are gated behind a purchase; `isFree` sessions
 * make up the public workout library.
 */

/** [exerciseId, sets, reps, restSeconds, notes?] */
type Row = [string, number, string, number, string?]

type Seed = {
  slug: string
  name: string
  summary: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  difficulty: Difficulty
  durationMinutes: number
  imageKey: keyof typeof IMAGES.workouts
  programSlug?: string
  day?: number
  isFree?: boolean
  rows: Row[]
}

function rows(list: Row[]): WorkoutExercise[] {
  return list.map(([id, sets, reps, restSeconds, notes], index) => ({
    exercise: getExercise(id),
    order: index + 1,
    sets,
    reps,
    restSeconds,
    notes,
  }))
}

function build(seed: Seed): Workout {
  return {
    id: seed.slug,
    slug: seed.slug,
    name: seed.name,
    summary: seed.summary,
    muscleGroup: seed.muscleGroup,
    equipment: seed.equipment,
    difficulty: seed.difficulty,
    durationMinutes: seed.durationMinutes,
    image: IMAGES.workouts[seed.imageKey],
    programSlug: seed.programSlug ?? null,
    week: null,
    day: seed.day ?? null,
    exercises: rows(seed.rows),
    isFree: seed.isFree ?? false,
  }
}

const SEEDS: Seed[] = [
  /* ---------------------------------------------------------------- */
  /* Beginner Strength — 3 sessions / week                             */
  /* ---------------------------------------------------------------- */
  {
    slug: 'bs-full-body-a',
    name: 'Full Body A — Squat Focus',
    summary:
      'The first of three weekly sessions. You will learn the squat pattern properly, then back it up with a horizontal push and pull.',
    muscleGroup: 'Full Body',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    durationMinutes: 45,
    imageKey: 'fullBody',
    programSlug: 'beginner-strength',
    day: 1,
    rows: [
      ['goblet-squat', 3, '10', 90, 'Leave two reps in the tank on every set this week.'],
      ['bench-press', 3, '8', 90, 'Ask for a spot on your top set.'],
      ['seated-row', 3, '12', 60],
      ['glute-bridge', 3, '12', 45],
      ['plank', 3, '30 sec', 45],
    ],
  },
  {
    slug: 'bs-full-body-b',
    name: 'Full Body B — Hinge Focus',
    summary:
      'The hip hinge is the single most valuable pattern you will learn. This session builds it from the ground up.',
    muscleGroup: 'Full Body',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    durationMinutes: 45,
    imageKey: 'lower',
    programSlug: 'beginner-strength',
    day: 2,
    rows: [
      ['romanian-deadlift', 3, '10', 90, 'Light. The goal is the pattern, not the load.'],
      ['lat-pulldown', 3, '12', 60],
      ['db-shoulder-press', 3, '10', 60],
      ['walking-lunge', 2, '10 each', 60],
      ['dead-bug', 3, '8 each', 45],
    ],
  },
  {
    slug: 'bs-full-body-c',
    name: 'Full Body C — Press Focus',
    summary:
      'Upper body volume with a leg press finisher. By week four this session will feel noticeably easier at the same weight.',
    muscleGroup: 'Full Body',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    durationMinutes: 50,
    imageKey: 'push',
    programSlug: 'beginner-strength',
    day: 3,
    rows: [
      ['incline-db-press', 3, '10', 75],
      ['dumbbell-row', 3, '10 each', 60],
      ['leg-press', 3, '12', 75],
      ['lateral-raise', 3, '15', 45],
      ['bicep-curl', 2, '12', 45],
      ['tricep-pushdown', 2, '12', 45],
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Fat Loss & Conditioning — 5 sessions / week                       */
  /* ---------------------------------------------------------------- */
  {
    slug: 'fl-upper-strength',
    name: 'Upper Body Strength',
    summary:
      'Heavy enough to protect muscle while you are in a deficit. Rest properly between sets — this is not a circuit.',
    muscleGroup: 'Chest',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 50,
    imageKey: 'upper',
    programSlug: 'fat-loss-conditioning',
    day: 1,
    rows: [
      ['bench-press', 4, '8', 90],
      ['barbell-row', 4, '8', 90],
      ['db-shoulder-press', 3, '10', 75],
      ['lat-pulldown', 3, '12', 60],
      ['face-pull', 3, '15', 45],
    ],
  },
  {
    slug: 'fl-metcon-a',
    name: 'Metabolic Conditioning A',
    summary:
      'Twenty-five minutes of steady, repeatable work. Pick a pace you could hold for a sixth round and stay there.',
    muscleGroup: 'HIIT',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 35,
    imageKey: 'conditioning',
    programSlug: 'fat-loss-conditioning',
    day: 2,
    rows: [
      ['rower-intervals', 5, '500 m', 60, 'Hold the same split on all five.'],
      ['kettlebell-swing', 5, '15', 45],
      ['burpee', 5, '10', 45],
      ['plank', 3, '45 sec', 30],
    ],
  },
  {
    slug: 'fl-lower-strength',
    name: 'Lower Body Strength',
    summary: 'Squat, hinge, carry. The three things that keep your legs strong while the scale moves.',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 55,
    imageKey: 'lower',
    programSlug: 'fat-loss-conditioning',
    day: 3,
    rows: [
      ['back-squat', 4, '8', 120],
      ['romanian-deadlift', 3, '10', 90],
      ['bulgarian-split-squat', 3, '10 each', 75],
      ['leg-curl', 3, '12', 60],
      ['farmers-carry', 3, '40 m', 60],
    ],
  },
  {
    slug: 'fl-metcon-b',
    name: 'Metabolic Conditioning B',
    summary: 'Shorter intervals, higher output. Go hard on the work, take the full rest, repeat.',
    muscleGroup: 'HIIT',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    durationMinutes: 30,
    imageKey: 'hiit',
    programSlug: 'fat-loss-conditioning',
    day: 4,
    rows: [
      ['assault-bike', 8, '20 sec', 40, 'All-out. If round eight matches round one, add resistance next week.'],
      ['jump-squat', 4, '12', 60],
      ['mountain-climber', 4, '30 sec', 45],
      ['russian-twist', 3, '20', 45],
    ],
  },
  {
    slug: 'fl-full-body-circuit',
    name: 'Full Body Circuit',
    summary: 'One long, controlled circuit to finish the week. Move between stations without rushing your form.',
    muscleGroup: 'Full Body',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 45,
    imageKey: 'fullBody',
    programSlug: 'fat-loss-conditioning',
    day: 5,
    rows: [
      ['goblet-squat', 4, '12', 45],
      ['push-up', 4, '12', 45],
      ['inverted-row', 4, '10', 45],
      ['walking-lunge', 3, '12 each', 45],
      ['sled-push', 4, '20 m', 75],
      ['hanging-leg-raise', 3, '10', 45],
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Muscle Building — 5 sessions / week (push / pull / legs split)    */
  /* ---------------------------------------------------------------- */
  {
    slug: 'mb-push-heavy',
    name: 'Push — Heavy',
    summary: 'Low reps, real weight, long rests. Your top set should be genuinely hard by the last rep.',
    muscleGroup: 'Chest',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 60,
    imageKey: 'push',
    programSlug: 'muscle-building',
    day: 1,
    rows: [
      ['bench-press', 4, '6', 150, 'Add 2.5kg whenever you hit all four sets.'],
      ['overhead-press', 4, '8', 120],
      ['incline-db-press', 3, '10', 90],
      ['lateral-raise', 4, '15', 45],
      ['close-grip-bench', 3, '10', 75],
      ['tricep-pushdown', 3, '12', 45],
    ],
  },
  {
    slug: 'mb-pull-heavy',
    name: 'Pull — Heavy',
    summary: 'Deadlift leads, then a full spread of rowing and pulldown volume for the back.',
    muscleGroup: 'Back',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 60,
    imageKey: 'pull',
    programSlug: 'muscle-building',
    day: 2,
    rows: [
      ['deadlift', 4, '5', 180, 'Reset your grip and brace on every single rep.'],
      ['pull-up', 4, '8', 120, 'Add weight once you clear 10 clean reps.'],
      ['barbell-row', 3, '10', 90],
      ['seated-row', 3, '12', 60],
      ['face-pull', 3, '15', 45],
      ['hammer-curl', 3, '12', 45],
    ],
  },
  {
    slug: 'mb-legs-heavy',
    name: 'Legs — Heavy',
    summary: 'The session that decides whether this program works. Do not skip it.',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    durationMinutes: 65,
    imageKey: 'legs',
    programSlug: 'muscle-building',
    day: 3,
    rows: [
      ['back-squat', 5, '5', 180],
      ['romanian-deadlift', 4, '8', 120],
      ['leg-press', 3, '12', 90],
      ['leg-curl', 3, '12', 60],
      ['calf-raise', 4, '15', 45],
      ['hanging-leg-raise', 3, '12', 45],
    ],
  },
  {
    slug: 'mb-push-volume',
    name: 'Push — Volume',
    summary: 'Lighter loads, more reps, shorter rests. Chase the pump and the stretch on every rep.',
    muscleGroup: 'Shoulders',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 55,
    imageKey: 'shoulders',
    programSlug: 'muscle-building',
    day: 4,
    rows: [
      ['incline-db-press', 4, '12', 75],
      ['db-shoulder-press', 4, '12', 75],
      ['cable-fly', 3, '15', 60],
      ['lateral-raise', 4, '18', 40],
      ['overhead-tricep', 3, '12', 60],
      ['dips', 3, 'AMRAP', 90],
    ],
  },
  {
    slug: 'mb-pull-volume',
    name: 'Pull & Arms — Volume',
    summary: 'Back thickness plus dedicated arm work to close out the training week.',
    muscleGroup: 'Arms',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 55,
    imageKey: 'arms',
    programSlug: 'muscle-building',
    day: 5,
    rows: [
      ['lat-pulldown', 4, '12', 75],
      ['dumbbell-row', 4, '12 each', 60],
      ['rear-delt-fly', 3, '18', 45],
      ['bicep-curl', 4, '12', 45],
      ['hammer-curl', 3, '15', 45],
      ['cable-crunch', 3, '15', 45],
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Home Workout — 4 sessions / week                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: 'hw-upper',
    name: 'Home Upper Body',
    summary: 'One pair of dumbbells and a floor. That is genuinely all you need for this one.',
    muscleGroup: 'Chest',
    equipment: 'Dumbbells',
    difficulty: 'All Levels',
    durationMinutes: 35,
    imageKey: 'upper',
    programSlug: 'home-workout',
    day: 1,
    rows: [
      ['push-up', 4, '12', 60, 'Elevate your hands on a chair if 12 is out of reach today.'],
      ['dumbbell-row', 4, '12 each', 60],
      ['db-shoulder-press', 3, '12', 60],
      ['bicep-curl', 3, '12', 45],
      ['overhead-tricep', 3, '12', 45],
    ],
  },
  {
    slug: 'hw-lower',
    name: 'Home Lower Body',
    summary: 'Unilateral work does the heavy lifting when the weights are light.',
    muscleGroup: 'Legs',
    equipment: 'Dumbbells',
    difficulty: 'All Levels',
    durationMinutes: 35,
    imageKey: 'lower',
    programSlug: 'home-workout',
    day: 2,
    rows: [
      ['goblet-squat', 4, '15', 60],
      ['bulgarian-split-squat', 3, '12 each', 60],
      ['romanian-deadlift', 3, '12', 60],
      ['glute-bridge', 3, '20', 45],
      ['calf-raise', 3, '20', 30],
    ],
  },
  {
    slug: 'hw-conditioning',
    name: 'Home Conditioning',
    summary: 'Twenty minutes, no equipment, no excuses. Work for 40 seconds, rest for 20, repeat.',
    muscleGroup: 'HIIT',
    equipment: 'No Equipment',
    difficulty: 'All Levels',
    durationMinutes: 25,
    imageKey: 'hiit',
    programSlug: 'home-workout',
    day: 3,
    rows: [
      ['burpee', 4, '40 sec', 20],
      ['jump-squat', 4, '40 sec', 20],
      ['mountain-climber', 4, '40 sec', 20],
      ['skipping', 4, '40 sec', 20],
      ['plank', 3, '45 sec', 30],
    ],
  },
  {
    slug: 'hw-full-body',
    name: 'Home Full Body',
    summary: 'A complete session that hits everything. This is the one to keep if life gets busy.',
    muscleGroup: 'Full Body',
    equipment: 'Dumbbells',
    difficulty: 'All Levels',
    durationMinutes: 40,
    imageKey: 'fullBody',
    programSlug: 'home-workout',
    day: 4,
    rows: [
      ['goblet-squat', 3, '12', 60],
      ['push-up', 3, '12', 60],
      ['dumbbell-row', 3, '12 each', 60],
      ['walking-lunge', 3, '10 each', 60],
      ['pike-push-up', 3, '10', 60],
      ['dead-bug', 3, '10 each', 45],
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Athletic Performance — 4 sessions / week                          */
  /* ---------------------------------------------------------------- */
  {
    slug: 'ap-power-lower',
    name: 'Lower Power',
    summary: 'Jumps before lifts, always. Power work is done fresh or not at all.',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    durationMinutes: 60,
    imageKey: 'legs',
    programSlug: 'athletic-performance',
    day: 1,
    rows: [
      ['box-jump', 5, '3', 120, 'Quality over height. Stop the set the moment the landing gets loud.'],
      ['back-squat', 5, '4', 180],
      ['romanian-deadlift', 3, '8', 120],
      ['bulgarian-split-squat', 3, '8 each', 90],
      ['farmers-carry', 3, '40 m', 75],
    ],
  },
  {
    slug: 'ap-power-upper',
    name: 'Upper Power',
    summary: 'Explosive intent on every rep, even when the bar is moving slowly.',
    muscleGroup: 'Chest',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    durationMinutes: 55,
    imageKey: 'upper',
    programSlug: 'athletic-performance',
    day: 2,
    rows: [
      ['bench-press', 5, '4', 180],
      ['pull-up', 5, '5', 120, 'Weighted if you can hold clean form.'],
      ['overhead-press', 4, '6', 120],
      ['barbell-row', 3, '8', 90],
      ['face-pull', 3, '15', 45],
    ],
  },
  {
    slug: 'ap-speed',
    name: 'Speed & Change of Direction',
    summary: 'Short efforts, long rests. If your times drop off, the session is over — that is the rule.',
    muscleGroup: 'Full Body',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    durationMinutes: 45,
    imageKey: 'conditioning',
    programSlug: 'athletic-performance',
    day: 3,
    rows: [
      ['sled-push', 6, '20 m', 120],
      ['box-jump', 4, '4', 90],
      ['jump-squat', 4, '6', 90],
      ['plank', 3, '60 sec', 45],
    ],
  },
  {
    slug: 'ap-engine',
    name: 'Engine Builder',
    summary: 'The aerobic base that lets you recover between hard efforts. Steadier than it feels it should be.',
    muscleGroup: 'HIIT',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 40,
    imageKey: 'conditioning',
    programSlug: 'athletic-performance',
    day: 4,
    rows: [
      ['rower-intervals', 6, '3 min', 90, 'Nose-breathing pace. If you cannot talk, slow down.'],
      ['kettlebell-swing', 4, '20', 60],
      ['farmers-carry', 3, '60 m', 60],
      ['cat-cow', 2, '10', 30],
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Strong Foundations — 3 sessions / week                            */
  /* ---------------------------------------------------------------- */
  {
    slug: 'sf-lower',
    name: 'Foundations — Lower',
    summary: 'Glute and hamstring focused, built around patterns you can load safely for years.',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    durationMinutes: 45,
    imageKey: 'legs',
    programSlug: 'strong-foundations',
    day: 1,
    rows: [
      ['hip-thrust', 4, '12', 75],
      ['goblet-squat', 3, '12', 75],
      ['romanian-deadlift', 3, '10', 75],
      ['walking-lunge', 3, '10 each', 60],
      ['glute-bridge', 3, '15', 45],
    ],
  },
  {
    slug: 'sf-upper',
    name: 'Foundations — Upper',
    summary: 'Build real pressing and pulling strength. The first pull-up starts here.',
    muscleGroup: 'Back',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    durationMinutes: 45,
    imageKey: 'upper',
    programSlug: 'strong-foundations',
    day: 2,
    rows: [
      ['lat-pulldown', 4, '10', 75],
      ['incline-db-press', 3, '10', 75],
      ['seated-row', 3, '12', 60],
      ['db-shoulder-press', 3, '10', 60],
      ['band-pull-apart', 3, '20', 40],
    ],
  },
  {
    slug: 'sf-full-body',
    name: 'Foundations — Full Body',
    summary: 'Ties the week together with a mix of strength and core work.',
    muscleGroup: 'Full Body',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    durationMinutes: 45,
    imageKey: 'fullBody',
    programSlug: 'strong-foundations',
    day: 3,
    rows: [
      ['back-squat', 3, '8', 120],
      ['dumbbell-row', 3, '12 each', 60],
      ['push-up', 3, '10', 60],
      ['kettlebell-swing', 3, '15', 60],
      ['dead-bug', 3, '10 each', 45],
      ['plank', 3, '40 sec', 45],
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Free workout library — open to everyone, no purchase required     */
  /* ---------------------------------------------------------------- */
  {
    slug: '30-minute-full-body-blast',
    name: '30 Minute Full Body Blast',
    summary:
      'Short on time but not on intent. Three rounds through six movements with minimal rest.',
    muscleGroup: 'Full Body',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    durationMinutes: 30,
    imageKey: 'fullBody',
    isFree: true,
    rows: [
      ['goblet-squat', 3, '15', 45],
      ['push-up', 3, '15', 45],
      ['dumbbell-row', 3, '12 each', 45],
      ['kettlebell-swing', 3, '20', 45],
      ['walking-lunge', 3, '12 each', 45],
      ['plank', 3, '45 sec', 30],
    ],
  },
  {
    slug: 'classic-chest-day',
    name: 'Classic Chest Day',
    summary: 'Press heavy, then chase volume. The session that never goes out of style.',
    muscleGroup: 'Chest',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 50,
    imageKey: 'chest',
    isFree: true,
    rows: [
      ['bench-press', 4, '8', 120],
      ['incline-db-press', 4, '10', 90],
      ['cable-fly', 3, '15', 60],
      ['dips', 3, 'AMRAP', 90],
      ['tricep-pushdown', 3, '12', 45],
    ],
  },
  {
    slug: 'back-width-and-thickness',
    name: 'Back Width & Thickness',
    summary: 'Vertical pulling for width, horizontal rowing for thickness. Both, every time.',
    muscleGroup: 'Back',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 50,
    imageKey: 'back',
    isFree: true,
    rows: [
      ['pull-up', 4, '8', 120],
      ['barbell-row', 4, '10', 90],
      ['lat-pulldown', 3, '12', 60],
      ['seated-row', 3, '12', 60],
      ['face-pull', 3, '20', 45],
    ],
  },
  {
    slug: 'leg-day-that-counts',
    name: 'Leg Day That Counts',
    summary: 'Squat, hinge, single leg, calves. Everything below the belt in under an hour.',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    durationMinutes: 60,
    imageKey: 'legs',
    isFree: true,
    rows: [
      ['back-squat', 4, '8', 150],
      ['romanian-deadlift', 4, '10', 120],
      ['bulgarian-split-squat', 3, '10 each', 75],
      ['leg-curl', 3, '15', 60],
      ['calf-raise', 4, '15', 45],
    ],
  },
  {
    slug: 'shoulder-builder',
    name: 'Shoulder Builder',
    summary: 'One heavy press and a lot of lateral raises. That is the whole secret.',
    muscleGroup: 'Shoulders',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    durationMinutes: 40,
    imageKey: 'shoulders',
    isFree: true,
    rows: [
      ['overhead-press', 4, '8', 120],
      ['db-shoulder-press', 3, '12', 75],
      ['lateral-raise', 4, '18', 45],
      ['rear-delt-fly', 3, '18', 45],
      ['face-pull', 3, '20', 45],
    ],
  },
  {
    slug: 'arms-in-forty',
    name: 'Arms In Forty',
    summary: 'Alternate biceps and triceps with short rests. Your sleeves will notice.',
    muscleGroup: 'Arms',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    durationMinutes: 40,
    imageKey: 'arms',
    isFree: true,
    rows: [
      ['bicep-curl', 4, '12', 45],
      ['tricep-pushdown', 4, '12', 45],
      ['hammer-curl', 3, '15', 45],
      ['overhead-tricep', 3, '15', 45],
      ['close-grip-bench', 3, '10', 75],
    ],
  },
  {
    slug: 'ten-minute-core-finisher',
    name: '10 Minute Core Finisher',
    summary: 'Bolt this onto the end of any session. Bracing, not crunching.',
    muscleGroup: 'Core',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    durationMinutes: 10,
    imageKey: 'core',
    isFree: true,
    rows: [
      ['dead-bug', 3, '10 each', 30],
      ['plank', 3, '45 sec', 30],
      ['russian-twist', 3, '20', 30],
      ['hanging-leg-raise', 3, '10', 30],
    ],
  },
  {
    slug: 'twenty-minute-hiit',
    name: '20 Minute HIIT Burner',
    summary: 'Four movements, five rounds, no equipment. Bring a towel.',
    muscleGroup: 'HIIT',
    equipment: 'No Equipment',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    imageKey: 'hiit',
    isFree: true,
    rows: [
      ['burpee', 5, '30 sec', 30],
      ['jump-squat', 5, '30 sec', 30],
      ['mountain-climber', 5, '30 sec', 30],
      ['plank', 5, '30 sec', 30],
    ],
  },
  {
    slug: 'no-equipment-full-body',
    name: 'No Equipment Full Body',
    summary: 'A hotel room, a living room, anywhere. Nothing but your bodyweight.',
    muscleGroup: 'Full Body',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    durationMinutes: 30,
    imageKey: 'fullBody',
    isFree: true,
    rows: [
      ['bodyweight-squat', 4, '20', 45],
      ['push-up', 4, '12', 45],
      ['glute-bridge', 4, '20', 45],
      ['pike-push-up', 3, '10', 45],
      ['dead-bug', 3, '10 each', 30],
    ],
  },
  {
    slug: 'beginner-first-session',
    name: 'Your Very First Session',
    summary:
      'Never trained before? Start here. Six movements, light weight, and no rush. Every member started somewhere.',
    muscleGroup: 'Full Body',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    durationMinutes: 35,
    imageKey: 'fullBody',
    isFree: true,
    rows: [
      ['bodyweight-squat', 3, '10', 60, 'Sit to a bench if you are unsure of the depth.'],
      ['incline-db-press', 3, '10', 60],
      ['seated-row', 3, '12', 60],
      ['glute-bridge', 3, '12', 45],
      ['plank', 3, '20 sec', 45],
      ['cat-cow', 2, '8', 30],
    ],
  },
  {
    slug: 'mobility-reset',
    name: 'Mobility Reset',
    summary: 'A twenty minute reset for stiff hips and shoulders. Best used on a rest day.',
    muscleGroup: 'Full Body',
    equipment: 'No Equipment',
    difficulty: 'All Levels',
    durationMinutes: 20,
    imageKey: 'mobility',
    isFree: true,
    rows: [
      ['world-greatest-stretch', 3, '3 each', 30],
      ['cat-cow', 3, '10', 30],
      ['hip-flexor-stretch', 2, '90 sec each', 30],
      ['band-pull-apart', 3, '20', 30],
      ['dead-bug', 3, '8 each', 30],
    ],
  },
  {
    slug: 'conditioning-ladder',
    name: 'Conditioning Ladder',
    summary: 'Rowing intervals that get shorter and faster. A brutally honest fitness test.',
    muscleGroup: 'HIIT',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    durationMinutes: 30,
    imageKey: 'conditioning',
    isFree: true,
    rows: [
      ['rower-intervals', 1, '1000 m', 120],
      ['rower-intervals', 1, '750 m', 105],
      ['rower-intervals', 1, '500 m', 90],
      ['rower-intervals', 1, '250 m', 90],
      ['russian-twist', 3, '20', 45],
    ],
  },
]

export const WORKOUTS: Workout[] = SEEDS.map(build)

export const WORKOUT_BY_SLUG: Record<string, Workout> = Object.fromEntries(
  WORKOUTS.map((workout) => [workout.slug, workout]),
)

export const FREE_WORKOUTS = WORKOUTS.filter((workout) => workout.isFree)

export function workoutsForProgram(programSlug: string): Workout[] {
  return WORKOUTS.filter((workout) => workout.programSlug === programSlug).sort(
    (a, b) => (a.day ?? 0) - (b.day ?? 0),
  )
}
