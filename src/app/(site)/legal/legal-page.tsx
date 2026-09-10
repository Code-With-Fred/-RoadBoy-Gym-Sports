import type { ReactNode } from 'react'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui'

export interface LegalSection {
  heading: string
  body: ReactNode
}

/**
 * Shared layout for the policy pages.
 *
 * These are honest starting drafts, not legal advice — the note at the bottom
 * says so, and says it to the gym owner rather than hiding it in small print.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={title}
        lede={intro}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]}
        size="sm"
      />

      <Section className="!pt-10">
        <div className="container">
          <p className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
            Last updated {updated}
          </p>

          <div className="mt-10 max-w-3xl">
            {sections.map((section, index) => (
              <section key={section.heading} className="border-t border-line py-8 first:border-t-0 first:pt-0">
                <h2 className="flex gap-4 font-display text-2xl uppercase leading-none">
                  <span className="text-sm text-slate2">{String(index + 1).padStart(2, '0')}</span>
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-ash">{section.body}</div>
              </section>
            ))}
          </div>

          <div className="mt-12 max-w-3xl border border-line bg-steel p-7">
            <p className="font-display text-sm uppercase leading-none text-ember">A note to the gym owner</p>
            <p className="mt-4 text-sm leading-relaxed text-ash">
              This page is a working draft written to cover how the site actually behaves — it is not legal advice.
              Before launch, have a Nigerian solicitor review it against the Nigeria Data Protection Act and the
              Federal Competition and Consumer Protection Act, and update it to match your real refund, cancellation
              and membership terms.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
