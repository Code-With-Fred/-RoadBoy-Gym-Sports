import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Inter } from 'next/font/google'
import { IMAGES, sized } from '@/lib/images'
import { SITE } from '@/lib/site'
import './globals.css'

/**
 * Barlow Condensed carries every headline; Inter carries every sentence.
 * Both are self-hosted by next/font, so there is no render-blocking request to
 * Google and no layout shift when they swap in — which matters on the mobile
 * connections most of this traffic arrives on.
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

const OG_IMAGE = sized(IMAGES.og.src, 1200, 80)

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: 'RoadBoy Gym & Sports Equipments | Gym Equipment Delivery Across Nigeria',
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'gym equipment in Nigeria',
    'gym equipment Nigeria',
    'buy gym equipment Nigeria',
    'gym equipment supplier Nigeria',
    'gym equipment for sale Nigeria',
    'home gym equipment Nigeria',
    'commercial gym equipment Nigeria',
    'treadmill Nigeria',
    'treadmill price in Nigeria',
    'dumbbells Nigeria',
    'gym setup Nigeria',
    'fitness equipment Nigeria',
    'table tennis table Nigeria',
    'snooker table Nigeria',
    'rowing machine Nigeria',
    'massage gun Nigeria',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: SITE.url },
  // Nigerian buyers tap the number as often as they tap WhatsApp.
  formatDetection: { telephone: true },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: 'RoadBoy Gym & Sports Equipments | Gym Equipment Delivery Across Nigeria',
    description: SITE.description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoadBoy Gym & Sports Equipments',
    description: SITE.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'shopping',
}

export const viewport: Viewport = {
  themeColor: '#08090B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

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
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* The hero image is the LCP element; warm the connection early. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
