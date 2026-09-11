'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Section, SectionHeading, WhatsAppLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { FAQS } from '@/lib/faqs'
import { cn } from '@/lib/utils'
import { waGeneral } from '@/lib/whatsapp'

/**
 * FAQ accordion.
 *
 * Every answer is present in the HTML whether or not its panel is open — it is
 * hidden with the `hidden` attribute rather than conditionally rendered — so
 * the FAQ rich result and the page agree, and Ctrl+F finds everything.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionHeading eyebrow="Questions" title="Before you order." />
              <p className="mt-6 text-sm leading-relaxed text-ash">
                Anything not answered here, send it to us on WhatsApp. You will get a person, not an auto-reply.
              </p>
              <WhatsAppLink href={waGeneral()} variant="outline" className="mt-8">
                Ask a question
              </WhatsAppLink>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <dl className="border-t border-line">
              {FAQS.map((faq, index) => {
                const expanded = open === index
                return (
                  <div key={faq.question} className="border-b border-line">
                    <dt>
                      <button
                        type="button"
                        onClick={() => setOpen(expanded ? null : index)}
                        aria-expanded={expanded}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-button-${index}`}
                        className="group flex w-full items-center gap-5 py-6 text-left transition-colors hover:text-ember"
                      >
                        <span className="flex-1 font-display text-lg uppercase leading-tight sm:text-xl">
                          {faq.question}
                        </span>
                        <span
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center border transition-colors',
                            expanded
                              ? 'border-ember bg-ember text-ink'
                              : 'border-line text-ash group-hover:border-ember',
                          )}
                        >
                          {expanded ? (
                            <Minus className="h-4 w-4" aria-hidden />
                          ) : (
                            <Plus className="h-4 w-4" aria-hidden />
                          )}
                        </span>
                      </button>
                    </dt>

                    <dd
                      id={`faq-panel-${index}`}
                      aria-labelledby={`faq-button-${index}`}
                      hidden={!expanded}
                      className="pb-7 pr-14"
                    >
                      <p className="max-w-2xl text-base leading-relaxed text-ash">{faq.answer}</p>
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  )
}
