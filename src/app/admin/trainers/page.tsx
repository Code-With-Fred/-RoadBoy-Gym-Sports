import type { Metadata } from 'next'
import { PanelHeader } from '@/components/dashboard/ui'
import { ResourceManager, type FieldSchema } from '@/components/admin/resource-manager'
import { adminRows } from '@/lib/admin-data'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Trainers — Admin',
  description: 'Manage the RoadBoy Gym&Sports coaching team.',
  path: '/admin/trainers',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

const FIELDS: FieldSchema[] = [
  { name: 'slug', label: 'URL slug', type: 'text', required: true, help: 'Lowercase and hyphenated. Sets the profile URL.', placeholder: 'tunde-bakare' },
  { name: 'name', label: 'Full name', type: 'text', required: true },
  { name: 'role', label: 'Job title', type: 'text', required: true, placeholder: 'Head of Strength' },
  { name: 'specialty', label: 'Specialty', type: 'text', required: true, placeholder: 'Powerlifting and Strength' },
  { name: 'years_experience', label: 'Years of experience', type: 'number', required: true },
  { name: 'short_bio', label: 'Short bio', type: 'textarea', required: true, help: 'Two sentences, shown on the card.' },
  { name: 'bio', label: 'Full biography', type: 'list', help: 'One paragraph per line.' },
  { name: 'philosophy', label: 'Training philosophy', type: 'textarea', help: 'A single quotable line.' },
  { name: 'certifications', label: 'Certifications', type: 'list', help: 'One per line.' },
  { name: 'program_slugs', label: 'Programs written', type: 'list', help: 'One program slug per line.' },
  { name: 'image_url', label: 'Portrait URL', type: 'image' },
  { name: 'image_alt', label: 'Portrait description', type: 'text' },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
]

export default async function Page() {
  const rows = await adminRows('trainers', 'sort_order', true)

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader eyebrow="Content" title="Trainers" lede="Coach profiles, biographies and certifications. These drive the trainers page and the author credit on every program." />

      <div className="mt-10">
        <ResourceManager
          table="trainers"
          singular="trainer"
          fields={FIELDS}
          rows={rows}
          columns={['name', 'role', 'specialty', 'years_experience']}
          note="Sort order controls the sequence on the public trainers page — lower numbers appear first."
        />
      </div>
    </div>
  )
}
