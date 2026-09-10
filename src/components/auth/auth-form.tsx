'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { LabelledInput } from '@/components/ui/field'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup' | 'reset' | 'update'

const COPY: Record<Mode, { submit: string; busy: string }> = {
  login: { submit: 'Log in', busy: 'Logging in…' },
  signup: { submit: 'Create account', busy: 'Creating account…' },
  reset: { submit: 'Send reset link', busy: 'Sending…' },
  update: { submit: 'Set new password', busy: 'Saving…' },
}

/**
 * One form for all four auth flows.
 *
 * Supabase errors are mapped to plain language — "Invalid login credentials"
 * helps nobody — and the whole form degrades to a clear setup notice when the
 * backend has not been connected yet.
 */
export function AuthForm({ mode, configured }: { mode: Mode; configured: boolean }) {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/dashboard'

  const [status, setStatus] = useState<'idle' | 'busy' | 'error' | 'done'>('idle')
  const [error, setError] = useState('')

  if (!configured) {
    return (
      <div className="flex gap-4 border border-amber-500/40 bg-amber-500/10 p-6">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
        <div className="text-sm leading-relaxed text-amber-200/90">
          <p className="font-display uppercase tracking-[0.14em] text-amber-300">Accounts not connected</p>
          <p className="mt-2">
            Member accounts run on Supabase. Add <code className="bg-ink px-1.5 py-0.5 text-xs text-bone">NEXT_PUBLIC_SUPABASE_URL</code>{' '}
            and <code className="bg-ink px-1.5 py-0.5 text-xs text-bone">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to
            <code className="mx-1 bg-ink px-1.5 py-0.5 text-xs text-bone">.env.local</code>, run the migrations in{' '}
            <code className="bg-ink px-1.5 py-0.5 text-xs text-bone">supabase/migrations</code>, and this form goes
            live.
          </p>
          <p className="mt-4">
            <Link href="/programs" className="underline underline-offset-4 hover:text-amber-100">
              Browse programs in the meantime
            </Link>
          </p>
        </div>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="border border-ember bg-ember-ghost p-8 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-ember" aria-hidden />
        <h2 className="mt-5 font-display text-xl uppercase leading-none">
          {mode === 'reset' ? 'Check your email' : 'Almost there'}
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ash">
          {mode === 'reset'
            ? 'If that address has an account, a password reset link is on its way. It expires in one hour.'
            : 'We have sent you a confirmation link. Click it to activate your account and start training.'}
        </p>
      </div>
    )
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')
    const fullName = String(data.get('fullName') ?? '').trim()

    setStatus('busy')
    setError('')

    try {
      const supabase = createClient()

      if (mode === 'login') {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
        router.push(next)
        router.refresh()
        return
      }

      if (mode === 'signup') {
        if (password.length < 8) throw new Error('Password must be at least 8 characters.')
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        })
        if (authError) throw authError
        setStatus('done')
        return
      }

      if (mode === 'reset') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        })
        if (authError) throw authError
        setStatus('done')
        return
      }

      // mode === 'update'
      if (password.length < 8) throw new Error('Password must be at least 8 characters.')
      const { error: authError } = await supabase.auth.updateUser({ password })
      if (authError) throw authError
      router.push('/dashboard')
      router.refresh()
    } catch (caught) {
      const raw = caught instanceof Error ? caught.message : 'Something went wrong.'
      setStatus('error')
      setError(
        raw === 'Invalid login credentials'
          ? 'That email and password do not match an account.'
          : raw.includes('already registered')
            ? 'There is already an account with that email. Try logging in instead.'
            : raw,
      )
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {mode === 'signup' ? (
        <LabelledInput label="Full name" name="fullName" autoComplete="name" required placeholder="Chidi Okafor" />
      ) : null}

      {mode !== 'update' ? (
        <LabelledInput
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      ) : null}

      {mode !== 'reset' ? (
        <LabelledInput
          label={mode === 'update' ? 'New password' : 'Password'}
          name="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
          minLength={8}
          description={mode === 'login' ? undefined : 'At least 8 characters.'}
          placeholder="••••••••"
        />
      ) : null}

      {mode === 'login' ? (
        <div className="flex justify-end">
          <Link href="/reset-password" className="text-xs text-ash link-underline hover:text-ember">
            Forgot your password?
          </Link>
        </div>
      ) : null}

      {status === 'error' ? (
        <p role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={status === 'busy'}>
        {status === 'busy' ? COPY[mode].busy : COPY[mode].submit}
      </Button>
    </form>
  )
}
