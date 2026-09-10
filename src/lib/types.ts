/**
 * Domain types. These mirror the Supabase schema in supabase/migrations so a
 * row and a static seed object are interchangeable to every component.
 */

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'

export type Goal =
  | 'Muscle Building'
  | 'Fat Loss'
  | 'Strength'
  | 'Conditioning'
  | 'Beginner'
  | 'Home Workout'

export type Equipment = 'No Equipment' | 'Dumbbells' | 'Full Gym' | 'Home Equipment'

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Full Body'
  | 'HIIT'

export interface Exercise {
  id: string
  name: string
  slug: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  difficulty: Difficulty
  /** Short, coach-voiced cues. Two or three lines, not an essay. */
  instructions: string[]
  /** Populated once the gym uploads its demo clips. */
  videoUrl: string | null
  substitutions: string[]
}

/** An exercise as it appears inside one specific workout (sets/reps/rest). */
export interface WorkoutExercise {
  exercise: Exercise
  order: number
  sets: number
  reps: string
  restSeconds: number
  notes?: string
}

export interface Workout {
  id: string
  slug: string
  name: string
  summary: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  difficulty: Difficulty
  durationMinutes: number
  image: { src: string; alt: string }
  /** Null when the workout is a free library session rather than part of a plan. */
  programSlug: string | null
  week: number | null
  day: number | null
  exercises: WorkoutExercise[]
  /** Free sessions are viewable by anyone; the rest need a purchase. */
  isFree: boolean
}

export interface ProgramWeek {
  number: number
  title: string
  focus: string
  description: string
  workoutSlugs: string[]
}

export interface Program {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  goal: Goal
  secondaryGoals: Goal[]
  difficulty: Difficulty
  weeks: number
  sessionsPerWeek: number
  totalWorkouts: number
  equipment: Equipment
  priceNaira: number
  compareAtNaira: number | null
  rating: number
  reviewCount: number
  image: { src: string; alt: string }
  outcomes: string[]
  includes: string[]
  breakdown: ProgramWeek[]
  coachSlug: string
  featured: boolean
  bestSeller: boolean
}

export interface Trainer {
  id: string
  slug: string
  name: string
  role: string
  specialty: string
  yearsExperience: number
  shortBio: string
  bio: string[]
  philosophy: string
  certifications: string[]
  programSlugs: string[]
  image: { src: string; alt: string }
  socials: { instagram?: string; x?: string; youtube?: string }
}

export interface Testimonial {
  id: string
  name: string
  role: string
  rating: number
  quote: string
  trainingDuration: string
  image: { src: string; alt: string }
}

export interface Transformation {
  id: string
  slug: string
  name: string
  age: number
  startingPoint: string
  goal: string
  programSlug: string
  programName: string
  duration: string
  result: string
  quote: string
  before: { src: string; alt: string }
  after: { src: string; alt: string }
  featured: boolean
}

export interface MembershipPlan {
  id: string
  slug: string
  name: string
  priceNaira: number
  interval: 'month'
  summary: string
  features: string[]
  highlight: boolean
  badge?: string
}

export interface Category {
  slug: string
  name: string
  blurb: string
  image: { src: string; alt: string }
}

export interface Facility {
  slug: string
  name: string
  headline: string
  description: string
  features: string[]
  image: { src: string; alt: string }
}

export interface Service {
  slug: string
  title: string
  description: string
  icon: string
  href: string
}

/* -------------------------------------------------------------------------- */
/* Commerce + account                                                          */
/* -------------------------------------------------------------------------- */

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  reference: string
  userId: string
  email: string
  status: OrderStatus
  amountNaira: number
  createdAt: string
  items: Array<{ programSlug: string; programName: string; priceNaira: number }>
}

export interface UserProgram {
  programSlug: string
  purchasedAt: string
  currentWeek: number
  completedWorkoutSlugs: string[]
}

export interface WorkoutProgressRecord {
  workoutSlug: string
  completedAt: string
  completedExerciseIds: string[]
}

export interface Profile {
  id: string
  fullName: string
  email: string
  avatarUrl: string | null
  role: 'customer' | 'admin'
  createdAt: string
}
