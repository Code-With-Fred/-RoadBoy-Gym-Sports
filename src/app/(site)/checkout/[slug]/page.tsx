import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { Section } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import { CheckoutClient } from '@/components/checkout/checkout-client'
import { getProgramBySlug } from '@/lib/data'
import { paymentsEnabled } from '@/lib/payments'
import { buildMetadata } from '@/lib/seo'
import { getUser } from '@/lib/supabase/server'

export const metadata: Metadata = buildMetadata({
  title: 'Checkout',
  description: 'Complete your RoadBoy Gym&Sports program purchase.',
  path: '/checkout',
  noIndex: true,
})

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) notFound()

  const user = await getUser()

  return (
    <Section className="!pt-[calc(var(--nav-h)+3rem)]">
      <div className="container">
        <Link
          href={`/programs/${program.slug}`}
          className="inline-flex items-center gap-2 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-ash transition-colors hover:text-ember"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to program
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Payment */}
          <div className="lg:col-span-7">
            <h1 className="text-display-md">Checkout.</h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ash">
              One payment, lifetime access. Your program appears in your dashboard as soon as the payment clears.
            </p>

            <div className="mt-10">
              <CheckoutClient
                program={program}
                signedInEmail={user?.email ?? null}
                paymentsReady={paymentsEnabled()}
              />
            </div>

            {!user ? (
              <p className="mt-8 border-t border-line pt-6 text-sm text-ash">
                Already have an account?{' '}
                <Link href={`/login?next=/checkout/${program.slug}`} className="text-ember link-underline">
                  Log in first
                </Link>{' '}
                so the program lands straight in your dashboard.
              </p>
            ) : null}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 border border-line bg-steel">
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage src={program.image.src} alt={program.image.alt} width={800} sizes="(max-width: 1024px) 100vw, 40vw" />
                <div className="absolute inset-0 overlay-bottom" />
              </div>

              <div className="p-7">
                <h2 className="font-display text-[0.625rem] uppercase tracking-[0.2em] text-slate2">Order summary</h2>

                <div className="mt-5 flex items-start justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <p className="font-display text-xl uppercase leading-none">{program.name}</p>
                    <p className="mt-2 text-xs text-ash">
                      {program.weeks} weeks · {program.totalWorkouts} workouts · {program.difficulty}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-lg">₦{program.priceNaira.toLocaleString('en-NG')}</p>
                </div>

                {program.compareAtNaira ? (
                  <div className="flex items-center justify-between border-b border-line py-4 text-sm">
                    <span className="text-ash">Launch discount</span>
                    <span className="text-ember">
                      −₦{(program.compareAtNaira - program.priceNaira).toLocaleString('en-NG')}
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between border-b border-line py-4 text-sm">
                  <span className="text-ash">VAT</span>
                  <span className="text-ash">Included</span>
                </div>

                <div className="flex items-baseline justify-between py-6">
                  <span className="font-display text-sm uppercase tracking-[0.16em] text-ash">Total</span>
                  <span className="font-display text-3xl text-ember">
                    ₦{program.priceNaira.toLocaleString('en-NG')}
                  </span>
                </div>

                <ul className="space-y-3 border-t border-line pt-6 text-sm">
                  {program.includes.slice(0, 4).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-ash">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
