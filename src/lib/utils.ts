/** Join class names, dropping falsy values. Keeps JSX conditionals readable. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Naira, no decimals — prices in this business are always whole thousands. */
export function formatNaira(kobo: number): string {
  return `₦${Math.round(kobo).toLocaleString('en-NG')}`
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** "55 minutes" -> "55 min" style compact duration label. */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Deterministic pick so server and client render the same value. */
export function pick<T>(items: readonly T[], seed: number): T {
  return items[Math.abs(seed) % items.length]
}
