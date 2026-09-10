import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { JsonLd, Ordinal, Section, SectionHeading } from '@/components/ui'
import { Gallery } from '@/components/site/gallery'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { FinalCta } from '@/components/home/final-cta'
import { getFacilities, getGallery } from '@/lib/data'
import { IMAGES } from '@/lib/images'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Gym Facilities in Lekki — Strength Hall, Cardio & Recovery',
  description:
    'Inside RoadBoy Gym&Sports Lekki: eight lifting platforms, a full dumbbell rack to 60kg, a 20m turf sprint lane, Concept2 rowers, private changing rooms and a dedicated recovery area.',
  path: '/facilities',
})

export const revalidate = 3600

export default async function FacilitiesPage() {
  const [facilities, gallery] = await Promise.all([getFacilities(), getGallery()])

  return (
    <>
      <PageHero
        eyebrow="The facility"
        title="Built for training. Not for photos."
        lede="Twelve hundred square metres in Lekki Phase 1, laid out by people who train — enough space between the racks that nobody is waiting on anyone."
        image={IMAGES.facilities.strength}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Facilities' }]}
      />

      {/* Alternating editorial rows */}
      <Section>
        <div className="container space-y-20 md:space-y-28">
          {facilities.map((facility, index) => {
            const flipped = index % 2 === 1
            return (
              <Reveal key={facility.slug}>
                <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                  <div className={cn('lg:col-span-7', flipped && 'lg:order-2')}>
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <SmartImage
                        src={facility.image.src}
                        alt={facility.image.alt}
                        width={1400}
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />
                    </div>
                  </div>

                  <div className={cn('lg:col-span-5', flipped && 'lg:order-1')}>
                    <Ordinal index={index + 1} />
                    <h2 className="mt-5 text-display-sm">{facility.name}</h2>
                    <p className="mt-4 font-display text-xl uppercase leading-tight text-ember">
                      {facility.headline}
                    </p>
                    <p className="mt-5 text-base leading-relaxed text-ash">{facility.description}</p>

                    <ul className="mt-8 space-y-3">
                      {facility.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-ash">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* Gallery */}
      <Section tone="coal">
        <div className="container">
          <SectionHeading eyebrow="Gallery" title="Have a look around." />
        </div>
        <Reveal className="container mt-12">
          <Gallery items={gallery} />
        </Reveal>
      </Section>

      {/* Practical info */}
      <Section>
        <div className="container">
          <SectionHeading eyebrow="Visiting" title="Getting here." />

          <dl className="mt-12 grid gap-px border-l border-t border-line md:grid-cols-3">
            <div className="border-b border-r border-line p-8">
              <dt className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">Address</dt>
              <dd className="mt-3 text-base leading-relaxed text-ash">
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.city}, {SITE.address.countryName}
              </dd>
            </div>
            <div className="border-b border-r border-line p-8">
              <dt className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">Opening hours</dt>
              <dd className="mt-3 space-y-1.5 text-base text-ash">
                {SITE.hours.map((entry) => (
                  <p key={entry.days}>
                    {entry.days}
                    <span className="block text-sm text-slate2">
                      {entry.open} – {entry.close}
                    </span>
                  </p>
                ))}
              </dd>
            </div>
            <div className="border-b border-r border-line p-8">
              <dt className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">Parking</dt>
              <dd className="mt-3 text-base leading-relaxed text-ash">
                Free on-site parking for thirty cars, plus secure bike storage inside the entrance. Drop-off bay on
                Admiralty Way.
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <FinalCta />

      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Facilities', path: '/facilities' }])} />
    </>
  )
}
