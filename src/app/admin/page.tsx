import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui'
import { PanelHeader, StatTile } from '@/components/dashboard/ui'
import { RankedBars, RevenueChart } from '@/components/admin/charts'
import { DataTable } from '@/components/admin/data-table'
import { getAdminStats } from '@/lib/analytics'
import { buildMetadata } from '@/lib/seo'
import { formatDate, formatNaira } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Admin overview',
  description: 'RoadBoy Gym&Sports admin console.',
  path: '/admin',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader
        eyebrow="Console"
        title="Overview"
        lede="Sales, revenue and members. Everything here is derived from paid orders, so it always matches the money."
      />

      {!stats.connected ? (
        <div className="mt-8 flex gap-4 border border-amber-500/40 bg-amber-500/10 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
          <div className="text-sm leading-relaxed text-amber-200/90">
            <p className="font-display uppercase tracking-[0.14em] text-amber-300">No data source connected</p>
            <p className="mt-2">
              Connect Supabase and run the migrations in <code className="bg-ink px-1.5 py-0.5 text-xs text-bone">supabase/migrations</code>{' '}
              to see live numbers. Until then this console shows the structure but no figures.
            </p>
          </div>
        </div>
      ) : null}

      {/* Headline numbers — these are stat tiles, not charts, because each is a
          single value with no shape to show. */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key figures">
        <StatTile label="Total revenue" value={formatNaira(stats.revenueNaira)} hint="All paid orders" />
        <StatTile label="This month" value={formatNaira(stats.monthlyRevenueNaira)} hint="Since the 1st" />
        <StatTile label="Programs sold" value={stats.programsSold} hint={`${stats.totalSales} paid orders`} />
        <StatTile label="Customers" value={stats.totalCustomers} hint={`${stats.activeMemberships} active memberships`} />
      </section>

      {/* Charts */}
      <section className="mt-4 grid gap-4 xl:grid-cols-5" aria-label="Trends">
        <div className="border border-line bg-steel p-6 xl:col-span-3">
          <h2 className="font-display text-[0.625rem] uppercase tracking-[0.2em] text-slate2">
            Revenue, last 12 months
          </h2>
          <div className="mt-6">
            <RevenueChart data={stats.revenueSeries} title="Revenue by month, last 12 months" />
          </div>
        </div>

        <div className="border border-line bg-steel p-6 xl:col-span-2">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-[0.625rem] uppercase tracking-[0.2em] text-slate2">
              Programs sold
            </h2>
            <Link
              href="/admin/programs"
              className="font-display text-[0.5625rem] uppercase tracking-[0.16em] text-ash transition-colors hover:text-ember"
            >
              Manage
            </Link>
          </div>

          <div className="mt-6">
            <RankedBars data={stats.programSeries} title="Copies sold per program" />
          </div>

          {stats.mostPopularProgram ? (
            <p className="mt-6 border-t border-line pt-4 text-xs text-ash">
              Most popular: <span className="text-bone">{stats.mostPopularProgram}</span>
            </p>
          ) : null}
        </div>
      </section>

      {/* Recent orders */}
      <section className="mt-14" aria-labelledby="recent-orders">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
          <h2 id="recent-orders" className="font-display text-xl uppercase leading-none">
            Recent orders
          </h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 font-display text-[0.625rem] uppercase tracking-[0.16em] text-ash transition-colors hover:text-ember"
          >
            All orders
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>

        <div className="mt-6">
          <DataTable
            caption="The eight most recent orders"
            rows={stats.recentOrders}
            getKey={(order) => order.reference}
            empty="No orders yet. They will appear here the moment the first program sells."
            columns={[
              { header: 'Date', cell: (order) => formatDate(order.createdAt) },
              {
                header: 'Reference',
                cell: (order) => <span className="font-mono text-xs text-slate2">{order.reference}</span>,
              },
              { header: 'Customer', cell: (order) => <span className="text-bone">{order.email}</span> },
              {
                header: 'Status',
                cell: (order) => (
                  <Badge tone={order.status === 'paid' ? 'success' : order.status === 'pending' ? 'outline' : 'neutral'}>
                    {order.status}
                  </Badge>
                ),
              },
              {
                header: 'Amount',
                align: 'right',
                cell: (order) => <span className="font-display text-bone">{formatNaira(order.amountNaira)}</span>,
              },
            ]}
          />
        </div>
      </section>
    </div>
  )
}
