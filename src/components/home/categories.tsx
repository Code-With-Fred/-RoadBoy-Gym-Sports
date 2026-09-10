import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { CATEGORIES } from '@/lib/content'

/**
 * Muscle-group entry points into the workout library.
 *
 * A horizontal snap rail: tall portrait tiles that stay one gesture away on a
 * phone and read as an editorial strip on desktop. Each tile deep-links to the
 * library pre-filtered to that muscle group.
 */
export function Categories() {
  return (
    <Section tone="coal" className="overflow-hidden">
      <div className="container">
        <SectionHeading
          eyebrow="Workout library"
          title="Pick a muscle. Start there."
          lede="Hundreds of sessions, sorted the way you actually think about training."
        />
      </div>

      <Reveal>
        <ul className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:px-6 lg:px-[max(2rem,calc((100vw-1360px)/2+2rem))]">
          {CATEGORIES.map((category) => (
            <li key={category.slug} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-[19rem]">
              <Link
                href={`/workouts?muscle=${category.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden"
              >
                <SmartImage
                  src={category.image.src}
                  alt={category.image.alt}
                  width={700}
                  zoom
                  sizes="(max-width: 640px) 62vw, (max-width: 1024px) 38vw, 19rem"
                />
                <div className="absolute inset-0 overlay-bottom" />
                <div className="absolute inset-0 bg-ember/0 transition-colors duration-500 group-hover:bg-ember/15" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <h3 className="font-display text-3xl leading-none">{category.name}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-bone/60">{category.blurb}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/30 text-bone transition-colors duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
