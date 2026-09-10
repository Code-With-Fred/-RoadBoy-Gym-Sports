import type { Metadata } from 'next'
import { PanelHeader } from '@/components/dashboard/ui'
import { ResourceManager, type FieldSchema } from '@/components/admin/resource-manager'
import { DIFFICULTIES, EQUIPMENT_OPTIONS, GOALS } from '@/lib/content'
import { adminRows } from '@/lib/admin-data'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Programs — Admin',
  description: 'Manage RoadBoy Gym&Sports workout programs.',
  path: '/admin/programs',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

const FIELDS: FieldSchema[] = [
  { name: 'slug', label: 'URL slug', type: 'text', required: true, help: 'Lowercase, hyphenated. Changing this changes the public URL.', placeholder: 'muscle-building' },
  { name: 'name', label: 'Program name', type: 'text', required: true, placeholder: 'Muscle Building' },
  { name: 'tagline', label: 'Tagline', type: 'text', required: true, help: 'One line, shown on the card.', placeholder: 'Twelve weeks. One rep at a time.' },
  { name: 'description', label: 'Description', type: 'textarea', required: true, help: 'The sales page paragraph. Two or three sentences beats a wall of text.' },
  { name: 'goal', label: 'Primary goal', type: 'select', options: GOALS, required: true },
  { name: 'difficulty', label: 'Difficulty', type: 'select', options: [...DIFFICULTIES, 'All Levels'], required: true },
  { name: 'equipment', label: 'Equipment', type: 'select', options: EQUIPMENT_OPTIONS, required: true },
  { name: 'weeks', label: 'Length in weeks', type: 'number', required: true },
  { name: 'sessions_per_week', label: 'Sessions per week', type: 'number', required: true },
  { name: 'total_workouts', label: 'Total workouts', type: 'number', help: 'Usually weeks × sessions per week.' },
  { name: 'price_naira', label: 'Price (₦)', type: 'number', required: true, help: 'Whole Naira, no decimals or separators.' },
  { name: 'compare_at_naira', label: 'Compare-at price (₦)', type: 'number', help: 'Shown struck through. Leave at 0 for no discount.' },
  { name: 'image_url', label: 'Cover image URL', type: 'image', help: 'Upload to Supabase Storage and paste the public URL.' },
  { name: 'image_alt', label: 'Cover image description', type: 'text', help: 'Describe the photo for screen readers and SEO.' },
  { name: 'outcomes', label: 'What you will achieve', type: 'list', help: 'One outcome per line.' },
  { name: 'includes', label: 'What is included', type: 'list', help: 'One item per line.' },
  { name: 'coach_slug', label: 'Coach', type: 'text', help: 'The slug of the trainer who wrote it, e.g. tunde-bakare.' },
  { name: 'rating', label: 'Rating', type: 'number', help: 'Out of 5.' },
  { name: 'review_count', label: 'Review count', type: 'number' },
  { name: 'featured', label: 'Feature on the homepage', type: 'boolean' },
  { name: 'best_seller', label: 'Show the best seller badge', type: 'boolean' },
  { name: 'published', label: 'Published (visible in the store)', type: 'boolean' },
]

export default async function AdminProgramsPage() {
  const rows = await adminRows('programs', 'price_naira', true)

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader
        eyebrow="Catalogue"
        title="Programs"
        lede="The digital products you sell. Prices, copy and cover images update on the live site the moment you save."
      />

      <div className="mt-10">
        <ResourceManager
          table="programs"
          singular="program"
          fields={FIELDS}
          rows={rows}
          columns={['name', 'goal', 'weeks', 'price_naira', 'published']}
          note="Every program here appears in the store. Unpublish rather than delete if you want to retire one — deleting breaks the links of anyone who already bought it."
        />
      </div>
    </div>
  )
}
