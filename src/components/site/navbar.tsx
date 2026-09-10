'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ButtonLink } from '@/components/ui'
import { NAV_LINKS, SITE } from '@/lib/site'
import { cn } from '@/lib/utils'
import { Wordmark } from './wordmark'

/**
 * Sticky navigation.
 *
 * Condenses on scroll (shorter bar, solid ground, hairline) so the hero stays
 * uninterrupted at the top but the bar reads clearly over content further down.
 */
export function Navbar({ signedIn = false }: { signedIn?: boolean }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname])

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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ember focus:px-4 focus:py-2 focus:font-display focus:text-xs focus:uppercase focus:tracking-[0.16em] focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out',
          scrolled ? 'border-b border-line bg-ink/92 backdrop-blur-md' : 'border-b border-transparent bg-transparent',
        )}
      >
        <div
          className={cn(
            'container flex items-center justify-between transition-all duration-300 ease-out',
            scrolled ? 'h-[60px]' : 'h-[--nav-h]',
          )}
        >
          <Link href="/" className="shrink-0" aria-label={`${SITE.name} home`}>
            <Wordmark className={cn('transition-all duration-300', scrolled ? 'text-[15px]' : 'text-[17px]')} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={cn(
                      'link-underline font-display text-xs uppercase tracking-[0.18em] transition-colors duration-200',
                      isActive(link.href) ? 'text-ember' : 'text-bone/85 hover:text-bone',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            {signedIn ? (
              <ButtonLink href="/dashboard" variant="outline" size="sm">
                <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
                Dashboard
              </ButtonLink>
            ) : (
              <>
                <Link
                  href="/login"
                  className="link-underline font-display text-xs uppercase tracking-[0.18em] text-bone/85 hover:text-bone"
                >
                  Login
                </Link>
                <ButtonLink href="/membership" size="sm">
                  Join now
                </ButtonLink>
              </>
            )}
          </div>

          {/* Mobile: primary CTA stays visible next to the menu trigger. */}
          <div className="flex items-center gap-2 lg:hidden">
            <ButtonLink href="/membership" size="sm" className="px-3.5">
              Join
            </ButtonLink>
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
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col bg-ink pt-[--nav-h] lg:hidden"
      >
        <nav aria-label="Mobile" className="container flex flex-1 flex-col justify-center">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, index) => (
              <li key={link.href} className="border-b border-line">
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-baseline gap-4 py-5 font-display text-[2rem] uppercase leading-none tracking-tight transition-colors',
                    isActive(link.href) ? 'text-ember' : 'text-bone',
                  )}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <span className="text-xs tracking-[0.2em] text-slate2">{String(index + 1).padStart(2, '0')}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3">
            {signedIn ? (
              <ButtonLink href="/dashboard" size="lg">
                Go to dashboard
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/membership" size="lg">
                  Join the gym
                </ButtonLink>
                <ButtonLink href="/programs" variant="outline" size="lg">
                  Shop programs
                </ButtonLink>
                <ButtonLink href="/login" variant="ghost" size="lg">
                  Log in
                </ButtonLink>
              </>
            )}
          </div>

          <p className="mt-10 pb-10 text-sm text-slate2">
            {SITE.address.line1}, {SITE.address.line2}, {SITE.address.city}
            <br />
            <a href={`tel:${SITE.contact.phoneHref}`} className="text-ash hover:text-ember">
              {SITE.contact.phone}
            </a>
          </p>
        </nav>
      </div>
    </>
  )
}
