import { ArrowRight } from 'lucide-react'
import { ButtonLink, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { TransformationCard } from '@/components/transformations/transformation-card'
import { getTransformations } from '@/lib/data'

export async function Transformations() {
  const all = await getTransformations()
  const featured = all.filter((item) => item.featured).slice(0, 3)

  return (
    <Section tone="coal">
      <div className="container">
        <SectionHeading
          eyebrow="Member results"
          title="Results speak louder."
          lede="Real members, real programs, real timelines. Nobody here changed overnight and none of them claim to have."
          action={
            <ButtonLink href="/transformations" variant="outline" className="hidden md:inline-flex">
              See more transformations
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden />
            </ButtonLink>
          }
        />

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, index) => (
            <Reveal as="li" key={item.id} delay={index * 80}>
              <TransformationCard item={item} />
            </Reveal>
          ))}
        </ul>

        <ButtonLink href="/transformations" variant="outline" size="lg" className="mt-10 w-full md:hidden">
          See more transformations
        </ButtonLink>
      </div>
    </Section>
  )
}
