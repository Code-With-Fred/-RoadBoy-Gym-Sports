'use client'

import { CheckCircle2, Send } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { Field, Input, LabelledInput, LabelledTextarea, Select } from '@/components/ui/field'
import { MEMBERSHIPS, TRAINERS } from '@/lib/content'

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'message', string>>

/**
 * Enquiry form.
 *
 * Validated on the client for fast feedback and again on the server, which is
 * the check that counts. Pre-selects an interest when the visitor arrives from
 * a pricing card (?plan=) or a coach profile (?coach=).
 */
export function ContactForm() {
  const params = useSearchParams()
  const plan = params.get('plan')
  const coach = params.get('coach')

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')

  const defaultInterest = coach ? 'personal-training' : plan ? `membership-${plan}` : 'membership-standard'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const next: Errors = {}
    if (name.length < 2) next.name = 'Please tell us your name.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) next.email = 'Enter a valid email address.'
    if (phone && phone.replace(/\D/g, '').length < 7) next.phone = 'That phone number looks too short.'
    if (message.length < 10) next.message = 'A sentence or two helps us point you at the right coach.'

    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    setServerError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          interest: String(data.get('interest') ?? ''),
          // Honeypot: real people leave this empty.
          company: String(data.get('company') ?? ''),
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(payload.error ?? 'Something went wrong sending your message.')
      }

      setStatus('sent')
      form.reset()
    } catch (error) {
      setStatus('error')
      setServerError(error instanceof Error ? error.message : 'Something went wrong.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-ember bg-ember-ghost p-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-ember" aria-hidden />
        <h2 className="mt-6 font-display text-2xl uppercase leading-none">Message sent.</h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ash">
          Thanks — a coach will get back to you within one working day. If it is urgent, WhatsApp is faster.
        </p>
        <Button variant="outline" className="mt-8" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <LabelledInput label="Name" name="name" autoComplete="name" required error={errors.name} placeholder="Chidi Okafor" />
        <LabelledInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <LabelledInput
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          error={errors.phone}
          description="Optional — but it is the fastest way to reach you."
          placeholder="+234 800 000 0000"
        />

        <Field label="I am interested in" htmlFor="interest">
          <Select id="interest" name="interest" defaultValue={defaultInterest}>
            <optgroup label="Membership">
              {MEMBERSHIPS.map((membershipPlan) => (
                <option key={membershipPlan.slug} value={`membership-${membershipPlan.slug}`}>
                  {membershipPlan.name} membership
                </option>
              ))}
            </optgroup>
            <optgroup label="Coaching">
              <option value="personal-training">Personal training</option>
              <option value="group-classes">Group classes</option>
              <option value="nutrition">Nutrition guidance</option>
            </optgroup>
            <optgroup label="Other">
              <option value="programs">Online workout programs</option>
              <option value="tour">Book a gym tour</option>
              <option value="other">Something else</option>
            </optgroup>
          </Select>
        </Field>
      </div>

      {coach && TRAINERS.some((trainer) => trainer.slug === coach) ? (
        <input type="hidden" name="coach" value={coach} />
      ) : null}

      <LabelledTextarea
        label="Message"
        name="message"
        required
        error={errors.message}
        placeholder="Tell us where you are starting from and what you want to achieve."
      />

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <Input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' ? (
        <p role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
          {status !== 'sending' ? <Send className="h-4 w-4" aria-hidden /> : null}
        </Button>
        <p className="text-xs leading-relaxed text-slate2">
          We reply within one working day. We never share your details.
        </p>
      </div>
    </form>
  )
}
