/** Join class names, dropping falsy values. Keeps JSX conditionals readable. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Whole Naira with thousands separators: 1150000 -> "₦1,150,000". */
export function formatNaira(naira: number): string {
  return `₦${Math.round(naira).toLocaleString('en-NG')}`
}
