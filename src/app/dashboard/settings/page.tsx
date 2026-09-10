import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ButtonLink } from '@/components/ui'
import { PanelHeader } from '@/components/dashboard/ui'
import { ProfileForm } from '@/components/dashboard/profile-form'
import { getProfile } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { getUser } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Settings',
  description: 'Manage your RoadBoy Gym&Sports account.',
  path: '/dashboard/settings',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getUser()
  if (!user) redirect('/login?next=/dashboard/settings')

  const profile = await getProfile(user.id)
  const fullName = typeof profile?.full_name === 'string' ? profile.full_name : ''

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader eyebrow="Account" title="Settings" lede="Your details, your password and where to get help." />

      <section className="mt-10" aria-labelledby="details">
        <h2 id="details" className="font-display text-xl uppercase leading-none">
          Your details
        </h2>
        <div className="mt-6">
          <ProfileForm userId={user.id} fullName={fullName} email={user.email ?? ''} />
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-10" aria-labelledby="security">
        <h2 id="security" className="font-display text-xl uppercase leading-none">
          Security
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ash">
          We will email you a secure link to set a new password. The link expires after one hour.
        </p>
        <ButtonLink href="/reset-password" variant="outline" className="mt-6">
          Change password
        </ButtonLink>

        <dl className="mt-10 grid max-w-lg gap-px border-l border-t border-line sm:grid-cols-2">
          <div className="border-b border-r border-line p-5">
            <dt className="font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2">Member since</dt>
            <dd className="mt-2 text-sm text-ash">{user.created_at ? formatDate(user.created_at) : '—'}</dd>
          </div>
          <div className="border-b border-r border-line p-5">
            <dt className="font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2">Account type</dt>
            <dd className="mt-2 text-sm text-ash">
              {typeof profile?.role === 'string' && profile.role === 'admin' ? 'Administrator' : 'Member'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-14 border-t border-line pt-10" aria-labelledby="help">
        <h2 id="help" className="font-display text-xl uppercase leading-none">
          Need a hand?
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ash">
          Something not working, a program missing, or a question about a payment? Email{' '}
          <a href={`mailto:${SITE.contact.supportEmail}`} className="text-ember link-underline">
            {SITE.contact.supportEmail}
          </a>{' '}
          or message the gym on WhatsApp — we answer both within a working day.
        </p>
        <p className="mt-6 text-sm">
          <Link href="/contact" className="text-ash link-underline hover:text-ember">
            All contact details
          </Link>
        </p>
      </section>
    </div>
  )
}
