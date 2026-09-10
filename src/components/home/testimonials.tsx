'use client'

import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Rating } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import type { Testimonial } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Testimonial carousel.
 *
 * Built on native scroll-snap: the browser handles the momentum and the
 * accessibility, and the arrows just call scrollBy. No transform maths, no
 * resize listeners, and it stays swipeable on a phone with zero extra code.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const railRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  const scrollToIndex = useCallback((index: number) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.children[index] as HTMLElement | undefined
    if (card) rail.scrollTo({ left: card.offsetLeft - rail.offsetLeft, behavior: 'smooth' })
  }, [])

  // Track which card is centred so the dots stay in sync with a manual swipe.
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const middle = rail.scrollLeft + rail.clientWidth / 2
        let closest = 0
        let distance = Infinity
        Array.from(rail.children).forEach((child, index) => {
          const element = child as HTMLElement
          const centre = element.offsetLeft - rail.offsetLeft + element.clientWidth / 2
          const delta = Math.abs(centre - middle)
          if (delta < distance) {
            distance = delta
            closest = index
          }
        })
        setActive(closest)
      })
    }

    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      rail.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="relative">
      <ul
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        aria-label="Member testimonials"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="w-[86vw] shrink-0 snap-center sm:w-[60vw] lg:w-[31.5rem]"
          >
            <figure className="card flex h-full flex-col p-8 lg:p-10">
              <Quote className="h-7 w-7 shrink-0 text-ember" aria-hidden />

              <blockquote className="mt-6 flex-1 text-lg leading-relaxed text-bone/90 text-pretty">
                {item.quote}
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-steel">
                  <SmartImage src={item.image.src} alt="" width={120} sizes="48px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base uppercase leading-none">{item.name}</span>
                  <span className="mt-1.5 block truncate text-xs text-slate2">{item.role}</span>
                  <span className="mt-1 block text-xs text-slate2">{item.trainingDuration}</span>
                </span>
                <Rating value={item.rating} className="shrink-0" />
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-6">
        {/* Dots double as direct navigation. */}
        <ul className="flex items-center gap-2">
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Show testimonial ${index + 1} of ${items.length}`}
                aria-current={index === active}
                className={cn(
                  'h-1 transition-all duration-300',
                  index === active ? 'w-8 bg-ember' : 'w-4 bg-white/20 hover:bg-white/40',
                )}
              />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(active - 1, 0))}
            disabled={active === 0}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center border border-white/20 text-bone transition-colors hover:border-ember hover:text-ember disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-bone"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(Math.min(active + 1, items.length - 1))}
            disabled={active === items.length - 1}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center border border-white/20 text-bone transition-colors hover:border-ember hover:text-ember disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-bone"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
