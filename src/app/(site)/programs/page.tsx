import type { Metadata } from 'next'
import { JsonLd, Section } from '@/components/ui'
import { PageHero } from '@/components/site/page-hero'
import { StickyCta } from '@/components/site/sticky-cta'
import { ProgramExplorer } from '@/components/programs/program-explorer'
import { FinalCta } from '@/components/home/final-cta'
import { getPrograms } from '@/lib/data'
import { IMAGES } from '@/lib/images'
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Online Workout Programs — Strength, Fat Loss & Muscle Building',
  description:
    'Structured online workout programs from RoadBoy Gym&Sports. Beginner strength, fat loss and conditioning, muscle building and home workout plans with progress tracking. From ₦25,000.',
  path: '/programs',
})

export const revalidate = 3600

const FAQS = [
  {
    question: 'How do I access a program after I buy it?',
    answer:
      'Your program appears in your RoadBoy dashboard immediately after payment. You can follow it on your phone in the gym, tick off sets as you go, and pick up exactly where you stopped.',
  },
  {
    question: 'Do I need a gym membership to use these programs?',
    answer:
      'No. The programs are sold separately and work anywhere. The Home Workout program needs only a pair of dumbbells, and every exercise in every program has a substitution listed.',
  },
  {
    question: 'How long do I have access?',
    answer:
      'Lifetime access, including any future updates to that program. You can re-run a block as many times as you like.',
  },
  {
    question: 'Which program should I start with?',
    answer:
      'If you are new to structured training, start with Beginner Strength or Strong Foundations. If you have trained before and want size, choose Muscle Building. If conditioning and body composition are the priority, choose Fat Loss & Conditioning.',
  },
]

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ goal?: string }>
}) {
  const [programs, params] = await Promise.all([getPrograms(), searchParams])

  return (
    <>
      <PageHero
        eyebrow="Digital workout programs"
        title="Train with a plan."
        lede="Structured training blocks written and coached by the RoadBoy team. Buy once, keep it for life, and follow it wherever you train."
        image={IMAGES.programs['muscle-building']}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Programs' }]}
      />

      <Section>
        <ProgramExplorer programs={programs} initialGoal={params.goal} />
      </Section>

      {/* FAQ — genuinely useful here, and it earns the FAQ rich result. */}
      <Section tone="coal">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-display-sm">Before you buy.</h2>
              <p className="mt-5 text-sm leading-relaxed text-ash">
                Still deciding? Message us on WhatsApp and a coach will tell you honestly which block fits — including
                if the answer is none of them yet.
              </p>
            </div>

            <dl className="lg:col-span-8">
              {FAQS.map((faq) => (
                <div key={faq.question} className="border-b border-line py-7 first:border-t">
                  <dt className="font-display text-xl leading-tight">{faq.question}</dt>
                  <dd className="mt-3 max-w-2xl text-sm leading-relaxed text-ash">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <FinalCta />

      <StickyCta href="/membership" label="Join gym" note={`Programs from ₦25,000`} secondaryLabel="Or visit us in Lekki" secondaryHref="/contact" />

      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Programs', path: '/programs' }])} />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Workout programs by ${SITE.name}`,
          numberOfItems: programs.length,
          itemListElement: programs.map((program, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE.url}/programs/${program.slug}`,
            name: program.name,
          })),
        }}
      />
    </>
  )
}
