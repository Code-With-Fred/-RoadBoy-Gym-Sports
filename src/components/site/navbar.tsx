'use client'

import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { WhatsAppLink } from '@/components/ui'
import { NAV_LINKS, SITE } from '@/lib/site'
import { cn } from '@/lib/utils'
import { waGeneral } from '@/lib/whatsapp'
import { Wordmark } from './wordmark'

/**
 * Sticky navigation over a single-page layout.
 *
 * Condenses on scroll so the hero stays uninterrupted at the top but the bar
 * reads clearly over content further down. The links are in-page anchors, and
 * the active one is tracked with an IntersectionObserver rather than the URL
 * hash, so it updates while the visitor scrolls rather than only on click.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight whichever section currently occupies the middle of the screen.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const sections = NAV_LINKS.map((link) => document.querySelector(link.href)).filter(
      (node): node is Element => node !== null,
    )
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Lock the page behind the open drawer.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a
        href="#equipment"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ember focus:px-4 focus:py-2 focus:font-display focus:text-xs focus:uppercase focus:tracking-[0.16em] focus:text-ink"
      >
        Skip to equipment
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out',
          scrolled ? 'border-b border-line bg-ink/94 backdrop-blur-md' : 'border-b border-transparent',
        )}
      >
        <div
          className={cn(
            'container flex items-center justify-between gap-4 transition-all duration-300 ease-out',
            scrolled ? 'h-[62px]' : 'h-[--nav-h]',
          )}
        >
          <a href="#home" aria-label={`${SITE.name} — back to top`} className="shrink-0">
            <Wordmark className={cn('transition-all duration-300', scrolled ? 'text-[14px]' : 'text-[16px]')} />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={active === link.href ? 'true' : undefined}
                    className={cn(
                      'link-underline font-display text-xs uppercase tracking-[0.18em] transition-colors duration-200',
                      active === link.href ? 'text-ember' : 'text-bone/85 hover:text-bone',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 lg:block">
            <WhatsAppLink href={waGeneral()} size="sm">
              Order on WhatsApp
            </WhatsAppLink>
          </div>

          {/* Mobile: the WhatsApp action stays on screen beside the menu trigger. */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <WhatsAppLink href={waGeneral()} size="sm" className="px-3.5">
              Order
            </WhatsAppLink>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-bone transition-colors hover:border-ember hover:text-ember"
            >
              {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div id="mobile-nav" hidden={!open} className="fixed inset-0 z-40 flex flex-col bg-ink pt-[--nav-h] lg:hidden">
        <nav aria-label="Mobile" className="container flex flex-1 flex-col justify-center">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, index) => (
              <li key={link.href} className="border-b border-line">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-baseline gap-4 py-5 font-display text-[1.9rem] uppercase leading-none tracking-tight transition-colors',
                    active === link.href ? 'text-ember' : 'text-bone',
                  )}
                >
                  <span className="text-xs tracking-[0.2em] text-slate2">{String(index + 1).padStart(2, '0')}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <WhatsAppLink href={waGeneral()} size="lg" className="mt-10 w-full">
            Order on WhatsApp
          </WhatsAppLink>

          <p className="mt-8 pb-10 text-sm text-slate2">
            Free nationwide delivery · Free installation · Pay on delivery
            <a href={`tel:${SITE.contact.phoneIntl}`} className="mt-2 block text-ash hover:text-ember">
              {SITE.contact.phoneDisplay}
            </a>
          </p>
        </nav>
      </div>
    </>
  )
}
