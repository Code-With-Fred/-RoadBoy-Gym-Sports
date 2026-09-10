'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Dumbbell, LayoutDashboard, LogOut, Settings, ShoppingBag, Store } from 'lucide-react'
import type { ReactNode } from 'react'
import { Wordmark } from '@/components/site/wordmark'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/programs', label: 'My programs', icon: Dumbbell },
  { href: '/dashboard/orders', label: 'Purchases', icon: ShoppingBag },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

/**
 * Account chrome: a persistent rail on desktop, a horizontal scroller on
 * mobile. Deliberately quieter than the marketing site — this is a tool.
 */
export function DashboardShell({ children, name }: { children: ReactNode; name: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => (href === '/dashboard' ? pathname === href : pathname.startsWith(href))

  async function signOut() {
    if (!isSupabaseConfigured()) return
    await createClient().auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-dvh lg:flex">
      {/* Rail */}
      <aside className="border-b border-line bg-coal lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6 lg:py-7">
          <Link href="/" aria-label="RoadBoy Gym&Sports home">
            <Wordmark className="text-[17px]" />
          </Link>

          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 font-display text-[0.625rem] uppercase tracking-[0.16em] text-slate2 transition-colors hover:text-ember lg:hidden"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Sign out
          </button>
        </div>

        <nav aria-label="Account" className="lg:mt-4 lg:px-3">
          <ul className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <li key={link.href} className="shrink-0 lg:w-full">
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 font-display text-[0.6875rem] uppercase tracking-[0.16em] transition-colors',
                      active ? 'bg-ember text-ink' : 'text-ash hover:bg-steel hover:text-bone',
                    )}
                  >
                    <link.icon className="h-4 w-4 shrink-0" aria-hidden />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden lg:mt-auto lg:block lg:px-3 lg:pb-6 lg:pt-8">
          <Link
            href="/programs"
            className="flex items-center gap-3 px-4 py-3 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-ash transition-colors hover:bg-steel hover:text-bone"
          >
            <Store className="h-4 w-4" aria-hidden />
            Browse store
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 px-4 py-3 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-ash transition-colors hover:bg-steel hover:text-bone"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>

          <p className="mt-6 border-t border-line px-4 pt-5 text-xs text-slate2">
            Signed in as
            <span className="mt-1 block truncate text-ash">{name}</span>
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
