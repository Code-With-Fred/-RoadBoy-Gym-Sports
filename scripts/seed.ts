/**
 * Seeds Supabase from the curated content in src/lib/content.
 *
 *   npm run seed
 *
 * The content modules are the single source of truth, so this is safe to re-run
 * at any time: every write is an upsert keyed on a natural unique column, and
 * nothing a member owns (orders, entitlements, progress) is touched.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY — the service
 * role is needed because seeding writes to admin-only tables.
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

import {
  CATEGORIES,
  EXERCISES,
  MEMBERSHIPS,
  PROGRAMS,
  TESTIMONIALS,
  TRAINERS,
  TRANSFORMATIONS,
  WORKOUTS,
} from '../src/lib/content'
import { IMAGES } from '../src/lib/images'

config({ path: '.env.local' })
config()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    '\nMissing credentials.\n' +
      'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, then run this again.\n',
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

/** Upsert a batch and report, stopping the run on the first real failure. */
async function upsert(table: string, rows: object[], conflict: string) {
  if (!rows.length) return
  const { error } = await supabase.from(table).upsert(rows, { onConflict: conflict })
  if (error) {
    console.error(`  ✗ ${table}: ${error.message}`)
    process.exitCode = 1
    return
  }
  console.log(`  ✓ ${table} — ${rows.length} rows`)
}

async function main() {
  console.log('\nSeeding ROADBOY GYM&SPORTS content\n')

  // Order matters: trainers and programs are referenced by later foreign keys.
  await upsert(
    'trainers',
    TRAINERS.map((trainer, index) => ({
      slug: trainer.slug,
      name: trainer.name,
      role: trainer.role,
      specialty: trainer.specialty,
      years_experience: trainer.yearsExperience,
      short_bio: trainer.shortBio,
      bio: trainer.bio,
      philosophy: trainer.philosophy,
      certifications: trainer.certifications,
      program_slugs: trainer.programSlugs,
      image_url: trainer.image.src,
      image_alt: trainer.image.alt,
      socials: trainer.socials,
      sort_order: index,
    })),
    'slug',
  )

  await upsert(
    'programs',
    PROGRAMS.map((program) => ({
      slug: program.slug,
      name: program.name,
      tagline: program.tagline,
      description: program.description,
      goal: program.goal,
      secondary_goals: program.secondaryGoals,
      difficulty: program.difficulty,
      equipment: program.equipment,
      weeks: program.weeks,
      sessions_per_week: program.sessionsPerWeek,
      total_workouts: program.totalWorkouts,
      price_naira: program.priceNaira,
      compare_at_naira: program.compareAtNaira,
      rating: program.rating,
      review_count: program.reviewCount,
      image_url: program.image.src,
      image_alt: program.image.alt,
      outcomes: program.outcomes,
      includes: program.includes,
      coach_slug: program.coachSlug,
      featured: program.featured,
      best_seller: program.bestSeller,
      published: true,
    })),
    'slug',
  )

  await upsert(
    'program_weeks',
    PROGRAMS.flatMap((program) =>
      program.breakdown.map((week) => ({
        program_slug: program.slug,
        week_number: week.number,
        title: week.title,
        focus: week.focus,
        description: week.description,
      })),
    ),
    'program_slug,week_number',
  )

  await upsert(
    'exercises',
    EXERCISES.map((exercise) => ({
      slug: exercise.slug,
      name: exercise.name,
      muscle_group: exercise.muscleGroup,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions,
      substitutions: exercise.substitutions,
      video_url: exercise.videoUrl,
    })),
    'slug',
  )

  await upsert(
    'workouts',
    WORKOUTS.map((workout) => ({
      slug: workout.slug,
      name: workout.name,
      summary: workout.summary,
      muscle_group: workout.muscleGroup,
      equipment: workout.equipment,
      difficulty: workout.difficulty,
      duration_minutes: workout.durationMinutes,
      image_url: workout.image.src,
      image_alt: workout.image.alt,
      program_slug: workout.programSlug,
      day_number: workout.day,
      is_free: workout.isFree,
    })),
    'slug',
  )

  await upsert(
    'program_exercises',
    WORKOUTS.flatMap((workout) =>
      workout.exercises.map((item) => ({
        workout_slug: workout.slug,
        exercise_slug: item.exercise.slug,
        position: item.order,
        sets: item.sets,
        reps: item.reps,
        rest_seconds: item.restSeconds,
        notes: item.notes ?? null,
      })),
    ),
    'workout_slug,exercise_slug',
  )

  await upsert(
    'memberships',
    MEMBERSHIPS.map((plan) => ({
      slug: plan.slug,
      name: plan.name,
      price_naira: plan.priceNaira,
      summary: plan.summary,
      features: plan.features,
      highlight: plan.highlight,
      badge: plan.badge ?? null,
      active: true,
    })),
    'slug',
  )

  await upsert(
    'categories',
    CATEGORIES.map((category, index) => ({
      slug: category.slug,
      name: category.name,
      blurb: category.blurb,
      image_url: category.image.src,
      image_alt: category.image.alt,
      sort_order: index,
    })),
    'slug',
  )

  await upsert(
    'transformations',
    TRANSFORMATIONS.map((item, index) => ({
      slug: item.slug,
      name: item.name,
      age: item.age,
      starting_point: item.startingPoint,
      goal: item.goal,
      program_slug: item.programSlug,
      program_name: item.programName,
      duration: item.duration,
      result: item.result,
      quote: item.quote,
      before_url: item.before.src,
      after_url: item.after.src,
      featured: item.featured,
      published: true,
      sort_order: index,
    })),
    'slug',
  )

  // Testimonials have no natural key, so only insert them when the table is
  // empty — re-running should never duplicate the same quote six times.
  const { count } = await supabase.from('testimonials').select('id', { count: 'exact', head: true })
  if (!count) {
    const { error } = await supabase.from('testimonials').insert(
      TESTIMONIALS.map((item, index) => ({
        name: item.name,
        role: item.role,
        quote: item.quote,
        rating: item.rating,
        training_duration: item.trainingDuration,
        image_url: item.image.src,
        published: true,
        sort_order: index,
      })),
    )
    if (error) {
      console.error(`  ✗ testimonials: ${error.message}`)
      process.exitCode = 1
    } else {
      console.log(`  ✓ testimonials — ${TESTIMONIALS.length} rows`)
    }
  } else {
    console.log(`  — testimonials — skipped, ${count} rows already present`)
  }

  const { count: galleryCount } = await supabase
    .from('gym_gallery')
    .select('id', { count: 'exact', head: true })

  if (!galleryCount) {
    const { error } = await supabase.from('gym_gallery').insert(
      IMAGES.gallery.map((image, index) => ({
        image_url: image.src,
        alt_text: image.alt,
        published: true,
        sort_order: index,
      })),
    )
    if (error) {
      console.error(`  ✗ gym_gallery: ${error.message}`)
      process.exitCode = 1
    } else {
      console.log(`  ✓ gym_gallery — ${IMAGES.gallery.length} rows`)
    }
  } else {
    console.log(`  — gym_gallery — skipped, ${galleryCount} rows already present`)
  }

  console.log(
    '\nDone.\n' +
      'Next: sign up on the site, then make yourself an admin with\n' +
      "  update public.profiles set role = 'admin' where email = 'you@yourgym.com';\n",
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
