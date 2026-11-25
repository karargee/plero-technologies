<script setup lang="ts">
import { stats } from '~/data/site'
</script>

<template>
  <section class="band">
    <div class="band__img" aria-hidden="true" />
    <div class="container band__inner">
      <div v-reveal:left class="band__copy">
        <span class="eyebrow">Proudly Nigerian</span>
        <h2>Built in Lagos. Serving Deriv traders across Nigeria.</h2>
        <p>
          From Lagos to Abuja to Port Harcourt — wherever you trade, your deposits and withdrawals are handled by a
          local team that understands Naira, local banks and your time.
        </p>
      </div>
      <div class="band__stats">
        <div v-for="(s, i) in stats" :key="s.label" v-reveal:zoom="i * 90" class="band__stat">
          <strong><CountUp :value="s.value" /></strong>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </div>
    <p class="band__credit">Photo: Ayorinde Ogundele, CC BY-SA 4.0</p>
  </section>
</template>

<style scoped>
.band {
  position: relative;
  overflow: hidden;
  color: #fff;
  padding-block: clamp(80px, 11vw, 140px);
  isolation: isolate;
}
.band__img {
  position: absolute;
  inset: -12% 0;
  z-index: -1;
  background: linear-gradient(100deg, rgb(12 12 36 / 0.94) 0%, rgb(27 26 74 / 0.82) 45%, rgb(61 63 147 / 0.45) 100%),
    url('/images/lagos-aerial.webp') center / cover no-repeat;
  animation: band-zoom 30s ease-in-out infinite alternate;
}
@keyframes band-zoom {
  to {
    transform: scale(1.08);
  }
}
.band__inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
}
.band .eyebrow {
  color: #8ee0b9;
}
h2 {
  font-size: clamp(30px, 4.2vw, 46px);
}
.band__copy p {
  margin-top: 16px;
  max-width: 560px;
  font-size: 18px;
  color: rgb(255 255 255 / 0.78);
}
.band__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.band__stat {
  display: grid;
  gap: 4px;
  padding: 22px;
  border-radius: var(--radius);
  background: rgb(19 18 58 / 0.45);
  border: 1px solid rgb(255 255 255 / 0.14);
  backdrop-filter: blur(14px) saturate(140%);
}
.band__stat strong {
  font-family: var(--font-display);
  font-size: clamp(26px, 3.4vw, 34px);
}
.band__stat > span {
  font-size: 14px;
  color: rgb(255 255 255 / 0.7);
}
.band__credit {
  position: absolute;
  right: 12px;
  bottom: 8px;
  font-size: 11px;
  color: rgb(255 255 255 / 0.4);
}
@media (max-width: 860px) {
  .band__inner {
    grid-template-columns: 1fr;
  }
}
</style>
