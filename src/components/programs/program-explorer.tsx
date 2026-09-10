'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui'
import { Select } from '@/components/ui/field'
import { Reveal } from '@/components/site/reveal'
import { DIFFICULTIES, DURATIONS, EQUIPMENT_OPTIONS, GOALS } from '@/lib/content'
import type { Program } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ProgramCard } from './program-card'

type Filters = {
  goal: string[]
  difficulty: string[]
  duration: number[]
  equipment: string[]
}

const EMPTY: Filters = { goal: [], difficulty: [], duration: [], equipment: [] }

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'duration'

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'duration', label: 'Shortest program' },
]

/**
 * The marketplace. Filtering happens client-side over the full catalogue —
 * there are tens of programs, not thousands, so a round-trip per checkbox would
 * be slower and worse.
 */
export function ProgramExplorer({
  programs,
  initialGoal,
}: {
  programs: Program[]
  initialGoal?: string
}) {
  const [filters, setFilters] = useState<Filters>(
    initialGoal && (GOALS as readonly string[]).includes(initialGoal)
      ? { ...EMPTY, goal: [initialGoal] }
      : EMPTY,
  )
  const [sort, setSort] = useState<SortKey>('popular')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggle = <K extends keyof Filters>(group: K, value: Filters[K][number]) => {
    setFilters((current) => {
      const list = current[group] as Array<typeof value>
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
      return { ...current, [group]: next }
    })
  }

  const activeCount =
    filters.goal.length + filters.difficulty.length + filters.duration.length + filters.equipment.length

  const results = useMemo(() => {
    const matched = programs.filter((program) => {
      // A program matches a goal filter on its primary *or* secondary goals —
      // "Strength" should surface the conditioning block that also builds it.
      if (filters.goal.length) {
        const goals = [program.goal, ...program.secondaryGoals]
        if (!filters.goal.some((goal) => goals.includes(goal as Program['goal']))) return false
      }
      if (filters.difficulty.length && !filters.difficulty.includes(program.difficulty)) return false
      if (filters.duration.length && !filters.duration.includes(program.weeks)) return false
      if (filters.equipment.length && !filters.equipment.includes(program.equipment)) return false
      return true
    })

    const sorted = [...matched]
    if (sort === 'price-asc') sorted.sort((a, b) => a.priceNaira - b.priceNaira)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.priceNaira - a.priceNaira)
    else if (sort === 'duration') sorted.sort((a, b) => a.weeks - b.weeks)
    else sorted.sort((a, b) => b.reviewCount - a.reviewCount)

    return sorted
  }, [programs, filters, sort])

  const groups: Array<{ key: keyof Filters; label: string; options: Array<{ value: string | number; label: string }> }> = [
    { key: 'goal', label: 'Goal', options: GOALS.map((goal) => ({ value: goal, label: goal })) },
    {
      key: 'difficulty',
      label: 'Difficulty',
      options: DIFFICULTIES.map((level) => ({ value: level, label: level })),
    },
    {
      key: 'duration',
      label: 'Duration',
      options: DURATIONS.map((weeks) => ({ value: weeks, label: `${weeks} weeks` })),
    },
    {
      key: 'equipment',
      label: 'Equipment',
      options: EQUIPMENT_OPTIONS.map((item) => ({ value: item, label: item })),
    },
  ]

  const filterPanel = (
    <div className="space-y-9">
      {groups.map((group) => (
        <fieldset key={group.key}>
          <legend className="font-display text-[0.6875rem] uppercase tracking-[0.2em] text-bone">
            {group.label}
          </legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {group.options.map((option) => {
              const selected = (filters[group.key] as Array<string | number>).includes(option.value)
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggle(group.key, option.value as never)}
                  className={cn(
                    'border px-3 py-2 text-left font-display text-[0.6875rem] uppercase tracking-[0.12em] transition-colors duration-200',
                    selected
                      ? 'border-ember bg-ember text-ink'
                      : 'border-line text-ash hover:border-white/30 hover:text-bone',
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}

      {activeCount > 0 ? (
        <Button variant="outline" size="sm" onClick={() => setFilters(EMPTY)} className="w-full">
          Clear all filters
        </Button>
      ) : null}
    </div>
  )

  return (
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Desktop filter rail */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <h2 className="font-display text-sm uppercase tracking-[0.18em] text-ash">Filter</h2>
            <div className="mt-8">{filterPanel}</div>
          </div>
        </aside>

        <div className="lg:col-span-9">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="font-display text-sm uppercase tracking-[0.14em] text-ash">
              <span className="text-bone">{results.length}</span>{' '}
              {results.length === 1 ? 'program' : 'programs'}
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden"
                aria-expanded={drawerOpen}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                Filter
                {activeCount ? <span className="ml-1 text-ember">({activeCount})</span> : null}
              </Button>

              <label className="flex items-center gap-2">
                <span className="sr-only">Sort programs</span>
                <Select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="h-9 w-[11.5rem] text-xs"
                >
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {groups.flatMap((group) =>
                (filters[group.key] as Array<string | number>).map((value) => (
                  <li key={`${group.key}-${value}`}>
                    <button
                      type="button"
                      onClick={() => toggle(group.key, value as never)}
                      className="group flex items-center gap-2 border border-white/20 px-3 py-1.5 font-display text-[0.625rem] uppercase tracking-[0.14em] text-ash transition-colors hover:border-ember hover:text-ember"
                    >
                      {group.key === 'duration' ? `${value} weeks` : value}
                      <X className="h-3 w-3" aria-hidden />
                      <span className="sr-only">Remove filter</span>
                    </button>
                  </li>
                )),
              )}
            </ul>
          ) : null}

          {results.length ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((program, index) => (
                <Reveal as="li" key={program.slug} delay={Math.min(index, 5) * 60}>
                  <ProgramCard program={program} priority={index < 3} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="mt-8 border border-line bg-steel p-12 text-center">
              <h3 className="font-display text-2xl">No programs match that combination.</h3>
              <p className="mt-3 text-sm text-ash">
                Try widening the duration or equipment filters — most of our plans have a home-equipment variant.
              </p>
              <Button variant="outline" onClick={() => setFilters(EMPTY)} className="mt-8">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden" role="dialog" aria-modal="true" aria-label="Filter programs">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-sm uppercase tracking-[0.18em]">Filter programs</h2>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
              className="flex h-10 w-10 items-center justify-center border border-white/20 transition-colors hover:border-ember hover:text-ember"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-8">{filterPanel}</div>

          <div className="border-t border-line p-5" style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
            <Button size="lg" className="w-full" onClick={() => setDrawerOpen(false)}>
              Show {results.length} {results.length === 1 ? 'program' : 'programs'}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
