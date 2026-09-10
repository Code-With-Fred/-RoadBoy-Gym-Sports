import type { Metadata } from 'next'
import { JsonLd, Section, SectionHeading } from '@/components/ui'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { TrainerCard } from '@/components/trainers/trainer-card'
import { FinalCta } from '@/components/home/final-cta'
import { getTrainers } from '@/lib/data'
import { IMAGES } from '@/lib/images'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Personal Trainers & Coaches in Lekki, Lagos',
  description:
    'Meet the RoadBoy Gym&Sports coaching team — accredited strength, conditioning, performance and nutrition coaches in Lekki, Lagos. Book a personal training session.',
  path: '/trainers',
})

export const revalidate = 3600

export default async function TrainersPage() {
  const trainers = await getTrainers()

  return (
    <>
      <PageHero
        eyebrow="The coaching team"
        title="Coached by people who compete."
        lede="Every coach on our floor holds a recognised strength and conditioning qualification. Most of them still train for something."
        image={IMAGES.coaching}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Trainers' }]}
      />

      <Section>
        <div className="container">
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {trainers.map((trainer, index) => (
              <Reveal as="li" key={trainer.slug} delay={(index % 3) * 70}>
                <TrainerCard trainer={trainer} priority={index < 3} />
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="coal">
        <div className="container">
          <SectionHeading
            eyebrow="Personal training"
            title="Work with one of them directly."
            lede="Sessions run sixty minutes and are booked straight with your coach. Included on Premium membership, or bought as a block of five or ten."
            align="center"
          />
        </div>
      </Section>

      <FinalCta />

      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Trainers', path: '/trainers' }])} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Coaches at ${SITE.name}`,
          itemListElement: trainers.map((trainer, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE.url}/trainers/${trainer.slug}`,
            name: trainer.name,
          })),
        }}
      />
    </>
  )
}
