import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { buildMetadata } from '@/lib/seo'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const metadata: Metadata = buildMetadata({
  title: 'Log In',
  description: 'Log in to your RoadBoy Gym&Sports account to access your workout programs and track your progress.',
  path: '/login',
  noIndex: true,
})

export default function Page() {
  return (
    <AuthShell
      title="Welcome back."
      lede="Log in to reach your programs, your progress and the sessions waiting for you."
      footer={
        <>
          New here?{' '}
          <Link href="/signup" className="text-ember link-underline">
            Create an account
          </Link>{' '}
          — it takes about thirty seconds.
        </>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse bg-steel" />}>
        <AuthForm mode="login" configured={isSupabaseConfigured()} />
      </Suspense>
    </AuthShell>
  )
}
