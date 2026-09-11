import Link from 'next/link'
import { ButtonLink } from '@/components/ui'
import { WhatsAppLink } from '@/components/ui/whatsapp-link'
import { Wordmark } from '@/components/site/wordmark'
import { waGeneral } from '@/lib/whatsapp'

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-20 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 texture-grid opacity-30" />

      <Link href="/" aria-label="RoadBoy Gym&Sports Equipments home">
        <Wordmark className="text-[19px]" />
      </Link>

      <p className="mt-16 font-display text-[6rem] leading-none text-ember sm:text-[9rem]">404</p>

      <h1 className="mt-4 text-display-sm">This page does not exist.</h1>

      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ash">
        The page you were looking for has moved or never existed. The equipment is all on the home page — or just
        message us and tell us what you need.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/#equipment" variant="outline" size="lg">
          View equipment
        </ButtonLink>
        <WhatsAppLink href={waGeneral()} size="lg">
          Order on WhatsApp
        </WhatsAppLink>
      </div>
    </main>
  )
}
