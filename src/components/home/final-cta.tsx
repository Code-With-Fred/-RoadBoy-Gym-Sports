import { ButtonLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import { SmartImage } from '@/components/site/smart-image'
import { IMAGES } from '@/lib/images'

/** The closing ask. Two doors: join the gym, or buy a program. */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SmartImage src={IMAGES.cta.src} alt="" width={1900} quality={70} sizes="100vw" />
        <div className="absolute inset-0 bg-ink/78" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      </div>

      <div className="container py-section">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Stop waiting</p>

          <h2 className="mt-6 text-display-lg text-balance">Ready to get stronger?</h2>

          <p className="mx-auto mt-7 max-w-xl text-lede text-bone/80 text-pretty">
            Stop waiting for the perfect time. There is a session on the floor right now and a program that starts the
            moment you buy it. Start training today.
          </p>

          <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/membership" size="lg">
              Join the gym
            </ButtonLink>
            <ButtonLink href="/programs" variant="solid" size="lg">
              Shop workout programs
            </ButtonLink>
          </div>

          <p className="mt-8 text-sm text-ash">
            No joining fee this month · Cancel your membership any time
          </p>
        </Reveal>
      </div>
    </section>
  )
}
