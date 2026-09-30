<template>
  <div class="page">
    <HeroSection />
    <RateTicker />
    <StatsBand />
    <GiftCardsSection />
    <StepsSection />
    <FeaturesSection />
    <TestimonialsSection />
    <FaqSection :items="HOME_FAQS" />
    <CtaSection
      title="Open an account before the next rate move."
      lede="Free to join. Verification takes minutes. Your first payout lands before you finish your next coffee."
    />
  </div>
</template>

<script setup lang="ts">
import { HOME_FAQS } from '~/data/site'

useHead({
  title: 'Plero Technologies — Trade gift cards at live market rates',
  meta: [
    {
      name: 'description',
      content:
        'Live USD/NGN pricing, verified settlement, and payouts straight to your Nigerian bank account in 5–15 minutes.',
    },
  ],
})
</script>

<style scoped>
.page {
  padding-top: var(--nav-h);
}
</style>
