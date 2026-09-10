import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Inter } from 'next/font/google'
import { JsonLd } from '@/components/ui'
import { IMAGES, sized } from '@/lib/images'
import { gymSchema } from '@/lib/seo'
import { SITE } from '@/lib/site'
import './globals.css'

/**
 * Barlow Condensed carries every headline; Inter carries every sentence.
 * Both are self-hosted by next/font, so there is no render-blocking request to
 * Google and no layout shift when they swap in.
 */
const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Gym in Lekki, Lagos & Online Workout Programs`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'gym near me',
    'gym in Lekki',
    'fitness gym Lagos',
    'personal training Lagos',
    'workout programs',
    'online workout programs',
    'strength training',
    'muscle building program',
    'fat loss workout',
    'gym membership Lagos',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: SITE.url },
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: `${SITE.name} — Build Your Strongest Self`,
    description: SITE.description,
    images: [{ url: sized(IMAGES.og.src, 1200, 80), width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Build Your Strongest Self`,
    description: SITE.description,
    images: [sized(IMAGES.og.src, 1200, 80)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'fitness',
}

export const viewport: Viewport = {
  themeColor: '#08090B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

/**
 * Document shell only. Each route group supplies its own chrome:
 * (site) has the navigation and footer, (auth) is bare, and the dashboard and
 * admin areas bring their own.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/*
          Marks the document as JavaScript-capable before first paint, which is
          what lets the scroll-reveal CSS hide anything at all. Without JS the
          class never lands and every section renders plainly — no blank page,
          no flash of hidden content.
        */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body className="min-h-dvh">
        {children}
        <JsonLd data={gymSchema()} />
      </body>
    </html>
  )
}
