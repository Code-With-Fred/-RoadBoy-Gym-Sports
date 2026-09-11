import { ClipboardCheck, Truck, Wallet, Wrench } from 'lucide-react'
import { Eyebrow, Section, WhatsAppLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { IMAGES } from '@/lib/images'
import { waGeneral } from '@/lib/whatsapp'

const STAGES = [
  {
    icon: ClipboardCheck,
    title: 'Order',
    body: 'Choose your equipment and confirm your order on WhatsApp.',
  },
  {
    icon: Truck,
    title: 'Delivery',
    body: 'We deliver nationwide, typically within 3 days.',
  },
  {
    icon: Wrench,
    title: 'Installation',
    body: 'Our team assembles and installs your equipment for free.',
  },
  {
    icon: Wallet,
    title: 'Payment',
    body: "Pay when your equipment arrives and you've verified it.",
  },
]

/**
 * Where "How it works" covers what the customer does, this covers what RoadBoy
 * does — the delivery, installation and pay-on-delivery promises that separate
 * a real supplier from an unknown seller on a marketplace.
 */
export function Delivery() {
  return (
    <Section className="overflow-hidden">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Delivery &amp; installation</Eyebrow>
              <h2 className="mt-6 text-display-md text-balance">
                We bring the gym to your doorstep.
              </h2>
              <p className="mt-6 text-lede text-ash text-pretty">
                You never pay a delivery fee, you never pay an installation fee, and you never pay for anything before
                you have seen it working.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative mt-10 aspect-[4/3] overflow-hidden">
                <SmartImage
                  src={IMAGES.delivery.src}
                  alt={IMAGES.delivery.alt}
                  width={1000}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </Reveal>

            <Reveal delay={140}>
              <WhatsAppLink href={waGeneral()} size="lg" className="mt-8 w-full sm:w-auto">
                Order on WhatsApp
              </WhatsAppLink>
            </Reveal>
          </div>

          {/* Vertical timeline */}
          <div className="lg:col-span-7">
            <ol className="relative">
              {/* The connecting rule stops short of the last marker. */}
              <span aria-hidden className="absolute left-[27px] top-4 bottom-16 w-px bg-line" />

              {STAGES.map((stage, index) => (
                <Reveal as="li" key={stage.title} delay={index * 80} className="relative flex gap-6 pb-10 last:pb-0">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center border border-line bg-ink text-ember">
                    <stage.icon className="h-5 w-5" aria-hidden />
                  </span>

                  <div className="flex-1 pt-1.5">
                    <p className="font-display text-[0.625rem] uppercase tracking-[0.2em] text-slate2">
                      Step {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2.5 font-display text-2xl uppercase leading-none lg:text-3xl">{stage.title}</h3>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-ash">{stage.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  )
}
