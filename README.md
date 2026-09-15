# RoadBoy Gym&Sports Equipments

A conversion-focused landing page for a Nigerian gym and sports equipment
supplier. One page, one job: get the visitor into WhatsApp with a message that
already says which equipment they want.

There is no cart, no checkout, no accounts and no database. **WhatsApp is the
checkout.**

```
VISIT → VIEW EQUIPMENT → ORDER ON WHATSAPP → DELIVERY → FREE INSTALLATION → PAY ON DELIVERY
```

Built with Next.js 15 (App Router), TypeScript and Tailwind CSS. The whole page
is static — no server, no environment variables, no secrets.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

---

## The three files you will actually edit

### 1. `src/lib/site.ts` — brand and phone number

The WhatsApp number, the display phone number, the navigation and the four
promises. Change the number here and every button, the floating bubble, the
footer and the structured data all follow.

```ts
contact: {
  phoneDisplay: '0805 359 4533',
  phoneIntl: '+2348053594533',
  whatsapp: '2348053594533',   // digits only, for wa.me links
}
```

**Social links are deliberately empty.** Nothing renders until you add real URLs
to `SITE.socials` — an invented handle sends your customers to someone else's
account.

### 2. `src/lib/products.ts` — the catalogue and price list

RoadBoy's current price list: **27 products** across four tabs — Cardio (7),
Strength (9), Sports & Games (5) and Massage & Recovery (6). Plain data; add,
remove or reorder freely and the grid, tab counts and WhatsApp messages follow.

```ts
{
  id: 'treadmill-2-5hp',
  name: '2.5HP Treadmill',
  category: 'Treadmill',
  filter: 'cardio',              // drives the filter tabs
  image: productImage('treadmill-2-5hp'),
  priceNaira: 830_000,           // whole Naira; null -> "Price on request"
  description: '...',
  specs: [
    { label: 'Motor', value: '2.5 HP' },
    { label: 'Max user weight', value: '120 kg' },
  ],
  availability: 'Available to order',
}
```

- **Specs come only from the supplier's list.** Nothing is estimated. If a spec
  was not supplied, it is not shown.
- The "All" tab shows the first 8 products, then **Show all 27**. Collapsed
  cards are hidden, not removed, so search engines still see the full range.

### 3. `src/lib/images.ts` — the photography

**Product photos.** 12 products have an illustrative public-domain photo in
`/public/images/products` (sources in `SOURCES.md` there). Each shows the right
*type* of product, not the exact model, so the card labels it
**"Similar model shown"**.

The other 15 products show a designed **"Photo of this model on WhatsApp"**
tile instead. That is deliberate — a stock photo of a *different* machine would
mislead someone about to spend six figures, and no honest match existed for
massage guns, steppers, the plate boards or the benches with lat pulldown.

To add a real photo: save it as `/public/images/products/<product-id>.jpg`,
add or update its entry in `PRODUCT_IMAGES`, and set `representative: false`.
**Real photos of RoadBoy's own stock will out-convert every stock image on this
page** — this is the single most valuable next step.

---

## How WhatsApp ordering works

Every call to action is built in `src/lib/whatsapp.ts`. No link is written by
hand, so none can end up opening a blank chat.

| Where | Message |
|---|---|
| Hero, nav, floating bubble | *"I'm interested in your gym equipment…"* |
| Each product card | *"I'd like to order the **2.5HP Treadmill (₦830,000)**. Please confirm availability and delivery to my location."* |
| Build a home gym | *"I want to set up a home gym. Please help me choose…"* |
| Outfit a commercial gym | *"I want to outfit a commercial gym. Please send me a quote…"* |
| Need help choosing | *"I need help choosing equipment…"* |
| Final CTA | *"Please send me a quote… with delivery and installation."* |

Every product sends its own name and price, so you know exactly what the
customer wants — and what price they saw — before you reply.

To override the message for one product, set `whatsappMessage` on it.

---

## Adding customer reviews

`src/lib/reviews.ts` is an empty array, and the Reviews section reads that.

While it is empty the page shows an honest panel explaining that we publish real
feedback only. Add your first entry and the section automatically switches to a
proper review wall — no other change needed.

