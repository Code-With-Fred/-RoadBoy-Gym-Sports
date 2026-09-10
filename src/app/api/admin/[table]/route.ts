import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Admin CRUD.
 *
 * Three guards, deliberately layered:
 *  1. Only the tables in ADMIN_TABLES can be addressed at all, so the dynamic
 *     segment can never be pointed at `profiles` or an auth table.
 *  2. The caller must hold the `admin` role on their profile.
 *  3. Writes go through the *user's* client, so Row Level Security applies —
 *     a stolen session for a non-admin still cannot write.
 *
 * The service-role key is intentionally not used here. Only the payment
 * webhook, which acts as the system rather than as a person, gets that.
 */
const ADMIN_TABLES = [
  'programs',
  'program_weeks',
  'workouts',
  'exercises',
  'trainers',
  'testimonials',
  'transformations',
  'gym_gallery',
  'memberships',
  'categories',
] as const

type AdminTable = (typeof ADMIN_TABLES)[number]

function isAdminTable(value: string): value is AdminTable {
  return (ADMIN_TABLES as readonly string[]).includes(value)
}

async function requireAdmin() {
  const supabase = await createClient()
  if (!supabase) return { error: NextResponse.json({ error: 'Backend not configured.' }, { status: 503 }) }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: NextResponse.json({ error: 'Not signed in.' }, { status: 401 }) }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Admin access required.' }, { status: 403 }) }
  }

  return { supabase, user }
}

export async function POST(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params
  if (!isAdminTable(table)) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 })

  const guard = await requireAdmin()
  if (guard.error) return guard.error

  let body: { record?: Record<string, unknown> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.record || typeof body.record !== 'object') {
    return NextResponse.json({ error: 'Missing record.' }, { status: 400 })
  }

  const { data, error } = await guard.supabase.from(table).insert(body.record).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true, record: data })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params
  if (!isAdminTable(table)) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 })

  const guard = await requireAdmin()
  if (guard.error) return guard.error

  let body: { id?: string; record?: Record<string, unknown> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 })
  if (!body.record) return NextResponse.json({ error: 'Missing record.' }, { status: 400 })

  const { data, error } = await guard.supabase
    .from(table)
    .update({ ...body.record, updated_at: new Date().toISOString() })
    .eq('id', body.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true, record: data })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params
  if (!isAdminTable(table)) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 })

  const guard = await requireAdmin()
  if (guard.error) return guard.error

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 })

  const { error } = await guard.supabase.from(table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}
