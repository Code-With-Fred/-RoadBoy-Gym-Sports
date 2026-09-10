import { Check } from 'lucide-react'
import { Badge, ButtonLink } from '@/components/ui'
import { Reveal } from '@/components/site/reveal'
import type { MembershipPlan } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Membership pricing. Shared by the homepage and /membership so the plans can
 * never drift apart.
 *
 * The highlighted plan is raised with an ember border and a solid CTA rather
 * than a scale transform — no layout shift, and it still wins the eye.
 */
export function Pricing({ plans, className }: { plans: MembershipPlan[]; className?: string }) {
  return (
    <ul className={cn('grid gap-4 lg:grid-cols-3', className)}>
      {plans.map((plan, index) => (
        <Reveal as="li" key={plan.slug} delay={index * 80} className="h-full">
          <article
            className={cn(
              'relative flex h-full flex-col border p-8 transition-colors duration-300 lg:p-10',
              plan.highlight
                ? 'border-ember bg-gradient-to-b from-ember-ghost to-transparent'
                : 'border-line bg-steel hover:border-white/25',
            )}
          >
            {plan.badge ? (
              <Badge tone="ember" className="absolute -top-3 left-8">
                {plan.badge}
              </Badge>
            ) : null}

            <h3 className="font-display text-3xl leading-none">{plan.name}</h3>
            <p className="mt-3 text-sm text-ash">{plan.summary}</p>

            <p className="mt-8 flex items-baseline gap-2">
              <span className="font-display text-5xl leading-none text-bone">
                ₦{plan.priceNaira.toLocaleString('en-NG')}
              </span>
              <span className="font-display text-xs uppercase tracking-[0.16em] text-ash">/ {plan.interval}</span>
            </p>

            <ul className="mt-8 flex-1 space-y-3.5 border-t border-line pt-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-ash">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <ButtonLink
              href={`/contact?plan=${plan.slug}`}
              variant={plan.highlight ? 'primary' : 'outline'}
              size="lg"
              className="mt-10 w-full"
            >
              Join now
            </ButtonLink>
          </article>
        </Reveal>
      ))}
    </ul>
  )
}
