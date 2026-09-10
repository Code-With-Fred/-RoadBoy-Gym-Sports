import type { Metadata } from 'next'
import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui'
import { PanelHeader } from '@/components/dashboard/ui'
import { buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const metadata: Metadata = buildMetadata({
  title: 'Settings — Admin',
  description: 'RoadBoy Gym&Sports site configuration.',
  path: '/admin/settings',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

/**
 * Configuration status.
 *
 * Deliberately reports only *whether* a secret is present, never its value —
 * a settings screen that prints keys is a settings screen that leaks them.
 */
export default function AdminSettingsPage() {
  const checks = [
    {
      label: 'Supabase (database and accounts)',
      ready: isSupabaseConfigured(),
      hint: 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
    },
    {
      label: 'Service role key (webhook fulfilment)',
      ready: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hint: 'SUPABASE_SERVICE_ROLE_KEY — server only, never exposed to the browser',
    },
    {
      label: 'Paystack (taking payments)',
      ready: Boolean(process.env.PAYSTACK_SECRET_KEY),
      hint: 'PAYSTACK_SECRET_KEY — server only',
    },
    {
      label: 'Paystack webhook signature',
      ready: Boolean(process.env.PAYSTACK_WEBHOOK_SECRET ?? process.env.PAYSTACK_SECRET_KEY),
      hint: 'PAYSTACK_WEBHOOK_SECRET — falls back to the secret key if unset',
    },
    {
      label: 'Public site URL',
      ready: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      hint: 'NEXT_PUBLIC_SITE_URL — used for canonical URLs and payment callbacks',
    },
  ]

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader
        eyebrow="Console"
        title="Settings"
        lede="What is connected, and where the rest of the gym's details are configured."
      />

      <section className="mt-10" aria-labelledby="integrations">
        <h2 id="integrations" className="font-display text-xl uppercase leading-none">
          Integrations
        </h2>

        <ul className="mt-6 border-t border-line">
          {checks.map((check) => (
            <li key={check.label} className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5">
              <div>
                <p className="text-sm text-bone">{check.label}</p>
                <p className="mt-1.5 font-mono text-xs text-slate2">{check.hint}</p>
              </div>
              {check.ready ? (
                <Badge tone="success">
                  <Check className="h-3 w-3" aria-hidden />
                  Connected
                </Badge>
              ) : (
                <Badge tone="outline">
                  <X className="h-3 w-3" aria-hidden />
                  Not set
                </Badge>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs leading-relaxed text-slate2">
          Secrets live in environment variables, never in the database and never in this screen. Set them in your
          hosting dashboard, or in <code className="bg-steel px-1.5 py-0.5 text-bone">.env.local</code> for local
          development. Restart the server after changing one.
        </p>
      </section>

      <section className="mt-14" aria-labelledby="gym-details">
        <h2 id="gym-details" className="font-display text-xl uppercase leading-none">
          Gym details
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">
          Address, phone number, opening hours and social links are edited in one file —{' '}
          <code className="bg-steel px-1.5 py-0.5 text-xs text-bone">src/lib/site.ts</code>. Changing them there
          updates the footer, contact page, WhatsApp links and the structured data that search engines read for local
          results, all at once.
        </p>

        <dl className="mt-8 grid gap-px border-l border-t border-line sm:grid-cols-2">
          {[
            { term: 'Business name', value: SITE.name },
            { term: 'Address', value: `${SITE.address.line1}, ${SITE.address.line2}, ${SITE.address.city}` },
            { term: 'Phone', value: SITE.contact.phone },
            { term: 'Email', value: SITE.contact.email },
            { term: 'WhatsApp', value: `+${SITE.contact.whatsapp}` },
            { term: 'Public URL', value: SITE.url },
          ].map((row) => (
            <div key={row.term} className="border-b border-r border-line p-5">
              <dt className="font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2">{row.term}</dt>
              <dd className="mt-2 break-words text-sm text-ash">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14" aria-labelledby="images">
        <h2 id="images" className="font-display text-xl uppercase leading-none">
          Replacing the photography
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ash">
          Every stock photograph on the site is referenced from{' '}
          <code className="bg-steel px-1.5 py-0.5 text-xs text-bone">src/lib/images.ts</code>. Upload your own shots to
          Supabase Storage, paste the public URLs over the ones in that file, and the whole site switches over. Gallery
          images, program covers and trainer portraits can also be replaced from this console without touching code.
        </p>
      </section>
    </div>
  )
}
