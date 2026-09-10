import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Enquiry endpoint.
 *
 * Validates server-side (the client checks are only for fast feedback), drops
 * anything that fills the honeypot, and stores the message in `contact_messages`
 * when Supabase is configured so the admin inbox has something to show.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>

  try {
    payload = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const value = (key: string) => (typeof payload[key] === 'string' ? (payload[key] as string).trim() : '')

  const name = value('name')
  const email = value('email')
  const phone = value('phone')
  const message = value('message')
  const interest = value('interest')
  const coach = value('coach')

  // Honeypot. Return 200 so the bot has nothing to learn from the response.
  if (value('company')) return NextResponse.json({ ok: true })

  if (name.length < 2) return NextResponse.json({ error: 'Please provide your name.' }, { status: 400 })
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
  }
  if (message.length < 10) {
    return NextResponse.json({ error: 'Please include a short message.' }, { status: 400 })
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: 'That message is too long.' }, { status: 400 })
  }

  const supabase = await createClient()

  if (supabase) {
    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      phone: phone || null,
      message,
      interest: interest || null,
      coach_slug: coach || null,
    })

    if (error) {
      // Log for the operator, but do not leak database detail to the browser.
      console.error('[contact] insert failed:', error.message)
      return NextResponse.json(
        { error: 'We could not save your message. Please call or WhatsApp us instead.' },
        { status: 500 },
      )
    }
  } else {
    // No backend yet — surface it in the server log so nothing is silently lost.
    console.info('[contact] Supabase not configured. Enquiry received:', { name, email, phone, interest })
  }

  return NextResponse.json({ ok: true })
}
