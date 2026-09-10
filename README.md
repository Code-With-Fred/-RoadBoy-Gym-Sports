# ROADBOY GYM&SPORTS

A production-ready website for a premium gym that also sells digital workout
programs. It is four things in one codebase:

- a **marketing site** for the physical gym (facilities, trainers, community, results)
- a **digital marketplace** selling structured workout programs
- a **training app** members log into to follow their program and track progress
- an **admin console** the gym owner runs the business from, without touching code

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS and Supabase.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

**The whole marketing site works with no configuration at all.** Every page
renders from the curated content in `src/lib/content`, so you can look at the
finished thing before deciding anything about a backend. Accounts, checkout, the
dashboard and the admin console light up once Supabase is connected.

---

## Connecting the backend

### 1. Create a Supabase project

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

The first two are public and safe in the browser. **The service role key is not** —
it bypasses every security rule, so it is only ever read on the server (by the
payment webhook and the seed script) and must never gain a `NEXT_PUBLIC_` prefix.

### 2. Run the migrations

In the Supabase SQL editor, run in order:

1. `supabase/migrations/0001_schema.sql` — tables, relationships, triggers
2. `supabase/migrations/0002_rls.sql` — Row Level Security policies

### 3. Seed the content

```bash
npm run seed
```

This pushes the programs, workouts, exercises, trainers, memberships,
testimonials, transformations and gallery from `src/lib/content` into the
database. It is idempotent — re-run it any time.

### 4. Make yourself an admin

Sign up on the site, then in the SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@yourgym.com';
```

`/admin` is now open to you.

### 5. Connect payments

```
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_WEBHOOK_SECRET=...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
```

In the Paystack dashboard, point the webhook at:

```
https://yourdomain.com/api/payments/webhook
```

Until the secret key is set, checkout says so plainly rather than pretending to
charge anyone.

---

## How the money works

```
Browse → Program detail → Checkout → Paystack hosted page
                                          ↓
                              webhook (signature verified)
                                          ↓
                          order marked paid · program granted
                                          ↓
                            Dashboard → Workouts unlocked
```

Three things are deliberate here:

- **The browser never sets the price.** Checkout sends a program slug; the server
  looks the price up in the catalogue. A tampered request cannot change what is charged.
- **The browser never grants access.** The success page only *reads* payment state.
  Entitlements are written by the webhook, after re-verifying with Paystack.
- **Card details never reach this application.** Paystack holds the instrument; we
  store only their transaction reference.

Bought without an account? The entitlement is parked against the email address and
claimed automatically when someone signs up with it.

### Swapping payment provider

Everything goes through the `PaymentProvider` interface in
`src/lib/payments/types.ts`. To move to Flutterwave or Stripe, write one more
implementation and change the single export in `src/lib/payments/index.ts`.
Nothing else in the app knows which gateway is in use.

---

## Security

Access is enforced in the database, not the interface.

| Data | Who can read it |
|---|---|
| Marketing content | Everyone |
| Free library workouts | Everyone |
| Program workouts | Only users with a matching `user_programs` row |
| Orders, progress, profile | Only their owner (and admins) |
| Payments, customers | Admins only |

Row Level Security is on for every table. The key policy is
`workouts_readable_when_free_or_owned` — the UI padlock is a courtesy, that
policy is the actual paywall. `user_programs` has **no** insert policy for
members, so nobody can grant themselves a program; only the webhook (running as
the service role) writes there.

Admin is checked three times — middleware, layout, and RLS — so a mistake in any
one of them is not a breach.

---

## Managing the site without code

`/admin` is a real CMS. The owner can change, with no deploy:

| Section | What it controls |
|---|---|
| Programs | Names, copy, prices, covers, what is featured, published state |
| Workouts | Session names, summaries, durations, covers, free/paid |
| Exercises | Coaching cues, substitutions, **demonstration video URLs** |
| Memberships | Plans, prices, features, which one is highlighted |
| Trainers | Profiles, bios, certifications, portraits, ordering |
| Testimonials | Member quotes and ratings |
| Gallery | The photographs across the homepage and facilities page |
| Orders / Customers | Read-only views of the business |
| Overview | Revenue, sales, programs sold, most popular program |

**How the fallback works.** Every read goes through `src/lib/data.ts`, which
prefers the database and falls back to `src/lib/content` when a table is empty.
That is why a fresh clone shows a complete site, and why the admin console shows
an empty table honestly instead of pretending built-in content is editable.

Gym address, phone, hours and social links live in one file: `src/lib/site.ts`.
Changing them there updates the footer, contact page, WhatsApp links and the
local-SEO structured data at once.

---

## Replacing the photography

Every image is referenced from **`src/lib/images.ts`**. The placeholders are real
gym photography from Unsplash, sized and cropped through `next/image`.

To use the gym's own photos: upload them (Supabase Storage, or `/public`), paste
the URLs over the ones in that file, and keep the keys unchanged. Add the host to
`images.remotePatterns` in `next.config.mjs` if it is somewhere new. Program
covers, trainer portraits and gallery images can also be replaced from `/admin`
without touching the file at all.

---

## Project structure

```
src/
├── app/
│   ├── (site)/          Public site — nav + footer chrome
│   ├── (auth)/          Login, signup, password reset — no chrome
│   ├── dashboard/       Member area: programs, workout player, orders, settings
│   ├── admin/           Owner console: catalogue, business, content
│   └── api/             checkout · payments/webhook · progress · contact · admin
├── components/
│   ├── ui/              Buttons, fields, badges, headings — the design system
│   ├── site/            Nav, footer, gallery, reveal, images, page hero
│   ├── home/            Homepage sections
│   ├── programs/ workouts/ trainers/ transformations/ membership/ checkout/
│   ├── dashboard/       Member shell, workout player, progress components
│   └── admin/           Admin shell, CMS resource manager, charts, tables
├── lib/
│   ├── content/         Curated programs, workouts, exercises, coaches, copy
│   ├── supabase/        Browser / server / admin clients
│   ├── payments/        Provider abstraction + Paystack implementation
│   ├── data.ts          Read layer — database first, content fallback
│   ├── progress.ts      Turning progress rows into dashboard numbers
│   ├── seo.ts           Metadata + schema.org builders
│   ├── images.ts        Every photograph on the site
│   └── site.ts          Brand, address, hours, navigation
├── middleware.ts        Session refresh + route protection
supabase/migrations/     Schema and RLS
scripts/seed.ts          Sync content → database
```

---

## Design system

A narrow, deliberate palette: charcoal ground, bone type, **one** accent (ember
`#FF4A1C`) reserved for actions, prices and anything the eye must find first.
Resist adding a second accent — the restraint is what makes it read as premium.

