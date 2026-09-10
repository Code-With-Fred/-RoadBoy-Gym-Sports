import Link from 'next/link'
import { Section, SectionHeading } from '@/components/ui'
import { Pricing } from '@/components/membership/pricing'
import { getMemberships } from '@/lib/data'

export async function MembershipSection() {
  const plans = await getMemberships()

  return (
    <Section id="membership">
      <div className="container">
        <SectionHeading
          eyebrow="Membership"
          title="Choose your membership."
          lede="One monthly price, no contract, cancel whenever you like. Every plan includes a free induction session with a coach."
          align="center"
        />

        <Pricing plans={plans} className="mt-14" />

        <p className="mt-10 text-center text-sm text-ash">
          Training from outside Lagos?{' '}
          <Link href="/programs" className="text-ember link-underline">
            Buy a workout program instead
          </Link>{' '}
          — no membership required.
        </p>
      </div>
    </Section>
  )
}
