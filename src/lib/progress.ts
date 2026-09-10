import { workoutsForProgram } from '@/lib/content'
import type { Program, UserProgram, Workout } from '@/lib/types'
import { clamp } from '@/lib/utils'

/**
 * Turns raw progress rows into the numbers the dashboard shows.
 *
 * A program's schedule is `weeks × sessionsPerWeek`, and the sessions repeat
 * each week, so "session 7 of 12" is derived from the count of completed
 * sessions rather than stored — one number to keep correct instead of two.
 */
export interface ProgramProgress {
  program: Program
  /** 0–100, rounded. */
  percent: number
  completed: number
  total: number
  currentWeek: number
  /** Position within the current week, 1-based. */
  dayOfWeek: number
  nextWorkout: Workout | null
  sessions: Workout[]
  isComplete: boolean
}

export function computeProgress(program: Program, record: UserProgram | undefined): ProgramProgress {
  const sessions = workoutsForProgram(program.slug)
  const perWeek = Math.max(program.sessionsPerWeek, sessions.length || 1)
  const total = program.weeks * perWeek

  const completed = clamp(record?.completedWorkoutSlugs.length ?? 0, 0, total)
  const isComplete = completed >= total && total > 0

  const currentWeek = isComplete ? program.weeks : Math.min(Math.floor(completed / perWeek) + 1, program.weeks)
  const dayOfWeek = isComplete ? perWeek : (completed % perWeek) + 1

  // Sessions rotate within the week, so the next one is simply the next slot.
  const nextWorkout = isComplete ? null : (sessions[completed % Math.max(sessions.length, 1)] ?? null)

  return {
    program,
    percent: total ? Math.round((completed / total) * 100) : 0,
    completed,
    total,
    currentWeek,
    dayOfWeek,
    nextWorkout,
    sessions,
    isComplete,
  }
}

/** Sorts a member's programs so the one they are mid-way through leads. */
export function sortByActivity(items: ProgramProgress[]): ProgramProgress[] {
  return [...items].sort((a, b) => {
    if (a.isComplete !== b.isComplete) return a.isComplete ? 1 : -1
    return b.percent - a.percent
  })
}
