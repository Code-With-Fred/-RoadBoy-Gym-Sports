import { cn } from '@/lib/utils'

/**
 * The logotype. Sized in `em` off the root font-size, so callers scale it with
 * a single text-[..px] class rather than fighting fixed SVG dimensions.
 *
 * The mark is two forward-leaning bars — a road marking read at speed, one
 * ember and one bone. It sets the name up rather than competing with it.
 */
export function Wordmark({
  className,
  showSub = true,
}: {
  className?: string
  showSub?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-[0.55em] text-[17px] leading-none', className)}>
      <span aria-hidden className="flex items-center gap-[0.14em]">
        <span className="block h-[1.15em] w-[0.26em] -skew-x-[18deg] bg-ember" />
        <span className="block h-[1.15em] w-[0.13em] -skew-x-[18deg] bg-bone/70" />
      </span>
      <span className="flex flex-col gap-[0.18em]">
        <span className="font-display text-[1em] font-extrabold uppercase leading-none tracking-[0.04em] text-bone">
          RoadBoy
        </span>
        {showSub ? (
          // Tracked-out so the ampersand reads cleanly at small sizes.
          <span className="font-display text-[0.4em] uppercase leading-none tracking-[0.34em] text-ash">
            Gym &amp; Sports
          </span>
        ) : null}
      </span>
    </span>
  )
}
