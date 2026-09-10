import { Badge } from '@/components/ui'
import type { Workout } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * The sets/reps/rest table for a single session.
 *
 * A real table on desktop, a stacked definition list on mobile — a five column
 * table at 360px is unreadable, and squeezing one in is the fastest way to make
 * a fitness site feel unusable exactly where it is used most.
 */
export function ExerciseTable({ workout, className }: { workout: Workout; className?: string }) {
  return (
    <div className={cn('', className)}>
      {/* Mobile */}
      <ul className="space-y-px md:hidden">
        {workout.exercises.map((item) => (
          <li key={item.exercise.id} className="border border-line bg-coal p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
                  {String(item.order).padStart(2, '0')}
                </p>
                <h4 className="mt-1.5 font-display text-lg uppercase leading-tight">{item.exercise.name}</h4>
              </div>
              <Badge tone="ember">
                {item.sets} × {item.reps}
              </Badge>
            </div>

            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ash">
              <div className="flex gap-2">
                <dt className="text-slate2">Rest</dt>
                <dd>{item.restSeconds}s</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate2">Target</dt>
                <dd>{item.exercise.muscleGroup}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate2">Level</dt>
                <dd>{item.exercise.difficulty}</dd>
              </div>
            </dl>

            {item.notes ? <p className="mt-4 border-l-2 border-ember pl-3 text-xs italic text-ash">{item.notes}</p> : null}
          </li>
        ))}
      </ul>

      {/* Desktop */}
      <table className="hidden w-full border-collapse text-left md:table">
        <caption className="sr-only">Exercises in {workout.name}</caption>
        <thead>
          <tr className="border-b border-line">
            {['#', 'Exercise', 'Sets', 'Reps', 'Rest', 'Target'].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="pb-4 font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workout.exercises.map((item) => (
            <tr key={item.exercise.id} className="border-b border-line transition-colors hover:bg-coal">
              <td className="py-5 pr-4 align-top font-display text-xs text-slate2">
                {String(item.order).padStart(2, '0')}
              </td>
              <td className="py-5 pr-6 align-top">
                <p className="font-display text-base uppercase leading-tight">{item.exercise.name}</p>
                {item.notes ? <p className="mt-1.5 max-w-md text-xs italic text-slate2">{item.notes}</p> : null}
              </td>
              <td className="py-5 pr-4 align-top font-display text-base text-ember">{item.sets}</td>
              <td className="py-5 pr-4 align-top text-sm text-ash">{item.reps}</td>
              <td className="py-5 pr-4 align-top text-sm text-ash">{item.restSeconds}s</td>
              <td className="py-5 align-top text-sm text-ash">{item.exercise.muscleGroup}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
