import Link from 'next/link'
import { Instagram, Twitter, Youtube } from 'lucide-react'
import { SmartImage } from '@/components/site/smart-image'
import type { Trainer } from '@/lib/types'
import { cn } from '@/lib/utils'

const SOCIAL_ICONS = { instagram: Instagram, x: Twitter, youtube: Youtube } as const

export function TrainerCard({
  trainer,
  className,
  priority = false,
}: {
  trainer: Trainer
  className?: string
  priority?: boolean
}) {
  return (
    <article className={cn('group relative', className)}>
      <Link href={`/trainers/${trainer.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-steel">
          <SmartImage
            src={trainer.image.src}
            alt={trainer.image.alt}
            width={800}
            priority={priority}
            zoom
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 overlay-bottom" />

          {/* Years of experience, set vertically down the edge. */}
          <span
            className="absolute right-4 top-4 font-display text-[0.625rem] uppercase tracking-[0.2em] text-bone/70"
            style={{ writingMode: 'vertical-rl' }}
          >
            {trainer.yearsExperience} yrs experience
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-2xl leading-none transition-colors duration-300 group-hover:text-ember">
              {trainer.name}
            </h3>
            <p className="mt-2 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-ember">
              {trainer.specialty}
            </p>
          </div>
        </div>
      </Link>

      <p className="mt-5 text-sm leading-relaxed text-ash">{trainer.shortBio}</p>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4">
        <Link
          href={`/trainers/${trainer.slug}`}
          className="font-display text-[0.6875rem] uppercase tracking-[0.16em] text-bone link-underline hover:text-ember"
        >
          View profile
        </Link>

        <ul className="flex items-center gap-1.5">
          {(Object.keys(SOCIAL_ICONS) as Array<keyof typeof SOCIAL_ICONS>).map((key) => {
            const href = trainer.socials[key]
            if (!href) return null
            const IconComponent = SOCIAL_ICONS[key]
            return (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${trainer.name} on ${key === 'x' ? 'X' : key}`}
                  className="flex h-8 w-8 items-center justify-center border border-line text-ash transition-colors hover:border-ember hover:text-ember"
                >
                  <IconComponent className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}
