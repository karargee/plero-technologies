# Plero Technologies — website

Nuxt 4 marketing site: Home, Rates, How it works, About, Support.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Edit content

All copy, rates, contacts, stats, testimonials and FAQs live in `app/data/site.ts`.
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
