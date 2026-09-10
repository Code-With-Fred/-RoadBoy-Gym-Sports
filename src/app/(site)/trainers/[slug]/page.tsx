import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Award, Instagram, Twitter, Youtube } from 'lucide-react'
import { ButtonLink, JsonLd, Section, SectionHeading } from '@/components/ui'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { StickyCta } from '@/components/site/sticky-cta'
import { ProgramCard } from '@/components/programs/program-card'
import { TRAINERS } from '@/lib/content'
import { getPrograms, getTrainerBySlug, getTrainers } from '@/lib/data'
import { breadcrumbSchema, buildMetadata, trainerSchema } from '@/lib/seo'
import { whatsappLink } from '@/lib/site'

export const revalidate = 3600

export function generateStaticParams() {
  return TRAINERS.map((trainer) => ({ slug: trainer.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const trainer = await getTrainerBySlug(slug)
  if (!trainer) return buildMetadata({ title: 'Trainer not found', description: '', path: `/trainers/${slug}`, noIndex: true })

  return buildMetadata({
    title: `${trainer.name} — ${trainer.role}`,
    description: `${trainer.shortBio} ${trainer.yearsExperience} years experience in ${trainer.specialty} at RoadBoy Gym&Sports, Lekki.`,
    path: `/trainers/${trainer.slug}`,
    image: trainer.image.src,
    type: 'profile',
  })
}

const SOCIAL_ICONS = { instagram: Instagram, x: Twitter, youtube: Youtube } as const

export default async function TrainerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trainer = await getTrainerBySlug(slug)
  if (!trainer) notFound()

  const [programs, allTrainers] = await Promise.all([getPrograms(), getTrainers()])
  const written = programs.filter((program) => trainer.programSlugs.includes(program.slug))
  const colleagues = allTrainers.filter((item) => item.slug !== trainer.slug).slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow={trainer.role}
        title={trainer.name}
        lede={trainer.shortBio}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Trainers', href: '/trainers' },
          { label: trainer.name },
        ]}
        size="sm"
      />

      <Section className="!pt-0">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Portrait + facts */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden">
                <SmartImage
                  src={trainer.image.src}
                  alt={trainer.image.alt}
                  width={1000}
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              <dl className="mt-px grid grid-cols-2 border-l border-t border-line">
                <div className="border-b border-r border-line p-5">
                  <dt className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">Experience</dt>
                  <dd className="mt-2 font-display text-3xl leading-none text-ember">{trainer.yearsExperience} yrs</dd>
                </div>
                <div className="border-b border-r border-line p-5">
                  <dt className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">Specialty</dt>
                  <dd className="mt-2 font-display text-lg uppercase leading-tight">{trainer.specialty}</dd>
                </div>
              </dl>

              <div className="mt-8 space-y-3">
                <ButtonLink href={`/contact?coach=${trainer.slug}`} size="lg" className="w-full">
                  Book a session
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink(`Hi RoadBoy — I would like to book a session with ${trainer.name}.`)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ask on WhatsApp
                </ButtonLink>
              </div>

              {Object.keys(trainer.socials).length ? (
                <ul className="mt-6 flex items-center gap-2">
                  {(Object.keys(SOCIAL_ICONS) as Array<keyof typeof SOCIAL_ICONS>).map((key) => {
                    const href = trainer.socials[key]
                    if (!href) return null
                    const IconComponent = SOCIAL_ICONS[key]
                    return (
                      <li key={key}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${trainer.name} on ${key === 'x' ? 'X' : key}`}
                          className="flex h-10 w-10 items-center justify-center border border-line text-ash transition-colors hover:border-ember hover:text-ember"
                        >
                          <IconComponent className="h-4 w-4" aria-hidden />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>

            {/* Biography */}
            <div className="lg:col-span-7">
              <h2 className="text-display-sm">Biography.</h2>
              <div className="mt-6 space-y-5 text-lede text-ash text-pretty">
                {trainer.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <blockquote className="mt-12 border-l-2 border-ember py-2 pl-6">
                <p className="font-display text-2xl uppercase leading-tight text-bone md:text-3xl">
                  &ldquo;{trainer.philosophy}&rdquo;
                </p>
                <footer className="mt-4 text-xs uppercase tracking-[0.16em] text-slate2">
                  {trainer.name} — Training philosophy
                </footer>
              </blockquote>

              <h2 className="mt-14 text-display-sm">Certifications.</h2>
              <ul className="mt-6 space-y-px border-t border-line">
                {trainer.certifications.map((certification) => (
                  <li key={certification} className="flex items-center gap-4 border-b border-line py-4 text-sm text-ash">
                    <Award className="h-4 w-4 shrink-0 text-ember" aria-hidden />
                    {certification}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {written.length ? (
        <Section tone="coal">
          <div className="container">
            <SectionHeading
              eyebrow="Programs created"
              title={`Written by ${trainer.name.split(' ')[0]}.`}
              lede="The same programming, published exactly as it is coached on the floor."
            />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {written.map((program, index) => (
                <Reveal as="li" key={program.slug} delay={index * 70}>
                  <ProgramCard program={program} />
                </Reveal>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      <Section>
        <div className="container">
          <SectionHeading
            eyebrow="The rest of the team"
            title="Other coaches."
            action={
              <ButtonLink href="/trainers" variant="outline" className="hidden md:inline-flex">
                All trainers
              </ButtonLink>
            }
          />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {colleagues.map((item, index) => (
              <Reveal as="li" key={item.slug} delay={index * 70}>
                <a href={`/trainers/${item.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <SmartImage src={item.image.src} alt={item.image.alt} width={700} zoom sizes="(max-width: 640px) 100vw, 30vw" />
                    <div className="absolute inset-0 overlay-bottom" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="font-display text-2xl leading-none transition-colors group-hover:text-ember">
                        {item.name}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ember">{item.specialty}</p>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <StickyCta href={`/contact?coach=${trainer.slug}`} label="Book" note={`Train with ${trainer.name}`} />

      <JsonLd data={trainerSchema(trainer)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Trainers', path: '/trainers' },
          { name: trainer.name, path: `/trainers/${trainer.slug}` },
        ])}
      />
    </>
  )
}
