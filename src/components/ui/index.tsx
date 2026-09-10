import { Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export { Button, ButtonLink } from './button'

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */

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
    <section
      id={id}
      className={cn('py-section', tone === 'coal' && 'bg-coal', className)}
    >
      {children}
    </section>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('eyebrow eyebrow-rule', className)}>{children}</p>
}

/**
 * The standard section opener: eyebrow, headline, optional lede, optional
 * trailing action. Used everywhere so vertical rhythm stays identical.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  align = 'left',
  size = 'md',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  action?: ReactNode
  align?: 'left' | 'center'
  size?: 'md' | 'lg'
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
        <h2 className={cn('mt-5 text-balance', size === 'lg' ? 'text-display-lg' : 'text-display-md')}>{title}</h2>
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

/* -------------------------------------------------------------------------- */
/* Atoms                                                                       */
/* -------------------------------------------------------------------------- */

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'ember' | 'outline' | 'success'
  className?: string
}) {
  const tones = {
    neutral: 'bg-white/10 text-bone',
    ember: 'bg-ember text-ink',
    outline: 'border border-white/20 text-ash',
    success: 'bg-emerald-500/15 text-emerald-300',
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

/** Small metadata chips: "8 Weeks", "5 / week", "Intermediate". */
export function MetaList({
  items,
  className,
}: {
  items: Array<string | { label: string; value: string }>
  className?: string
}) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.14em]', className)}>
      {items.map((item, index) => {
        const text = typeof item === 'string' ? item : `${item.value} ${item.label}`
        return (
          <li key={index} className="flex items-center gap-5 text-ash">
            {index > 0 ? <span aria-hidden className="-ml-3 h-3 w-px bg-white/15" /> : null}
            <span className="font-display">{text}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function Rating({
  value,
  count,
  size = 'sm',
  className,
}: {
  value: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
}) {
  const dimension = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(dimension, index < Math.round(value) ? 'fill-ember text-ember' : 'text-white/20')}
          />
        ))}
      </div>
      <span className="font-display text-xs tracking-[0.12em] text-ash">
        {value.toFixed(1)}
        {count !== undefined ? ` (${count})` : ''}
      </span>
      <span className="sr-only">
        Rated {value} out of 5{count !== undefined ? ` from ${count} reviews` : ''}
      </span>
    </div>
  )
}

export function Price({
  naira,
  compareAt,
  size = 'md',
  className,
}: {
  naira: number
  compareAt?: number | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-display-sm' }
  return (
    <div className={cn('flex items-baseline gap-3', className)}>
      <span className={cn('font-display text-ember', sizes[size])}>₦{naira.toLocaleString('en-NG')}</span>
      {compareAt ? (
        <span className="font-display text-sm text-slate2 line-through">₦{compareAt.toLocaleString('en-NG')}</span>
      ) : null}
    </div>
  )
}

/** Thin numbered label used down the left edge of editorial sections. */
export function Ordinal({ index, className }: { index: number; className?: string }) {
  return (
    <span className={cn('font-display text-xs tracking-[0.2em] text-slate2', className)}>
      {String(index).padStart(2, '0')}
    </span>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-line', className)} />
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
