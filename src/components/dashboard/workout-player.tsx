'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronDown, PlayCircle, RotateCcw, Timer, Trophy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge, Button, ButtonLink } from '@/components/ui'
import { Checkbox } from '@/components/ui/field'
import { ProgressBar } from '@/components/dashboard/ui'
import type { Workout } from '@/lib/types'
import { cn, formatMinutes } from '@/lib/utils'

/**
 * The in-gym workout interface.
 *
 * Optimistic by design: ticking a set updates immediately and the save is
 * debounced in the background, because phone signal in a basement gym is not
 * something to build a UI around. A failed save is surfaced, never swallowed.
 */
export function WorkoutPlayer({
  workout,
  initialCompleted,
  alreadyFinished,
}: {
  workout: Workout
  initialCompleted: string[]
  alreadyFinished: boolean
}) {
  const router = useRouter()

  const [completed, setCompleted] = useState<string[]>(initialCompleted)
  const [finished, setFinished] = useState(alreadyFinished)
  const [openId, setOpenId] = useState<string | null>(workout.exercises[0]?.exercise.id ?? null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle')
  const [rest, setRest] = useState<{ id: string; secondsLeft: number } | null>(null)

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = workout.exercises.length
  const percent = total ? Math.round((completed.length / total) * 100) : 0

  const save = useCallback(
    async (ids: string[], done: boolean) => {
      setSaveState('saving')
      try {
        const response = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workoutSlug: workout.slug, completedExerciseIds: ids, finished: done }),
        })
        if (!response.ok) throw new Error('save failed')
        setSaveState('idle')
      } catch {
        setSaveState('error')
      }
    },
    [workout.slug],
  )

  // Debounce ticks so a fast run through the checklist is one request.
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    if (completed === initialCompleted) return

    saveTimer.current = setTimeout(() => void save(completed, false), 900)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [completed, initialCompleted, save])

  // Rest countdown.
  useEffect(() => {
    if (!rest) return
    if (rest.secondsLeft <= 0) {
      setRest(null)
      return
    }
    const timer = setTimeout(() => setRest({ ...rest, secondsLeft: rest.secondsLeft - 1 }), 1000)
    return () => clearTimeout(timer)
  }, [rest])

  function toggle(id: string, restSeconds: number) {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      // Starting a rest timer only makes sense when ticking *on*.
      if (!current.includes(id)) setRest({ id, secondsLeft: restSeconds })
      return next
    })
  }

  async function finish() {
    setFinished(true)
    await save(completed, true)
    router.refresh()
  }

  function restart() {
    setCompleted([])
    setFinished(false)
    void save([], false)
  }

  if (finished) {
    return (
      <div className="border border-ember bg-ember-ghost p-10 text-center md:p-14">
        <Trophy className="mx-auto h-12 w-12 text-ember" aria-hidden />
        <h2 className="mt-7 font-display text-display-sm uppercase leading-none">Workout completed.</h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ash">
          {workout.name} is logged and your program progress is updated. Rest well — the next session is already
          waiting on your dashboard.
        </p>

        <dl className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-px border-l border-t border-line">
          <div className="border-b border-r border-line p-5">
            <dt className="font-display text-[0.5625rem] uppercase tracking-[0.16em] text-slate2">Exercises</dt>
            <dd className="mt-2 font-display text-2xl text-bone">{completed.length}</dd>
          </div>
          <div className="border-b border-r border-line p-5">
            <dt className="font-display text-[0.5625rem] uppercase tracking-[0.16em] text-slate2">Duration</dt>
            <dd className="mt-2 font-display text-2xl text-bone">{workout.durationMinutes}m</dd>
          </div>
          <div className="border-b border-r border-line p-5">
            <dt className="font-display text-[0.5625rem] uppercase tracking-[0.16em] text-slate2">Date</dt>
            <dd className="mt-2 font-display text-2xl text-bone">
              {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
            </dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/dashboard" size="lg">
            Back to dashboard
          </ButtonLink>
          <Button variant="outline" size="lg" onClick={restart}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Run it again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Sticky progress header */}
      <div className="sticky top-0 z-20 -mx-5 border-b border-line bg-ink/95 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
            {completed.length} of {total} done
          </p>

          <div className="flex items-center gap-3">
            {rest ? (
              <span className="flex items-center gap-1.5 font-display text-sm text-ember tabular-nums">
                <Timer className="h-4 w-4" aria-hidden />
                {Math.floor(rest.secondsLeft / 60)}:{String(rest.secondsLeft % 60).padStart(2, '0')}
                <span className="sr-only">rest remaining</span>
              </span>
            ) : null}
            {saveState === 'saving' ? <span className="text-xs text-slate2">Saving…</span> : null}
            {saveState === 'error' ? (
              <span role="alert" className="text-xs text-red-400">
                Not saved — check connection
              </span>
            ) : null}
          </div>
        </div>
        <ProgressBar value={percent} className="mt-3" />
      </div>

      {/* Exercises */}
      <ol className="mt-8 space-y-3">
        {workout.exercises.map((item) => {
          const id = item.exercise.id
          const done = completed.includes(id)
          const expanded = openId === id

          return (
            <li
              key={id}
              className={cn(
                'border transition-colors duration-300',
                done ? 'border-ember/40 bg-ember-ghost' : 'border-line bg-steel',
              )}
            >
              <div className="flex items-start gap-4 p-5 sm:p-6">
                <div className="pt-1">
                  <Checkbox
                    checked={done}
                    onChange={() => toggle(id, item.restSeconds)}
                    label={<span className="sr-only">Mark {item.exercise.name} completed</span>}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2">
                        Exercise {item.order}
                      </p>
                      <h3
                        className={cn(
                          'mt-1.5 font-display text-xl uppercase leading-none sm:text-2xl',
                          done && 'text-ash line-through decoration-ember/60',
                        )}
                      >
                        {item.exercise.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={done ? 'success' : 'ember'}>
                        {item.sets} sets × {item.reps}
                      </Badge>
                      <Badge tone="outline">
                        <Timer className="h-3 w-3" aria-hidden />
                        {item.restSeconds}s rest
                      </Badge>
                    </div>
                  </div>

                  {item.notes ? (
                    <p className="mt-3 border-l-2 border-ember pl-3 text-sm italic leading-relaxed text-ash">
                      {item.notes}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setOpenId(expanded ? null : id)}
                    aria-expanded={expanded}
                    aria-controls={`exercise-${id}`}
                    className="mt-4 flex items-center gap-2 font-display text-[0.625rem] uppercase tracking-[0.16em] text-ash transition-colors hover:text-ember"
                  >
                    How to do it
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} aria-hidden />
                  </button>

                  <div id={`exercise-${id}`} hidden={!expanded} className="mt-5 grid gap-5 md:grid-cols-2">
                    <div className="relative flex aspect-video items-center justify-center border border-line bg-ink">
                      {item.exercise.videoUrl ? (
                        <video
                          src={item.exercise.videoUrl}
                          controls
                          preload="none"
                          playsInline
                          className="h-full w-full object-cover"
                          aria-label={`${item.exercise.name} demonstration`}
                        />
                      ) : (
                        <div className="text-center">
                          <PlayCircle className="mx-auto h-8 w-8 text-slate2" aria-hidden />
                          <p className="mt-2.5 font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2">
                            Demonstration coming soon
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <ol className="space-y-2.5">
                        {item.exercise.instructions.map((line, index) => (
                          <li key={line} className="flex gap-3 text-sm leading-relaxed text-ash">
                            <span className="font-display text-xs text-ember">{index + 1}</span>
                            {line}
                          </li>
                        ))}
                      </ol>

                      {item.exercise.substitutions.length ? (
                        <p className="mt-4 border-t border-line pt-3 text-xs text-slate2">
                          <span className="font-display uppercase tracking-[0.16em]">No kit? Swap for: </span>
                          {item.exercise.substitutions.join(' · ')}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      {/* Finish */}
      <div className="mt-10 border border-line bg-steel p-8 text-center">
        <h2 className="font-display text-2xl uppercase leading-none">
          {completed.length === total ? 'That is everything.' : 'Finished early?'}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ash">
          {completed.length === total
            ? 'Log the session and your program progress updates straight away.'
            : `You have ${total - completed.length} exercises left. You can still log the session — cutting a workout short beats skipping it.`}
        </p>

        <Button size="lg" className="mt-7 w-full sm:w-auto" onClick={finish}>
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Complete workout
        </Button>

        <p className="mt-5 text-xs text-slate2">
          <Link href="/dashboard" className="link-underline hover:text-ash">
            Save and come back later
          </Link>
        </p>
      </div>

      <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-slate2">
        Warm up for eight to ten minutes before your first working set, and stop any exercise that causes sharp pain.
        Progress the load only when every prescribed rep is clean. {formatMinutes(workout.durationMinutes)} is a guide,
        not a target.
      </p>
    </div>
  )
}
