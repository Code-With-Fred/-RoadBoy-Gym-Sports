import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '../legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `What ${SITE.name} collects, why, and what you can ask us to do with it.`,
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="10 September 2026"
      intro="What we collect, why we collect it, and what you can ask us to do with it."
      sections={[
        {
          heading: 'What we collect',
          body: (
            <>
              <p>
                <strong className="text-bone">If you make an account:</strong> your name, email address and password
                (stored hashed, never in readable form).
              </p>
              <p>
                <strong className="text-bone">If you buy a program:</strong> your email address, the order amount, and
                the payment reference. Card details go directly to Paystack and never reach our servers.
              </p>
              <p>
                <strong className="text-bone">If you train with us online:</strong> which workouts you completed and
                when, so your dashboard can show your progress.
              </p>
              <p>
                <strong className="text-bone">If you contact us:</strong> the name, email, phone number and message
                you send.
              </p>
            </>
          ),
        },
        {
          heading: 'Why we collect it',
          body: (
            <p>
              To give you access to what you bought, show your training progress, answer your enquiry, take payment,
              and meet our accounting obligations. We do not sell your data, and we do not share it with advertisers.
            </p>
          ),
        },
        {
          heading: 'Who processes it',
          body: (
            <>
              <p>
                <strong className="text-bone">Supabase</strong> hosts our database and handles authentication.{' '}
                <strong className="text-bone">Paystack</strong> processes payments and is the only party that sees
                your card details. Our hosting provider serves the website.
              </p>
              <p>Each of them processes your data on our instructions and under their own security commitments.</p>
            </>
          ),
        },
        {
          heading: 'How long we keep it',
          body: (
            <p>
              Account and purchase records are kept while your account is open, and for seven years afterwards where
              tax law requires it. Enquiry messages are deleted once they are resolved and no longer useful.
            </p>
          ),
        },
        {
          heading: 'Keeping it safe',
          body: (
            <p>
              Data is protected by row-level security rules in the database, so one member cannot read another
              member&rsquo;s orders, progress or details. Administrative access is limited to the staff who need it.
              Secret keys are held in server-side environment variables and are never sent to your browser.
            </p>
          ),
        },
        {
          heading: 'Cookies',
          body: (
            <p>
              We use a small number of strictly necessary cookies to keep you signed in and to remember your session.
              There are no advertising or third-party tracking cookies on this site.
            </p>
          ),
        },
        {
          heading: 'Your rights',
          body: (
            <>
              <p>
                Under the Nigeria Data Protection Act you can ask us for a copy of your data, ask us to correct it,
                ask us to delete it, or object to how we use it.
              </p>
              <p>
                Email{' '}
                <a href={`mailto:${SITE.contact.supportEmail}`} className="text-ember link-underline">
                  {SITE.contact.supportEmail}
                </a>{' '}
                and we will respond within 30 days. You can also complain to the Nigeria Data Protection Commission.
              </p>
            </>
          ),
        },
        {
          heading: 'Contact',
          body: (
            <p>
              {SITE.name}, {SITE.address.line1}, {SITE.address.line2}, {SITE.address.city},{' '}
              {SITE.address.countryName}. Phone {SITE.contact.phone}. See also our{' '}
              <Link href="/terms" className="text-ember link-underline">
                terms of service
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
