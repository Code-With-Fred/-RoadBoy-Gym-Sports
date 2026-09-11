import { Timer, Truck, Wallet, Wrench } from 'lucide-react'
import { Ordinal, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'

const BENEFITS = [
  {
    icon: Truck,
    title: 'Free nationwide delivery',
    body: 'Get your gym equipment delivered across Nigeria without paying extra delivery fees.',
  },
  {
    icon: Wrench,
    title: 'Free installation',
    body: "We don't just drop the equipment at your doorstep. We assemble and set it up for you.",
  },
  {
    icon: Wallet,
    title: 'Pay on delivery',
    body: 'Inspect your equipment when it arrives before making payment.',
  },
  {
    icon: Timer,
    title: 'Fast delivery',
    body: 'Get your equipment delivered quickly, typically within 3 days of placing your order.',
  },
]

export function Benefits() {
  return (
    <Section id="why-us" tone="coal">
      <div className="container">
        <SectionHeading
          eyebrow="The RoadBoy difference"
          title="Why buy from RoadBoy?"
          lede="Buying heavy equipment online means trusting someone you have not met. These four things are how we earn that."
        />

        {/* A single hairline grid rather than four floating cards. */}
        <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <Reveal
              as="li"
              key={benefit.title}
              delay={index * 70}
              className="group border-b border-r border-line p-8 transition-colors duration-300 hover:bg-steel lg:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center border border-line text-ember transition-colors duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                  <benefit.icon className="h-5 w-5" aria-hidden />
                </span>
                <Ordinal index={index + 1} />
              </div>

              <h3 className="mt-8 font-display text-xl uppercase leading-tight">{benefit.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ash">{benefit.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
