'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart3,
  Dumbbell,
  ExternalLink,
  Image as ImageIcon,
  LogOut,
  MessageSquareQuote,
  Package,
  Receipt,
  Settings,
  Sparkles,
  Ticket,
  Users,
  UsersRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Wordmark } from '@/components/site/wordmark'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { cn } from '@/lib/utils'

const SECTIONS = [
  {
    label: 'Insight',
    links: [{ href: '/admin', label: 'Overview', icon: BarChart3 }],
  },
  {
    label: 'Catalogue',
    links: [
      { href: '/admin/programs', label: 'Programs', icon: Package },
      { href: '/admin/workouts', label: 'Workouts', icon: Dumbbell },
      { href: '/admin/exercises', label: 'Exercises', icon: Sparkles },
      { href: '/admin/memberships', label: 'Memberships', icon: Ticket },
    ],
  },
  {
    label: 'Business',
    links: [
      { href: '/admin/orders', label: 'Orders', icon: Receipt },
      { href: '/admin/customers', label: 'Customers', icon: Users },
    ],
  },
  {
    label: 'Content',
    links: [
      { href: '/admin/trainers', label: 'Trainers', icon: UsersRound },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
      { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function AdminShell({ children, email }: { children: ReactNode; email: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href))

  async function signOut() {
    if (!isSupabaseConfigured()) return
    await createClient().auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-dvh lg:flex">
      <aside className="border-b border-line bg-coal lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-5 lg:block lg:px-6 lg:py-7">
          <div>
            <Link href="/" aria-label="RoadBoy Gym&Sports home">
              <Wordmark className="text-[16px]" />
            </Link>
            <p className="mt-2 font-display text-[0.5625rem] uppercase tracking-[0.22em] text-ember">
              Admin console
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="font-display text-[0.625rem] uppercase tracking-[0.16em] text-slate2 transition-colors hover:text-ember lg:hidden"
          >
            Sign out
          </button>
        </div>

        <nav aria-label="Admin" className="lg:px-3 lg:pb-8">
          <div className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {SECTIONS.map((section) => (
              <div key={section.label} className="contents lg:block">
                <p className="hidden px-4 pb-2 font-display text-[0.5625rem] uppercase tracking-[0.2em] text-slate2 lg:block">
                  {section.label}
                </p>
                <ul className="contents lg:block lg:space-y-0.5">
                  {section.links.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <li key={link.href} className="shrink-0 lg:w-full">
                        <Link
                          href={link.href}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 font-display text-[0.6875rem] uppercase tracking-[0.14em] transition-colors',
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
              </div>
            ))}
          </div>

          <div className="hidden border-t border-line pt-6 lg:mt-8 lg:block">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2.5 font-display text-[0.6875rem] uppercase tracking-[0.14em] text-ash transition-colors hover:bg-steel hover:text-bone"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              View live site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 font-display text-[0.6875rem] uppercase tracking-[0.14em] text-ash transition-colors hover:bg-steel hover:text-bone"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
            <p className="mt-5 px-4 text-xs text-slate2">
              Signed in as
              <span className="mt-1 block truncate text-ash">{email}</span>
            </p>
          </div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
