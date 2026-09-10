import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { buildMetadata } from '@/lib/seo'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const metadata: Metadata = buildMetadata({
  title: 'Create Account',
  description: 'Create a free RoadBoy Gym&Sports account to buy workout programs and track your training progress.',
  path: '/signup',
  noIndex: true,
})

export default function Page() {
  return (
    <AuthShell
      title="Create your account."
      lede="One account for every program you buy, on every device you train with."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="text-ember link-underline">
            Log in
          </Link>
          .
        </>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse bg-steel" />}>
        <AuthForm mode="signup" configured={isSupabaseConfigured()} />
      </Suspense>
    </AuthShell>
  )
}
