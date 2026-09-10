import {
  FACILITIES,
  MEMBERSHIPS,
  PROGRAMS,
  TESTIMONIALS,
  TRAINERS,
  TRANSFORMATIONS,
  WORKOUTS,
} from '@/lib/content'
import { IMAGES } from '@/lib/images'
import { createClient } from '@/lib/supabase/server'
import type {
  Facility,
  MembershipPlan,
  Program,
  Testimonial,
  Trainer,
  Transformation,
  UserProgram,
  Workout,
} from '@/lib/types'

/**
 * Read layer.
 *
 * Every entity the gym owner manages from the admin dashboard is read through
 * here. When Supabase is configured and the table has rows, the database wins —
 * that is what makes the admin a real CMS. Otherwise the curated content in
 * src/lib/content is served, so a fresh clone renders a complete site.
 *
 * Reads are cached per-request by Next's fetch/React cache semantics; the pages
 * that use them set their own revalidation.
 */

type Row = Record<string, unknown>

const str = (row: Row, key: string, fallback = ''): string =>
  typeof row[key] === 'string' ? (row[key] as string) : fallback
const num = (row: Row, key: string, fallback = 0): number =>
  typeof row[key] === 'number' ? (row[key] as number) : fallback
const bool = (row: Row, key: string, fallback = false): boolean =>
  typeof row[key] === 'boolean' ? (row[key] as boolean) : fallback
const arr = (row: Row, key: string): string[] => (Array.isArray(row[key]) ? (row[key] as string[]) : [])

/** Query a table, returning null on any failure so callers fall back quietly. */
async function rows(table: string, order?: { column: string; ascending?: boolean }): Promise<Row[] | null> {
  try {
    const supabase = await createClient()
    if (!supabase) return null
    let query = supabase.from(table).select('*')
    if (order) query = query.order(order.column, { ascending: order.ascending ?? true })
    const { data, error } = await query
    if (error || !data || data.length === 0) return null
    return data as Row[]
  } catch {
    return null
  }
}

/* -------------------------------------------------------------------------- */
/* Programs                                                                    */
/* -------------------------------------------------------------------------- */

function mapProgram(row: Row): Program {
  const fallback = PROGRAMS.find((program) => program.slug === str(row, 'slug'))
  const slug = str(row, 'slug', fallback?.slug ?? '')
  return {
    id: str(row, 'id', slug),
    slug,
    name: str(row, 'name', fallback?.name ?? ''),
    tagline: str(row, 'tagline', fallback?.tagline ?? ''),
    description: str(row, 'description', fallback?.description ?? ''),
    goal: (str(row, 'goal') || fallback?.goal || 'Strength') as Program['goal'],
    secondaryGoals: (arr(row, 'secondary_goals') as Program['secondaryGoals']) ?? fallback?.secondaryGoals ?? [],
    difficulty: (str(row, 'difficulty') || fallback?.difficulty || 'Beginner') as Program['difficulty'],
    weeks: num(row, 'weeks', fallback?.weeks ?? 0),
    sessionsPerWeek: num(row, 'sessions_per_week', fallback?.sessionsPerWeek ?? 0),
    totalWorkouts: num(row, 'total_workouts', fallback?.totalWorkouts ?? 0),
    equipment: (str(row, 'equipment') || fallback?.equipment || 'Full Gym') as Program['equipment'],
    priceNaira: num(row, 'price_naira', fallback?.priceNaira ?? 0),
    compareAtNaira: typeof row.compare_at_naira === 'number' ? (row.compare_at_naira as number) : null,
    rating: num(row, 'rating', fallback?.rating ?? 5),
    reviewCount: num(row, 'review_count', fallback?.reviewCount ?? 0),
    image: {
      src: str(row, 'image_url', fallback?.image.src ?? IMAGES.hero.src),
      alt: str(row, 'image_alt', fallback?.image.alt ?? ''),
    },
    outcomes: arr(row, 'outcomes').length ? arr(row, 'outcomes') : (fallback?.outcomes ?? []),
    includes: arr(row, 'includes').length ? arr(row, 'includes') : (fallback?.includes ?? []),
    // The week-by-week breakdown lives in program_weeks; the curated block is a
    // good fallback and keeps the sales page complete during a partial migration.
    breakdown: fallback?.breakdown ?? [],
    coachSlug: str(row, 'coach_slug', fallback?.coachSlug ?? ''),
    featured: bool(row, 'featured', fallback?.featured ?? false),
    bestSeller: bool(row, 'best_seller', fallback?.bestSeller ?? false),
  }
}

