import { IMAGES, sized } from './images'
import { PRODUCTS } from './products'
import { SITE } from './site'

/**
 * Structured data.
 *
 * No PostalAddress, deliberately: none has been supplied, and a fabricated shop
 * address would put a wrong pin on the map and damage the local listing it was
 * meant to help. `areaServed` carries the nationwide-delivery signal instead.
 * Add a real address in site.ts, then extend here.
 *
 * Product prices are included only where the card shows one, so the markup can
 * never disagree with the page — Google penalises that.
 */

/** Structured data needs absolute URLs; local images are stored as paths. */
function absolute(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${SITE.url}${src}`
}

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
        // Price only when the page shows one, so the markup never disagrees
        // with what a visitor sees.
        ...(product.priceNaira !== null ? { price: product.priceNaira, priceCurrency: 'NGN' } : {}),
        itemOffered: {
          '@type': 'Product',
          name: product.name,
          category: product.category,
          description: product.description,
          ...(product.image ? { image: absolute(product.image.src) } : {}),
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
