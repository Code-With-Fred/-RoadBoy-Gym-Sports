import Link from 'next/link'
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone, Youtube } from 'lucide-react'
import { FOOTER_NAV, SITE, mapsLink, whatsappLink } from '@/lib/site'
import { Wordmark } from './wordmark'

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  Instagram,
  TikTok: Music2,
  YouTube: Youtube,
  Facebook,
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-coal">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Wordmark className="text-[20px]" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ash">
              A strength and conditioning gym in Lekki, and a home for structured training online. Built for people
              who want the work to add up to something.
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              <li>
                <a
                  href={mapsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-ash transition-colors hover:text-bone"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
                  <span>
                    {SITE.address.line1}, {SITE.address.line2}
                    <br />
                    {SITE.address.city}, {SITE.address.countryName}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE.contact.phoneHref}`}
                  className="flex items-center gap-3 text-ash transition-colors hover:text-bone"
                >
                  <Phone className="h-4 w-4 shrink-0 text-ember" aria-hidden />
                  {SITE.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className="flex items-center gap-3 text-ash transition-colors hover:text-bone"
                >
                  <Mail className="h-4 w-4 shrink-0 text-ember" aria-hidden />
                  {SITE.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-ash transition-colors hover:text-bone"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-ember" aria-hidden />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-5 lg:col-start-6">
            {FOOTER_NAV.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-display text-[0.6875rem] uppercase tracking-[0.2em] text-bone">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-ash transition-colors hover:text-ember">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Hours */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-[0.6875rem] uppercase tracking-[0.2em] text-bone">Opening hours</h2>
            <dl className="mt-5 space-y-3 text-sm">
              {SITE.hours.map((entry) => (
                <div key={entry.days} className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-ash">{entry.days}</dt>
                  <dd className="shrink-0 font-display tracking-[0.08em] text-bone">
                    {entry.open} – {entry.close}
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-8 font-display text-[0.6875rem] uppercase tracking-[0.2em] text-bone">Follow</h2>
            <ul className="mt-4 flex items-center gap-3">
              {SITE.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.name] ?? Instagram
                return (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${SITE.name} on ${social.name}`}
                      className="flex h-10 w-10 items-center justify-center border border-line text-ash transition-colors hover:border-ember hover:text-ember"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate2">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate2">
            <li>
              <Link href="/contact" className="transition-colors hover:text-ash">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-ash">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition-colors hover:text-ash">
                Privacy
              </Link>
            </li>
            <li>RC 1234567</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