export async function getPrograms(): Promise<Program[]> {
  const data = await rows('programs', { column: 'price_naira' })
  if (!data) return PROGRAMS
  return data.filter((row) => bool(row, 'published', true)).map(mapProgram)
}

export async function getProgramBySlug(slug: string): Promise<Program | undefined> {
  const all = await getPrograms()
  return all.find((program) => program.slug === slug)
}

export async function getFeaturedPrograms(): Promise<Program[]> {
  const all = await getPrograms()
  const featured = all.filter((program) => program.featured)
  return featured.length ? featured.slice(0, 4) : all.slice(0, 4)
}

/* -------------------------------------------------------------------------- */
/* Workouts                                                                    */
/* -------------------------------------------------------------------------- */

export async function getWorkouts(): Promise<Workout[]> {
  const data = await rows('workouts', { column: 'name' })
  if (!data) return WORKOUTS
  return data.map((row) => {
    const slug = str(row, 'slug')
    const fallback = WORKOUTS.find((workout) => workout.slug === slug)
    if (!fallback) return null
    return {
      ...fallback,
      name: str(row, 'name', fallback.name),
      summary: str(row, 'summary', fallback.summary),
      durationMinutes: num(row, 'duration_minutes', fallback.durationMinutes),
      isFree: bool(row, 'is_free', fallback.isFree),
      image: {
        src: str(row, 'image_url', fallback.image.src),
        alt: str(row, 'image_alt', fallback.image.alt),
      },
    } satisfies Workout
  }).filter((workout): workout is Workout => workout !== null)
}

export async function getWorkoutBySlug(slug: string): Promise<Workout | undefined> {
  const all = await getWorkouts()
  return all.find((workout) => workout.slug === slug)
}

/* -------------------------------------------------------------------------- */
/* Trainers                                                                    */
/* -------------------------------------------------------------------------- */

export async function getTrainers(): Promise<Trainer[]> {
  const data = await rows('trainers', { column: 'sort_order' })
  if (!data) return TRAINERS
  return data
    .map((row) => {
      const slug = str(row, 'slug')
      const fallback = TRAINERS.find((trainer) => trainer.slug === slug)
      return {
        id: str(row, 'id', slug),
        slug,
        name: str(row, 'name', fallback?.name ?? ''),
        role: str(row, 'role', fallback?.role ?? ''),
        specialty: str(row, 'specialty', fallback?.specialty ?? ''),
        yearsExperience: num(row, 'years_experience', fallback?.yearsExperience ?? 0),
        shortBio: str(row, 'short_bio', fallback?.shortBio ?? ''),
        bio: arr(row, 'bio').length ? arr(row, 'bio') : (fallback?.bio ?? []),
        philosophy: str(row, 'philosophy', fallback?.philosophy ?? ''),
        certifications: arr(row, 'certifications').length
          ? arr(row, 'certifications')
          : (fallback?.certifications ?? []),
        programSlugs: arr(row, 'program_slugs').length ? arr(row, 'program_slugs') : (fallback?.programSlugs ?? []),
        image: {
          src: str(row, 'image_url', fallback?.image.src ?? IMAGES.coaching.src),
          alt: str(row, 'image_alt', fallback?.image.alt ?? ''),
        },
        socials: (row.socials as Trainer['socials']) ?? fallback?.socials ?? {},
      } satisfies Trainer
    })
    .filter((trainer) => trainer.slug)
}

export async function getTrainerBySlug(slug: string): Promise<Trainer | undefined> {
  const all = await getTrainers()
  return all.find((trainer) => trainer.slug === slug)
}

/* -------------------------------------------------------------------------- */
/* Social proof, memberships, facilities                                       */
/* -------------------------------------------------------------------------- */

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await rows('testimonials', { column: 'sort_order' })
  if (!data) return TESTIMONIALS
  return data.map((row, index) => ({
    id: str(row, 'id', `t${index}`),
    name: str(row, 'name'),
    role: str(row, 'role'),
    rating: num(row, 'rating', 5),
    quote: str(row, 'quote'),
    trainingDuration: str(row, 'training_duration'),
    image: {
      src: str(row, 'image_url', TESTIMONIALS[index % TESTIMONIALS.length].image.src),
      alt: str(row, 'image_alt', `Portrait of ${str(row, 'name')}`),
    },
  }))
}

