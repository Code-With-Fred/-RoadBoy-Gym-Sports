import { ArrowDown, ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import { IMAGES } from '@/lib/images'

/**
 * Full-bleed hero.
 *
 * The photograph is the only `priority` image on the site — it is the LCP
 * element, so it preloads while everything below stays lazy.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        <SmartImage src={IMAGES.hero.src} alt={IMAGES.hero.alt} width={2000} quality={78} priority sizes="100vw" />
        {/* Two-stop scrim: keeps the type readable without flattening the photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/72 to-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent" />
      </div>

      <div className="container relative pb-16 pt-32 md:pb-24">
        <div className="max-w-4xl">
          <p className="eyebrow eyebrow-rule animate-fade-in">Strength, conditioning &amp; sport · Lekki, Lagos</p>

          <h1
            className="mt-7 text-display-xl text-balance animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            Build your
            <br />
            <span className="text-ember">strongest</span> self.
          </h1>

          <p
            className="mt-8 max-w-xl text-lede text-bone/80 text-pretty animate-fade-up"
            style={{ animationDelay: '180ms' }}
          >
            Train with purpose, follow proven programs, and build the strength, confidence and discipline to become
            your best version.
          </p>

          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-up"
            style={{ animationDelay: '280ms' }}
          >
            <ButtonLink href="/membership" size="lg">
              Start training
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/programs" variant="outline" size="lg">
              Explore programs
            </ButtonLink>
          </div>

          <p
            className="mt-8 max-w-md text-sm leading-relaxed text-ash animate-fade-up"
            style={{ animationDelay: '380ms' }}
          >
            Trusted by athletes, beginners and everyday people committed to getting stronger.
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="container relative hidden pb-10 md:block">
        <a
          href="#more-than-a-gym"
          className="group inline-flex items-center gap-3 text-ash transition-colors hover:text-ember"
        >
          <span className="relative flex h-11 w-6 items-start justify-center overflow-hidden rounded-full border border-white/25">
            <ArrowDown className="mt-1.5 h-3 w-3 animate-scroll-hint" aria-hidden />
          </span>
          <span className="font-display text-[0.6875rem] uppercase tracking-[0.2em]">Scroll</span>
        </a>
      </div>
    </section>
  )
}
