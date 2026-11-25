<script setup lang="ts">
import { cards } from '~/data/site'
// Duplicated list so the marquee loops seamlessly.
const loop = [...cards, ...cards]
</script>

<template>
  <div class="ticker" aria-label="Today's gift card rates">
    <div class="ticker__track">
      <NuxtLink v-for="(c, i) in loop" :key="i" to="/rates" class="ticker__item" :aria-hidden="i >= cards.length">
        <CardMark :name="c.name" :color="c.color" :size="26" />
        <span class="ticker__name">{{ c.name }}</span>
        <span class="ticker__rate">{{ formatMoney(c.rate) }}/$</span>
        <span class="ticker__chg" :class="c.change >= 0 ? 'up' : 'down'">
          {{ c.change >= 0 ? '▲' : '▼' }} {{ Math.abs(c.change).toFixed(1) }}%
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  overflow: hidden;
  background: var(--navy-950);
  border-block: 1px solid rgb(255 255 255 / 0.06);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.ticker__track {
  display: flex;
  width: max-content;
  animation: scroll 45s linear infinite;
}
.ticker:hover .ticker__track {
  animation-play-state: paused;
}
.ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
  border-right: 1px solid rgb(255 255 255 / 0.08);
}
.ticker__name {
  font-weight: 500;
}
.ticker__rate {
  font-variant-numeric: tabular-nums;
  color: rgb(255 255 255 / 0.75);
}
.ticker__chg {
  font-size: 12.5px;
  font-weight: 600;
}
.up {
  color: #6ee7b7;
}
.down {
  color: #fca5a5;
}
@keyframes scroll {
  to {
    transform: translateX(-50%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ticker__track {
    animation: none;
  }
  .ticker {
    overflow-x: auto;
  }
}
</style>
