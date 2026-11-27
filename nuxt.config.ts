export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  // Old URLs keep working.
  routeRules: {
    '/rates': { redirect: { to: '/gift-cards', statusCode: 301 } },
    '/how-it-works': { redirect: { to: '/deriv', statusCode: 301 } },
  },
  // Server-only secrets; set via NUXT_RESEND_API_KEY, NUXT_CONTACT_TO, NUXT_CONTACT_FROM.
  runtimeConfig: {
    resendApiKey: '',
    contactTo: '',
    contactFrom: 'Plero Website <onboarding@resend.dev>',
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Plero Technologies',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1b1a4a' },
        {
          name: 'description',
          content:
            'Plero Technologies: Deriv payment agent and Plero Pay — buy & sell USDT and Airtm USD, pay Chinese suppliers, all in Naira. Live Deriv charts.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap',
        },
      ],
    },
  },
})
