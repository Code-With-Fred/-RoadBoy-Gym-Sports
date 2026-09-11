import { Building2, Home } from 'lucide-react'
import { Eyebrow, Section, WhatsAppLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { IMAGES } from '@/lib/images'
import { waCommercial, waHomeGym } from '@/lib/whatsapp'

const AUDIENCES = [
  'Homeowners building a personal gym',
  'Commercial gym owners',
  'Hotel fitness centers',
  'Corporate office gyms',
]

/**
 * Splits the two buyers apart and gives each their own WhatsApp route, so the
 * opening message already tells RoadBoy which conversation this is — a single
 * bench, or a full commercial floor.
 */
export function Audiences() {
  return (
    <Section tone="coal">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden">
              <SmartImage
                src={IMAGES.commercial.src}
                alt={IMAGES.commercial.alt}
                width={1200}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow>Who we supply</Eyebrow>
              <h2 className="mt-6 text-display-md text-balance">
                From home gyms to commercial fitness centers.
              </h2>
              <p className="mt-6 text-lede text-ash text-pretty">
                Whether you are setting up a personal gym at home, opening a commercial fitness center, upgrading a
                hotel gym or creating a corporate fitness space, RoadBoy helps you get the equipment you need.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {AUDIENCES.map((audience) => (
                  <li key={audience} className="flex items-start gap-3 text-sm text-ash">
                    <span aria-hidden className="mt-2 h-1 w-4 shrink-0 bg-ember" />
                    {audience}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <WhatsAppLink href={waHomeGym()} size="lg" className="flex-1">
                  <Home className="h-4 w-4 shrink-0" aria-hidden />
                  Build a home gym
                </WhatsAppLink>
                <WhatsAppLink href={waCommercial()} variant="outline" size="lg" className="flex-1" showIcon={false}>
                  <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                  Outfit a commercial gym
                </WhatsAppLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}
