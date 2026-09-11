import { Check } from 'lucide-react'
import { Badge, WhatsAppLink } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import { productLink, type Product } from '@/lib/products'
import { cn } from '@/lib/utils'

/**
 * A catalogue card.
 *
 * The photograph is the sales pitch, so it takes the top two thirds and gets a
 * restrained zoom on hover. The price line says "Price on request" until a real
 * price is entered in products.ts — a made-up figure on a six-figure purchase
 * is the fastest way to lose a buyer's trust at the door.
 */
export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product
  priority?: boolean
  className?: string
}) {
  return (
    <article className={cn('group card card-hover flex h-full flex-col', className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          src={product.image.src}
          alt={product.image.alt}
          width={800}
          priority={priority}
          zoom
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 overlay-bottom" />
        <Badge tone="neutral" className="absolute left-4 top-4 backdrop-blur-sm">
          {product.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl uppercase leading-tight transition-colors duration-300 group-hover:text-ember">
          {product.name}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">{product.description}</p>

        {/* Specs render only when real figures have been entered. */}
        {product.specs.length ? (
          <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-xs">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-3">
                <dt className="text-slate2">{spec.label}</dt>
                <dd className="text-ash">{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-5 border-t border-line pt-4 text-xs text-slate2">
            Full specifications sent on request
          </p>
        )}

        <p className="mt-4 flex items-center gap-2 text-xs text-ash">
          <Check className="h-3.5 w-3.5 shrink-0 text-ember" aria-hidden />
          {product.availability}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-5">
          <p>
            {product.price ? (
              <span className="font-display text-2xl text-ember">{product.price}</span>
            ) : (
              <>
                <span className="block font-display text-base uppercase tracking-[0.08em] text-ember">
                  Price on request
                </span>
                <span className="mt-1 block text-[0.6875rem] text-slate2">Best price confirmed on WhatsApp</span>
              </>
            )}
          </p>
        </div>

        <WhatsAppLink href={productLink(product)} size="md" className="mt-5 w-full">
          Order on WhatsApp
        </WhatsAppLink>
      </div>
    </article>
  )
}
