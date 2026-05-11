# Update Footer, FAQ, Pricing, and SEO

Scope: only content, links, and `<head>` metadata. No changes to test logic, auth, or claim flow.

## 1. Footer (`src/components/Footer.tsx` + footer copy in `src/pages/Index.tsx`)

In both ID and EN `company` arrays:
- Remove the "Tentang" / "About" link entirely.
- Keep "Privasi" → `/privasi`, "Syarat" → `/syarat`, "Kontak" → mailto.

Note: `Index.tsx` has its own duplicate footer copy block (lines ~84–106 and ~174–196). Update that one too so both stay in sync.

## 2. FAQ section (`src/pages/Index.tsx`)

- Title (ID): "Hal-hal yang biasa ditanyakan." (replace current `["Lima hal yang", "selalu ditanyakan."]`).
- Title (EN): keep an equivalent ("Things people often ask.").
- Sub-message (ID): `Masih ada pertanyaan? Email kami di sini <mailto link>admin.johariwindow.id@gmail.com</mailto>` (rendered as a clickable mailto link, replacing current `lead`).
- Sub-message (EN): equivalent English version.
- Replace the 5 ID FAQ items with the new Q1–Q5 provided. Mirror them with English translations for the EN locale.
- Accordion behavior: the FAQ already uses an expand/collapse pattern (state `open`), so it stays accordion-style — just swap the items.

## 3. Pricing page (`src/pages/Pricing.tsx`)

- On Coach Starter and Coach Growth tier cards only, add a green pill/label directly under the price:
  - ID: "✓ Sekali Bayar, Bukan Langganan"
  - EN: "✓ One-time payment, not a subscription"
  - Styled with semantic green tokens (e.g. `text-emerald-600 bg-emerald-50` via existing token system or a new `success` token if available).
- Add a feature comparison table beneath the 3 pricing cards, before the enterprise CTA box:
  - Columns: Fitur | Gratis | Coach Starter | Coach Growth
  - Rows exactly as specified by the user (8 rows). Use `✓` and `—`.
  - Responsive: horizontal scroll on small screens.
  - Provide ID and EN versions of headers and row labels.
- Below the table, add a small line:
  - ID: `Ada pertanyaan soal harga? Hubungi kami via email: admin.johariwindow.id@gmail.com` with the email as a `mailto:` link.
  - EN equivalent.

## 4. SEO meta tags (per-page)

Install `react-helmet-async` (lightweight, standard for Vite/React) and wrap the app in `HelmetProvider` in `src/App.tsx`. Then add a `<Helmet>` block to each page:

- `/` (`src/pages/Index.tsx`):
  - Title: `Tes Johari Window Indonesia — Temukan Kekuatan & Blind Spot Kamu`
  - Description: provided text.
  - Open Graph tags (title/description/type/url/image) as specified.
  - JSON-LD FAQ schema script as specified.
- `/pricing` (`src/pages/Pricing.tsx`): title + description as specified.
- `/coach` (`src/pages/coach/CoachLanding.tsx`): title + description as specified.
- `/privasi` (`src/pages/Privasi.tsx`): title + description as specified.
- `/syarat` (`src/pages/Syarat.tsx`): title + description as specified.

Also update `index.html` defaults to match the new homepage title/description so pre-hydration crawlers see the right values, and remove the stale `og:image` pointing at the lovable preview (replace with `https://johariwindow.id/og-image.png`).

Note: `og-image.png` is referenced but may not exist in `/public`. I'll point to it as specified; if missing, we can add the asset in a follow-up.

## Out of scope (untouched)

- Test flow, auth, admin, claim/redeem logic.
- Database, edge functions, RLS.
- Existing routes other than meta-tag additions.
