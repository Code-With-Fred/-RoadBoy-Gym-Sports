import { ArrowRight, BadgeCheck, Truck, Wallet, Wrench } from 'lucide-react'
import { ButtonLink, WhatsAppLink } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import { IMAGES } from '@/lib/images'
import { waGeneral } from '@/lib/whatsapp'

const TRUST = [
  { icon: Truck, label: 'Free delivery' },
  { icon: Wrench, label: 'Free installation' },
  { icon: Wallet, label: 'Pay on delivery' },
  { icon: BadgeCheck, label: '3-day delivery' },
]

/**
 * The hero carries the whole proposition above the fold: what is sold, the four
 * reasons to buy here, and one obvious action.
 *
 * Its photograph is the only `priority` image on the page — it is the LCP
 * element, so it preloads while everything below stays lazy.
 */
export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        <SmartImage src={IMAGES.hero.src} alt={IMAGES.hero.alt} width={2000} quality={76} priority sizes="100vw" />
        {/* Two-stop scrim: keeps the type readable without flattening the photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/35 to-transparent" />
      </div>

      <div className="container relative pb-10 pt-32 md:pb-14">
        <div className="max-w-4xl">
          <p className="eyebrow eyebrow-rule animate-fade-in">
            Gym &amp; sports equipment · Nationwide delivery
          </p>

          <h1 className="mt-7 text-display-xl text-balance animate-fade-up" style={{ animationDelay: '80ms' }}>
            Quality gym equipment.
            <br />
            <span className="text-ember">Delivered</span> to your door.
          </h1>

          <p
            className="mt-8 max-w-2xl text-lede text-bone/85 text-pretty animate-fade-up"
            style={{ animationDelay: '180ms' }}
          >
            Shop premium gym and sports equipment with free nationwide delivery, free installation and payment on
            delivery.
          </p>

          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-up"
            style={{ animationDelay: '280ms' }}
          >
            <WhatsAppLink href={waGeneral()} size="lg">
              Order on WhatsApp
            </WhatsAppLink>
            <ButtonLink href="#equipment" variant="outline" size="lg">
              View equipment
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                aria-hidden
              />
            </ButtonLink>
          </div>

          <p
            className="mt-7 text-sm leading-relaxed text-ash animate-fade-up"
            style={{ animationDelay: '380ms' }}
          >
            Nationwide delivery <span className="mx-1.5 text-slate2">•</span> Up to 3-day fulfillment
            <span className="mx-1.5 text-slate2">•</span> Pay on delivery
          </p>
        </div>
      </div>

      {/* Trust strip — the four promises, repeated at the fold. */}
      <div className="relative border-y border-line bg-ink/70 backdrop-blur-sm">
        <ul className="container grid grid-cols-2 divide-x divide-y divide-line md:grid-cols-4 md:divide-y-0">
          {TRUST.map((item) => (
            <li key={item.label} className="flex items-center justify-center gap-3 px-3 py-5 md:py-6">
              <item.icon className="h-5 w-5 shrink-0 text-ember" aria-hidden />
              <span className="font-display text-[0.6875rem] uppercase tracking-[0.16em] text-bone sm:text-xs">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
