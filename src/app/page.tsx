import { JsonLd } from '@/components/ui'
import { FloatingWhatsApp } from '@/components/site/floating-whatsapp'
import { Footer } from '@/components/site/footer'
import { Navbar } from '@/components/site/navbar'
import { Audiences } from '@/components/sections/audiences'
import { Benefits } from '@/components/sections/benefits'
import { Catalogue } from '@/components/sections/catalogue'
import { Delivery } from '@/components/sections/delivery'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'
import { Hero } from '@/components/sections/hero'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Reviews } from '@/components/sections/reviews'
import { WhyRoadBoy } from '@/components/sections/why-roadboy'
import { FAQS } from '@/lib/faqs'
import { faqSchema, organisationSchema, serviceSchema } from '@/lib/seo'

/**
 * The landing page.
 *
 * One page, one job: get the visitor to WhatsApp with a message that says what
 * they want. The order is deliberate — show the promise, prove it, show the
 * goods, explain the service, remove the doubt, then ask.
 */
export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main">
        <Hero />
        <Benefits />
        <Catalogue />
        <Audiences />
        <WhyRoadBoy />
        <HowItWorks />
        <Delivery />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <FloatingWhatsApp />

      <JsonLd data={organisationSchema()} />
      <JsonLd data={serviceSchema()} />
      <JsonLd data={faqSchema(FAQS)} />
    </>
  )
}
