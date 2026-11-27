# Plero Technologies — website

Nuxt 4 site for a Deriv payment agent: Home, Deposit & Withdraw (`/deriv`), Live charts (`/markets`),
Tools (`/tools`), Guides (`/guides`), Gift cards, About, Support. Also serves `/sitemap.xml` and `/robots.txt`.

Add or edit guide articles in `app/data/guides.ts` — no page code needed.

**Plero Pay** (`/plero-pay`, `/plero-pay/usdt`, `/plero-pay/airtm`, `/plero-pay/china`): rates, limits,
networks, payment methods, steps and FAQs all live in `app/data/pay.ts`.

Live charts stream from Deriv's public WebSocket feed
(`wss://api.derivws.com/trading/v1/options/ws/public`) — no API key needed. Logic is in
`app/composables/useDeriv.ts`; the chart is `app/components/deriv/DerivChart.vue`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Edit content

All copy, rates, contacts, stats, testimonials and FAQs live in `app/data/site.ts`.
The `deriv` block there holds your affiliate sign-up link, payment agent ID/email, deposit and
withdrawal rates, limits and Deriv app id.
Items marked `TODO` are placeholders — replace them before launch.
Emptying the `stats` or `testimonials` arrays hides those sections.

## Deploy (Vercel)

1. Push this folder to GitHub.
2. In Vercel: **Add New → Project → import the repo**. Framework is auto-detected as Nuxt; keep the defaults.
   If the repo root is the parent folder, set **Root Directory** to `plero-site`.
3. Add environment variables (Project → Settings → Environment Variables) for the Support form:

| Variable | Value |
| --- | --- |
| `NUXT_RESEND_API_KEY` | API key from https://resend.com |
| `NUXT_CONTACT_TO` | Inbox that receives messages |
| `NUXT_CONTACT_FROM` | e.g. `Plero <hello@yourdomain.com>` (domain verified in Resend) |

Without these, the form still works by opening the visitor's email app.
