import type { ReactNode } from 'react'
import { buttonClass } from './button'
import { WhatsAppIcon } from './whatsapp-icon'

/**
 * The conversion button. Every WhatsApp call to action on the page is this
 * component, so no link can be built by hand and end up opening a blank chat
 * or missing `rel="noopener"`.
 */
export function WhatsAppLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  showIcon = true,
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'outline' | 'solid' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass(variant, size, className)}
    >
      {showIcon ? <WhatsAppIcon className="h-4 w-4 shrink-0" /> : null}
      {children}
      <span className="sr-only"> (opens WhatsApp)</span>
    </a>
  )
}
