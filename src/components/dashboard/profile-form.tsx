'use client'

import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { LabelledInput } from '@/components/ui/field'
import { createClient } from '@/lib/supabase/client'

/** Updates the display name on the member's profile row. */
export function ProfileForm({ userId, fullName, email }: { userId: string; fullName: string; email: string }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('fullName') ?? '').trim()

    if (name.length < 2) {
      setStatus('error')
      setError('Please enter your name.')
      return
    }

    setStatus('saving')
    setError('')

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.from('profiles').update({ full_name: name }).eq('id', userId)
      if (updateError) throw updateError

      // Keep the auth metadata in step so the name survives a token refresh.
      await supabase.auth.updateUser({ data: { full_name: name } })

      setStatus('saved')
    } catch (caught) {
      setStatus('error')
      setError(caught instanceof Error ? caught.message : 'Could not save your details.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-6">
      <LabelledInput label="Full name" name="fullName" defaultValue={fullName} required autoComplete="name" />

      <LabelledInput
        label="Email address"
        value={email}
        readOnly
        disabled
        description="Contact support if you need to change the email on your account."
      />

      {status === 'error' ? (
        <p role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {status === 'saved' ? (
        <p className="flex items-center gap-2 text-sm text-ember">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Saved.
        </p>
      ) : null}

      <Button type="submit" disabled={status === 'saving'}>
        {status === 'saving' ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
