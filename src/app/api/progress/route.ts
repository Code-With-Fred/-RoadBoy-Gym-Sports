import { NextResponse } from 'next/server'
import { WORKOUT_BY_SLUG } from '@/lib/content'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Saves workout progress.
 *
 * Ownership is enforced twice: this handler refuses to write progress for a
 * program the caller has not bought, and Row Level Security refuses the insert
 * regardless. The API check exists so the user gets a clear 403 instead of an
 * opaque database error.
 */
export async function POST(request: Request) {
  let body: {
    workoutSlug?: string
    completedExerciseIds?: string[]
    finished?: boolean
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const workout = body.workoutSlug ? WORKOUT_BY_SLUG[body.workoutSlug] : undefined
  if (!workout) return NextResponse.json({ error: 'Unknown workout.' }, { status: 404 })

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Backend not configured.' }, { status: 503 })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  if (workout.programSlug) {
    const { data: entitlement } = await supabase
      .from('user_programs')
      .select('id')
      .eq('user_id', user.id)
      .eq('program_slug', workout.programSlug)
      .maybeSingle()

    if (!entitlement) {
      return NextResponse.json({ error: 'You do not have access to this program.' }, { status: 403 })
    }
  }

  // Only keep ids that actually belong to this session.
  const valid = new Set(workout.exercises.map((item) => item.exercise.id))
  const completedExerciseIds = (body.completedExerciseIds ?? []).filter((id) => valid.has(id))

  const { error } = await supabase.from('workout_progress').upsert(
    {
      user_id: user.id,
      program_slug: workout.programSlug,
      workout_slug: workout.slug,
      completed_exercise_ids: completedExerciseIds,
      completed_at: body.finished ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,workout_slug' },
  )

  if (error) {
    console.error('[progress] upsert failed:', error.message)
    return NextResponse.json({ error: 'Could not save your progress.' }, { status: 500 })
  }

  // Finishing a session may push the member into the next week.
  if (body.finished && workout.programSlug) {
    const { count } = await supabase
      .from('workout_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('program_slug', workout.programSlug)
      .not('completed_at', 'is', null)

    if (typeof count === 'number') {
      const { data: program } = await supabase
        .from('programs')
        .select('sessions_per_week, weeks')
        .eq('slug', workout.programSlug)
        .maybeSingle()

      const perWeek = program?.sessions_per_week ?? 3
      const weeks = program?.weeks ?? 4
      const currentWeek = Math.min(Math.floor(count / perWeek) + 1, weeks)

      await supabase
        .from('user_programs')
        .update({ current_week: currentWeek, last_trained_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('program_slug', workout.programSlug)
    }
  }

  return NextResponse.json({ ok: true })
}
