import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Badge, ButtonLink } from '@/components/ui'
import { EmptyState, PanelHeader } from '@/components/dashboard/ui'
import { PROGRAM_BY_SLUG } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { createClient, getUser } from '@/lib/supabase/server'
import { formatDate, formatNaira } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Purchases',
  description: 'Your RoadBoy Gym&Sports order history.',
  path: '/dashboard/orders',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

type OrderRow = {
  reference: string
  status: string
  amount_naira: number
  created_at: string
  order_items?: Array<{ program_slug: string; price_naira: number }>
}

export default async function OrdersPage() {
  const user = await getUser()
  if (!user) redirect('/login?next=/dashboard/orders')

  const supabase = await createClient()
  const { data } = supabase
    ? await supabase
        .from('orders')
        .select('reference, status, amount_naira, created_at, order_items(program_slug, price_naira)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    : { data: null }

  const orders = (data ?? []) as OrderRow[]

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader
        eyebrow="Billing"
        title="Purchases"
        lede="Every program you have bought, with its payment reference. Programs are one-off purchases — there is no subscription to cancel."
      />

      {orders.length ? (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <caption className="sr-only">Your order history</caption>
            <thead>
              <tr className="border-b border-line">
                {['Date', 'Reference', 'Items', 'Amount', 'Status'].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="pb-4 font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.reference} className="border-b border-line transition-colors hover:bg-coal">
                  <td className="py-5 pr-6 text-sm text-ash">{formatDate(order.created_at)}</td>
                  <td className="py-5 pr-6 font-mono text-xs text-slate2">{order.reference}</td>
                  <td className="py-5 pr-6 text-sm">
                    <ul className="space-y-1">
                      {(order.order_items ?? []).map((item) => {
                        const program = PROGRAM_BY_SLUG[item.program_slug]
                        return (
                          <li key={item.program_slug}>
                            {program ? (
                              <Link
                                href={`/dashboard/programs/${program.slug}`}
                                className="text-bone transition-colors hover:text-ember"
                              >
                                {program.name}
                              </Link>
                            ) : (
                              <span className="text-ash">{item.program_slug}</span>
                            )}
                          </li>
                        )
                      })}
                      {!order.order_items?.length ? <li className="text-slate2">—</li> : null}
                    </ul>
                  </td>
                  <td className="py-5 pr-6 font-display text-base text-bone">{formatNaira(order.amount_naira)}</td>
                  <td className="py-5">
                    <Badge tone={order.status === 'paid' ? 'success' : order.status === 'pending' ? 'outline' : 'neutral'}>
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No purchases yet"
            body="When you buy a program the receipt and payment reference show up here, alongside lifetime access in your library."
            action={
              <ButtonLink href="/programs" size="lg">
                Browse programs
              </ButtonLink>
            }
          />
        </div>
      )}

      <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-slate2">
        Card details are never stored by RoadBoy — payments are processed entirely by Paystack. For a refund or a
        billing question, email support with your reference and we will look into it.
      </p>
    </div>
  )
}
