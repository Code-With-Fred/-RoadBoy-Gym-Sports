import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import { ButtonLink, JsonLd, Section } from '@/components/ui'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { ContactForm } from '@/components/contact/contact-form'
import { breadcrumbSchema, buildMetadata, gymSchema } from '@/lib/seo'
import { SITE, mapsLink, whatsappLink } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Contact & Visit the Gym in Lekki Phase 1',
  description: `Visit RoadBoy Gym&Sports at ${SITE.address.line1}, ${SITE.address.line2}, ${SITE.address.city}. Call ${SITE.contact.phone}, message us on WhatsApp, or book a free gym tour.`,
  path: '/contact',
})

export default function ContactPage() {
  const { address, contact, hours, socials } = SITE

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Come and see the place."
        lede="Book a free tour, ask about membership, or just turn up — the front desk is staffed every hour we are open."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        size="sm"
      />

      <Section className="!pt-8">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <h2 className="text-display-sm">Send us a message.</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ash">
                Tell us where you are starting from. There is no wrong answer, and it helps us point you at the right
                coach rather than the most expensive plan.
              </p>

              <div className="mt-10">
                <Suspense fallback={<div className="h-96 animate-pulse bg-steel" />}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-5">
              <div className="border border-line bg-steel">
                <div className="border-b border-line p-7">
                  <h2 className="font-display text-lg uppercase leading-none">Visit the gym</h2>

                  <ul className="mt-6 space-y-5 text-sm">
                    <li className="flex gap-4">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
                      <address className="not-italic leading-relaxed text-ash">
                        {address.line1}
                        <br />
                        {address.line2}
                        <br />
                        {address.city} {address.postalCode}, {address.countryName}
                      </address>
                    </li>
                    <li className="flex gap-4">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
                      <a href={`tel:${contact.phoneHref}`} className="text-ash transition-colors hover:text-bone">
                        {contact.phone}
                      </a>
                    </li>
                    <li className="flex gap-4">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
                      <a href={`mailto:${contact.email}`} className="text-ash transition-colors hover:text-bone">
                        {contact.email}
                      </a>
                    </li>
                  </ul>

                  <ButtonLink
                    href={whatsappLink()}
                    size="lg"
                    className="mt-7 w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Chat on WhatsApp
                  </ButtonLink>
                </div>

                <div className="p-7">
                  <h2 className="flex items-center gap-2 font-display text-lg uppercase leading-none">
                    <Clock className="h-4 w-4 text-ember" aria-hidden />
                    Opening hours
                  </h2>
                  <dl className="mt-5 space-y-3 text-sm">
                    {hours.map((entry) => (
                      <div key={entry.days} className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
                        <dt className="text-ash">{entry.days}</dt>
                        <dd className="font-display tracking-[0.08em] text-bone">
                          {entry.open} – {entry.close}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Map. Swap for an embedded Google Map iframe once the listing exists. */}
              <Reveal className="relative mt-4 aspect-[4/3] overflow-hidden border border-line bg-coal">
                <div aria-hidden className="absolute inset-0 texture-grid opacity-60" />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,74,28,0.16),transparent_58%)]"
                />

                <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ember bg-ink text-ember">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-5 font-display text-lg uppercase leading-none">{SITE.shortName} Lekki</p>
                  <p className="mt-2 text-xs leading-relaxed text-ash">
                    {address.line1}, {address.line2}
                  </p>
                  <ButtonLink
                    href={mapsLink()}
                    variant="outline"
                    size="sm"
                    className="mt-6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="h-3.5 w-3.5" aria-hidden />
                    Open in Maps
                  </ButtonLink>
                </div>
              </Reveal>

              {/* Socials */}
              <div className="mt-4 border border-line bg-steel p-7">
                <h2 className="font-display text-lg uppercase leading-none">Follow the gym</h2>
                <p className="mt-3 text-sm text-ash">
                  Session clips, class timetables and member results — posted most days.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {socials.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between border-b border-line py-2.5 text-sm text-ash transition-colors hover:text-ember"
                      >
                        <span>{social.name}</span>
                        <span className="text-slate2">{social.handle}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <JsonLd data={gymSchema()} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])} />
    </>
  )
}
