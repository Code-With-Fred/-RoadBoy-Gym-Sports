import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export { Button, ButtonLink } from './button'
export { WhatsAppLink } from './whatsapp-link'

/** A full-width band. `id` is the scroll anchor the navigation targets. */
export function Section({
  children,
  className,
  id,
  tone = 'ink',
}: {
  children: ReactNode
  className?: string
  id?: string
  tone?: 'ink' | 'coal'
}) {
  return (
    <section id={id} className={cn('py-section scroll-mt-20', tone === 'coal' && 'bg-coal', className)}>
      {children}
    </section>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('eyebrow eyebrow-rule', className)}>{children}</p>
}

/**
 * The standard section opener. Every band on the page uses it, which is what
 * keeps the vertical rhythm identical from top to bottom.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  action?: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? <Eyebrow className={cn(align === 'center' && 'justify-center')}>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-5 text-display-md text-balance">{title}</h2>
        {lede ? (
          <p className={cn('mt-6 max-w-2xl text-lede text-ash text-pretty', align === 'center' && 'mx-auto')}>
            {lede}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'outline'
  className?: string
}) {
  const tones = {
    neutral: 'bg-white/10 text-bone',
    accent: 'bg-ember text-ink',
    outline: 'border border-white/20 text-ash',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 font-display text-[0.6875rem] uppercase tracking-[0.16em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Thin numbered label used down the left edge of the process sections. */
export function Ordinal({ index, className }: { index: number; className?: string }) {
  return (
    <span className={cn('font-display text-xs tracking-[0.2em] text-slate2', className)}>
      {String(index).padStart(2, '0')}
    </span>
  )
}

/** Renders a JSON-LD block. Content is our own, never user input. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
