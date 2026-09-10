'use client'

import { useId, useState } from 'react'
import { formatNaira } from '@/lib/utils'

/**
 * Two small charts, hand-drawn in SVG.
 *
 * Both are single-series, so there is no legend box — the title names the
 * series — and no categorical palette: one hue (ember, validated at >= 3:1
 * against the card surface) carries every mark. Grid and axes are solid
 * hairlines one shade off the surface, marks are thin, and each chart ships a
 * hover layer plus a visually-hidden table so the values are readable without
 * colour or a pointer.
 */

const EMBER = '#FF4A1C'
const GRID = 'rgba(255,255,255,0.09)'
const SURFACE = '#17191D'

export type SeriesPoint = { label: string; value: number }

/* -------------------------------------------------------------------------- */
/* Revenue over time                                                           */
/* -------------------------------------------------------------------------- */

export function RevenueChart({ data, title }: { data: SeriesPoint[]; title: string }) {
  const gradientId = useId()
  const [hover, setHover] = useState<number | null>(null)

  if (data.length < 2) {
    return <p className="py-16 text-center text-sm text-slate2">Not enough history to chart yet.</p>
  }

  const width = 720
  const height = 240
  const pad = { top: 16, right: 16, bottom: 28, left: 56 }
  const plotW = width - pad.left - pad.right
  const plotH = height - pad.top - pad.bottom

  const max = Math.max(...data.map((point) => point.value), 1)
  // Round the ceiling up so the axis labels are readable numbers.
  const ceiling = Math.ceil(max / 50000) * 50000 || max

  const x = (index: number) => pad.left + (index / (data.length - 1)) * plotW
  const y = (value: number) => pad.top + plotH - (value / ceiling) * plotH

  const line = data.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.value)}`).join(' ')
  const area = `${line} L ${x(data.length - 1)} ${pad.top + plotH} L ${x(0)} ${pad.top + plotH} Z`

  const peakIndex = data.reduce((best, point, index) => (point.value > data[best].value ? index : best), 0)
  const lastIndex = data.length - 1
  const active = hover ?? lastIndex

  const ticks = [0, 0.5, 1].map((fraction) => Math.round(ceiling * fraction))

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={`${title}. Highest month ${data[peakIndex].label} at ${formatNaira(data[peakIndex].value)}.`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={EMBER} stopOpacity="0.28" />
            <stop offset="100%" stopColor={EMBER} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Solid hairline grid, one shade off the surface */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke={GRID} strokeWidth="1" />
            <text
              x={pad.left - 10}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-[#5A5E66] text-[10px]"
            >
              {tick >= 1000 ? `${Math.round(tick / 1000)}k` : tick}
            </text>
          </g>
        ))}

        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke={EMBER} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Month labels, thinned so they never collide */}
        {data.map((point, index) =>
          index % Math.ceil(data.length / 6) === 0 || index === lastIndex ? (
            <text
              key={point.label}
              x={x(index)}
              y={height - 8}
              textAnchor="middle"
              className="fill-[#5A5E66] text-[10px]"
            >
              {point.label}
            </text>
          ) : null,
        )}

        {/* Crosshair + marker for the hovered month */}
        <line
          x1={x(active)}
          x2={x(active)}
          y1={pad.top}
          y2={pad.top + plotH}
          stroke={GRID}
          strokeWidth="1"
        />
        {/* 2px surface ring keeps the marker legible over the line */}
        <circle cx={x(active)} cy={y(data[active].value)} r="5" fill={EMBER} stroke={SURFACE} strokeWidth="2" />

        {/* Generous invisible hit targets */}
        {data.map((point, index) => (
          <rect
            key={point.label}
            x={x(index) - plotW / (data.length - 1) / 2}
            y={pad.top}
            width={plotW / (data.length - 1)}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(index)}
          />
        ))}
      </svg>

      <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <span className="font-display text-[0.625rem] uppercase tracking-[0.18em] text-slate2">
          {data[active].label}
        </span>
        <span className="font-display text-lg text-bone">{formatNaira(data[active].value)}</span>
      </figcaption>

      {/* Table fallback — the values without colour or a pointer */}
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.label}</th>
              <td>{formatNaira(point.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/* Ranked bars                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A ranked list with bars. One hue for every bar — length already encodes the
 * magnitude, so shading by value would burn the colour channel on information
 * the chart shows twice.
 */
export function RankedBars({
  data,
  title,
  format = (value: number) => String(value),
}: {
  data: SeriesPoint[]
  title: string
  format?: (value: number) => string
}) {
  const [hover, setHover] = useState<string | null>(null)

  if (!data.length) {
    return <p className="py-16 text-center text-sm text-slate2">No sales recorded yet.</p>
  }

  const max = Math.max(...data.map((point) => point.value), 1)

  return (
    <figure className="m-0">
      <ul className="space-y-3.5">
        {data.map((point) => {
          const percent = Math.max((point.value / max) * 100, 1.5)
          return (
            <li
              key={point.label}
              onMouseEnter={() => setHover(point.label)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="truncate text-sm text-ash">{point.label}</span>
                <span className="shrink-0 font-display text-sm tabular-nums text-bone">{format(point.value)}</span>
              </div>
              <div className="mt-2 h-2 w-full bg-white/[0.07]">
                <div
                  className="h-full rounded-r-[4px] transition-[width,opacity] duration-500 ease-out"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: EMBER,
                    opacity: hover && hover !== point.label ? 0.45 : 1,
                  }}
                />
              </div>
            </li>
          )
        })}
      </ul>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.label}</th>
              <td>{format(point.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
