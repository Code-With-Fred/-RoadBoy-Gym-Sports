import { ArrowRight } from 'lucide-react'
import { ButtonLink, Eyebrow, Section } from '@/components/ui'
import { Counter } from '@/components/site/counter'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { IMAGES } from '@/lib/images'
import { SITE } from '@/lib/site'

/** Editorial introduction — the "who we are" beat of the homepage story. */
export function Intro() {
  return (
    <Section id="more-than-a-gym" className="relative overflow-hidden">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>More than a gym</Eyebrow>
              <h2 className="mt-6 text-display-lg text-balance">
                More than
                <br />a gym.
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-8 space-y-5 text-lede text-ash text-pretty">
                <p>
                  RoadBoy started in 2015 with four racks, a rowing machine and a stubborn belief that most people quit
                  training because nobody ever gave them a plan worth following.
                </p>
                <p>
                  Ten years on we are a five hundred member training community in Lekki, built around three things:
                  discipline, consistency, and progress you can actually measure. Every coach on our floor is
                  accredited. Every program we sell is one we have already run with our own members.
                </p>
                <p className="font-display text-xl uppercase leading-tight tracking-tight text-bone">
                  Your body is built one rep at a time.
                </p>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <ButtonLink href="/trainers" variant="outline" className="mt-10">
                Meet our team
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
              </ButtonLink>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={60}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <SmartImage
                  src={IMAGES.intro.src}
                  alt={IMAGES.intro.alt}
                  width={1400}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>
            </Reveal>

            {/* Stats sit directly under the photograph, sharing its width. */}
            <dl className="mt-px grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
              {SITE.stats.map((stat, index) => (
                <Reveal
                  key={stat.label}
                  delay={index * 70}
                  as="div"
                  className="border-b border-r border-line px-5 py-7"
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl leading-none text-ember md:text-5xl">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="mt-3 block font-display text-[0.6875rem] uppercase tracking-[0.16em] text-ash">
                      {stat.label}
                    </span>
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  )
}
