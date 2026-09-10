import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Check, Clock, Play } from 'lucide-react'
import { Badge, ButtonLink } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import { PanelHeader, ProgressBar, ProgressRing, StatTile } from '@/components/dashboard/ui'
import { getProgramBySlug, getUserPrograms, hasPurchased } from '@/lib/data'
import { computeProgress } from '@/lib/progress'
import { buildMetadata } from '@/lib/seo'
import { getUser } from '@/lib/supabase/server'
import { cn, formatMinutes } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Program',
  description: 'Your RoadBoy Gym&Sports program.',
  path: '/dashboard/programs',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

export default async function DashboardProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const user = await getUser()
  if (!user) redirect(`/login?next=/dashboard/programs/${slug}`)

  const program = await getProgramBySlug(slug)
  if (!program) notFound()

  const owns = await hasPurchased(user.id, program.slug)
  if (!owns) redirect(`/programs/${program.slug}`)

  const records = await getUserPrograms(user.id)
  const record = records.find((item) => item.programSlug === program.slug)
  const progress = computeProgress(program, record)
  const doneSlugs = new Set(record?.completedWorkoutSlugs ?? [])

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <Link
        href="/dashboard/programs"
        className="inline-flex items-center gap-2 font-display text-[0.625rem] uppercase tracking-[0.16em] text-ash transition-colors hover:text-ember"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        My programs
      </Link>

      <div className="mt-7">
        <PanelHeader
          eyebrow={`${program.goal} · ${program.difficulty}`}
          title={program.name}
          lede={program.tagline}
          action={
            progress.nextWorkout ? (
              <ButtonLink href={`/dashboard/workout/${progress.nextWorkout.slug}`} size="lg">
                <Play className="h-4 w-4" aria-hidden />
                Continue
              </ButtonLink>
            ) : (
              <Badge tone="success">Program complete</Badge>
            )
          }
        />
      </div>

      {/* Progress summary */}
      <section className="mt-10 grid gap-px border border-line bg-line lg:grid-cols-3" aria-label="Progress">
        <div className="flex items-center gap-7 bg-steel p-8">
          <ProgressRing value={progress.percent} size={112}>
            <span className="font-display text-3xl leading-none">{progress.percent}%</span>
          </ProgressRing>
          <div>
            <p className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">Overall progress</p>
            <p className="mt-2 font-display text-2xl leading-none">
              Week {progress.currentWeek}
              <span className="text-ash"> / {program.weeks}</span>
            </p>
            <p className="mt-2 text-sm text-ash">
              {progress.completed} of {progress.total} workouts
            </p>
          </div>
        </div>

        <div className="relative flex flex-col justify-end overflow-hidden bg-steel p-8 lg:col-span-2">
          <div className="absolute inset-0">
            <SmartImage src={program.image.src} alt="" width={1200} quality={65} sizes="66vw" />
            <div className="absolute inset-0 bg-ink/85" />
          </div>
          <div className="relative">
            <p className="max-w-xl text-sm leading-relaxed text-ash">{program.description}</p>
            <ProgressBar value={progress.percent} className="mt-7 max-w-md" label="Completed" />
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-3" aria-label="Program facts">
        <StatTile label="This week" value={`Day ${progress.dayOfWeek}`} hint={`of ${program.sessionsPerWeek} sessions`} />
        <StatTile label="Workouts left" value={progress.total - progress.completed} hint="Across the whole block" />
        <StatTile label="Equipment" value={program.equipment} hint="Substitutions listed per exercise" />
      </section>

      {/* Sessions */}
      <section className="mt-14" aria-labelledby="sessions">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
          <h2 id="sessions" className="font-display text-xl uppercase leading-none">
            This week&rsquo;s sessions
          </h2>
          <p className="font-display text-[0.625rem] uppercase tracking-[0.16em] text-slate2">
            Week {progress.currentWeek} · {program.breakdown[progress.currentWeek - 1]?.title}
          </p>
        </div>

        <ol className="mt-6 space-y-3">
          {progress.sessions.map((workout, index) => {
            const done = doneSlugs.has(workout.slug)
            const isNext = progress.nextWorkout?.slug === workout.slug

            return (
              <li
                key={workout.slug}
                className={cn(
                  'border transition-colors',
                  isNext ? 'border-ember bg-ember-ghost' : 'border-line bg-steel hover:border-white/20',
                )}
              >
                <Link href={`/dashboard/workout/${workout.slug}`} className="flex flex-wrap items-center gap-5 p-6">
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center border font-display text-sm',
                      done ? 'border-ember bg-ember text-ink' : 'border-line text-ash',
                    )}
                  >
                    {done ? <Check className="h-5 w-5" aria-hidden /> : String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2">
                      Day {index + 1}
                      {isNext ? <span className="ml-2 text-ember">Up next</span> : null}
                    </span>
                    <span className="mt-1.5 block font-display text-xl uppercase leading-none">{workout.name}</span>
                    <span className="mt-2 block text-xs text-ash">{workout.summary}</span>
                  </span>

                  <span className="flex shrink-0 items-center gap-5">
                    <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-ash">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {formatMinutes(workout.durationMinutes)}
                    </span>
                    <span className="font-display text-[0.625rem] uppercase tracking-[0.16em] text-ember">
                      {done ? 'Repeat' : 'Start'}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      {/* Full plan */}
      <section className="mt-14" aria-labelledby="full-plan">
        <h2 id="full-plan" className="border-b border-line pb-5 font-display text-xl uppercase leading-none">
          The full block
        </h2>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {program.breakdown.map((week) => {
            const state =
              week.number < progress.currentWeek ? 'done' : week.number === progress.currentWeek ? 'current' : 'todo'
            return (
              <li
                key={week.number}
                className={cn(
                  'border p-5',
                  state === 'current' ? 'border-ember bg-ember-ghost' : 'border-line bg-steel',
                  state === 'done' && 'opacity-60',
                )}
              >
                <p className="font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2">
                  Week {week.number}
                </p>
                <p className="mt-2 font-display text-lg uppercase leading-none">{week.title}</p>
                <p className="mt-2 text-xs text-ash">{week.focus}</p>
                {state === 'done' ? (
                  <p className="mt-3 flex items-center gap-1.5 text-[0.625rem] uppercase tracking-[0.14em] text-ember">
                    <Check className="h-3 w-3" aria-hidden />
                    Complete
                  </p>
                ) : null}
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
