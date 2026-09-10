'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Mobile-only sticky action bar.
 *
 * Most visitors arrive from Instagram, TikTok or a WhatsApp link and read on a
 * phone, so the page's single most important action follows them down the page.
 * It appears only after the hero has scrolled away, to avoid covering it.
 */
export function StickyCta({
  href,
  label,
  note,
  secondaryHref,
  secondaryLabel,
}: {
  href: string
  label: string
  note?: string
  secondaryHref?: string
  secondaryLabel?: string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur-md transition-transform duration-300 ease-out lg:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      // Clear of the iOS home indicator.
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="container flex items-center gap-3 py-3">
        <div className="min-w-0 flex-1">
          {note ? <p className="truncate text-[0.6875rem] uppercase tracking-[0.14em] text-slate2">{note}</p> : null}
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="font-display text-xs uppercase tracking-[0.14em] text-ash underline-offset-4 hover:text-bone hover:underline"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
        <Link
          href={href}
          className="flex h-12 shrink-0 items-center justify-center bg-ember px-7 font-display text-xs uppercase tracking-[0.14em] text-ink active:translate-y-px"
        >
          {label}
        </Link>
      </div>
    </div>
  )
}