Nothing there is invented. A fabricated review is the easiest thing for a
sceptical buyer to catch, and on a six-figure purchase it costs the sale.

---

## Structure

```
src/
├── app/
│   ├── page.tsx          The landing page — every section, in order
│   ├── layout.tsx        Fonts, metadata, Open Graph
│   ├── globals.css       Design tokens and primitives
│   ├── not-found.tsx     404 -> back to the equipment
│   └── robots.ts  sitemap.ts
├── components/
│   ├── sections/         Hero, benefits, catalogue, audiences, why, how it
│   │                     works, delivery, reviews, FAQ, final CTA
│   ├── site/             Nav, footer, wordmark, floating WhatsApp, image, reveal
│   └── ui/               Buttons, WhatsApp link + glyph, headings, badges
└── lib/
    ├── site.ts           Brand, phone, navigation      <- edit
    ├── products.ts       The catalogue                 <- edit
    ├── images.ts         All photography               <- edit
    ├── reviews.ts        Customer reviews (empty)      <- edit
    ├── whatsapp.ts       Every pre-filled message
    ├── faqs.ts           FAQ copy + its rich result
    └── seo.ts            Structured data
```

---

## Design system

Charcoal ground, bone type, **one** accent — ember `#FF4A1C` — on every call to
action, price and hover state. Resist adding a second accent; the restraint is
what makes it read as premium rather than as a template.

WhatsApp buttons use the accent, not WhatsApp green, so the page keeps a single
accent. The WhatsApp glyph on each button is what signals where it goes. If you
would rather have the familiar green, it is one colour token.

- **Type** — Barlow Condensed headlines (always uppercase), Inter body. Fluid
  `clamp()` sizes, so nothing is ever too small on a phone.
- **Shape** — 2–4px radii, hairline borders, generous spacing. Sharp, not soft.
- **Motion** — scroll reveals, image zoom on hover, a condensing nav, one slow
  pulse on the floating button. `prefers-reduced-motion` disables all of it.

Tokens live in `tailwind.config.ts` and `src/app/globals.css`.

---

## Mobile, performance, accessibility

Most of this traffic arrives from Instagram, TikTok and WhatsApp on a phone, so:

- One `priority` image on the page (the hero, the LCP element). Every other
  image lazy-loads with a responsive `srcset` in AVIF/WebP.
- No animation library, no chart library, no UI framework — ~124 kB first load
  for the whole page, fully static.
- 48–56px tap targets on every button; the WhatsApp action is on screen at all
  times, in the nav and then in the floating bubble.
- **Content renders without JavaScript.** Scroll-reveal hiding is gated on a
  `js` class set by an inline script, so if JS never runs nothing is ever
  hidden. Images are not gated on client state either.
- Semantic landmarks and heading order, a skip link, visible ember focus rings,
  `aria-expanded` on the FAQ and menu, real `alt` text on every image.

---

## SEO

Targets Nigerian buying intent — *gym equipment in Nigeria*, *buy gym equipment
Nigeria*, *home gym equipment Nigeria*, *commercial gym equipment Nigeria*,
*treadmill price in Nigeria*, *snooker table Nigeria*, *table tennis table
Nigeria*, *massage gun Nigeria*.

Structured data covers the store, the delivery and installation service, and the
FAQ.

Every product with a price is published as a priced `Offer` in NGN, generated
from the same data as the cards, so the markup can never disagree with the page.

**One deliberate omission:** there is no postal address. None has been supplied,
and a fabricated shop address would put a wrong pin on the map and damage the
local listing it was meant to help. `areaServed: Nigeria` carries the
nationwide-delivery signal instead. Add a real address to `site.ts` and extend
the schema in `src/lib/seo.ts` when you have one.

---

## Commands

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

---

## Before you launch

- [ ] Get real photos of the 27 products (15 have none yet) — see `src/lib/images.ts`
- [ ] Confirm the WhatsApp number in `src/lib/site.ts` is the one you monitor
- [ ] Confirm item 15 on the price list — it was missing from the list supplied
- [ ] Add your Instagram / Facebook / TikTok URLs to `SITE.socials`
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain
- [ ] Send yourself a test order from a phone and check the message arrives right
- [ ] Add a real business address once there is a premises, for local search
