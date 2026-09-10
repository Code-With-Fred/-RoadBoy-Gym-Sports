import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Heading block used at the top of every dashboard and admin screen. */
export function PanelHeader({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="font-display text-[0.625rem] uppercase tracking-[0.2em] text-ember">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 font-display text-display-sm uppercase leading-none">{title}</h1>
        {lede ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number
  label?: string
  className?: string
}) {
  const safe = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('', className)}>
      {label ? (
        <div className="mb-2.5 flex items-baseline justify-between gap-4">
          <span className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">{label}</span>
          <span className="font-display text-sm text-ember">{safe}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className="h-1.5 w-full overflow-hidden bg-white/10"
      >
        <div className="h-full bg-ember transition-[width] duration-700 ease-out" style={{ width: `${safe}%` }} />
      </div>
    </div>
  )
}

/**
 * Circular progress. Pure SVG with a stroke-dashoffset — no chart library for
 * what is one circle and a number.
 */
export function ProgressRing({
  value,
  size = 132,
  stroke = 6,
  children,
}: {
  value: number
  size?: number
  stroke?: number
  children?: ReactNode
}) {
  const safe = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden focusable="false">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FF4A1C"
          strokeWidth={stroke}
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (safe / 100) * circumference}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string
  value: ReactNode
  hint?: string
  className?: string
}) {
  return (
    <div className={cn('border border-line bg-steel p-6', className)}>
      <p className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">{label}</p>
      <p className="mt-3 font-display text-4xl leading-none text-bone">{value}</p>
      {hint ? <p className="mt-2.5 text-xs text-ash">{hint}</p> : null}
    </div>
  )
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="border border-line bg-steel p-12 text-center">
      <h2 className="font-display text-2xl uppercase leading-none">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ash">{body}</p>
      {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
    </div>
  )
}
