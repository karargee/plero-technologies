<template>
  <section class="section">
    <span class="neon-orb neon-orb--1" style="width:520px;height:520px;top:6%;left:-160px" aria-hidden="true" />
    <span class="neon-orb neon-orb--2" style="width:460px;height:460px;bottom:4%;right:-140px" aria-hidden="true" />

    <div class="container" style="position:relative;z-index:1">
      <div class="section-head reveal">
        <p class="eyebrow">What we trade</p>
        <h2 class="section-title">
          One exchange layer for <span class="grad-text">every asset</span> you hold.
        </h2>
        <p class="section-lede">
          Digital trading balances, crypto, vouchers and gift cards — all priced off the same live
          feed and settled to your Nigerian bank account.
        </p>
      </div>

      <div ref="gridRef" class="bento">
        <!-- Deriv USD: the flagship tile -->
        <article v-if="derivCard" class="glass glass-hover neon-border tile tile--hero">
          <span class="glow-spot" aria-hidden="true" />
          <div class="tile-top">
            <span class="icon-tile icon-float"><AppIcon name="trend" :size="20" /></span>
            <span class="chip chip--neon">
              <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
              {{ hasLiveRate ? 'Live' : 'Cached' }}
            </span>
          </div>

          <h3 class="tile-title">Deriv USD</h3>
          <p class="tile-desc">
            Nigeria's deepest Deriv USD book. Send your balance, get naira — no agents, no queues.
          </p>

          <div class="rates">
            <div class="rate">
              <p class="rate-label">We buy at</p>
              <p class="rate-value is-in">{{ format(derivCard.sellRate) }}</p>
            </div>
            <div class="rate">
              <p class="rate-label">We sell at</p>
              <p class="rate-value is-out">{{ format(derivCard.buyRate) }}</p>
            </div>
            <div class="rate">
              <p class="rate-label">Settlement</p>
              <p class="rate-value">{{ derivCard.eta }}</p>
            </div>
          </div>

          <div class="tile-foot">
            <NuxtLink to="/sell" class="btn-grad btn-sm">
              Sell Deriv USD
              <AppIcon name="arrow" :size="16" />
            </NuxtLink>
            <span class="denoms">
              ${{ derivCard.denominations.join(' · $') }}
            </span>
          </div>
        </article>

        <!-- Crypto -->
        <article class="glass glass-hover tile tile--crypto">
          <span class="glow-spot" aria-hidden="true" />
          <div class="tile-top">
            <span class="icon-tile icon-float"><AppIcon name="bolt" :size="20" /></span>
          </div>
          <h3 class="tile-title tile-title--sm">Crypto</h3>
          <ul class="asset-list">
            <li v-for="card in crypto" :key="card.id" class="asset">
              <CardMark :card="card" size="sm" />
              <span class="asset-name">{{ card.short }}</span>
              <span class="asset-price">{{ format(card.sellRate) }}</span>
            </li>
          </ul>
          <NuxtLink to="/rates" class="tile-link">
            All rates
            <AppIcon name="arrow" :size="15" />
          </NuxtLink>
        </article>

        <!-- Speed -->
        <article class="glass glass-hover tile tile--speed">
          <span class="glow-spot" aria-hidden="true" />
          <p class="metric grad-text">5–15</p>
          <p class="metric-unit">minutes to payout</p>
          <p class="tile-desc">
            Verified orders are released straight to your bank while you watch.
          </p>
          <div class="pulse-row">
            <span v-for="n in 4" :key="n" class="pulse" :style="{ animationDelay: n * 0.18 + 's' }" />
          </div>
        </article>

        <!-- Gift cards: the catalogue -->
        <article class="glass glass-hover tile tile--cards">
          <span class="glow-spot" aria-hidden="true" />
          <div class="tile-top">
            <div>
              <h3 class="tile-title tile-title--sm">Gift cards</h3>
              <p class="tile-desc">Instant settlement on the leading brands.</p>
            </div>
            <NuxtLink to="/cards" class="btn-glass btn-sm">Browse</NuxtLink>
          </div>
          <div class="cards-grid">
            <NuxtLink
              v-for="card in giftCards"
              :key="card.id"
              :to="`/card/${card.id}`"
              class="mini"
            >
              <CardMark :card="card" size="sm" />
              <span class="mini-name">{{ card.short }}</span>
              <span class="mini-rate">{{ format(card.sellRate) }}</span>
            </NuxtLink>
          </div>
        </article>

        <!-- Trade view -->
        <article class="glass glass-hover tile tile--chart">
          <span class="glow-spot" aria-hidden="true" />
          <div class="tile-top">
            <span class="icon-tile icon-float"><AppIcon name="spark" :size="20" /></span>
          </div>
          <h3 class="tile-title tile-title--sm">Live Deriv trade view</h3>
          <p class="tile-desc">
            Stream ticks and candles straight from the Deriv feed, and price your own order against
            it.
          </p>
          <div class="spark" aria-hidden="true">
            <span
              v-for="(bar, i) in spark"
              :key="i"
              class="spark-bar"
              :class="bar.up ? 'is-up' : 'is-down'"
              :style="{ height: bar.h + '%', animationDelay: i * 0.07 + 's' }"
            />
          </div>
          <NuxtLink to="/rates" class="tile-link">
            Open the trade view
            <AppIcon name="arrow" :size="15" />
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CARDS } from '~/data/cards'

