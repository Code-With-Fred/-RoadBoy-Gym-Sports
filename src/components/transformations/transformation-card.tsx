import Link from 'next/link'
import { Badge, MetaList } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import type { Transformation } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Before/after presented as a straight split rather than a dragging slider —
 * it is honest, it works on a phone, and it does not turn someone's body into a
 * toy. Results are described as training outcomes, never as health claims.
 */
export function TransformationCard({
  item,
  className,
  detailed = false,
}: {
  item: Transformation
  className?: string
  detailed?: boolean
}) {
  return (
    <article className={cn('card card-hover group flex h-full flex-col', className)}>
      <div className="grid grid-cols-2">
        {[
          { image: item.before, label: 'Before' },
          { image: item.after, label: 'After' },
        ].map((side, index) => (
          <div key={side.label} className={cn('relative aspect-[3/4] overflow-hidden', index === 0 && 'border-r border-line')}>
            <SmartImage
              src={side.image.src}
              alt={`${item.name} — ${side.label.toLowerCase()} ${item.programName}`}
              width={600}
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <span
              className={cn(
                'absolute left-3 top-3 px-2 py-1 font-display text-[0.625rem] uppercase tracking-[0.18em]',
                index === 0 ? 'bg-ink/80 text-ash' : 'bg-ember text-ink',
              )}
            >
              {side.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-none">{item.name}</h3>
          <Badge tone="outline">{item.duration}</Badge>
        </div>

        <MetaList items={[item.programName, item.goal]} className="mt-4" />

        <blockquote className="mt-5 flex-1 border-l-2 border-ember pl-4 text-sm italic leading-relaxed text-bone/85">
          {item.quote}
        </blockquote>

        {detailed ? (
          <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
            <div>
              <dt className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">Starting point</dt>
              <dd className="mt-1 text-ash">{item.startingPoint}</dd>
            </div>
            <div>
              <dt className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">Result</dt>
              <dd className="mt-1 text-ash">{item.result}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-5 border-t border-line pt-5 text-sm text-ash">{item.result}</p>
        )}

        <Link
          href={`/programs/${item.programSlug}`}
          className="mt-5 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-ember link-underline"
        >
          Ran {item.programName}
        </Link>
      </div>
    </article>
  )
}