export async function getTransformations(): Promise<Transformation[]> {
  const data = await rows('transformations', { column: 'sort_order' })
  if (!data) return TRANSFORMATIONS
  return data.map((row, index) => {
    const fallback = TRANSFORMATIONS[index % TRANSFORMATIONS.length]
    return {
      id: str(row, 'id', `tr${index}`),
      slug: str(row, 'slug', `transformation-${index}`),
      name: str(row, 'name'),
      age: num(row, 'age'),
      startingPoint: str(row, 'starting_point'),
      goal: str(row, 'goal'),
      programSlug: str(row, 'program_slug'),
      programName: str(row, 'program_name'),
      duration: str(row, 'duration'),
      result: str(row, 'result'),
      quote: str(row, 'quote'),
      before: { src: str(row, 'before_url', fallback.before.src), alt: `${str(row, 'name')} before training` },
      after: { src: str(row, 'after_url', fallback.after.src), alt: `${str(row, 'name')} after training` },
      featured: bool(row, 'featured', true),
    }
  })
}

export async function getMemberships(): Promise<MembershipPlan[]> {
  const data = await rows('memberships', { column: 'price_naira' })
  if (!data) return MEMBERSHIPS
  return data.map((row) => {
    const slug = str(row, 'slug')
    const fallback = MEMBERSHIPS.find((plan) => plan.slug === slug)
    return {
      id: str(row, 'id', slug),
      slug,
      name: str(row, 'name', fallback?.name ?? ''),
      priceNaira: num(row, 'price_naira', fallback?.priceNaira ?? 0),
      interval: 'month',
      summary: str(row, 'summary', fallback?.summary ?? ''),
      features: arr(row, 'features').length ? arr(row, 'features') : (fallback?.features ?? []),
      highlight: bool(row, 'highlight', fallback?.highlight ?? false),
      badge: str(row, 'badge', fallback?.badge ?? '') || undefined,
    } satisfies MembershipPlan
  })
}

export async function getGallery(): Promise<Array<{ src: string; alt: string }>> {
  const data = await rows('gym_gallery', { column: 'sort_order' })
  if (!data) return [...IMAGES.gallery]
  return data.map((row, index) => ({
    src: str(row, 'image_url', IMAGES.gallery[index % IMAGES.gallery.length].src),
    alt: str(row, 'alt_text', 'RoadBoy Gym&Sports'),
  }))
}

export async function getFacilities(): Promise<Facility[]> {
  return FACILITIES
}

/* -------------------------------------------------------------------------- */
/* Account-scoped reads. RLS enforces ownership; these just shape the result.  */
/* -------------------------------------------------------------------------- */

export async function getUserPrograms(userId: string): Promise<UserProgram[]> {
  try {
    const supabase = await createClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('user_programs')
      .select('program_slug, purchased_at, current_week, workout_progress(workout_slug, completed_at)')
      .eq('user_id', userId)

    if (error || !data) return []

    return (data as Row[]).map((row) => ({
      programSlug: str(row, 'program_slug'),
      purchasedAt: str(row, 'purchased_at'),
      currentWeek: num(row, 'current_week', 1),
      completedWorkoutSlugs: Array.isArray(row.workout_progress)
        ? (row.workout_progress as Row[])
            .filter((progress) => progress.completed_at)
            .map((progress) => str(progress, 'workout_slug'))
        : [],
    }))
  } catch {
    return []
  }
}

/** Authoritative check for "may this user open this program's workouts?". */
export async function hasPurchased(userId: string, programSlug: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    if (!supabase) return false
    const { data, error } = await supabase
      .from('user_programs')
      .select('id')
      .eq('user_id', userId)
      .eq('program_slug', programSlug)
      .maybeSingle()
    return !error && Boolean(data)
  } catch {
    return false
  }
}

export async function getProfile(userId: string) {
  try {
    const supabase = await createClient()
    if (!supabase) return null
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    return data as Row | null
  } catch {
    return null
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await getProfile(userId)
  return profile ? str(profile, 'role') === 'admin' : false
}
