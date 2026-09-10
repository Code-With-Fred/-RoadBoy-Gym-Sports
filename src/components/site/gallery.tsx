'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SmartImage } from './smart-image'
import { cn } from '@/lib/utils'

type Item = { src: string; alt: string }

/**
 * Editorial gallery with a lightbox.
 *
 * Tiles use a repeating span pattern rather than a true masonry library — it
 * gives the same irregular rhythm with no layout JavaScript, and it degrades to
 * a clean two-up on phones.
 */
const SPANS = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-2 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-2 md:row-span-2',
  'md:col-span-2 md:row-span-1',
]

export function Gallery({ items, className }: { items: Item[]; className?: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setIndex(null)
    triggerRef.current?.focus()
  }, [])

  const step = useCallback(
    (delta: number) => setIndex((current) => (current === null ? null : (current + delta + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    if (index === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, close, step])

  const active = index === null ? null : items[index]

  return (
    <>
      <ul
        className={cn(
          'grid grid-cols-2 gap-2 md:auto-rows-[190px] md:grid-cols-6 md:gap-3 lg:auto-rows-[210px]',
          className,
        )}
      >
        {items.map((item, i) => (
          <li key={`${item.src}-${i}`} className={cn('group relative overflow-hidden', SPANS[i % SPANS.length])}>
            <button
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget
                setIndex(i)
              }}
              className="absolute inset-0 h-full w-full"
              aria-label={`View larger: ${item.alt}`}
            >
              <span className="absolute inset-0 aspect-square md:aspect-auto">
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  zoom
                  width={900}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </span>
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/35" />
              <span className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="font-display text-[0.6875rem] uppercase tracking-[0.16em] text-bone">
                  View
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-[60] flex flex-col bg-ink/96 backdrop-blur-sm animate-fade-in"
          onClick={close}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-[0.6875rem] uppercase tracking-[0.16em] text-ash">
              {(index ?? 0) + 1} / {items.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-bone transition-colors hover:border-ember hover:text-ember"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center p-3 sm:p-8">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                step(-1)
              }}
              aria-label="Previous image"
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center border border-white/20 bg-ink/70 text-bone transition-colors hover:border-ember hover:text-ember sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>

            <div
              className="relative h-full w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <SmartImage src={active.src} alt={active.alt} width={1800} quality={82} priority sizes="100vw" fit="contain" />
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                step(1)
              }}
              aria-label="Next image"
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center border border-white/20 bg-ink/70 text-bone transition-colors hover:border-ember hover:text-ember sm:right-6"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <p className="border-t border-line px-4 py-4 text-center text-sm text-ash">{active.alt}</p>
        </div>
      ) : null}
    </>
  )
}
