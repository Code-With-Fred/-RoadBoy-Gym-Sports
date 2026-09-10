import type { Metadata } from 'next'
import { JsonLd, Section, SectionHeading } from '@/components/ui'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { TransformationCard } from '@/components/transformations/transformation-card'
import { TestimonialCarousel } from '@/components/home/testimonials'
import { FinalCta } from '@/components/home/final-cta'
import { getTestimonials, getTransformations } from '@/lib/data'
import { IMAGES } from '@/lib/images'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Member Transformations & Results',
  description:
    'Real RoadBoy Gym&Sports member results — the programs they ran, how long it took and what actually changed. Honest timelines, no unrealistic claims.',
  path: '/transformations',
})

export const revalidate = 3600

export default async function TransformationsPage() {
  const [transformations, testimonials] = await Promise.all([getTransformations(), getTestimonials()])

  return (
    <>
      <PageHero
        eyebrow="Member results"
        title="Results speak louder."
        lede="Every person here followed a plan and turned up when they did not feel like it. The programs are listed so you can see exactly what they ran."
        image={IMAGES.transformations.afterA}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Transformations' }]}
      />

      <Section>
        <div className="container">
          <ul className="grid gap-4 md:grid-cols-2">
            {transformations.map((item, index) => (
              <Reveal as="li" key={item.id} delay={(index % 2) * 80}>
                <TransformationCard item={item} detailed />
              </Reveal>
            ))}
          </ul>

          {/* An honest note rather than a disclaimer buried in the footer. */}
          <Reveal className="mx-auto mt-16 max-w-3xl border border-line bg-steel p-8 md:p-10">
            <h2 className="font-display text-xl uppercase leading-none">About these results</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-ash">
              <p>
                These are individual results from members who consented to sharing them, alongside the program they
                followed and how long it took. They are not typical, guaranteed or predictive — training outcomes
                depend on your starting point, your consistency, your sleep, your nutrition and your health.
              </p>
              <p>
                We do not make medical claims and we do not sell before-and-after photos as a promise. If you have an
                existing condition or injury, speak to your doctor before starting any program — and tell your coach,
                so the plan can be adjusted properly.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="coal" className="overflow-hidden">
        <div className="container">
          <SectionHeading eyebrow="In their words" title="What members say." />
        </div>
        <div className="container mt-12">
          <TestimonialCarousel items={testimonials} />
        </div>
      </Section>

      <FinalCta />

      <JsonLd
        data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Transformations', path: '/transformations' }])}
      />
    </>
  )
}
