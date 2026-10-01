<template>
  <div>
    <HeroSection />

    <RateTicker />

    <BentoShowcase />

    <StepsSection />
    <FeaturesSection />
    <StatsBand />
    <TestimonialsSection />
    <FaqSection :items="HOME_FAQS" />

    <CtaSection
      title="Ready to turn your cards into cash?"
      lede="Create a free account, send your gift card or Deriv balance, and get naira in your bank while you watch. No agents, no queues."
      primary-label="Create free account"
      secondary-label="Sign in instead"
      secondary-to="/login"
    />
  </div>
</template>

<script setup lang="ts">
import { HOME_FAQS } from '~/data/site'

useHead({
  title: 'Plero — Sell gift cards, crypto & Deriv USD for naira',
  meta: [
    {
      name: 'description',
      content:
        'Live market pricing on Deriv USD, crypto, vouchers and gift cards in Nigeria. Verified settlement and payouts straight to your bank in minutes.',
    },
    { property: 'og:title', content: 'Plero — live rates for gift cards, crypto & Deriv USD' },
    {
      property: 'og:description',
      content:
        'Send a gift card or Deriv balance, get naira in your bank in minutes. Live pricing, verified settlement, no agents.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>
