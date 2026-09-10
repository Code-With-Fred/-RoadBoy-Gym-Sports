import type { MetadataRoute } from 'next'
import { PROGRAMS, TRAINERS, WORKOUTS } from '@/lib/content'
import { SITE } from '@/lib/site'

/**
 * Static marketing routes plus every program, coach and free workout.
 * Paywalled sessions are excluded — they render a locked page to a crawler.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const pages: Array<{ path: string; priority: number; frequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/', priority: 1, frequency: 'weekly' },
    { path: '/programs', priority: 0.95, frequency: 'weekly' },
    { path: '/membership', priority: 0.9, frequency: 'monthly' },
    { path: '/workouts', priority: 0.85, frequency: 'weekly' },
    { path: '/trainers', priority: 0.8, frequency: 'monthly' },
    { path: '/about', priority: 0.7, frequency: 'monthly' },
    { path: '/facilities', priority: 0.7, frequency: 'monthly' },
    { path: '/transformations', priority: 0.7, frequency: 'monthly' },
    { path: '/contact', priority: 0.75, frequency: 'yearly' },
  ]

  return [
    ...pages.map((page) => ({
      url: `${SITE.url}${page.path === '/' ? '' : page.path}`,
      lastModified: now,
      changeFrequency: page.frequency,
      priority: page.priority,
    })),
    ...PROGRAMS.map((program) => ({
      url: `${SITE.url}/programs/${program.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...TRAINERS.map((trainer) => ({
      url: `${SITE.url}/trainers/${trainer.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...WORKOUTS.filter((workout) => workout.isFree).map((workout) => ({
      url: `${SITE.url}/workouts/${workout.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
