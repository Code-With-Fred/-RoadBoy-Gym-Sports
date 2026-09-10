export * from './exercises'
export * from './workouts'
export * from './programs'
export * from './trainers'
export * from './social-proof'
export * from './gym'

/** Filter vocabularies shared by the programs and workout-library UIs. */
export const GOALS = [
  'Muscle Building',
  'Fat Loss',
  'Strength',
  'Conditioning',
  'Beginner',
  'Home Workout',
] as const

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const

export const DURATIONS = [4, 6, 8, 12] as const

export const EQUIPMENT_OPTIONS = ['No Equipment', 'Dumbbells', 'Full Gym', 'Home Equipment'] as const

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Full Body',
  'HIIT',
] as const

export const WORKOUT_LENGTHS = [
  { label: 'Under 30 min', min: 0, max: 29 },
  { label: '30 – 45 min', min: 30, max: 45 },
  { label: '45 – 60 min', min: 46, max: 60 },
  { label: '60 min +', min: 61, max: 999 },
] as const
