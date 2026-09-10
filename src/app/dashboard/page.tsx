import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, CalendarDays, Clock, Flame, Play } from 'lucide-react'
import { Badge, ButtonLink } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import { EmptyState, PanelHeader, ProgressBar, ProgressRing, StatTile } from '@/components/dashboard/ui'
import { getProfile, getPrograms, getUserPrograms } from '@/lib/data'
import { computeProgress, sortByActivity } from '@/lib/progress'
import { buildMetadata } from '@/lib/seo'
import { getUser } from '@/lib/supabase/server'
import { formatMinutes } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'My dashboard',
  description: 'Your RoadBoy Gym&Sports programs and training progress.',
  path: '/dashboard',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login?next=/dashboard')

  const [profile, programs, records] = await Promise.all([
    getProfile(user.id),
    getPrograms(),
    getUserPrograms(user.id),
  ])

  const owned = sortByActivity(
    records
      .map((record) => {
        const program = programs.find((item) => item.slug === record.programSlug)
        return program ? computeProgress(program, record) : null
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
  )

  const current = owned[0]
  const firstName =
    (typeof profile?.full_name === 'string' ? profile.full_name.split(' ')[0] : '') || user.email?.split('@')[0] || 'there'

  const totalSessions = owned.reduce((sum, item) => sum + item.completed, 0)
  const activePrograms = owned.filter((item) => !item.isComplete).length

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${firstName}.`}
        lede={
          current
            ? 'Pick up where you left off. Your next session is ready below.'
            : 'You have no active program yet. Browse the store and start one today.'
        }
        action={
          <ButtonLink href="/programs" variant="outline">
            Browse programs
          </ButtonLink>
        }
      />

      {current ? (
        <>
          {/* Current program */}
          <section className="mt-10" aria-labelledby="current-program">
            <h2 id="current-program" className="sr-only">
              Current program
            </h2>

            <div className="grid gap-px border border-line bg-line lg:grid-cols-3">
              {/* Progress */}
              <div className="flex flex-col items-center justify-center bg-steel p-8 text-center">
                <ProgressRing value={current.percent}>
                  <span className="font-display text-4xl leading-none text-bone">{current.percent}%</span>
                  <span className="mt-1.5 font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2">
                    Complete
                  </span>
                </ProgressRing>

                <p className="mt-6 font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
                  Week {current.currentWeek} of {current.program.weeks}
                </p>
                <p className="mt-2 text-sm text-ash">
                  {current.completed} of {current.total} workouts done
                </p>
              </div>

              {/* Program */}
              <div className="relative flex flex-col justify-end overflow-hidden bg-steel p-8 lg:col-span-2">
                <div className="absolute inset-0">
                  <SmartImage src={current.program.image.src} alt="" width={1200} quality={65} sizes="66vw" />
                  <div className="absolute inset-0 bg-ink/82" />
                </div>

                <div className="relative">
                  <Badge tone="ember">Current program</Badge>
                  <h3 className="mt-5 font-display text-display-sm uppercase leading-none">
                    {current.program.name}
                  </h3>
                  <p className="mt-3 text-sm text-ash">
                    {current.program.weeks} weeks · {current.program.sessionsPerWeek} sessions a week ·{' '}
                    {current.program.difficulty}
                  </p>

                  <ProgressBar value={current.percent} className="mt-7 max-w-md" />

                  <div className="mt-8 flex flex-wrap gap-3">
                    {current.nextWorkout ? (
                      <ButtonLink href={`/dashboard/workout/${current.nextWorkout.slug}`} size="lg">
                        <Play className="h-4 w-4" aria-hidden />
                        Start workout
                      </ButtonLink>
                    ) : null}
                    <ButtonLink href={`/dashboard/programs/${current.program.slug}`} variant="outline" size="lg">
                      View program
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Next session */}
          {current.nextWorkout ? (
            <section className="mt-4" aria-labelledby="next-workout">
              <div className="border border-line bg-steel p-8">
                <h2 id="next-workout" className="font-display text-[0.625rem] uppercase tracking-[0.2em] text-ember">
                  Next workout
                </h2>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none">{current.nextWorkout.name}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash">{current.nextWorkout.summary}</p>

                    <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.14em] text-ash">
                      <li className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-ember" aria-hidden />
                        {formatMinutes(current.nextWorkout.durationMinutes)}
                      </li>
                      <li className="flex items-center gap-2">
                        <Flame className="h-3.5 w-3.5 text-ember" aria-hidden />
                        {current.nextWorkout.exercises.length} exercises
                      </li>
                      <li className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-ember" aria-hidden />
                        Week {current.currentWeek}, day {current.dayOfWeek}
                      </li>
                    </ul>
                  </div>

                  <ButtonLink href={`/dashboard/workout/${current.nextWorkout.slug}`} size="lg">
                    Start workout
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </ButtonLink>
                </div>
              </div>
            </section>
          ) : null}

          {/* Stats */}
          <section className="mt-4 grid gap-4 sm:grid-cols-3" aria-label="Training summary">
            <StatTile label="Workouts completed" value={totalSessions} hint="Across all your programs" />
            <StatTile label="Active programs" value={activePrograms} hint={`${owned.length} owned in total`} />
            <StatTile
              label="Current streak"
              value={`Week ${current.currentWeek}`}
              hint={`${current.program.weeks - current.currentWeek} weeks to go`}
            />
          </section>

          {/* Library */}
          {owned.length > 1 ? (
            <section className="mt-14" aria-labelledby="my-programs">
              <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
                <h2 id="my-programs" className="font-display text-xl uppercase leading-none">
                  My programs
                </h2>
                <Link
                  href="/dashboard/programs"
                  className="font-display text-[0.625rem] uppercase tracking-[0.16em] text-ash link-underline hover:text-ember"
                >
                  See all
                </Link>
              </div>

              <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {owned.slice(1).map((item) => (
                  <li key={item.program.slug}>
                    <Link
                      href={`/dashboard/programs/${item.program.slug}`}
                      className="group flex h-full flex-col border border-line bg-steel transition-colors hover:border-white/25"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <SmartImage src={item.program.image.src} alt="" width={700} zoom sizes="33vw" />
                        <div className="absolute inset-0 overlay-bottom" />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display text-xl uppercase leading-none transition-colors group-hover:text-ember">
                          {item.program.name}
                        </h3>
                        <p className="mt-2 text-xs text-ash">
                          Week {item.currentWeek} of {item.program.weeks}
                        </p>
                        <ProgressBar value={item.percent} className="mt-auto pt-6" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No programs yet"
            body="Once you buy a program it appears here with week-by-week workouts and progress tracking. Every plan is a one-off payment with lifetime access."
            action={
              <ButtonLink href="/programs" size="lg">
                Browse the store
              </ButtonLink>
            }
          />
        </div>
      )}
    </div>
  )
}
