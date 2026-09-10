import type { Metadata } from 'next'
import { Badge } from '@/components/ui'
import { PanelHeader, StatTile } from '@/components/dashboard/ui'
import { DataTable } from '@/components/admin/data-table'
import { PROGRAM_BY_SLUG } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Customers — Admin',
  description: 'RoadBoy Gym&Sports customer list.',
  path: '/admin/customers',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

type Customer = {
  id: string
  full_name?: string
  email?: string
  role?: string
  created_at?: string
  user_programs?: Array<{ program_slug: string; current_week: number }>
}

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  // Joined here rather than in adminRows because the console needs each
  // customer's programs alongside them, not as a second lookup per row.
  const { data } = supabase
    ? await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at, user_programs(program_slug, current_week)')
        .order('created_at', { ascending: false })
    : { data: null }

  const customers = (data ?? []) as Customer[]
  const withPrograms = customers.filter((customer) => (customer.user_programs?.length ?? 0) > 0)

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader
        eyebrow="Business"
        title="Customers"
        lede="Everyone with a RoadBoy account, and the programs they own. Read-only — customers manage their own details."
      />

      <section className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Customer summary">
        <StatTile label="Accounts" value={customers.length} hint="Total registered" />
        <StatTile label="Paying customers" value={withPrograms.length} hint="Own at least one program" />
        <StatTile
          label="Conversion"
          value={customers.length ? `${Math.round((withPrograms.length / customers.length) * 100)}%` : '—'}
          hint="Accounts that have bought"
        />
      </section>

      <div className="mt-10">
        <DataTable
          caption="All customers"
          rows={customers}
          getKey={(customer) => customer.id}
          empty="No customers yet. Accounts appear here as soon as people sign up."
          columns={[
            {
              header: 'Name',
              cell: (customer) => <span className="text-bone">{customer.full_name || '—'}</span>,
            },
            { header: 'Email', cell: (customer) => customer.email ?? '—' },
            {
              header: 'Joined',
              cell: (customer) => (customer.created_at ? formatDate(customer.created_at) : '—'),
            },
            {
              header: 'Programs',
              cell: (customer) =>
                customer.user_programs?.length ? (
                  <ul className="space-y-1">
                    {customer.user_programs.map((item) => (
                      <li key={item.program_slug} className="text-xs">
                        <span className="text-bone">
                          {PROGRAM_BY_SLUG[item.program_slug]?.name ?? item.program_slug}
                        </span>
                        <span className="text-slate2"> · week {item.current_week}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-slate2">None</span>
                ),
            },
            {
              header: 'Role',
              align: 'right',
              cell: (customer) =>
                customer.role === 'admin' ? <Badge tone="ember">Admin</Badge> : <Badge tone="outline">Member</Badge>,
            },
          ]}
        />
      </div>

      <p className="mt-8 text-xs leading-relaxed text-slate2">
        Handle this list carefully — it is personal data. Only grant the admin role to staff who genuinely need it, and
        remove it the day they leave.
      </p>
    </div>
  )
}
