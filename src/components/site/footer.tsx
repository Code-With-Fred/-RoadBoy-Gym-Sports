import { Facebook, Instagram, Music2, Phone } from 'lucide-react'
import { WhatsAppLink } from '@/components/ui'
import { NAV_LINKS, SITE } from '@/lib/site'
import { waGeneral } from '@/lib/whatsapp'
import { Wordmark } from './wordmark'

const SOCIAL_ICONS = { Instagram, Facebook, TikTok: Music2 } as const

export function Footer() {
  return (
    <footer className="border-t border-line bg-coal">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Wordmark className="text-[19px]" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ash">
              Quality gym and sports equipment delivered across Nigeria. Free delivery, free installation, and you pay
              when your order arrives.
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.14em] text-slate2">
              {SITE.promises.map((promise) => (
                <li key={promise}>{promise}</li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className="font-display text-[0.6875rem] uppercase tracking-[0.2em] text-bone">Explore</h2>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-ash transition-colors hover:text-ember">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h2 className="font-display text-[0.6875rem] uppercase tracking-[0.2em] text-bone">Order or enquire</h2>

            <a
              href={`tel:${SITE.contact.phoneIntl}`}
              className="mt-5 flex items-center gap-3 text-lg text-bone transition-colors hover:text-ember"
            >
              <Phone className="h-4 w-4 shrink-0 text-ember" aria-hidden />
              <span className="font-display tracking-[0.06em]">{SITE.contact.phoneDisplay}</span>
            </a>

            <p className="mt-3 text-sm text-ash">
              WhatsApp is the fastest way to reach us. Send the equipment you want and we will confirm price,
              availability and delivery.
            </p>

            <WhatsAppLink href={waGeneral()} size="lg" className="mt-6 w-full sm:w-auto">
              Chat with us on WhatsApp
            </WhatsAppLink>

            {/*
              Social links render only once real URLs are added to SITE.socials.
              An invented handle sends customers to someone else's account.
            */}
            {SITE.socials.length > 0 ? (
              <ul className="mt-7 flex items-center gap-3">
                {SITE.socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.name]
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
            ) : null}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate2">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate2">Serving customers nationwide across {SITE.countryName}.</p>
        </div>
      </div>
    </footer>
  )
}
