import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui'
import { Icon } from '@/components/site/icon'
import { Reveal } from '@/components/site/reveal'
import { SERVICES } from '@/lib/content'

export function Services() {
  return (
    <Section tone="coal">
      <div className="container">
        <SectionHeading
          eyebrow="What we offer"
          title="Train your way."
          lede="Six ways to work with us — on the floor in Lekki or through a structured plan wherever you are."
        />

        {/* A single hairline grid rather than six floating cards. */}
        <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={(index % 3) * 70}>
              <Link
                href={service.href}
                className="group flex h-full flex-col border-b border-r border-line p-8 transition-colors duration-300 hover:bg-steel lg:p-10"
              >
                <span className="flex h-12 w-12 items-center justify-center border border-line text-ember transition-colors duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                  <Icon name={service.icon} className="h-5 w-5" />
                </span>

                <h3 className="mt-8 font-display text-2xl leading-none">{service.title}</h3>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-ash">{service.description}</p>

                <span className="mt-8 inline-flex items-center gap-2 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-bone transition-colors group-hover:text-ember">
                  Learn more
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
