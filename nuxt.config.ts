export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  // Server-only secrets; set via NUXT_RESEND_API_KEY, NUXT_CONTACT_TO, NUXT_CONTACT_FROM.
  runtimeConfig: {
    resendApiKey: '',
    contactTo: '',
    contactFrom: 'Plero Website <onboarding@resend.dev>',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Plero Technologies',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1b1a4a' },
        {
          name: 'description',
          content:
            'Plero Technologies buys your unused gift cards at fair, transparent rates and pays you fast.',
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
