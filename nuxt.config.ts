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
        { property: 'og:image', content: '/plero-logo.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
    public: {
      // App ID identifies the app for authenticated REST calls. The public
      // market-data WebSocket does not take one.
      derivAppId: process.env.NUXT_DERIV_APP_ID || '',
      derivToken: process.env.NUXT_DERIV_TOKEN || '',
      derivWsUrl:
        process.env.NUXT_DERIV_WS_URL || 'wss://api.derivws.com/trading/v1/options/ws/public',
    },
  },
})
