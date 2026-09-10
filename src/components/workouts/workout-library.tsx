'use client'

import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui'
import { Input, Select } from '@/components/ui/field'
import { Reveal } from '@/components/site/reveal'
import { DIFFICULTIES, EQUIPMENT_OPTIONS, MUSCLE_GROUPS, WORKOUT_LENGTHS } from '@/lib/content'
import type { Workout } from '@/lib/types'
import { cn, slugify } from '@/lib/utils'
import { WorkoutCard } from './workout-card'

/**
 * Searchable workout library.
 *
 * The muscle group filter is mirrored into the URL (?muscle=legs) so the
 * homepage category tiles can deep-link straight into a filtered view and the
 * result stays shareable.
 */
export function WorkoutLibrary({
  workouts,
  initialMuscle,
}: {
  workouts: Workout[]
  initialMuscle?: string
}) {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [muscle, setMuscle] = useState<string>(() => {
    const match = MUSCLE_GROUPS.find((group) => slugify(group) === initialMuscle)
    return match ?? 'all'
  })
  const [equipment, setEquipment] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [length, setLength] = useState('all')

  // Keep the address bar in step with the muscle filter without a navigation.
  useEffect(() => {
    const url = new URL(window.location.href)
    if (muscle === 'all') url.searchParams.delete('muscle')
    else url.searchParams.set('muscle', slugify(muscle))
    window.history.replaceState(null, '', url.toString())
  }, [muscle])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return workouts.filter((workout) => {
      if (muscle !== 'all' && workout.muscleGroup !== muscle) return false
      if (equipment !== 'all' && workout.equipment !== equipment) return false
      if (difficulty !== 'all' && workout.difficulty !== difficulty) return false

      if (length !== 'all') {
        const band = WORKOUT_LENGTHS.find((item) => item.label === length)
        if (band && (workout.durationMinutes < band.min || workout.durationMinutes > band.max)) return false
      }

      if (needle) {
        // Search the exercise names too — people look for "deadlift", not
        // "Pull — Heavy".
        const haystack = [
          workout.name,
          workout.summary,
          workout.muscleGroup,
          workout.equipment,
          ...workout.exercises.map((item) => item.exercise.name),
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(needle)) return false
      }

      return true
    })
  }, [workouts, query, muscle, equipment, difficulty, length])

  const dirty = query !== '' || muscle !== 'all' || equipment !== 'all' || difficulty !== 'all' || length !== 'all'

  const reset = () => {
    setQuery('')
    setMuscle('all')
    setEquipment('all')
    setDifficulty('all')
    setLength('all')
    router.replace('/workouts')
  }

  const selects = [
    { label: 'Muscle group', value: muscle, set: setMuscle, options: MUSCLE_GROUPS },
    { label: 'Equipment', value: equipment, set: setEquipment, options: EQUIPMENT_OPTIONS },
    { label: 'Difficulty', value: difficulty, set: setDifficulty, options: DIFFICULTIES },
    { label: 'Duration', value: length, set: setLength, options: WORKOUT_LENGTHS.map((item) => item.label) },
  ]

  return (
    <div className="container">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate2" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search workouts..."
          aria-label="Search workouts"
          className="h-16 border-white/15 pl-14 text-base"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-slate2 transition-colors hover:text-bone"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {/* Filters */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {selects.map((group) => (
          <label key={group.label} className="block">
            <span className="sr-only">{group.label}</span>
            <Select
              value={group.value}
              onChange={(event) => group.set(event.target.value)}
              className={cn(group.value !== 'all' && 'border-ember text-bone')}
            >
              <option value="all">{group.label}: all</option>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </label>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <p className="font-display text-sm uppercase tracking-[0.14em] text-ash">
          <span className="text-bone">{results.length}</span> {results.length === 1 ? 'workout' : 'workouts'}
          {muscle !== 'all' ? <span className="text-ember"> · {muscle}</span> : null}
        </p>
        {dirty ? (
          <Button variant="ghost" size="sm" onClick={reset}>
            <X className="h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
        ) : null}
      </div>

      {results.length ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((workout, index) => (
            <Reveal as="li" key={workout.slug} delay={Math.min(index, 5) * 60}>
              <WorkoutCard workout={workout} priority={index < 3} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="mt-8 border border-line bg-steel p-12 text-center">
          <h3 className="font-display text-2xl">Nothing matches that search.</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-ash">
            Try a movement name like &ldquo;squat&rdquo; or &ldquo;row&rdquo;, or clear the filters to see the full
            library.
          </p>
          <Button variant="outline" onClick={reset} className="mt-8">
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}
