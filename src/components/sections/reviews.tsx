import { Camera, MessageSquareQuote, ShieldCheck, Truck } from 'lucide-react'
import { Section, SectionHeading, WhatsAppLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { REVIEWS } from '@/lib/reviews'
import { waGeneral } from '@/lib/whatsapp'

const SLOTS = [
  { icon: Truck, label: 'Delivery photos' },
  { icon: Camera, label: 'Installation photos' },
  { icon: MessageSquareQuote, label: 'Customer feedback' },
]

/**
 * Social proof.
 *
 * Two states, driven entirely by whether src/lib/reviews.ts has entries. Until
 * it does, this says plainly that we publish real feedback only — which is a
 * stronger trust signal to a cautious buyer than three invented five-star
 * quotes, and it cannot be caught out later.
 */
export function Reviews() {
  const hasReviews = REVIEWS.length > 0

  return (
    <Section id="reviews" tone="coal">
      <div className="container">
        <SectionHeading
          eyebrow="Built around trust"
          title="Real orders. Real customers."
          lede={
            hasReviews
              ? 'Feedback from customers who let us share their delivery and installation.'
              : 'Every review and photo on this page comes from a real RoadBoy customer who gave us permission to share it.'
          }
        />

        {hasReviews ? (
          <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review, index) => (
              <Reveal as="li" key={review.id} delay={index * 70}>
                <figure className="card flex h-full flex-col">
                  {review.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <SmartImage
                        src={review.image.src}
                        alt={review.image.alt}
                        width={800}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col p-7">
                    <MessageSquareQuote className="h-6 w-6 shrink-0 text-ember" aria-hidden />
                    <blockquote className="mt-5 flex-1 text-base leading-relaxed text-bone/90">
                      {review.quote}
                    </blockquote>
                    <figcaption className="mt-6 border-t border-line pt-5">
                      <span className="block font-display text-base uppercase leading-none">{review.name}</span>
                      <span className="mt-2 block text-xs text-slate2">{review.location}</span>
                      <span className="mt-1 block text-xs text-ash">Bought: {review.purchased}</span>
                    </figcaption>
                  </div>
                </figure>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal className="mt-14">
            <div className="border border-line bg-steel">
              <div className="grid gap-px border-b border-line sm:grid-cols-3">
                {SLOTS.map((slot) => (
                  <div
                    key={slot.label}
                    className="flex aspect-[4/3] flex-col items-center justify-center gap-4 border-r border-line p-6 text-center last:border-r-0"
                  >
                    <span className="flex h-14 w-14 items-center justify-center border border-dashed border-white/20 text-slate2">
                      <slot.icon className="h-6 w-6" aria-hidden />
                    </span>
                    <p className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
                      {slot.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-9 text-center md:p-12">
                <ShieldCheck className="mx-auto h-8 w-8 text-ember" aria-hidden />
                <h3 className="mt-6 font-display text-2xl uppercase leading-tight">
                  We only publish reviews we can stand behind
                </h3>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ash">
                  Plenty of sites fill this space with invented testimonials. We would rather show you nothing than
                  show you something we made up. As our customers send in photos of their delivered and installed
                  equipment, they will appear here — with their names on them.
                </p>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate2">
                  Bought from us already? Send us a photo of your setup on WhatsApp and we will ask before publishing
                  anything.
                </p>
                <WhatsAppLink href={waGeneral()} variant="outline" size="lg" className="mt-8">
                  Send us your feedback
                </WhatsAppLink>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  )
}
