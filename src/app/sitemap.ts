import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

/** A single page — the sections are anchors, not routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
