import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { buildMetadata } from '@/lib/seo'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const metadata: Metadata = buildMetadata({
  title: 'Set New Password',
  description: 'Choose a new password for your RoadBoy Gym&Sports account.',
  path: '/update-password',
  noIndex: true,
})

export default function Page() {
  return (
    <AuthShell
      title="Set a new password."
      lede="Choose something you have not used anywhere else. At least eight characters."
    >
      <Suspense fallback={<div className="h-64 animate-pulse bg-steel" />}>
        <AuthForm mode="update" configured={isSupabaseConfigured()} />
      </Suspense>
    </AuthShell>
  )
}
