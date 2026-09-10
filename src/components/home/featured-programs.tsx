import { ArrowRight } from 'lucide-react'
import { ButtonLink, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { ProgramCard } from '@/components/programs/program-card'
import { getFeaturedPrograms } from '@/lib/data'

/** The commercial heart of the homepage — the digital products. */
export async function FeaturedPrograms() {
  const programs = await getFeaturedPrograms()

  return (
    <Section id="programs">
      <div className="container">
        <SectionHeading
          eyebrow="Digital training programs"
          title="Programs built for results."
          lede="Whether you are starting from zero or pushing toward your next personal best, follow a structured program designed around your goals."
          action={
            <ButtonLink href="/programs" variant="outline" className="hidden md:inline-flex">
              View all programs
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
            </ButtonLink>
          }
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, index) => (
            <Reveal as="li" key={program.slug} delay={index * 70}>
              <ProgramCard program={program} />
            </Reveal>
          ))}
        </ul>

        <ButtonLink href="/programs" variant="outline" size="lg" className="mt-10 w-full md:hidden">
          View all programs
        </ButtonLink>
      </div>
    </Section>
  )
}
