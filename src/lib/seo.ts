import type { Metadata } from 'next'
import { IMAGES, sized } from '@/lib/images'
import { SITE } from '@/lib/site'
import type { Program, Trainer } from '@/lib/types'

const OG_IMAGE = sized(IMAGES.og.src, 1200, 80)

/** Page metadata with canonical, Open Graph and Twitter cards filled in. */
export function buildMetadata({
  title,
  description,
  path = '/',
  image = OG_IMAGE,
  type = 'website',
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
}): Metadata {
  const url = `${SITE.url}${path === '/' ? '' : path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE.name}`,
      description,
      images: [image],
    },
  }
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                             */
/* -------------------------------------------------------------------------- */

/**
 * HealthClub + LocalBusiness. This is the markup that matters for
 * "gym near me" style queries — keep the NAP identical to the footer.
 */
export function gymSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['HealthAndBeautyBusiness', 'ExerciseGym', 'LocalBusiness'],
    '@id': `${SITE.url}/#gym`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.contact.phone,
    email: SITE.contact.email,
    image: OG_IMAGE,
    priceRange: '₦₦',
    currenciesAccepted: 'NGN',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SITE.address.line1}, ${SITE.address.line2}`,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.address.lat, longitude: SITE.address.lng },
    openingHoursSpecification: SITE.hoursSchema.map((entry) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: entry.days,
      opens: entry.opens,
      closes: entry.closes,
    })),
    sameAs: SITE.socials.map((social) => social.href),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Memberships and training',
      itemListElement: [
        'Personal training',
        'Strength training',
        'Group training',
        'Cardio and conditioning',
        'Nutrition guidance',
        'Online workout programs',
      ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
    },
  }
}

/** Product markup for a digital program, including its aggregate rating. */
export function programSchema(program: Program) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${program.name} — ${program.weeks} Week Workout Program`,
    description: program.description,
    image: sized(program.image.src, 1200, 80),
    brand: { '@type': 'Brand', name: SITE.name },
    sku: program.slug,
    category: 'Fitness training program',
    offers: {
      '@type': 'Offer',
      url: `${SITE.url}/programs/${program.slug}`,
      priceCurrency: 'NGN',
      price: program.priceNaira,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: SITE.name },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: program.rating,
      reviewCount: program.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

export function trainerSchema(trainer: Trainer) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: trainer.name,
    jobTitle: trainer.role,
    description: trainer.shortBio,
    image: sized(trainer.image.src, 800, 80),
    url: `${SITE.url}/trainers/${trainer.slug}`,
    worksFor: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    knowsAbout: trainer.specialty,
    hasCredential: trainer.certifications,
    sameAs: Object.values(trainer.socials).filter(Boolean),
  }
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE.url}${crumb.path}`,
    })),
  }
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
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
