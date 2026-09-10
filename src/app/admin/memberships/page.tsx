import type { Metadata } from 'next'
import { PanelHeader } from '@/components/dashboard/ui'
import { ResourceManager, type FieldSchema } from '@/components/admin/resource-manager'
import { adminRows } from '@/lib/admin-data'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Memberships — Admin',
  description: 'Manage gym membership plans and prices.',
  path: '/admin/memberships',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

const FIELDS: FieldSchema[] = [
  { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'standard' },
  { name: 'name', label: 'Plan name', type: 'text', required: true },
  { name: 'price_naira', label: 'Monthly price in Naira', type: 'number', required: true },
  { name: 'summary', label: 'Summary', type: 'text', required: true, help: 'One line under the plan name.' },
  { name: 'features', label: 'Features', type: 'list', required: true, help: 'One per line.' },
  { name: 'highlight', label: 'Highlight this plan', type: 'boolean' },
  { name: 'badge', label: 'Badge text', type: 'text', placeholder: 'Most popular' },
]

export default async function Page() {
  const rows = await adminRows('memberships', 'price_naira', true)

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader eyebrow="Catalogue" title="Memberships" lede="The plans and prices shown on the membership page and the homepage pricing block." />

      <div className="mt-10">
        <ResourceManager
          table="memberships"
          singular="plan"
          fields={FIELDS}
          rows={rows}
          columns={['name', 'price_naira', 'highlight', 'badge']}
          note="Exactly one plan should be highlighted — that is the one the eye lands on first."
        />
      </div>
    </div>
  )
}
