import Link from 'next/link'
import type { ReactNode } from 'react'
import { SmartImage } from '@/components/site/smart-image'
import { Wordmark } from '@/components/site/wordmark'
import { IMAGES } from '@/lib/images'

/**
 * Split layout for every auth screen: form on the left, a photograph and a line
 * of brand copy on the right. The image is hidden below `lg` so a phone shows
 * only what matters.
 */
export function AuthShell({
  title,
  lede,
  children,
  footer,
}: {
  title: string
  lede: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" aria-label="RoadBoy Gym&Sports home">
            <Wordmark className="text-[19px]" />
          </Link>

          <h1 className="mt-14 text-display-md">{title}</h1>
          <p className="mt-4 text-base leading-relaxed text-ash">{lede}</p>

          <div className="mt-10">{children}</div>

          {footer ? <div className="mt-8 border-t border-line pt-6 text-sm text-ash">{footer}</div> : null}
        </div>
      </div>

      <aside className="relative hidden lg:block">
        <SmartImage src={IMAGES.heroAlt.src} alt="" width={1400} quality={70} sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />

        <div className="absolute inset-x-0 bottom-0 p-14">
          <p className="font-display text-display-sm uppercase leading-none text-bone">
            Your body is built
            <br />
            one rep at a time.
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone/70">
            Five hundred members. Fifteen coaches. One floor in Lekki, and a training plan that goes wherever you do.
          </p>
        </div>
      </aside>
    </div>
  )
}