const { format, hasLiveRate } = useDerivRate()

const derivCard = CARDS.find(card => card.id === 'deriv')
const crypto = CARDS.filter(card => card.category === 'Crypto').slice(0, 3)
const giftCards = CARDS.filter(card => !['Trading', 'Crypto'].includes(card.category)).slice(0, 6)

// Deterministic pseudo-random bars: a stable "market" texture that does not
// reshuffle on every render.
const spark = Array.from({ length: 22 }, (_, i) => {
  const wave = Math.sin(i * 0.7) * 0.5 + 0.5
  return { h: 22 + wave * 62, up: i % 3 !== 0 }
})

const { el: gridRef, bind } = useSpotlight()
onMounted(() => {
  for (const node of gridRef.value?.querySelectorAll('.glass-hover') ?? []) {
    bind(node as HTMLElement)
  }
})
</script>

<style scoped>
.bento {
  margin-top: clamp(28px, 4vw, 46px);
}

.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: clamp(20px, 2.4vw, 28px);
  z-index: 1;
}

.tile--hero {
  grid-column: span 6;
  grid-row: span 2;
  justify-content: space-between;
}
.tile--crypto {
  grid-column: span 3;
}
.tile--speed {
  grid-column: span 3;
}
.tile--cards {
  grid-column: span 7;
}
.tile--chart {
  grid-column: span 5;
}

@media (max-width: 1100px) {
  .tile--cards,
  .tile--chart {
    grid-column: span 12;
  }
  .tile--crypto,
  .tile--speed {
    grid-column: span 6;
  }
  .tile--hero {
    grid-column: span 12;
    grid-row: auto;
  }
}

.tile-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}
.tile-title {
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 800;
  letter-spacing: -0.03em;
}
.tile-title--sm {
  font-size: 18px;
  letter-spacing: -0.02em;
}
.tile-desc {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.65;
  max-width: 46ch;
}

.rates {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 16px;
  border-radius: var(--r-md);
  background: rgb(0 0 0 / 0.28);
  border: 1px solid var(--glass-border);
}
.rate-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-3);
  margin-bottom: 5px;
}
.rate-value {
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.is-in {
  color: var(--neon-5);
}
.is-out {
  color: var(--neon-amber);
}

.tile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.denoms {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--muted-3);
}

.btn-sm {
  padding: 10px 20px;
  font-size: 13.5px;
}

.asset-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.asset {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--r-md);
  background: rgb(255 255 255 / 0.03);
  border: 1px solid transparent;
  transition:
    border-color 0.25s var(--ease),
    transform 0.25s var(--ease);
}
.asset:hover {
  border-color: rgb(var(--neon-4-rgb) / 0.35);
  transform: translateX(3px);
}
.asset-name {
  flex: 1;
  font-size: 13.5px;
  font-weight: 600;
}
.asset-price {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--neon-5);
}

.metric {
  font-family: var(--font-display);
  font-size: clamp(38px, 4.6vw, 54px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}
.metric-unit {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-2);
  margin-top: -6px;
}

.pulse-row {
  display: flex;
  gap: 5px;
  margin-top: auto;
}
.pulse {
  flex: 1;
  height: 34px;
  border-radius: 6px;
  background: var(--brand-grad-soft);
  border: 1px solid var(--glass-border);
  animation: pulse-glow 2.4s var(--ease) infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 0 rgb(var(--neon-2-rgb) / 0);
    transform: scaleY(0.82);
  }
  50% {
    box-shadow: 0 0 22px -4px rgb(var(--neon-2-rgb) / 0.75);
    transform: scaleY(1);
  }
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 9px;
}
.mini {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 11px;
  border-radius: var(--r-md);
  background: rgb(255 255 255 / 0.03);
  border: 1px solid var(--glass-border);
  transition:
    transform 0.3s var(--ease-out-expo),
    border-color 0.25s var(--ease),
    background 0.25s var(--ease),
    box-shadow 0.3s var(--ease);
}
.mini:hover {
  transform: translateY(-3px);
  background: rgb(255 255 255 / 0.06);
  border-color: rgb(var(--neon-2-rgb) / 0.45);
  box-shadow: 0 14px 30px -18px rgb(var(--neon-2-rgb) / 0.9);
}
.mini-name {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mini-rate {
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--neon-5);
}

.spark {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 74px;
  padding: 10px 0;
}
.spark-bar {
  flex: 1;
  border-radius: 3px 3px 1px 1px;
  transform-origin: 50% 100%;
  animation: spark-rise 3.2s var(--ease) infinite;
}
.spark-bar.is-up {
  background: linear-gradient(180deg, var(--neon-5), rgb(var(--neon-5-rgb) / 0.25));
}
.spark-bar.is-down {
  background: linear-gradient(180deg, var(--neon-rose), rgb(251 113 133 / 0.25));
}

@keyframes spark-rise {
  0%,
  100% {
    transform: scaleY(0.6);
    opacity: 0.65;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

.tile-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: auto;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--neon-4);
  transition: gap 0.28s var(--ease-out-expo);
}
.tile-link:hover {
  gap: 12px;
}
</style>
