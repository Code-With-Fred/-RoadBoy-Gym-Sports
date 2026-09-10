import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ButtonLink } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import { EmptyState, PanelHeader, ProgressBar } from '@/components/dashboard/ui'
import { getPrograms, getUserPrograms } from '@/lib/data'
import { computeProgress, sortByActivity } from '@/lib/progress'
import { buildMetadata } from '@/lib/seo'
import { getUser } from '@/lib/supabase/server'

export const metadata: Metadata = buildMetadata({
  title: 'My programs',
  description: 'The RoadBoy Gym&Sports programs you own.',
  path: '/dashboard/programs',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

export default async function MyProgramsPage() {
  const user = await getUser()
  if (!user) redirect('/login?next=/dashboard/programs')

  const [programs, records] = await Promise.all([getPrograms(), getUserPrograms(user.id)])

  const owned = sortByActivity(
    records
      .map((record) => {
        const program = programs.find((item) => item.slug === record.programSlug)
        return program ? computeProgress(program, record) : null
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
  )

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <PanelHeader
        eyebrow="Library"
        title="My programs"
        lede="Everything you own, with lifetime access. Pick one up whenever you like — progress is saved per program."
        action={
          <ButtonLink href="/programs" variant="outline">
            Buy another
          </ButtonLink>
        }
      />

      {owned.length ? (
        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {owned.map((item) => (
            <li key={item.program.slug}>
              <Link
                href={`/dashboard/programs/${item.program.slug}`}
                className="group flex h-full flex-col border border-line bg-steel transition-colors hover:border-white/25"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <SmartImage src={item.program.image.src} alt="" width={700} zoom sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 overlay-bottom" />
                  {item.isComplete ? (
                    <span className="absolute right-4 top-4 bg-ember px-2.5 py-1 font-display text-[0.5625rem] uppercase tracking-[0.16em] text-ink">
                      Completed
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-xl uppercase leading-none transition-colors group-hover:text-ember">
                    {item.program.name}
                  </h2>
                  <p className="mt-2.5 text-xs text-ash">
                    Week {item.currentWeek} of {item.program.weeks} · {item.completed}/{item.total} workouts
                  </p>
                  <ProgressBar value={item.percent} label="Progress" className="mt-auto pt-7" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="Your library is empty"
            body="Programs you buy appear here for good, with week-by-week sessions and progress tracking on every one."
            action={
              <ButtonLink href="/programs" size="lg">
                Browse the store
              </ButtonLink>
            }
          />
        </div>
      )}
    </div>
  )
}
