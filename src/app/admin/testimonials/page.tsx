import type { Metadata } from 'next'
import { PanelHeader } from '@/components/dashboard/ui'
import { ResourceManager, type FieldSchema } from '@/components/admin/resource-manager'
import { adminRows } from '@/lib/admin-data'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Testimonials — Admin',
  description: 'Manage member testimonials.',
  path: '/admin/testimonials',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

const FIELDS: FieldSchema[] = [
  { name: 'name', label: 'Member name', type: 'text', required: true, placeholder: 'Kemi A.' },
  { name: 'role', label: 'Role and area', type: 'text', placeholder: 'Product designer, Lekki' },
  { name: 'quote', label: 'Quote', type: 'textarea', required: true },
  { name: 'rating', label: 'Rating out of 5', type: 'number', required: true },
  { name: 'training_duration', label: 'How long they have trained', type: 'text', placeholder: 'Member for 14 months' },
  { name: 'image_url', label: 'Photo URL', type: 'image' },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
]

export default async function Page() {
  const rows = await adminRows('testimonials', 'sort_order', true)

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader eyebrow="Content" title="Testimonials" lede="Quotes shown on the homepage carousel and the transformations page. Specific beats glowing — vague praise reads as invented." />

      <div className="mt-10">
        <ResourceManager
          table="testimonials"
          singular="testimonial"
          fields={FIELDS}
          rows={rows}
          columns={['name', 'role', 'rating', 'training_duration']}
          note="Only publish a quote you have permission to use, under the name the member is happy to be shown as."
        />
      </div>
    </div>
  )
}
