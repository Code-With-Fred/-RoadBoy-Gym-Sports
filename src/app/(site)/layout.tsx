import { Footer } from '@/components/site/footer'
import { Navbar } from '@/components/site/navbar'
import { getUser } from '@/lib/supabase/server'

/**
 * Public site chrome: sticky navigation and the full footer.
 *
 * Read once here so the nav can show "Dashboard" instead of "Login" without
 * every page paying for its own auth round-trip.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  return (
    <>
      <Navbar signedIn={Boolean(user)} />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
