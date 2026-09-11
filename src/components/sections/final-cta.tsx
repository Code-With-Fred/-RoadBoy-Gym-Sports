import { ButtonLink, WhatsAppLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { IMAGES } from '@/lib/images'
import { SITE } from '@/lib/site'
import { waQuote } from '@/lib/whatsapp'

/** The closing ask. One loud action, one quiet one, and the promises repeated. */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SmartImage src={IMAGES.finalCta.src} alt="" width={1900} quality={66} sizes="100vw" />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
      </div>

      <div className="container py-section">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Free delivery · Free installation · Pay on delivery</p>

          <h2 className="mt-6 text-display-lg text-balance">Ready to build your gym?</h2>

          <p className="mx-auto mt-7 max-w-xl text-lede text-bone/85 text-pretty">
            Get quality gym equipment delivered and installed anywhere in Nigeria. No delivery fee. No installation
            fee. Pay when your order arrives.
          </p>

          <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
            <WhatsAppLink href={waQuote()} size="lg">
              Order on WhatsApp
            </WhatsAppLink>
            <ButtonLink href="#equipment" variant="solid" size="lg">
              View equipment
            </ButtonLink>
          </div>

          <p className="mt-8 text-sm text-ash">
            Or call us on{' '}
            <a href={`tel:${SITE.contact.phoneIntl}`} className="text-bone link-underline">
              {SITE.contact.phoneDisplay}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
