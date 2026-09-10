'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { ProgramWeek, Workout } from '@/lib/types'
import { cn, formatMinutes } from '@/lib/utils'

/**
 * Week-by-week accordion.
 *
 * Phases repeat across weeks (three weeks of "Progression", and so on), so
 * consecutive weeks sharing a title are grouped into one row labelled
 * "Weeks 4–6" rather than printing the same card three times.
 */
export function ProgramBreakdown({
  weeks,
  workouts,
}: {
  weeks: ProgramWeek[]
  workouts: Workout[]
}) {
  const [open, setOpen] = useState(0)

  const phases: Array<{ label: string; week: ProgramWeek }> = []
  for (const week of weeks) {
    const previous = phases[phases.length - 1]
    if (previous && previous.week.title === week.title && previous.week.focus === week.focus) {
      const first = previous.label.match(/\d+/)?.[0] ?? String(previous.week.number)
      previous.label = `Weeks ${first}–${week.number}`
    } else {
      phases.push({ label: `Week ${week.number}`, week })
    }
  }

  return (
    <ul className="border-t border-line">
      {phases.map((phase, index) => {
        const expanded = open === index
        const sessions = phase.week.workoutSlugs
          .map((slug) => workouts.find((workout) => workout.slug === slug))
          .filter((workout): workout is Workout => Boolean(workout))

        return (
          <li key={`${phase.label}-${phase.week.title}`} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? -1 : index)}
                aria-expanded={expanded}
                aria-controls={`phase-panel-${index}`}
                className="group flex w-full items-center gap-5 py-6 text-left transition-colors hover:text-ember"
              >
                <span className="w-24 shrink-0 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-slate2 sm:w-32">
                  {phase.label}
                </span>
                <span className="flex-1 font-display text-xl uppercase leading-none sm:text-2xl">
                  {phase.week.title}
                </span>
                <span className="hidden shrink-0 text-xs uppercase tracking-[0.14em] text-ash md:block">
                  {phase.week.focus}
                </span>
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center border transition-colors',
                    expanded ? 'border-ember bg-ember text-ink' : 'border-line text-ash group-hover:border-ember',
                  )}
                >
                  {expanded ? <Minus className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                </span>
              </button>
            </h3>

            <div
              id={`phase-panel-${index}`}
              hidden={!expanded}
              className="pb-8 sm:pl-[7rem] md:pl-[8rem]"
            >
              <p className="max-w-2xl text-sm leading-relaxed text-ash">{phase.week.description}</p>

              {sessions.length ? (
                <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {sessions.map((workout, dayIndex) => (
                    <li key={workout.slug} className="border border-line bg-coal p-4">
                      <p className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-ember">
                        Day {dayIndex + 1}
                      </p>
                      <p className="mt-2 font-display text-base uppercase leading-tight">{workout.name}</p>
                      <p className="mt-2 text-xs text-slate2">
                        {workout.exercises.length} exercises · {formatMinutes(workout.durationMinutes)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
