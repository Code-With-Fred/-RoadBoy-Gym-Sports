import 'server-only'

import { PROGRAM_BY_SLUG } from '@/lib/content'
import { createClient } from '@/lib/supabase/server'
import type { SeriesPoint } from '@/components/admin/charts'

/**
 * Admin analytics.
 *
 * Every figure is derived from the `orders` table rather than stored in a
 * counter, so nothing can drift out of sync with what was actually paid.
 * Returns `connected: false` when Supabase is absent, letting the dashboard say
 * so plainly instead of displaying convincing zeros.
 */
export interface AdminStats {
  connected: boolean
  totalCustomers: number
  totalSales: number
  revenueNaira: number
  monthlyRevenueNaira: number
  activeMemberships: number
  programsSold: number
  mostPopularProgram: string | null
  revenueSeries: SeriesPoint[]
  programSeries: SeriesPoint[]
  recentOrders: Array<{
    reference: string
    email: string
    status: string
    amountNaira: number
    createdAt: string
  }>
}

const EMPTY: AdminStats = {
  connected: false,
  totalCustomers: 0,
  totalSales: 0,
  revenueNaira: 0,
  monthlyRevenueNaira: 0,
  activeMemberships: 0,
  programsSold: 0,
  mostPopularProgram: null,
  revenueSeries: [],
  programSeries: [],
  recentOrders: [],
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()
  if (!supabase) return EMPTY

  try {
    const [ordersResult, customersResult, entitlementsResult, membershipsResult] = await Promise.all([
      supabase
        .from('orders')
        .select('reference, email, status, amount_naira, created_at, order_items(program_slug)')
        .order('created_at', { ascending: false })
        .limit(500),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('user_programs').select('program_slug'),
      supabase.from('member_subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ])

    type OrderRow = {
      reference: string
      email: string
      status: string
      amount_naira: number
      created_at: string
      order_items?: Array<{ program_slug: string }>
    }

    const orders = (ordersResult.data ?? []) as OrderRow[]
    const paid = orders.filter((order) => order.status === 'paid')

    const revenueNaira = paid.reduce((sum, order) => sum + (order.amount_naira ?? 0), 0)

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyRevenueNaira = paid
      .filter((order) => new Date(order.created_at) >= monthStart)
      .reduce((sum, order) => sum + (order.amount_naira ?? 0), 0)

    // Last twelve months, oldest first, so the line reads left to right.
    const revenueSeries: SeriesPoint[] = Array.from({ length: 12 }).map((_, offset) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - offset), 1)
      const next = new Date(date.getFullYear(), date.getMonth() + 1, 1)
      const value = paid
        .filter((order) => {
          const stamp = new Date(order.created_at)
          return stamp >= date && stamp < next
        })
        .reduce((sum, order) => sum + (order.amount_naira ?? 0), 0)
      return { label: MONTHS[date.getMonth()], value }
    })

    // Sales per program, from granted entitlements.
    const counts = new Map<string, number>()
    for (const row of (entitlementsResult.data ?? []) as Array<{ program_slug: string }>) {
      counts.set(row.program_slug, (counts.get(row.program_slug) ?? 0) + 1)
    }

    const programSeries: SeriesPoint[] = [...counts.entries()]
      .map(([slug, value]) => ({ label: PROGRAM_BY_SLUG[slug]?.name ?? slug, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)

    return {
      connected: true,
      totalCustomers: customersResult.count ?? 0,
      totalSales: paid.length,
      revenueNaira,
      monthlyRevenueNaira,
      activeMemberships: membershipsResult.count ?? 0,
      programsSold: entitlementsResult.data?.length ?? 0,
      mostPopularProgram: programSeries[0]?.label ?? null,
      revenueSeries,
      programSeries,
      recentOrders: orders.slice(0, 8).map((order) => ({
        reference: order.reference,
        email: order.email,
        status: order.status,
        amountNaira: order.amount_naira ?? 0,
        createdAt: order.created_at,
      })),
    }
  } catch {
    // A missing table during setup should not take the console down.
    return EMPTY
  }
}
