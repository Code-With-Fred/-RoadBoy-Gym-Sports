'use client'

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Scroll reveal, built on IntersectionObserver rather than an animation
 * library — a few lines, no extra bundle, and it unobserves as soon as an
 * element has appeared.
 *
 * The hiding is done in CSS, gated on a `js` class that a tiny inline script in
 * the document head adds. That ordering matters: if the hidden state were
 * inline `opacity: 0` from React state, every revealed section would ship
 * invisible in the server HTML and stay invisible for anyone whose JavaScript
 * failed. This way the markup is visible by default and only hides when we
 * know we can also un-hide it.
 *
 * `prefers-reduced-motion` is handled in globals.css against the same selector.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 20,
  className,
  once = true,
}: {
  children: ReactNode
  as?: ElementType
  /** Milliseconds. Keep stagger steps to 60–90ms; more feels sluggish. */
  delay?: number
  y?: number
  className?: string
  once?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // No observer (a very old browser) — show the content rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setShown(false)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? 'shown' : 'pending'}
      className={cn('reveal', className)}
      style={{ '--reveal-y': `${y}px`, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
