import type { Metadata } from 'next'
import { PanelHeader } from '@/components/dashboard/ui'
import { ResourceManager, type FieldSchema } from '@/components/admin/resource-manager'
import { adminRows } from '@/lib/admin-data'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Exercises — Admin',
  description: 'Manage the exercise library and demonstration videos.',
  path: '/admin/exercises',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

const FIELDS: FieldSchema[] = [
  { name: 'slug', label: 'Slug', type: 'text', required: true },
  { name: 'name', label: 'Exercise name', type: 'text', required: true },
  { name: 'muscle_group', label: 'Muscle group', type: 'text', required: true },
  { name: 'equipment', label: 'Equipment', type: 'text', required: true },
  { name: 'difficulty', label: 'Difficulty', type: 'text', required: true },
  { name: 'instructions', label: 'Coaching cues', type: 'list', required: true, help: 'One cue per line. Two or three is plenty.' },
  { name: 'substitutions', label: 'Substitutions', type: 'list', help: 'One alternative exercise per line.' },
  { name: 'video_url', label: 'Demonstration video URL', type: 'image', help: 'An MP4 in Supabase Storage, or any direct video URL.' },
]

export default async function Page() {
  const rows = await adminRows('exercises', 'name', true)

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader eyebrow="Catalogue" title="Exercises" lede="The movement library. Coaching cues written here appear in every workout that uses the exercise, on the site and in the workout player." />

      <div className="mt-10">
        <ResourceManager
          table="exercises"
          singular="exercise"
          fields={FIELDS}
          rows={rows}
          columns={['name', 'muscle_group', 'equipment', 'video_url']}
          note="Adding a video URL replaces the “demonstration coming soon” placeholder everywhere that exercise appears."
        />
      </div>
    </div>
  )
}
