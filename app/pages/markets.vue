<script setup lang="ts">
import { deriv, markets } from '~/data/site'

useSeoMeta({
  title: 'Live Deriv charts',
  description: 'Live Deriv charts for Volatility indices, Boom & Crash, Step Index, forex, gold and crypto.',
})

const route = useRoute()
const router = useRouter()
const fromQuery = String(route.query.symbol ?? '')
const symbol = ref(markets.some((m) => m.symbol === fromQuery) ? fromQuery : 'R_75')

// Keep the URL shareable (e.g. /markets?symbol=BOOM1000)
watch(symbol, (s) => router.replace({ query: { ...route.query, symbol: s } }))
</script>

<template>
  <div>
    <section class="page-hero page-hero--tight page-hero--photo" style="--hero-img: url('/images/trading-laptop.webp')">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">Live charts</span>
        <h1>Live Deriv markets</h1>
        <p>Real-time prices streamed from Deriv. Pick a market, switch between ticks and 1-minute candles.</p>
      </div>
    </section>

    <section class="section markets">
      <div class="container">
        <DerivChart v-model:symbol="symbol" :height="440" />

        <div class="markets__cta">
          <p>Ready to trade? Fund your Deriv account in Naira through Plero.</p>
          <div>
            <NuxtLink to="/deriv" class="btn btn--primary">Deposit now</NuxtLink>
            <a :href="deriv.signupUrl" target="_blank" rel="noopener" class="btn btn--ghost">Register on Deriv</a>
          </div>
        </div>

        <h2 class="markets__title">All markets</h2>
        <MarketBoard v-model="symbol" />

        <p class="risk">
          Prices are provided by Deriv for information only. Trading derivatives is high-risk and you can lose
          the money you invest. Only trade with money you can afford to lose.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero--tight {
  padding-bottom: clamp(96px, 12vw, 140px);
}
.markets {
  padding-top: 0;
}
.markets :deep(.chart) {
  margin-top: clamp(-100px, -9vw, -72px);
  position: relative;
}
.markets__cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  padding: 20px 24px;
  border-radius: var(--radius);
  background: var(--indigo-50);
  border: 1px solid var(--indigo-100);
}
.markets__cta p {
  font-weight: 600;
}
.markets__cta div {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.markets__title {
  margin: 48px 0 18px;
  font-size: 24px;
}
.risk {
  margin-top: 32px;
  font-size: 13px;
  color: var(--ink-mute);
  max-width: 760px;
}
</style>
