import { IMAGES, sized } from './images'
import { PRODUCTS } from './products'
import { SITE } from './site'

/**
 * Structured data.
 *
 * Two deliberate omissions, both because the information has not been supplied
 * and inventing it would be worse than leaving it out:
 *
 *   - No PostalAddress. A fabricated shop address would put a wrong pin on the
 *     map and damage the local listing it was meant to help. `areaServed`
 *     carries the nationwide-delivery signal instead.
 *   - No `offers` price on products. Google penalises prices that disagree with
 *     the page, and the page says "on request".
 *
 * Add a real address in site.ts and prices in products.ts, then extend here.
 */

export function organisationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${SITE.url}/#store`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    image: sized(IMAGES.og.src, 1200, 80),
    telephone: SITE.contact.phoneIntl,
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Cash on delivery',
    areaServed: { '@type': 'Country', name: SITE.countryName },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.contact.phoneIntl,
      contactType: 'sales',
      areaServed: 'NG',
      availableLanguage: ['en'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Gym and sports equipment',
      itemListElement: PRODUCTS.map((product) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: product.name,
          category: product.category,
          description: product.description,
        },
      })),
    },
  }
}

export function faqSchema(items: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/** Makes the delivery and installation promises machine-readable too. */
export function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Gym equipment delivery and installation',
    provider: { '@id': `${SITE.url}/#store` },
    areaServed: { '@type': 'Country', name: SITE.countryName },
    serviceType: 'Gym equipment supply, delivery and installation',
    description:
      'Free nationwide delivery and free on-site installation of gym and sports equipment across Nigeria, with payment on delivery.',
  }
}
