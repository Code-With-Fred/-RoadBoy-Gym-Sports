import { Activity, Check, Dumbbell, Hand, Trophy, type LucideIcon } from 'lucide-react'
import { Badge, WhatsAppLink } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import { productLink, type CategoryFilter, type Product } from '@/lib/products'
import { cn, formatNaira } from '@/lib/utils'

const FILTER_ICON: Record<CategoryFilter, LucideIcon> = {
  cardio: Activity,
  strength: Dumbbell,
  games: Trophy,
  recovery: Hand,
}

/** Specs shown on the card before it gets cluttered; the rest go to WhatsApp. */
const MAX_SPECS = 4

/**
 * A catalogue card.
 *
 * The photograph is the sales pitch, so it takes the top of the card and gets
 * a restrained zoom on hover. When there is no photo of the right product yet,
 * the card shows a designed placeholder instead of a stock image of a different
 * machine — a buyer about to spend ₦600,000 notices when the picture is wrong.
 */
export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const Icon = FILTER_ICON[product.filter]

  return (
    <article className={cn('group card card-hover flex h-full flex-col', className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.image ? (
          <>
            <SmartImage
              src={product.image.src}
              alt={product.image.alt}
              width={800}
              zoom
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 overlay-bottom" />
            {product.image.representative ? (
              // Honest labelling until RoadBoy's own product photos replace the stock ones.
              <span className="absolute bottom-3 right-3 bg-ink/75 px-2 py-1 text-[0.625rem] uppercase tracking-[0.12em] text-bone/80 backdrop-blur-sm">
                Similar model shown
              </span>
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-iron via-steel to-ink px-6 text-center">
            <div aria-hidden className="absolute inset-0 texture-grid opacity-40" />
            <span className="relative flex h-16 w-16 items-center justify-center border border-white/15 text-ember transition-colors duration-300 group-hover:border-ember">
              <Icon className="h-7 w-7" aria-hidden />
            </span>
            <p className="relative font-display text-[0.625rem] uppercase tracking-[0.2em] text-slate2">
              Photo of this model on WhatsApp
            </p>
          </div>
        )}

        {/* Solid ground: a translucent badge disappears over a bright photo. */}
        <Badge tone="neutral" className="absolute left-4 top-4 bg-ink/85 backdrop-blur-sm">
          {product.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl uppercase leading-tight transition-colors duration-300 group-hover:text-ember">
          {product.name}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-ash">{product.description}</p>

        {/* Only supplier-given facts. A spec that was not supplied is not shown. */}
        {product.specs.length ? (
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-xs">
            {product.specs.slice(0, MAX_SPECS).map((spec) => (
              <div key={spec.label} className="flex justify-between gap-4">
                <dt className="shrink-0 text-slate2">{spec.label}</dt>
                <dd className="text-right text-bone/85">{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="flex-1" />

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-5">
          {product.priceNaira !== null ? (
            <p>
              <span className="sr-only">Price: </span>
              <span className="block font-display text-[1.75rem] leading-none text-ember">
                {formatNaira(product.priceNaira)}
              </span>
            </p>
          ) : (
            <p className="font-display text-base uppercase tracking-[0.08em] text-ember">Price on request</p>
          )}
          <p className="flex items-center gap-1.5 pb-0.5 text-[0.6875rem] text-ash">
            <Check className="h-3.5 w-3.5 shrink-0 text-ember" aria-hidden />
            {product.availability}
          </p>
        </div>

        <p className="mt-2 text-[0.6875rem] text-slate2">Free delivery &amp; installation · Pay on delivery</p>

        <WhatsAppLink href={productLink(product)} size="md" className="mt-5 w-full">
          Order on WhatsApp
        </WhatsAppLink>
      </div>
    </article>
  )
}
