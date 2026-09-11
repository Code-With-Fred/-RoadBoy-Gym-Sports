'use client'

import { useEffect, useState } from 'react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { cn } from '@/lib/utils'
import { waGeneral } from '@/lib/whatsapp'

/**
 * Floating WhatsApp button.
 *
 * Appears once the hero has scrolled past, so it never covers the hero's own
 * call to action. It sits above the safe-area inset on iPhones and carries a
 * label on wider screens where there is room for one — on a phone the glyph
 * alone is unmistakable and the extra width would crowd the content.
 */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={waGeneral()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with RoadBoy on WhatsApp"
      className={cn(
        'group fixed right-4 z-40 flex items-center gap-3 bg-ember px-4 py-4 text-ink shadow-lift transition-all duration-300 ease-out sm:right-6 sm:px-5',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
      )}
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      {/* A slow pulse draws the eye once without becoming a distraction. */}
      <span aria-hidden className="absolute inset-0 -z-10 animate-ping-slow bg-ember/40" />
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="hidden font-display text-xs uppercase tracking-[0.14em] sm:inline">Chat with us</span>
    </a>
  )
}
