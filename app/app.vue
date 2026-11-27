<script setup lang="ts">
const { site } = useContent()
const { deriv } = useRates()

const url = useRequestURL()
const route = useRoute()

// Link previews (WhatsApp, Facebook, X) and Google business details.
useSeoMeta({
  ogSiteName: () => site.value.name,
  ogType: 'website',
  ogImage: `${url.origin}/images/og.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogUrl: () => `${url.origin}${route.path}`,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: () => `${url.origin}${route.path}` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FinancialService',
        name: site.value.name,
        ...(site.value.registration.legalName ? { legalName: site.value.registration.legalName } : {}),
        ...(site.value.registration.rcNumber ? { identifier: site.value.registration.rcNumber } : {}),
        description: site.value.tagline,
        url: url.origin,
        logo: `${url.origin}/images/logo-full.jpg`,
        email: site.value.contact.email,
        telephone: site.value.contact.phone,
        areaServed: 'NG',
        address: { '@type': 'PostalAddress', addressLocality: site.value.contact.address },
        sameAs: site.value.socials.map((s) => s.href).filter((h) => h.startsWith('http')),
        knowsAbout: [
          'Deriv payment agent',
          'Deriv deposits',
          'Deriv withdrawals',
          'USDT exchange',
          'Airtm USD exchange',
          'China supplier payments',
          'Gift cards',
        ],
        brand: { '@type': 'Brand', name: 'Plero Pay' },
        potentialAction: { '@type': 'RegisterAction', target: deriv.value.signupUrl },
      })),
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
