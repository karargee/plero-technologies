<template>
  <div class="home-page">
    <HeroSection />

    <RateTicker />

    <BentoShowcase />

    <!-- Live Trading Terminal Section (Deriv Signature Feature) -->
    <section class="section terminal-section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">DERIV REAL-TIME STREAMING</p>
          <h2 class="section-title">
            World-class charts, <span class="title-accent">24/7 trading.</span>
          </h2>
          <p class="section-lede">
            Stream continuous ticks and candlestick feeds directly from Deriv's public WebSocket exchange. Technical precision with zero desk latency.
          </p>
        </div>

        <div class="terminal-container reveal" style="transition-delay:0.1s">
          <TradeView />
        </div>
      </div>
    </section>

    <StepsSection />
    <FeaturesSection />
    <StatsBand />
    <TestimonialsSection />
    <FaqSection :items="HOME_FAQS" />

    <CtaSection
      title="Ready to trade without limits?"
      lede="Open a free account in 2 minutes. Send your Deriv balance, gift cards or crypto, and get paid straight to your bank account."
      primary-label="Open free account"
      secondary-label="Sign in instead"
      secondary-to="/login"
    />
  </div>
</template>

<script setup lang="ts">
import { HOME_FAQS } from '~/data/site'

useHead({
  title: 'Plero Technologies — Trade gift cards, crypto & Deriv USD',
  meta: [
    {
      name: 'description',
      content:
        'Live market pricing on Deriv USD, crypto, vouchers and gift cards in Nigeria. Verified settlement and payouts straight to your bank in minutes.',
    },
    { property: 'og:title', content: 'Plero Technologies — Trade with confidence' },
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

<style scoped>
.terminal-section {
  padding-block: clamp(48px, 7vw, 96px);
  border-top: 1px solid var(--hairline);
  background: var(--bg-alt);
}

.title-accent {
  color: var(--primary);
}

.terminal-container {
  margin-top: 28px;
  overflow: hidden;
  border-radius: var(--r-xl);
}

@media (max-width: 640px) {
  .terminal-container {
    margin-top: 20px;
    border-radius: var(--r-lg);
  }
}
</style>

