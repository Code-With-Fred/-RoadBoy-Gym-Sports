import Link from 'next/link'
import { ButtonLink } from '@/components/ui'
import { Wordmark } from '@/components/site/wordmark'

/**
 * Lives at the root, so it renders outside the (site) group and brings its own
 * minimal chrome.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-20 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 texture-grid opacity-30" />

      <Link href="/" aria-label="RoadBoy Gym&Sports home">
        <Wordmark className="text-[19px]" />
      </Link>

      <p className="mt-16 font-display text-[6rem] leading-none text-ember sm:text-[9rem]">404</p>

      <h1 className="mt-4 text-display-sm">This rep does not exist.</h1>

      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ash">
        The page you were looking for has moved or never existed. No harm done — here is the way back.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Back to home
        </ButtonLink>
        <ButtonLink href="/programs" variant="outline" size="lg">
          Browse programs
        </ButtonLink>
      </div>

      <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.14em] text-slate2">
        {[
          { label: 'Workouts', href: '/workouts' },
          { label: 'Trainers', href: '/trainers' },
          { label: 'Membership', href: '/membership' },
          { label: 'Contact', href: '/contact' },
        ].map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition-colors hover:text-ember">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