- **Type**: Barlow Condensed for headlines (always uppercase), Inter for body.
  Fluid sizes via `clamp()`, so nothing is ever too small on a phone.
- **Shape**: 2–4px radii, hairline borders, generous spacing. Sharp, not soft.
- **Motion**: scroll reveals, counters, image zoom on hover, a condensing nav.
  All fast, all optional — `prefers-reduced-motion` disables them wholesale.

Tokens live in `tailwind.config.ts` and `src/app/globals.css`.

---

## Accessibility

Semantic landmarks and heading order throughout; a skip link; visible ember focus
rings on every interactive element; real `<table>` markup for tabular data;
labelled form controls with `aria-describedby` / `aria-invalid` wired up by the
`Field` primitive; `aria-expanded` on every disclosure; keyboard support in the
gallery lightbox (arrows, Escape) and mobile nav.

Charts ship a visually-hidden data table so the numbers are readable without
colour or a pointer, and the accent was validated for contrast against the card
surface rather than eyeballed.

**Content is visible without JavaScript.** Scroll-reveal hiding is gated on a `js`
class set by an inline script — if JS never runs, nothing is ever hidden. Images
are likewise not gated on client state.

---

## Performance

- Marketing pages are static or ISR (`revalidate = 3600`); account pages are dynamic
- One `priority` image per page (the hero — the LCP element); everything else lazy
- Responsive `srcset` and AVIF/WebP via `next/image`
- No animation library — scroll reveal and counters are ~40 lines of
  `IntersectionObserver` and `requestAnimationFrame`
- No chart library — the two admin charts are hand-drawn SVG
- ~105 kB shared JS

---

## SEO

Per-page titles, descriptions, canonicals and Open Graph; `sitemap.xml` and
`robots.txt` generated from the content (account and checkout paths excluded);
schema.org for the gym (`ExerciseGym` + `LocalBusiness` with NAP, geo and opening
hours), each `Product` program with its rating, each coach as a `Person`,
breadcrumbs, and FAQs on the programs and membership pages.

Targets `gym near me`, `gym in Lekki`, `personal training Lagos`, `online workout
programs`, `muscle building program`, `fat loss workout`, `gym membership Lagos`.

**Before launch**, replace the placeholder details in `src/lib/site.ts` — address,
phone, coordinates, socials, `NEXT_PUBLIC_SITE_URL` — and make sure they match
your Google Business Profile exactly. Local ranking depends on that consistency.

---

## Commands

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run seed       # sync src/lib/content into Supabase
```

---

## Before you launch

- [ ] Replace the gym details in `src/lib/site.ts`
- [ ] Replace the photography in `src/lib/images.ts` (or via `/admin`)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain
- [ ] Run both migrations, then `npm run seed`
- [ ] Promote your account to `admin`
- [ ] Add live Paystack keys and register the webhook URL
- [ ] Take one real test payment end-to-end and confirm it unlocks the dashboard
- [ ] Have a solicitor review `/terms` and `/privacy` (drafts are written, matched to how the site behaves)
- [ ] Confirm the transformation and testimonial content is genuine and consented to
