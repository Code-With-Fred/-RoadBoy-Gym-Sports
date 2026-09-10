import type { Metadata } from 'next'
import { Badge } from '@/components/ui'
import { PanelHeader, StatTile } from '@/components/dashboard/ui'
import { DataTable } from '@/components/admin/data-table'
import { adminRows } from '@/lib/admin-data'
import { buildMetadata } from '@/lib/seo'
import { formatDate, formatNaira } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Orders — Admin',
  description: 'RoadBoy Gym&Sports order history.',
  path: '/admin/orders',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

type Order = {
  id?: string
  reference?: string
  email?: string
  status?: string
  amount_naira?: number
  created_at?: string
  provider?: string
}

export default async function AdminOrdersPage() {
  const rows = (await adminRows('orders', 'created_at', false)) as Order[]

  const paid = rows.filter((order) => order.status === 'paid')
  const pending = rows.filter((order) => order.status === 'pending')
  const revenue = paid.reduce((sum, order) => sum + (order.amount_naira ?? 0), 0)

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader
        eyebrow="Business"
        title="Orders"
        lede="Every checkout, paid or abandoned. Orders are read-only here — payment state is owned by the provider and updated by the webhook."
      />

      <section className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Order summary">
        <StatTile label="Paid orders" value={paid.length} hint={formatNaira(revenue)} />
        <StatTile label="Pending" value={pending.length} hint="Started but not completed" />
        <StatTile
          label="Average order"
          value={paid.length ? formatNaira(Math.round(revenue / paid.length)) : '—'}
          hint="Across paid orders"
        />
      </section>

      <div className="mt-10">
        <DataTable
          caption="All orders"
          rows={rows}
          getKey={(order) => String(order.id ?? order.reference)}
          empty="No orders yet. The first one will appear here as soon as a program sells."
          columns={[
            { header: 'Date', cell: (order) => (order.created_at ? formatDate(order.created_at) : '—') },
            {
              header: 'Reference',
              cell: (order) => <span className="font-mono text-xs text-slate2">{order.reference ?? '—'}</span>,
            },
            { header: 'Customer', cell: (order) => <span className="text-bone">{order.email ?? '—'}</span> },
            { header: 'Provider', cell: (order) => <span className="capitalize">{order.provider ?? 'paystack'}</span> },
            {
              header: 'Status',
              cell: (order) => (
                <Badge
                  tone={order.status === 'paid' ? 'success' : order.status === 'pending' ? 'outline' : 'neutral'}
                >
                  {order.status ?? 'unknown'}
                </Badge>
              ),
            },
            {
              header: 'Amount',
              align: 'right',
              cell: (order) => (
                <span className="font-display text-bone">{formatNaira(order.amount_naira ?? 0)}</span>
              ),
            },
          ]}
        />
      </div>

      <p className="mt-8 text-xs leading-relaxed text-slate2">
        Card numbers are never stored by this application — Paystack holds them and we keep only their transaction
        reference. Refunds are issued from the Paystack dashboard; the webhook updates the order here.
        {rows.length ? ` Showing ${rows.length} orders.` : ''}
      </p>
    </div>
  )
}
