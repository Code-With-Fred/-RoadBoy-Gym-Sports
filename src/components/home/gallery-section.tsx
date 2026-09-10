import { Section, SectionHeading } from '@/components/ui'
import { Gallery } from '@/components/site/gallery'
import { Reveal } from '@/components/site/reveal'
import { getGallery } from '@/lib/data'

export async function GallerySection() {
  const images = await getGallery()

  return (
    <Section tone="coal">
      <div className="container">
        <SectionHeading
          eyebrow="Inside the gym"
          title="This is the floor."
          lede="No stock photography, no filters. Eight platforms, a turf lane, and five hundred people who show up."
        />
      </div>

      <Reveal className="container mt-14">
        <Gallery items={images} />
      </Reveal>
    </Section>
  )
}
