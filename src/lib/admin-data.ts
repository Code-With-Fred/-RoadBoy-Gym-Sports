import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { RecordRow } from '@/components/admin/resource-manager'

/**
 * Raw table reads for the admin console.
 *
 * Deliberately does *not* fall back to the curated content in src/lib/content:
 * the console must only ever show rows that actually exist and can be edited.
 * An empty table is honest — the public site is serving built-in content, and
 * the empty state says exactly that.
 */
export async function adminRows(table: string, orderBy = 'created_at', ascending = false): Promise<RecordRow[]> {
  try {
    const supabase = await createClient()
    if (!supabase) return []

    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending })
    if (error || !data) return []

    return data as RecordRow[]
  } catch {
    return []
  }
}
