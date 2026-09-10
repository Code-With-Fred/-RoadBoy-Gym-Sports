import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Clock, Dumbbell, Gauge } from 'lucide-react'
import { WorkoutPlayer } from '@/components/dashboard/workout-player'
import { getProgramBySlug, getWorkoutBySlug, hasPurchased } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { createClient, getUser } from '@/lib/supabase/server'
import { formatMinutes } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Workout',
  description: 'Follow your RoadBoy Gym&Sports workout.',
  path: '/dashboard/workout',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

export default async function WorkoutSessionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const user = await getUser()
  if (!user) redirect(`/login?next=/dashboard/workout/${slug}`)

  const workout = await getWorkoutBySlug(slug)
  if (!workout) notFound()

  // Free sessions are open to any signed-in member; program sessions are not.
  if (workout.programSlug && !workout.isFree) {
    const owns = await hasPurchased(user.id, workout.programSlug)
    if (!owns) redirect(`/programs/${workout.programSlug}`)
  }

  const program = workout.programSlug ? await getProgramBySlug(workout.programSlug) : undefined

  // Load any progress already saved for this session.
  const supabase = await createClient()
  const { data: progress } = supabase
    ? await supabase
        .from('workout_progress')
        .select('completed_exercise_ids, completed_at')
        .eq('user_id', user.id)
        .eq('workout_slug', workout.slug)
        .maybeSingle()
    : { data: null }

  const completedIds = Array.isArray(progress?.completed_exercise_ids)
    ? (progress.completed_exercise_ids as string[])
    : []

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <Link
        href={program ? `/dashboard/programs/${program.slug}` : '/dashboard'}
        className="inline-flex items-center gap-2 font-display text-[0.625rem] uppercase tracking-[0.16em] text-ash transition-colors hover:text-ember"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        {program ? program.name : 'Dashboard'}
      </Link>

      <header className="mt-7 border-b border-line pb-8">
        <p className="font-display text-[0.625rem] uppercase tracking-[0.2em] text-ember">
          {program ? `${program.name} · ${workout.muscleGroup}` : workout.muscleGroup}
        </p>

        <h1 className="mt-3 font-display text-display-md uppercase leading-none">{workout.name}</h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ash">{workout.summary}</p>

        <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-xs uppercase tracking-[0.14em] text-ash">
          <li className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-ember" aria-hidden />
            {formatMinutes(workout.durationMinutes)}
          </li>
          <li className="flex items-center gap-2">
            <Gauge className="h-3.5 w-3.5 text-ember" aria-hidden />
            {workout.difficulty}
          </li>
          <li className="flex items-center gap-2">
            <Dumbbell className="h-3.5 w-3.5 text-ember" aria-hidden />
            {workout.equipment}
          </li>
        </ul>
      </header>

      <div className="mt-2">
        <WorkoutPlayer
          workout={workout}
          initialCompleted={completedIds}
          alreadyFinished={Boolean(progress?.completed_at)}
        />
      </div>
    </div>
  )
}
