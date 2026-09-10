/**
 * Auth screens carry no site chrome — no nav, no footer. One task on the
 * screen, and the logo links home if someone changes their mind.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main id="main">{children}</main>
}
