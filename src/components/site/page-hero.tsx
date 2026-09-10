import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { SmartImage } from './smart-image'
import { cn } from '@/lib/utils'

/**
 * The opening block for every interior page. Keeping it in one component is
 * what makes the site feel like one product rather than twelve pages.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  breadcrumbs,
  children,
  align = 'left',
  size = 'md',
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  image?: { src: string; alt: string }
  breadcrumbs?: Array<{ label: string; href?: string }>
  children?: ReactNode
  align?: 'left' | 'center'
  size?: 'sm' | 'md'
}) {
  return (
    <section
      className={cn(
        'relative isolate flex flex-col justify-end overflow-hidden',
        size === 'sm' ? 'min-h-[46vh] pt-[--nav-h]' : 'min-h-[62vh] pt-[--nav-h]',
      )}
    >
      {image ? (
        <div className="absolute inset-0 -z-10">
          <SmartImage src={image.src} alt="" width={1900} quality={70} priority sizes="100vw" />
          <div className="absolute inset-0 bg-ink/76" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        </div>
      ) : (
        <div aria-hidden className="absolute inset-0 -z-10 texture-grid opacity-40" />
      )}

      <div className="container py-14 md:py-20">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {index > 0 ? <ChevronRight className="h-3 w-3" aria-hidden /> : null}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-ember">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-ash" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className={cn('max-w-4xl', align === 'center' && 'mx-auto text-center')}>
          {eyebrow ? <p className={cn('eyebrow', align === 'left' && 'eyebrow-rule')}>{eyebrow}</p> : null}

          <h1 className="mt-6 text-display-lg text-balance animate-fade-up">{title}</h1>

          {lede ? (
            <p
              className={cn(
                'mt-7 max-w-2xl text-lede text-ash text-pretty animate-fade-up',
                align === 'center' && 'mx-auto',
              )}
              style={{ animationDelay: '100ms' }}
            >
              {lede}
            </p>
          ) : null}

          {children ? (
            <div className="mt-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
