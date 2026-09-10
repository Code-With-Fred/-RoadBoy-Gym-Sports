import type { Metadata } from 'next'
import { PanelHeader } from '@/components/dashboard/ui'
import { ResourceManager, type FieldSchema } from '@/components/admin/resource-manager'
import { adminRows } from '@/lib/admin-data'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Gallery — Admin',
  description: 'Manage the gym gallery images.',
  path: '/admin/gallery',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

const FIELDS: FieldSchema[] = [
  { name: 'image_url', label: 'Image URL', type: 'image', required: true },
  { name: 'alt_text', label: 'Image description', type: 'text', required: true, help: 'Describe what is happening in the photo.' },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
]

export default async function Page() {
  const rows = await adminRows('gym_gallery', 'sort_order', true)

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader eyebrow="Content" title="Gallery" lede="The photographs shown on the homepage and facilities page. Real shots of your own floor always beat stock photography." />

      <div className="mt-10">
        <ResourceManager
          table="gym_gallery"
          singular="image"
          fields={FIELDS}
          rows={rows}
          columns={['alt_text', 'image_url', 'sort_order']}
          note="Upload the file to Supabase Storage first, then paste its public URL here. Always write alt text — it is read aloud, and it helps you rank."
        />
      </div>
    </div>
  )
}
