import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Dumbbell, Play, ShieldCheck, Target } from 'lucide-react'
import { Badge, ButtonLink, JsonLd, MetaList, Price, Rating, Section, SectionHeading } from '@/components/ui'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { StickyCta } from '@/components/site/sticky-cta'
import { ProgramBreakdown } from '@/components/programs/program-breakdown'
import { ProgramCard } from '@/components/programs/program-card'
import { ExerciseTable } from '@/components/workouts/exercise-table'
import { PROGRAMS, workoutsForProgram } from '@/lib/content'
import { getProgramBySlug, getPrograms, getTrainers } from '@/lib/data'
import { breadcrumbSchema, buildMetadata, programSchema } from '@/lib/seo'
import { formatMinutes } from '@/lib/utils'

export const revalidate = 3600

export function generateStaticParams() {
  return PROGRAMS.map((program) => ({ slug: program.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) return buildMetadata({ title: 'Program not found', description: '', path: `/programs/${slug}`, noIndex: true })

  return buildMetadata({
    title: `${program.name} — ${program.weeks} Week Workout Program`,
    description: `${program.tagline} ${program.sessionsPerWeek} sessions a week for ${program.weeks} weeks, with progress tracking and exercise demonstrations. ₦${program.priceNaira.toLocaleString('en-NG')}.`,
    path: `/programs/${program.slug}`,
    image: program.image.src,
    type: 'article',
  })
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) notFound()

  const [allPrograms, trainers] = await Promise.all([getPrograms(), getTrainers()])
  const coach = trainers.find((trainer) => trainer.slug === program.coachSlug)
  const sessions = workoutsForProgram(program.slug)
  const sample = sessions[0]
  const related = allPrograms.filter((item) => item.slug !== program.slug).slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow={`${program.goal} · ${program.difficulty}`}
        title={program.name}
        lede={program.tagline}
        image={program.image}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Programs', href: '/programs' },
          { label: program.name },
        ]}
      />

      {/* Buy panel */}
      <Section className="!pt-14">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <MetaList
                items={[
                  `${program.weeks} weeks`,
                  `${program.sessionsPerWeek} / week`,
                  `${program.totalWorkouts} workouts`,
                  program.difficulty,
                  program.equipment,
                ]}
              />

              <div className="mt-8 space-y-5 text-lede text-ash text-pretty">
                <p>{program.description}</p>
              </div>

              {coach ? (
                <Link
                  href={`/trainers/${coach.slug}`}
                  className="group mt-10 flex items-center gap-5 border border-line bg-steel p-5 transition-colors hover:border-white/25"
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden">
                    <SmartImage src={coach.image.src} alt="" width={200} sizes="64px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
                      Written and coached by
                    </span>
                    <span className="mt-1.5 block font-display text-lg uppercase leading-none transition-colors group-hover:text-ember">
                      {coach.name}
                    </span>
                    <span className="mt-1.5 block text-xs text-ash">
                      {coach.role} · {coach.yearsExperience} years experience
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ash transition-transform group-hover:translate-x-1 group-hover:text-ember" aria-hidden />
                </Link>
              ) : null}
            </div>

            {/* Sticky purchase card */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 border border-line bg-steel">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SmartImage src={program.image.src} alt={program.image.alt} width={900} sizes="(max-width: 1024px) 100vw, 40vw" />
                  <div className="absolute inset-0 overlay-bottom" />
                  {program.bestSeller ? (
                    <Badge tone="ember" className="absolute left-4 top-4">
                      Best seller
                    </Badge>
                  ) : null}
                </div>

                <div className="p-7">
                  <Rating value={program.rating} count={program.reviewCount} size="md" />

                  <Price naira={program.priceNaira} compareAt={program.compareAtNaira} size="lg" className="mt-5" />
                  <p className="mt-2 text-xs text-slate2">One-off payment · Lifetime access · No subscription</p>

                  <ButtonLink href={`/checkout/${program.slug}`} size="lg" className="mt-7 w-full">
                    Buy this program
                  </ButtonLink>

                  <ul className="mt-7 space-y-3 border-t border-line pt-6 text-sm">
                    {[
                      { icon: Target, text: `${program.totalWorkouts} structured workouts` },
                      { icon: Dumbbell, text: `Equipment: ${program.equipment}` },
                      { icon: Play, text: 'Demonstrations for every exercise' },
                      { icon: ShieldCheck, text: 'Secure payment via Paystack' },
                    ].map((row) => (
                      <li key={row.text} className="flex items-center gap-3 text-ash">
                        <row.icon className="h-4 w-4 shrink-0 text-ember" aria-hidden />
                        {row.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Outcomes + includes */}
      <Section tone="coal">
        <div className="container grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="text-display-sm">What you will achieve.</h2>
            <ul className="mt-8 space-y-5">
              {program.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-4 border-b border-line pb-5 text-ash">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-ember" aria-hidden />
                  <span className="text-base leading-relaxed">{outcome}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-display-sm">What is included.</h2>
            <ul className="mt-8 grid gap-px border-l border-t border-line">
              {program.includes.map((item) => (
                <li key={item} className="border-b border-r border-line px-5 py-4 text-sm text-ash">
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm leading-relaxed text-slate2">
              Not sure this is the right block for you? Message a coach on WhatsApp before you buy — we would rather
              point you at the right plan than sell you the wrong one.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Week by week */}
      <Section>
        <div className="container">
          <SectionHeading
            eyebrow="Program breakdown"
            title="Week by week."
            lede="Every phase, what changes in it, and the sessions you will run that week."
          />
          <div className="mt-12">
            <ProgramBreakdown weeks={program.breakdown} workouts={sessions} />
          </div>
        </div>
      </Section>

      {/* Sample session */}
      {sample ? (
        <Section tone="coal">
          <div className="container">
            <SectionHeading
              eyebrow="Sample workout"
              title="See a real session."
              lede="This is Day 1 of the program, exactly as it appears in your dashboard — sets, reps, rest and coaching notes."
            />

            <Reveal className="mt-12 border border-line bg-ink p-6 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-5 border-b border-line pb-6">
                <div>
                  <p className="font-display text-[0.625rem] uppercase tracking-[0.2em] text-ember">Day 1</p>
                  <h3 className="mt-3 font-display text-3xl leading-none">{sample.name}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash">{sample.summary}</p>
                </div>
                <MetaList
                  items={[formatMinutes(sample.durationMinutes), sample.difficulty, `${sample.exercises.length} exercises`]}
                />
              </div>

              <ExerciseTable workout={sample} className="mt-8" />

              <div className="mt-10 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-ash">
                  The other {program.totalWorkouts - 1} sessions unlock the moment you buy.
                </p>
                <ButtonLink href={`/checkout/${program.slug}`}>Buy this program</ButtonLink>
              </div>
            </Reveal>
          </div>
        </Section>
      ) : null}

      {/* Related */}
      <Section>
        <div className="container">
          <SectionHeading
            eyebrow="Other programs"
            title="Not quite right?"
            action={
              <ButtonLink href="/programs" variant="outline" className="hidden md:inline-flex">
                View all programs
              </ButtonLink>
            }
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal as="li" key={item.slug} delay={index * 70}>
                <ProgramCard program={item} />
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <StickyCta
        href={`/checkout/${program.slug}`}
        label="Buy program"
        note={`${program.name} · ₦${program.priceNaira.toLocaleString('en-NG')}`}
      />

      <JsonLd data={programSchema(program)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Programs', path: '/programs' },
          { name: program.name, path: `/programs/${program.slug}` },
        ])}
      />
    </>
  )
}
