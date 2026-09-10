import type { Metadata } from 'next'
import { ButtonLink, JsonLd, Ordinal, Section, SectionHeading } from '@/components/ui'
import { Counter } from '@/components/site/counter'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { FinalCta } from '@/components/home/final-cta'
import { IMAGES } from '@/lib/images'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'About RoadBoy Gym&Sports — A Strength Gym in Lekki, Lagos',
  description:
    'RoadBoy Gym&Sports is a strength, conditioning and sports performance gym in Lekki, Lagos. Ten years, fifteen accredited coaches and five hundred members built around discipline, consistency and measurable results.',
  path: '/about',
})

const TIMELINE = [
  {
    year: '2015',
    title: 'Four racks and a rower',
    body: 'RoadBoy opens in a 180 square metre unit off Admiralty Way with four racks, one rowing machine and eleven founding members.',
  },
  {
    year: '2018',
    title: 'The coaching team',
    body: 'We stop hiring for personality and start hiring for accreditation. Every coach on the floor from this point holds a recognised strength and conditioning qualification.',
  },
  {
    year: '2021',
    title: 'The move',
    body: 'We take over the full ground floor. Eight platforms, a twenty metre turf lane, a dedicated recovery room, and the free weight area we always wanted.',
  },
  {
    year: '2023',
    title: 'RoadBoy Online',
    body: 'Members kept asking for our programming to take away with them. We started publishing the blocks we already coached — the same plans, week by week, on your phone.',
  },
  {
    year: 'Today',
    title: 'Five hundred strong',
    body: 'Fifteen coaches, fifty classes a week, and a training community that notices when you stop showing up.',
  },
]

const VALUES = [
  {
    title: 'Discipline',
    body: 'Motivation is weather. Discipline is climate. We build routines that survive a bad week, a busy month and a missed session.',
  },
  {
    title: 'Strength',
    body: 'Not a look — a capacity. Strength is what makes everything else in training, and most things outside it, easier.',
  },
  {
    title: 'Consistency',
    body: 'The best program is the one you are still running in week ten. We would rather you did three sessions forever than six for a fortnight.',
  },
  {
    title: 'Results',
    body: 'Measured, retested and written down. If we cannot show you the number moved, we have not done our job.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Train hard.
            <br />
            Move better.
            <br />
            <span className="text-ember">Live stronger.</span>
          </>
        }
        lede="RoadBoy Gym&Sports is a strength, conditioning and sports performance gym in Lekki — and a training community built around discipline, consistency and results you can measure."
        image={IMAGES.about}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      {/* Story */}
      <Section>
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading eyebrow="Our story" title="We built the gym we wanted to train in." />
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <div className="space-y-6 text-lede text-ash text-pretty">
                  <p>
                    Every founder of this gym had the same experience somewhere else: paying a membership, walking in
                    without a plan, doing something roughly resembling a workout, and quietly stopping after six weeks.
                  </p>
                  <p>
                    We were convinced the problem was never willpower. It was that nobody was handed a structure worth
                    sticking to, and nobody noticed when they disappeared. So we built the opposite — a floor with
                    coaches on it, programming that progresses, and a front desk that knows your name.
                  </p>
                  <p>
                    Ten years later the equipment has changed and the space has tripled. The premise has not. Give
                    people a plan, teach them to run it properly, and measure what happens.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={140}>
                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <SmartImage src={IMAGES.aboutFloor.src} alt={IMAGES.aboutFloor.alt} width={800} sizes="(max-width: 640px) 100vw, 30vw" />
                  </div>
                  <div className="relative aspect-[4/5] overflow-hidden sm:mt-12">
                    <SmartImage src={IMAGES.community.src} alt={IMAGES.community.alt} width={800} sizes="(max-width: 640px) 100vw, 30vw" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section tone="coal">
        <div className="container">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four words on the wall."
            lede="They are painted above the platforms because they are the only four things we ask of anyone who trains here."
          />

          <ul className="mt-14 grid border-l border-t border-line md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <Reveal as="li" key={value.title} delay={index * 70} className="border-b border-r border-line p-8 lg:p-10">
                <Ordinal index={index + 1} />
                <h3 className="mt-6 font-display text-3xl leading-none text-ember">{value.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ash">{value.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <div className="container">
          <SectionHeading eyebrow="Ten years" title="How we got here." />

          <ol className="mt-14 border-t border-line">
            {TIMELINE.map((entry, index) => (
              <Reveal as="li" key={entry.year} delay={index * 60}>
                <div className="group grid gap-4 border-b border-line py-8 transition-colors duration-300 hover:bg-coal md:grid-cols-12 md:gap-8 md:py-10">
                  <p className="font-display text-2xl leading-none text-ember md:col-span-2 md:text-3xl">
                    {entry.year}
                  </p>
                  <h3 className="font-display text-xl leading-none md:col-span-4">{entry.title}</h3>
                  <p className="text-sm leading-relaxed text-ash md:col-span-6">{entry.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Numbers */}
      <Section tone="coal">
        <div className="container">
          <dl className="grid grid-cols-2 gap-px border-l border-t border-line lg:grid-cols-4">
            {SITE.stats.map((stat, index) => (
              <Reveal as="div" key={stat.label} delay={index * 70} className="border-b border-r border-line px-6 py-10 text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-5xl leading-none text-bone md:text-6xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="mt-4 block font-display text-[0.6875rem] uppercase tracking-[0.18em] text-ash">
                    {stat.label}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>

          <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/facilities" variant="outline" size="lg">
              See the facilities
            </ButtonLink>
            <ButtonLink href="/trainers" size="lg">
              Meet the coaches
            </ButtonLink>
          </div>
        </div>
      </Section>

      <FinalCta />

      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />
    </>
  )
}
