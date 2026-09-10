import { ArrowRight } from 'lucide-react'
import { ButtonLink, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { TrainerCard } from '@/components/trainers/trainer-card'
import { getTrainers } from '@/lib/data'

export async function Trainers() {
  const trainers = (await getTrainers()).slice(0, 4)

  return (
    <Section>
      <div className="container">
        <SectionHeading
          eyebrow="The coaching team"
          title="Coached by people who compete."
          lede="Fifteen accredited coaches. Between them, more than a hundred years of getting people stronger."
          action={
            <ButtonLink href="/trainers" variant="outline" className="hidden md:inline-flex">
              Meet all trainers
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
            </ButtonLink>
          }
        />

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {trainers.map((trainer, index) => (
            <Reveal as="li" key={trainer.slug} delay={index * 70}>
              <TrainerCard trainer={trainer} />
            </Reveal>
          ))}
        </ul>

        <ButtonLink href="/trainers" variant="outline" size="lg" className="mt-10 w-full md:hidden">
          Meet all trainers
        </ButtonLink>
      </div>
    </Section>
  )
}
