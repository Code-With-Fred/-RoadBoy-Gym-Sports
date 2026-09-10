import { Ordinal, Section, SectionHeading } from '@/components/ui'
import { Icon } from '@/components/site/icon'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { PILLARS } from '@/lib/content'
import { IMAGES } from '@/lib/images'

export function WhyUs() {
  return (
    <Section className="relative">
      {/* Full-bleed photograph anchoring the section, heavily scrimmed. */}
      <div className="absolute inset-0 -z-10">
        <SmartImage src={IMAGES.coaching.src} alt="" width={1800} quality={60} sizes="100vw" />
        <div className="absolute inset-0 bg-ink/92" />
      </div>

      <div className="container">
        <SectionHeading
          eyebrow="Why train with us"
          title={
            <>
              Why we do it
              <br />
              different.
            </>
          }
          lede="Anyone can sell you a gym membership. Very few will still be checking on you in week nine."
        />

        <ul className="mt-16 grid gap-px border-l border-t border-line md:grid-cols-2">
          {PILLARS.map((pillar, index) => (
            <Reveal as="li" key={pillar.title} delay={index * 80} className="border-b border-r border-line">
              <div className="flex h-full gap-6 bg-ink/40 p-8 backdrop-blur-[2px] lg:gap-8 lg:p-12">
                <div className="flex flex-col items-center gap-4">
                  <Ordinal index={index + 1} />
                  <span aria-hidden className="w-px flex-1 bg-line" />
                </div>

                <div className="flex-1">
                  <Icon name={pillar.icon} className="h-6 w-6 text-ember" />
                  <h3 className="mt-6 font-display text-2xl leading-none lg:text-3xl">{pillar.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-ash">{pillar.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
