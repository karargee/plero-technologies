<script setup lang="ts">
import { deriv, site } from '~/data/site'

const url = useRequestURL()
const route = useRoute()

// Link previews (WhatsApp, Facebook, X) and Google business details.
useSeoMeta({
  ogSiteName: site.name,
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
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FinancialService',
        name: site.name,
        ...(site.registration.legalName ? { legalName: site.registration.legalName } : {}),
        ...(site.registration.rcNumber ? { identifier: site.registration.rcNumber } : {}),
        description: site.tagline,
        url: url.origin,
        logo: `${url.origin}/images/logo-full.jpg`,
        email: site.contact.email,
        telephone: site.contact.phone,
        areaServed: 'NG',
        address: { '@type': 'PostalAddress', addressLocality: site.contact.address },
        sameAs: site.socials.map((s) => s.href).filter((h) => h.startsWith('http')),
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
        potentialAction: { '@type': 'RegisterAction', target: deriv.signupUrl },
      }),
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
