import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '../legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description: `The terms covering ${SITE.name} gym membership, digital workout programs and use of this website.`,
  path: '/terms',
})

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="10 September 2026"
      intro={`The agreement between you and ${SITE.name} covering membership, digital programs and this website.`}
      sections={[
        {
          heading: 'Who we are',
          body: (
            <p>
              {SITE.name} operates a gym at {SITE.address.line1}, {SITE.address.line2}, {SITE.address.city}, and sells
              digital training programs through this website. You can reach us at{' '}
              <a href={`mailto:${SITE.contact.email}`} className="text-ember link-underline">
                {SITE.contact.email}
              </a>{' '}
              or {SITE.contact.phone}.
            </p>
          ),
        },
        {
          heading: 'Digital programs',
          body: (
            <>
              <p>
                A program is a one-off purchase, not a subscription. Once payment clears, the program is added to your
                account and stays there — including any future updates we make to it. There is nothing to cancel.
              </p>
              <p>
                Programs are licensed for your own personal training use. You may not resell them, share your account,
                or redistribute the workouts or exercise content.
              </p>
            </>
          ),
        },
        {
          heading: 'Refunds',
          body: (
            <p>
              Because a program is delivered immediately and in full, we do not offer refunds simply for a change of
              mind. If a program does not work as described, is not what the sales page promised, or you were charged
              in error, email{' '}
              <a href={`mailto:${SITE.contact.supportEmail}`} className="text-ember link-underline">
                {SITE.contact.supportEmail}
              </a>{' '}
              within 14 days with your payment reference and we will put it right.
            </p>
          ),
        },
        {
          heading: 'Gym membership',
          body: (
            <>
              <p>
                Membership runs month to month with no fixed contract. You can cancel with fourteen days notice, and
                freeze for up to three months a year at no cost.
              </p>
              <p>
                While training with us you agree to follow the gym rules, re-rack your weights, use equipment as
                intended, and tell a coach about any injury or condition that affects how you should train.
              </p>
            </>
          ),
        },
        {
          heading: 'Training carries risk',
          body: (
            <>
              <p>
                Exercise carries an inherent risk of injury. Our programs and coaching are general fitness guidance,
                not medical advice, and nothing on this site diagnoses or treats any condition.
              </p>
              <p>
                Speak to a doctor before starting any new program, particularly if you are pregnant, recovering from
                injury or illness, or managing an existing health condition. Stop and seek help if something hurts in
                a way it should not. You train at your own risk.
              </p>
            </>
          ),
        },
        {
          heading: 'Results',
          body: (
            <p>
              The member results shown on this site are individual outcomes, shared with permission, alongside the
              program each person followed and how long it took. They are not typical, promised or predictive. What
              you get out of training depends on your starting point, your consistency, your nutrition, your sleep and
              your health.
            </p>
          ),
        },
        {
          heading: 'Payments',
          body: (
            <p>
              Payments are processed by Paystack. We never see or store your card details — only the transaction
              reference needed to reconcile your order. Prices are in Nigerian Naira and include VAT where it applies.
            </p>
          ),
        },
        {
          heading: 'Your account',
          body: (
            <p>
              Keep your password to yourself and let us know immediately if you think someone else has access. We may
              suspend an account that is being shared, resold, or used to redistribute our programs.
            </p>
          ),
        },
        {
          heading: 'Changes',
          body: (
            <p>
              We may update these terms as the business changes. Material changes will be posted here with a new date
              at the top, and if you hold an active membership we will tell you directly. See also our{' '}
              <Link href="/privacy" className="text-ember link-underline">
                privacy policy
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
