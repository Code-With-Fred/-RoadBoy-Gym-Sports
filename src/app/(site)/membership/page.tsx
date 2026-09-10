import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, Section, SectionHeading } from '@/components/ui'
import { PageHero } from '@/components/site/page-hero'
import { Reveal } from '@/components/site/reveal'
import { StickyCta } from '@/components/site/sticky-cta'
import { Pricing } from '@/components/membership/pricing'
import { FinalCta } from '@/components/home/final-cta'
import { getMemberships } from '@/lib/data'
import { IMAGES } from '@/lib/images'
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Gym Membership in Lekki, Lagos — Plans From ₦20,000/month',
  description:
    'RoadBoy Gym&Sports membership in Lekki, Lagos. Basic from ₦20,000/month, Standard with 50+ classes a week, Premium with personal training and nutrition. No contract, cancel any time.',
  path: '/membership',
})

export const revalidate = 3600

const FAQS = [
  {
    question: 'Is there a joining fee or a contract?',
    answer:
      'No joining fee and no fixed contract. Membership runs month to month and you can cancel any time with fourteen days notice.',
  },
  {
    question: 'Can I try the gym before I join?',
    answer:
      'Yes. Every prospective member gets a free walk-through and a full induction session with a coach — no obligation to sign up afterwards.',
  },
  {
    question: 'What is included in the free induction?',
    answer:
      'Sixty minutes with a coach going through the floor, the equipment you will actually use, and a starting plan based on your experience and goals.',
  },
  {
    question: 'Can I freeze my membership?',
    answer:
      'Yes — you can freeze for up to three months a year for travel, injury or work, at no cost. Just let the front desk know.',
  },
  {
    question: 'Do I need a membership to buy a workout program?',
    answer:
      'No. The digital programs are sold separately and work anywhere. Premium members get one program of their choice included.',
  },
]

const COMPARISON = [
  { feature: 'Gym floor access, all hours', basic: true, standard: true, premium: true },
  { feature: 'Locker and changing rooms', basic: true, standard: true, premium: true },
  { feature: 'Free induction session', basic: true, standard: true, premium: true },
  { feature: 'Group classes (50+ a week)', basic: false, standard: true, premium: true },
  { feature: 'Quarterly fitness assessment', basic: false, standard: true, premium: true },
  { feature: 'Recovery area access', basic: false, standard: true, premium: true },
  { feature: 'Personal training sessions', basic: false, standard: false, premium: '4 / month' },
  { feature: 'Nutrition consultation', basic: false, standard: false, premium: true },
  { feature: 'Digital program included', basic: false, standard: false, premium: true },
  { feature: 'Priority class booking', basic: false, standard: false, premium: true },
]

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === 'string') return <span className="font-display text-xs uppercase tracking-[0.12em] text-ember">{value}</span>
  return value ? (
    <>
      <span aria-hidden className="text-ember">
        ●
      </span>
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <span aria-hidden className="text-slate2">
        –
      </span>
      <span className="sr-only">Not included</span>
    </>
  )
}

export default async function MembershipPage() {
  const plans = await getMemberships()

  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Choose your membership."
        lede="One monthly price. No contract, no joining fee, cancel whenever you need to. Every plan starts with a free induction session."
        image={IMAGES.heroAlt}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Membership' }]}
        align="center"
      />

      <Section className="!pt-14">
        <div className="container">
          <Pricing plans={plans} />
          <p className="mt-10 text-center text-sm text-ash">
            Not in Lagos?{' '}
            <Link href="/programs" className="text-ember link-underline">
              Buy a workout program
            </Link>{' '}
            and train wherever you are.
          </p>
        </div>
      </Section>

      {/* Comparison */}
      <Section tone="coal">
        <div className="container">
          <SectionHeading eyebrow="Side by side" title="What each plan includes." />

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">Membership plan comparison</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="pb-5 font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.slug}
                      scope="col"
                      className="pb-5 text-center font-display text-sm uppercase tracking-[0.12em] text-bone"
                    >
                      {plan.name}
                      <span className="mt-1 block text-[0.625rem] tracking-[0.14em] text-ash">
                        ₦{plan.priceNaira.toLocaleString('en-NG')}/mo
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-line transition-colors hover:bg-ink">
                    <th scope="row" className="py-4 pr-6 text-sm font-normal text-ash">
                      {row.feature}
                    </th>
                    <td className="py-4 text-center">
                      <Cell value={row.basic} />
                    </td>
                    <td className="py-4 text-center">
                      <Cell value={row.standard} />
                    </td>
                    <td className="py-4 text-center">
                      <Cell value={row.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Questions" title="Before you join." />
              <p className="mt-6 text-sm leading-relaxed text-ash">
                Anything else, call {SITE.contact.phone} or come in — the front desk is staffed all opening hours.
              </p>
            </div>

            <dl className="lg:col-span-8">
              {FAQS.map((faq) => (
                <Reveal as="div" key={faq.question} className="border-b border-line py-7 first:border-t">
                  <dt className="font-display text-xl leading-tight">{faq.question}</dt>
                  <dd className="mt-3 max-w-2xl text-sm leading-relaxed text-ash">{faq.answer}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <FinalCta />

      <StickyCta href="/contact?plan=standard" label="Join now" note="From ₦20,000 / month" />

      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Membership', path: '/membership' }])} />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: `${SITE.name} memberships`,
          itemListElement: plans.map((plan) => ({
            '@type': 'Offer',
            name: `${plan.name} membership`,
            price: plan.priceNaira,
            priceCurrency: 'NGN',
            url: `${SITE.url}/membership`,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: plan.priceNaira,
              priceCurrency: 'NGN',
              billingIncrement: 1,
              unitCode: 'MON',
            },
          })),
        }}
      />
    </>
  )
}
