import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Admin table.
 *
 * Real `<table>` markup with scoped headers — admin data is tabular and a grid
 * of divs would lose that for anyone using a screen reader. Scrolls inside its
 * own container so the page never scrolls sideways.
 */
export function DataTable<T>({
  columns,
  rows,
  getKey,
  empty = 'Nothing here yet.',
  caption,
}: {
  columns: Array<{
    header: string
    cell: (row: T) => ReactNode
    align?: 'left' | 'right'
    className?: string
  }>
  rows: T[]
  getKey: (row: T) => string
  empty?: string
  caption: string
}) {
  if (!rows.length) {
    return (
      <div className="border border-line bg-steel p-12 text-center">
        <p className="text-sm text-ash">{empty}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-line bg-steel">
      <table className="w-full min-w-[44rem] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line">
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className={cn(
                  'px-5 py-4 font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2',
                  column.align === 'right' && 'text-right',
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getKey(row)} className="border-b border-line last:border-0 transition-colors hover:bg-iron">
              {columns.map((column) => (
                <td
                  key={column.header}
                  className={cn(
                    'px-5 py-4 align-middle text-sm text-ash',
                    column.align === 'right' && 'text-right',
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
