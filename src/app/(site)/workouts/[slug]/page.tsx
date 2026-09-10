import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lock, PlayCircle, Repeat, Timer } from 'lucide-react'
import { Badge, ButtonLink, JsonLd, MetaList, Section, SectionHeading } from '@/components/ui'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { StickyCta } from '@/components/site/sticky-cta'
import { ExerciseTable } from '@/components/workouts/exercise-table'
import { WorkoutCard } from '@/components/workouts/workout-card'
import { WORKOUTS } from '@/lib/content'
import { getProgramBySlug, getWorkoutBySlug, getWorkouts, hasPurchased } from '@/lib/data'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import { getUser } from '@/lib/supabase/server'
import { formatMinutes } from '@/lib/utils'

export const revalidate = 3600

export function generateStaticParams() {
  return WORKOUTS.filter((workout) => workout.isFree).map((workout) => ({ slug: workout.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const workout = await getWorkoutBySlug(slug)
  if (!workout) return buildMetadata({ title: 'Workout not found', description: '', path: `/workouts/${slug}`, noIndex: true })

  return buildMetadata({
    title: `${workout.name} — ${workout.muscleGroup} Workout`,
    description: `${workout.summary} ${formatMinutes(workout.durationMinutes)}, ${workout.difficulty} level, ${workout.equipment}.`,
    path: `/workouts/${workout.slug}`,
    image: workout.image.src,
    type: 'article',
    // Program sessions are paywalled, so keep them out of the index.
    noIndex: !workout.isFree,
  })
}

export default async function WorkoutDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workout = await getWorkoutBySlug(slug)
  if (!workout) notFound()

  // Free sessions are open. Program sessions need a purchase.
  let unlocked = workout.isFree
  if (!unlocked && workout.programSlug) {
    const user = await getUser()
    if (user) unlocked = await hasPurchased(user.id, workout.programSlug)
  }

  const program = workout.programSlug ? await getProgramBySlug(workout.programSlug) : undefined
  const all = await getWorkouts()
  const related = all
    .filter((item) => item.slug !== workout.slug && item.isFree && item.muscleGroup === workout.muscleGroup)
    .slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow={`${workout.muscleGroup} · ${workout.difficulty}`}
        title={workout.name}
        lede={workout.summary}
        image={workout.image}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Workouts', href: '/workouts' },
          { label: workout.name },
        ]}
        size="sm"
      >
        <MetaList
          items={[
            formatMinutes(workout.durationMinutes),
            `${workout.exercises.length} exercises`,
            workout.equipment,
            workout.isFree ? 'Free session' : 'Program session',
          ]}
        />
      </PageHero>

      <Section className="!pt-14">
        <div className="container">
          {unlocked ? (
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <h2 className="text-display-sm">The session.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">
                  Warm up for eight to ten minutes first — five minutes easy on a bike or rower, then a few light sets
                  of the first movement. Cool down with five minutes of easy breathing and the stretches you need.
                </p>

                <ExerciseTable workout={workout} className="mt-10" />

                {/* Coaching cues, per exercise */}
                <h2 className="mt-16 text-display-sm">How to perform each movement.</h2>
                <ul className="mt-8 space-y-px">
                  {workout.exercises.map((item) => (
                    <Reveal as="li" key={item.exercise.id} className="border border-line bg-coal p-6 md:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl leading-none">{item.exercise.name}</h3>
                          <p className="mt-2.5 text-xs uppercase tracking-[0.14em] text-slate2">
                            {item.exercise.muscleGroup} · {item.exercise.equipment} · {item.exercise.difficulty}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge tone="outline">
                            <Repeat className="h-3 w-3" aria-hidden />
                            {item.sets} × {item.reps}
                          </Badge>
                          <Badge tone="outline">
                            <Timer className="h-3 w-3" aria-hidden />
                            {item.restSeconds}s rest
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        {/* Video slot — swap the placeholder for the gym's clip. */}
                        <div className="relative flex aspect-video items-center justify-center border border-line bg-ink">
                          {item.exercise.videoUrl ? (
                            <video
                              src={item.exercise.videoUrl}
                              controls
                              preload="none"
                              className="h-full w-full object-cover"
                              aria-label={`${item.exercise.name} demonstration`}
                            />
                          ) : (
                            <div className="text-center">
                              <PlayCircle className="mx-auto h-9 w-9 text-slate2" aria-hidden />
                              <p className="mt-3 font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
                                Demonstration coming soon
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <ol className="space-y-2.5">
                            {item.exercise.instructions.map((line, index) => (
                              <li key={line} className="flex gap-3 text-sm leading-relaxed text-ash">
                                <span className="font-display text-xs text-ember">{index + 1}</span>
                                {line}
                              </li>
                            ))}
                          </ol>

                          {item.exercise.substitutions.length ? (
                            <p className="mt-5 border-t border-line pt-4 text-xs text-slate2">
                              <span className="font-display uppercase tracking-[0.16em]">Swap for: </span>
                              {item.exercise.substitutions.join(' · ')}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>

              {/* Aside */}
              <aside className="lg:col-span-4">
                <div className="sticky top-28 space-y-4">
                  <div className="border border-line bg-steel p-7">
                    <h2 className="font-display text-lg uppercase leading-none">Track this workout</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ash">
                      Members tick off each set as they go and the dashboard remembers where they stopped.
                    </p>
                    <ButtonLink href="/dashboard" size="lg" className="mt-6 w-full">
                      Open dashboard
                    </ButtonLink>
                  </div>

                  {program ? (
                    <div className="border border-line bg-steel p-7">
                      <p className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
                        Part of
                      </p>
                      <h2 className="mt-2 font-display text-xl uppercase leading-none">{program.name}</h2>
                      <p className="mt-3 text-sm text-ash">
                        {program.weeks} weeks · {program.totalWorkouts} workouts
                      </p>
                      <ButtonLink href={`/programs/${program.slug}`} variant="outline" className="mt-6 w-full">
                        View program
                      </ButtonLink>
                    </div>
                  ) : null}
                </div>
              </aside>
            </div>
          ) : (
            /* Locked state */
            <div className="mx-auto max-w-2xl border border-line bg-steel p-10 text-center md:p-14">
              <span className="mx-auto flex h-14 w-14 items-center justify-center border border-line text-ember">
                <Lock className="h-6 w-6" aria-hidden />
              </span>

              <h2 className="mt-8 text-display-sm">This session comes with the program.</h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ash">
                {workout.name} is part of {program?.name ?? 'a RoadBoy training program'}. Buy the program once and
                every session in it unlocks in your dashboard for good.
              </p>

              {program ? (
                <>
                  <p className="mt-8 font-display text-4xl text-ember">
                    ₦{program.priceNaira.toLocaleString('en-NG')}
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <ButtonLink href={`/checkout/${program.slug}`} size="lg">
                      Buy {program.name}
                    </ButtonLink>
                    <ButtonLink href={`/programs/${program.slug}`} variant="outline" size="lg">
                      See what is included
                    </ButtonLink>
                  </div>
                </>
              ) : null}

              <p className="mt-8 text-xs text-slate2">
                Already bought it?{' '}
                <Link href="/login" className="text-ember link-underline">
                  Log in
                </Link>{' '}
                to unlock this session.
              </p>
            </div>
          )}
        </div>
      </Section>

      {related.length ? (
        <Section tone="coal">
          <div className="container">
            <SectionHeading eyebrow="More like this" title={`More ${workout.muscleGroup.toLowerCase()} sessions.`} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal as="li" key={item.slug} delay={index * 70}>
                  <WorkoutCard workout={item} />
                </Reveal>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {!unlocked && program ? (
        <StickyCta
          href={`/checkout/${program.slug}`}
          label="Unlock"
          note={`${program.name} · ₦${program.priceNaira.toLocaleString('en-NG')}`}
        />
      ) : null}

      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Workouts', path: '/workouts' },
          { name: workout.name, path: `/workouts/${workout.slug}` },
        ])}
      />
    </>
  )
}
