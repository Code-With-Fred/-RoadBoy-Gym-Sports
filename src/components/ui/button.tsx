import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'solid' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const BASE =
  'group/btn relative inline-flex select-none items-center justify-center gap-2.5 text-center font-display uppercase ' +
  'tracking-[0.12em] transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-45'

const VARIANTS: Record<Variant, string> = {
  // The one loud element on the page. Reserved for the WhatsApp action.
  primary: 'bg-ember text-ink hover:bg-ember-soft active:translate-y-px hover:shadow-ember',
  outline: 'border border-white/25 text-bone hover:border-ember hover:text-ember active:translate-y-px',
  solid: 'bg-bone text-ink hover:bg-white active:translate-y-px',
  ghost: 'text-bone hover:text-ember',
}

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.6875rem]',
  // 48px and 56px — comfortably tappable on a phone, which is where nearly all
  // of this traffic arrives from.
  md: 'h-12 px-6 text-xs',
  lg: 'h-14 px-8 text-sm',
}

type Shared = { variant?: Variant; size?: Size; className?: string; children: ReactNode }

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: Shared & ComponentProps<'button'>) {
  return (
    <button className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({ variant = 'primary', size = 'md', className, children, href, ...props }: Shared & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </Link>
  )
}

/** Shared styling for anchors that leave the site (WhatsApp, tel:). */
export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className)
}
