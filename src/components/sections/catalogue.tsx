'use client'

import { ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Section, SectionHeading, WhatsAppLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { CATEGORY_TABS, INITIAL_VISIBLE, PRODUCTS, type CategoryFilter } from '@/lib/products'
import { cn } from '@/lib/utils'
import { waAdvice } from '@/lib/whatsapp'
import { ProductCard } from './product-card'

const COUNTS = Object.fromEntries(
  CATEGORY_TABS.map((tab) => [
    tab.value,
    tab.value === 'all' ? PRODUCTS.length : PRODUCTS.filter((product) => product.filter === tab.value).length,
  ]),
) as Record<CategoryFilter | 'all', number>

/**
 * The catalogue.
 *
 * Filtering is local state over a short list — no router round-trip, nothing to
 * get out of sync. On the "All" tab only the first few products are visible
 * until "Show all" is pressed, which keeps a phone visitor from scrolling past
 * two dozen cards to reach the rest of the page. Collapsed products use the
 * `hidden` attribute rather than being unmounted, so the whole range is always
 * in the HTML for search engines.
 */
export function Catalogue() {
  const [filter, setFilter] = useState<CategoryFilter | 'all'>('all')
  const [expanded, setExpanded] = useState(false)

  const products = useMemo(
    () => (filter === 'all' ? PRODUCTS : PRODUCTS.filter((product) => product.filter === filter)),
    [filter],
  )

  const collapsed = filter === 'all' && !expanded && products.length > INITIAL_VISIBLE
  const visibleCount = collapsed ? INITIAL_VISIBLE : products.length

  return (
    <Section id="equipment">
      <div className="container">
        <SectionHeading
          eyebrow="Equipment & prices"
          title="Build your gym. Your way."
          lede="From treadmills and multi-gyms to snooker tables and massagers — quality equipment for homes, gyms, offices and game rooms, with the price on every item."
        />

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Filter equipment by category"
          className="no-scrollbar -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0"
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
                  'flex shrink-0 items-center gap-2 border px-4 py-2.5 font-display text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-200',
                  selected
                    ? 'border-ember bg-ember text-ink'
                    : 'border-line text-ash hover:border-white/30 hover:text-bone',
                )}
              >
                {tab.label}
                <span className={cn('tabular-nums', selected ? 'text-ink/60' : 'text-slate2')}>
                  {COUNTS[tab.value]}
                </span>
              </button>
            )
          })}
        </div>

        <p aria-live="polite" className="mt-6 font-display text-xs uppercase tracking-[0.14em] text-slate2">
          Showing {visibleCount} of {products.length} products
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <li key={product.id} hidden={collapsed && index >= INITIAL_VISIBLE}>
              <Reveal delay={Math.min(index % 4, 3) * 60} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            </li>
          ))}
        </ul>

        {collapsed ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex h-14 w-full items-center justify-center gap-2.5 border border-white/25 px-8 font-display text-sm uppercase tracking-[0.12em] text-bone transition-colors hover:border-ember hover:text-ember sm:w-auto"
            >
              Show all {products.length} products
              <ChevronDown className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}

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
