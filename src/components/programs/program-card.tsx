import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge, MetaList, Price, Rating } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import type { Program } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * The product card for a digital program. Used on the homepage, the
 * marketplace grid and the "related programs" rail, so every price and rating
 * on the site is rendered by exactly one component.
 */
export function ProgramCard({
  program,
  className,
  priority = false,
}: {
  program: Program
  className?: string
  priority?: boolean
}) {
  return (
    <article className={cn('group card card-hover flex h-full flex-col', className)}>
      <Link href={`/programs/${program.slug}`} className="flex h-full flex-col focus-visible:outline-none">
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage
            src={program.image.src}
            alt={program.image.alt}
            width={900}
            priority={priority}
            zoom
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 overlay-bottom" />

          {program.bestSeller ? (
            <Badge tone="ember" className="absolute left-4 top-4">
              Best seller
            </Badge>
          ) : null}

          <div className="absolute bottom-4 left-4 right-4">
            <MetaList
              items={[`${program.weeks} weeks`, `${program.sessionsPerWeek} / week`, program.difficulty]}
              className="text-bone/90"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-2xl leading-none transition-colors duration-300 group-hover:text-ember">
            {program.name}
          </h3>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">{program.tagline}</p>

          <Rating value={program.rating} count={program.reviewCount} className="mt-5" />

          <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
            <Price naira={program.priceNaira} compareAt={program.compareAtNaira} />
            <span className="inline-flex items-center gap-2 pb-1 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-bone transition-colors group-hover:text-ember">
              View program
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
