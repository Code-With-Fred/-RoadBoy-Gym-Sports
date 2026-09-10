import Link from 'next/link'
import { ArrowRight, Clock, Lock } from 'lucide-react'
import { Badge } from '@/components/ui'
import { SmartImage } from '@/components/site/smart-image'
import type { Workout } from '@/lib/types'
import { cn, formatMinutes } from '@/lib/utils'

export function WorkoutCard({
  workout,
  className,
  priority = false,
}: {
  workout: Workout
  className?: string
  priority?: boolean
}) {
  return (
    <article className={cn('group card card-hover h-full', className)}>
      <Link href={`/workouts/${workout.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <SmartImage
            src={workout.image.src}
            alt={workout.image.alt}
            width={800}
            priority={priority}
            zoom
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 overlay-bottom" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge tone="ember">{workout.muscleGroup}</Badge>
            {!workout.isFree ? (
              <Badge tone="neutral">
                <Lock className="h-3 w-3" aria-hidden />
                Program
              </Badge>
            ) : null}
          </div>

          <p className="absolute bottom-4 left-4 flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.14em] text-bone">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {formatMinutes(workout.durationMinutes)}
          </p>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl leading-tight transition-colors duration-300 group-hover:text-ember">
            {workout.name}
          </h3>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">{workout.summary}</p>

          <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pt-5 text-xs text-slate2">
            <div className="flex gap-2">
              <dt className="sr-only">Difficulty</dt>
              <dd>{workout.difficulty}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="sr-only">Equipment</dt>
              <dd>{workout.equipment}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="sr-only">Exercises</dt>
              <dd>{workout.exercises.length} exercises</dd>
            </div>
          </dl>

          <span className="mt-5 inline-flex items-center gap-2 font-display text-[0.6875rem] uppercase tracking-[0.16em] text-bone transition-colors group-hover:text-ember">
            View workout
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  )
}
