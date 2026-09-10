import type { Metadata } from 'next'
import { JsonLd, Section } from '@/components/ui'
import { PageHero } from '@/components/site/page-hero'
import { WorkoutLibrary } from '@/components/workouts/workout-library'
import { FinalCta } from '@/components/home/final-cta'
import { getWorkouts } from '@/lib/data'
import { IMAGES } from '@/lib/images'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Workout Library — Free Gym & Home Workouts',
  description:
    'Search the RoadBoy Gym&Sports workout library. Free full body, chest, back, leg, HIIT and core sessions with sets, reps, rest periods and coaching cues for every exercise.',
  path: '/workouts',
})

export const revalidate = 3600

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ muscle?: string }>
}) {
  const [workouts, params] = await Promise.all([getWorkouts(), searchParams])

  return (
    <>
      <PageHero
        eyebrow="Workout library"
        title="Find a session. Start today."
        lede="Every session below lists sets, reps, rest and coaching cues. The free ones need no account at all — the rest come with their program."
        image={IMAGES.workouts.fullBody}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Workouts' }]}
        size="sm"
      />

      <Section className="!pt-14">
        <WorkoutLibrary workouts={workouts} initialMuscle={params.muscle} />
      </Section>

      <FinalCta />

      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Workouts', path: '/workouts' }])} />
    </>
  )
}
