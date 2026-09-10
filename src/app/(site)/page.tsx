import { Section, SectionHeading } from '@/components/ui'
import { Categories } from '@/components/home/categories'
import { FeaturedPrograms } from '@/components/home/featured-programs'
import { FinalCta } from '@/components/home/final-cta'
import { GallerySection } from '@/components/home/gallery-section'
import { Hero } from '@/components/home/hero'
import { Intro } from '@/components/home/intro'
import { MembershipSection } from '@/components/home/membership-section'
import { Services } from '@/components/home/services'
import { TestimonialCarousel } from '@/components/home/testimonials'
import { Trainers } from '@/components/home/trainers'
import { Transformations } from '@/components/home/transformations'
import { WhyUs } from '@/components/home/why-us'
import { getTestimonials } from '@/lib/data'

/**
 * The homepage tells one story in order: who we are, what we offer, what we
 * sell, why people trust us, what results we create, and how to start. Every
 * section ends in one of three actions — join, buy, or get in touch.
 */
export const revalidate = 3600

export default async function HomePage() {
  const testimonials = await getTestimonials()

  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <FeaturedPrograms />
      <Categories />
      <WhyUs />
      <Transformations />
      <Trainers />
      <GallerySection />
      <MembershipSection />

      <Section tone="coal" className="overflow-hidden">
        <div className="container">
          <SectionHeading
            eyebrow="What members say"
            title="In their words."
            lede="Unedited, and specific enough to be checked."
          />
        </div>
        <div className="container mt-14">
          <TestimonialCarousel items={testimonials} />
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
