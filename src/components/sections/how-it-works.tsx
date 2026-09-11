import { MessageSquare, PackageCheck, Search } from 'lucide-react'
import { ButtonLink, Section, SectionHeading, WhatsAppLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { waGeneral } from '@/lib/whatsapp'

const STEPS = [
  {
    icon: Search,
    title: 'Choose your equipment',
    body: 'Browse the equipment available and select what you need.',
  },
  {
    icon: MessageSquare,
    title: 'Order on WhatsApp',
    body: "Send us the equipment you're interested in and confirm your delivery details.",
  },
  {
    icon: PackageCheck,
    title: 'We deliver & install',
    body: 'Receive your equipment, get free installation and pay on delivery.',
  },
]

export function HowItWorks() {
  return (
    <Section id="how-it-works" tone="coal">
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title="Get your equipment in 3 simple steps."
          lede="No account, no cart, no card details. One conversation from start to finish."
          align="center"
        />

        <ol className="mt-16 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 90} className="relative">
              <div className="flex h-full flex-col border border-line bg-steel p-8 lg:p-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-[3.5rem] leading-none text-ember/25">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-line text-ember">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>

                <h3 className="mt-8 font-display text-2xl uppercase leading-tight">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ash">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <WhatsAppLink href={waGeneral()} size="lg">
            Order on WhatsApp
          </WhatsAppLink>
          <ButtonLink href="#equipment" variant="outline" size="lg">
            View equipment
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}
