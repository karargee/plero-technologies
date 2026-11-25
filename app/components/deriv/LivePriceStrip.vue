<script setup lang="ts">
import { featuredSymbols, markets } from '~/data/site'

const prices = useDerivPrices(featuredSymbols)
const items = featuredSymbols.map((s) => ({ symbol: s, name: markets.find((m) => m.symbol === s)?.name ?? s }))
const loop = [...items, ...items]

function pct(s: string) {
  const p = prices[s]
  if (!p?.open || !p.price) return null
  return ((p.price - p.open) / p.open) * 100
}
</script>

<template>
  <div class="strip" aria-label="Live Deriv market prices">
    <div class="strip__track">
      <NuxtLink
        v-for="(m, i) in loop"
        :key="i"
        :to="{ path: '/markets', query: { symbol: m.symbol } }"
        class="strip__item"
        :aria-hidden="i >= items.length"
        :tabindex="i >= items.length ? -1 : undefined"
      >
        <span class="strip__name">{{ m.name }}</span>
        <span class="strip__price" :class="{ up: prices[m.symbol]?.dir === 1, down: prices[m.symbol]?.dir === -1 }">
          {{ formatPrice(prices[m.symbol]?.price, prices[m.symbol]?.pip) }}
        </span>
        <span v-if="pct(m.symbol) != null" class="strip__chg" :class="pct(m.symbol)! >= 0 ? 'up' : 'down'">
          {{ pct(m.symbol)! >= 0 ? '▲' : '▼' }} {{ Math.abs(pct(m.symbol)!).toFixed(2) }}%
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.strip {
  overflow: hidden;
  margin-top: -1px;
  background: var(--navy-950);
  border-block: 1px solid rgb(255 255 255 / 0.06);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.strip__track {
  display: flex;
  width: max-content;
  animation: scroll 50s linear infinite;
}
.strip:hover .strip__track {
  animation-play-state: paused;
}
.strip__item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
  border-right: 1px solid rgb(255 255 255 / 0.08);
}
.strip__name {
  font-weight: 500;
  color: rgb(255 255 255 / 0.85);
}
.strip__price {
  min-width: 70px;
  font-variant-numeric: tabular-nums;
  color: rgb(255 255 255 / 0.75);
  transition: color 0.3s ease;
}
.strip__chg {
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
  .strip__track {
    animation: none;
  }
  .strip {
    overflow-x: auto;
  }
}
</style>
