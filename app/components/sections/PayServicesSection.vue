<script setup lang="ts">
import { payServices } from '~/data/pay'
</script>

<template>
  <section class="section pay-sec">
    <div class="pay-sec__bg" aria-hidden="true" />
    <div class="container pay-sec__grid">
      <div class="pay-sec__copy">
        <div v-reveal><PayLogo :size="38" /></div>
        <h2 v-reveal="60" class="section-title">More ways to move your money</h2>
        <p v-reveal="120" class="section-lead">
          Beyond Deriv, Plero Pay helps you buy and sell USDT and Airtm USD, and pay your suppliers in China — all
          in Naira, with the same fast, honest service.
        </p>
        <div v-reveal="180" class="pay-sec__cta">
          <NuxtLink to="/plero-pay" class="btn btn--primary">Explore Plero Pay <AppIcon name="arrow" :size="18" /></NuxtLink>
          <NuxtLink to="/plero-pay#calculator" class="btn btn--ghost">Get a quote</NuxtLink>
        </div>
      </div>

      <div class="pay-sec__cards">
        <NuxtLink
          v-for="(s, i) in payServices"
          :key="s.id"
          v-reveal:right="i * 110"
          v-spotlight
          :to="`/plero-pay/${s.id}`"
          class="pcard card"
          :style="{ '--c': s.color }"
        >
          <PayMark :symbol="s.symbol" :color="s.color" :size="48" />
          <span class="pcard__body">
            <b>{{ s.short }}</b>
            <small>{{ s.tagline }}</small>
          </span>
          <span class="pcard__rate">
            <template v-if="s.kind === 'trade'">
              <em>from</em> {{ formatMoney(s.sellRate) }}
            </template>
            <template v-else>{{ formatMoney(s.rate) }}<em>/¥1</em></template>
          </span>
        </NuxtLink>
        <NuxtLink v-reveal:right="330" v-spotlight to="/gift-cards" class="pcard card" style="--c: #6a3fb5">
          <PayMark symbol="🎁" color="#6a3fb5" :size="48" />
          <span class="pcard__body">
            <b>Sell gift cards</b>
            <small>Apple, Amazon, Steam and more — paid to your bank.</small>
          </span>
          <span class="pcard__rate"><AppIcon name="arrow" :size="18" /></span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pay-sec {
  position: relative;
  overflow: hidden;
}
.pay-sec__bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(500px 360px at 90% 20%, rgb(26 158 117 / 0.08), transparent 70%),
    radial-gradient(500px 360px at 70% 90%, rgb(214 52 44 / 0.06), transparent 70%),
    radial-gradient(600px 400px at 10% 30%, var(--indigo-50), transparent 70%);
  pointer-events: none;
}
.pay-sec__grid {
  position: relative;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: clamp(36px, 6vw, 72px);
  align-items: center;
}
.pay-sec__copy .section-title {
  margin-top: 22px;
}
.pay-sec__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.pay-sec__cards {
  display: grid;
  gap: 12px;
}
.pcard {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border-left: 4px solid var(--c);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.pcard:hover {
  transform: translateX(6px);
  box-shadow: var(--shadow);
}
.pcard__body {
  flex: 1;
  min-width: 0;
  display: grid;
}
.pcard__body small {
  color: var(--ink-soft);
  font-size: 14px;
}
.pcard__rate {
  flex: none;
  font-weight: 700;
  color: var(--navy-700);
  font-variant-numeric: tabular-nums;
}
.pcard__rate em {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: var(--ink-mute);
  margin: 0 3px;
}
@media (max-width: 900px) {
  .pay-sec__grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 480px) {
  .pcard__rate {
    display: none;
  }
}
</style>
