export default defineNuxtConfig({
  compatibilityDate: '2026-09-30',
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  components: [
    {
      path: '~/components',
      // Components are namespaced by folder on disk, but referenced by their
      // bare name in templates: <SiteHeader />, <AppIcon />, <AppTabBar />.
      pathPrefix: false,
    },
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Plero Technologies — Trade gift cards at live market rates',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#08080a' },
        { name: 'color-scheme', content: 'dark' },
        {
          name: 'description',
          content:
            'Buy and sell gift cards at live market rates. Deriv USD, iCash, Vouch, Cherry, Amazon, Apple, Google Play and Steam settled in 5–15 minutes.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Plero Technologies' },
        { property: 'og:title', content: 'Plero Technologies — Trade gift cards at live market rates' },
        {
          property: 'og:description',
          content: 'Live USD/NGN pricing, verified settlement, and payouts straight to your Nigerian bank account.',
        },
        // 1200x630 social card generated from the logo by scripts/generate-assets.cjs.
        // The raw logo is the wrong shape and aspect for a social preview.
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Plero — trade gift cards at live market rates' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: '/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    // Payment-scoped Deriv PAT. Private on purpose: anything under `public` is
    // serialised into the client bundle and readable by every visitor, so only
    // server/ routes may read this.
    derivToken: process.env.NUXT_DERIV_TOKEN || '',
    public: {
      // An app ID is not a secret — it only identifies the app. Safe to ship.
      derivAppId: process.env.NUXT_DERIV_APP_ID || '1089',
      derivWsUrl:
        process.env.NUXT_DERIV_WS_URL || 'wss://api.derivws.com/trading/v1/options/ws/public',
    },
  },
})
