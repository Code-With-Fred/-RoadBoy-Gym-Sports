import { HeartHandshake, PackageSearch, Truck, Wrench } from 'lucide-react'
import { Ordinal, Section, SectionHeading, WhatsAppLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { IMAGES } from '@/lib/images'
import { waAdvice } from '@/lib/whatsapp'

const PILLARS = [
  {
    icon: PackageSearch,
    title: 'Quality sourcing',
    body: 'We source equipment selected for performance, durability and value.',
  },
  {
    icon: Truck,
    title: 'Nationwide logistics',
    body: 'We handle delivery across Nigeria so you do not have to figure out complicated logistics.',
  },
  {
    icon: Wrench,
    title: 'On-site installation',
    body: 'Our team assembles and installs your equipment after delivery.',
  },
  {
    icon: HeartHandshake,
    title: 'Customer-first service',
    body: 'We help you choose equipment based on your space, needs and budget.',
  },
]

export function WhyRoadBoy() {
  return (
    <Section className="relative">
      {/* Full-bleed photograph anchoring the section, heavily scrimmed. */}
      <div className="absolute inset-0 -z-10">
        <SmartImage src={IMAGES.whyUs.src} alt="" width={1800} quality={58} sizes="100vw" />
        <div className="absolute inset-0 bg-ink/93" />
      </div>

      <div className="container">
        <SectionHeading
          eyebrow="The full service"
          title="We don't just sell equipment."
          lede="Anyone can quote you a treadmill. Getting it to your door, through it, and set up properly is the part that actually decides whether buying online was a good idea."
        />

        <ul className="mt-16 grid gap-px border-l border-t border-line md:grid-cols-2">
          {PILLARS.map((pillar, index) => (
            <Reveal as="li" key={pillar.title} delay={index * 80} className="border-b border-r border-line">
              <div className="flex h-full gap-6 bg-ink/50 p-8 backdrop-blur-[2px] lg:gap-8 lg:p-12">
                <div className="flex flex-col items-center gap-4">
                  <Ordinal index={index + 1} />
                  <span aria-hidden className="w-px flex-1 bg-line" />
                </div>

                <div className="flex-1">
                  <pillar.icon className="h-6 w-6 text-ember" aria-hidden />
                  <h3 className="mt-6 font-display text-2xl uppercase leading-none lg:text-3xl">{pillar.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-ash">{pillar.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-4 border border-line bg-steel p-9 text-center md:p-12">
          <h3 className="text-display-sm">Need help choosing equipment?</h3>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ash">
            Tell us the room you are working with, what kind of training you want to do and roughly what you want to
            spend. We will tell you honestly what fits — including when the cheaper option is the right one.
          </p>
          <WhatsAppLink href={waAdvice()} size="lg" className="mt-8">
            Chat with RoadBoy
          </WhatsAppLink>
        </Reveal>
      </div>
    </Section>
  )
}
