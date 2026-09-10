import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/admin-shell'
import { isAdmin } from '@/lib/data'
import { getUser } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * Admin is role-gated in three places: middleware redirects, this layout
 * redirects, and Row Level Security refuses the queries. Any one of them would
 * do; all three means a mistake in one is not a breach.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login?next=/admin')

  const allowed = await isAdmin(user.id)
  if (!allowed) redirect('/dashboard')

  return (
    <main id="main">
      <AdminShell email={user.email ?? ''}>{children}</AdminShell>
    </main>
  )
}
