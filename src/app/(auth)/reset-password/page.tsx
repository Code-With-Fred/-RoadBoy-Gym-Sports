import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { buildMetadata } from '@/lib/seo'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const metadata: Metadata = buildMetadata({
  title: 'Reset Password',
  description: 'Reset the password on your RoadBoy Gym&Sports account.',
  path: '/reset-password',
  noIndex: true,
})

export default function Page() {
  return (
    <AuthShell
      title="Reset your password."
      lede="Enter the email you signed up with and we will send you a link to set a new password."
      footer={
        <>
          Remembered it?{' '}
          <Link href="/login" className="text-ember link-underline">
            Back to login
          </Link>
          .
        </>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse bg-steel" />}>
        <AuthForm mode="reset" configured={isSupabaseConfigured()} />
      </Suspense>
    </AuthShell>
  )
}
