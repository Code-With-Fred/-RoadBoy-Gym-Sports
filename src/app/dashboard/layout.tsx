import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { getProfile } from '@/lib/data'
import { getUser } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Middleware already gates this; the second check is what makes the pages
  // below safe to write against a guaranteed user.
  const user = await getUser()
  if (!user) redirect('/login?next=/dashboard')

  const profile = await getProfile(user.id)
  const name =
    (typeof profile?.full_name === 'string' && profile.full_name) || user.email || 'Member'

  return (
    <main id="main">
      <DashboardShell name={name}>{children}</DashboardShell>
    </main>
  )
}
