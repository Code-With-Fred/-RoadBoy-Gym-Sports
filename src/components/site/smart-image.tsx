'use client'

import Image from 'next/image'
import { useState } from 'react'
import { sized } from '@/lib/images'
import { cn } from '@/lib/utils'

/**
 * Every photograph on the site goes through this.
 *
 * It caps the source rendition, lazy-loads by default, and degrades to a
 * designed placeholder if a file is missing — which matters while the gym is
 * still swapping in its own photography.
 *
 * The image is never hidden behind client state: a JS-driven fade would render
 * `opacity-0` in the server HTML, so the whole site would be imageless until
 * hydration and permanently imageless if the bundle failed. Instead a skeleton
 * sits *behind* the image and the browser paints the photo over it as it
 * arrives — same polish, no dependency on JavaScript.
 */
export function SmartImage({
  src,
  alt,
  width = 1600,
  quality = 74,
  priority = false,
  sizes = '100vw',
  className,
  imgClassName,
  fill = true,
  zoom = false,
  fit = 'cover',
}: {
  src: string
  alt: string
  width?: number
  quality?: number
  priority?: boolean
  sizes?: string
  className?: string
  imgClassName?: string
  fill?: boolean
  zoom?: boolean
  fit?: 'cover' | 'contain'
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-steel to-ink texture-grid',
          fill ? 'absolute inset-0' : 'h-full w-full',
          className,
        )}
      >
        <span className="px-6 text-center font-display text-[0.6875rem] uppercase tracking-[0.2em] text-slate2">
          Image unavailable
        </span>
      </div>
    )
  }

  return (
    <>
      {/* Holds the space and gives a slow connection something to look at. */}
      {fill ? <div aria-hidden className="absolute inset-0 bg-steel" /> : null}

      <Image
        src={sized(src, width, quality)}
        alt={alt}
        fill={fill}
        {...(fill ? {} : { width, height: Math.round(width * 0.66) })}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        onError={() => setFailed(true)}
        className={cn(fit === 'contain' ? 'object-contain' : 'object-cover', zoom && 'img-zoom', imgClassName, className)}
      />
    </>
  )
}
