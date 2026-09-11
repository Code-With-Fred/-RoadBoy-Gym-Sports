'use client'

import { useMemo, useState } from 'react'
import { Section, SectionHeading, WhatsAppLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { CATEGORY_TABS, PRODUCTS, type CategoryFilter } from '@/lib/products'
import { cn } from '@/lib/utils'
import { waAdvice } from '@/lib/whatsapp'
import { ProductCard } from './product-card'

/**
 * The catalogue.
 *
 * Filtering is a single piece of local state over a dozen products — no router
 * round-trip, no query string, nothing to get out of sync. Every card is
 * rendered on the server and simply hidden or shown, so the full range is in
 * the HTML for search engines regardless of which tab is active.
 */
export function Catalogue() {
  const [filter, setFilter] = useState<CategoryFilter | 'all'>('all')

  const products = useMemo(
    () => (filter === 'all' ? PRODUCTS : PRODUCTS.filter((product) => product.filter === filter)),
    [filter],
  )

  return (
    <Section id="equipment">
      <div className="container">
        <SectionHeading
          eyebrow="Equipment catalogue"
          title="Build your gym. Your way."
          lede="From home gyms to commercial fitness centers, find the equipment you need to build a complete training space."
        />

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Filter equipment by category"
          className="no-scrollbar mt-12 flex gap-2 overflow-x-auto pb-1"
        >
          {CATEGORY_TABS.map((tab) => {
            const selected = filter === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  'shrink-0 border px-4 py-2.5 font-display text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-200',
                  selected
                    ? 'border-ember bg-ember text-ink'
                    : 'border-line text-ash hover:border-white/30 hover:text-bone',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <p aria-live="polite" className="mt-6 font-display text-xs uppercase tracking-[0.14em] text-slate2">
          Showing {products.length} of {PRODUCTS.length} categories
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <Reveal as="li" key={product.id} delay={Math.min(index, 4) * 60}>
              {/* Nothing here is above the fold, so every card lazy-loads and
                  leaves the hero as the only preloaded image. */}
              <ProductCard product={product} />
            </Reveal>
          ))}
        </ul>

        {/* The catch-all for anyone who did not find what they came for. */}
        <Reveal className="mt-6 border border-line bg-steel p-8 text-center md:p-10">
          <h3 className="font-display text-2xl uppercase leading-tight">Looking for something else?</h3>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ash">
            This is a selection, not the whole warehouse. Tell us what you need — the space you are working with, the
            budget you have in mind — and we will source it and quote you.
          </p>
          <WhatsAppLink href={waAdvice()} size="lg" className="mt-8">
            Ask about other equipment
          </WhatsAppLink>
        </Reveal>
      </div>
    </Section>
  )
}
