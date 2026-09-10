import type { Metadata } from 'next'
import { PanelHeader } from '@/components/dashboard/ui'
import { ResourceManager, type FieldSchema } from '@/components/admin/resource-manager'
import { adminRows } from '@/lib/admin-data'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Workouts — Admin',
  description: 'Manage workout sessions.',
  path: '/admin/workouts',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

const FIELDS: FieldSchema[] = [
  { name: 'slug', label: 'Slug', type: 'text', required: true },
  { name: 'name', label: 'Workout name', type: 'text', required: true },
  { name: 'summary', label: 'Summary', type: 'textarea', required: true },
  { name: 'muscle_group', label: 'Muscle group', type: 'text', required: true },
  { name: 'duration_minutes', label: 'Duration in minutes', type: 'number', required: true },
  { name: 'image_url', label: 'Cover image URL', type: 'image' },
  { name: 'image_alt', label: 'Cover image description', type: 'text' },
  { name: 'is_free', label: 'Free in the public library', type: 'boolean', help: 'Free sessions are visible to everyone and indexed by search engines.' },
]

export default async function Page() {
  const rows = await adminRows('workouts', 'name', true)

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader eyebrow="Catalogue" title="Workouts" lede="Session names, summaries, durations and cover images. The set-and-rep prescription for each session lives in the exercise library." />

      <div className="mt-10">
        <ResourceManager
          table="workouts"
          singular="workout"
          fields={FIELDS}
          rows={rows}
          columns={['name', 'muscle_group', 'duration_minutes', 'is_free']}
          note="The slug must match a session in the training content so progress tracking keeps working. Refine copy and images here; add a brand new session in code first."
        />
      </div>
    </div>
  )
}
