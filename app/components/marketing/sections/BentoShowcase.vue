<template>
  <section class="section markets-hub" ref="sectionRef">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">MARKET DIRECTORY</p>
        <h2 class="section-title">
          All your markets in <span class="title-accent">one place.</span>
        </h2>
        <p class="section-lede">
          Trade Deriv USD, digital currencies, vouchers, and top gift cards.
          Pegged directly to institutional pricing feeds and settled straight to your Nigerian bank.
        </p>

        <!-- Category Tabs (Deriv style) -->
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="cat-pill"
            :class="{ 'cat-pill--active': selectedCat === cat }"
            @click="selectedCat = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div ref="gridRef" class="bento reveal" style="transition-delay:0.15s">
        <!-- Deriv USD: The Flagship Market Tile -->
        <article v-if="derivCard" class="tile tile--hero panel">
          <div class="tile-top">
            <div class="deriv-brand-badge">
              <span class="icon-tile"><AppIcon name="trend" :size="20" /></span>
              <div>
                <h3 class="tile-title">Deriv USD</h3>
                <p class="tile-sub">Flagship Market · 24/7 Liquidity</p>
              </div>
            </div>
            <span class="chip chip--neon">
              <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
              {{ hasLiveRate ? 'Streaming' : 'Cached' }}
            </span>
          </div>

          <p class="tile-desc">
            Nigeria's deepest Deriv USD liquidity book. Send your Deriv balance and receive naira in minutes with zero desk markup and no agents.
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
              <p class="rate-value is-eta">{{ derivCard.eta }}</p>
            </div>
          </div>

          <div class="tile-foot">
            <NuxtLink to="/sell" class="btn btn-primary btn-sm">
              Sell Deriv USD
              <AppIcon name="arrow" :size="16" />
            </NuxtLink>
            <span class="denoms">
              Accepted: ${{ derivCard.denominations.join(' · $') }}
            </span>
          </div>
        </article>

        <!-- Crypto Markets -->
        <article class="tile tile--crypto panel">
          <div class="tile-top">
            <div>
              <h3 class="tile-title tile-title--sm">Crypto Assets</h3>
              <p class="tile-sub">Instant USDT & Bitcoin Settlement</p>
            </div>
            <span class="icon-tile"><AppIcon name="bolt" :size="18" /></span>
          </div>
          <ul class="asset-list">
            <li v-for="card in crypto" :key="card.id" class="asset">
              <CardMark :card="card" size="sm" />
              <div class="asset-meta">
                <span class="asset-name">{{ card.name }}</span>
                <span class="asset-eta">{{ card.eta }}</span>
              </div>
              <div class="asset-pricing">
                <span class="asset-price">{{ format(card.sellRate) }}</span>
                <span class="asset-trend">▲ Live</span>
              </div>
            </li>
          </ul>
          <NuxtLink to="/rates" class="tile-link">
            Explore crypto book
            <AppIcon name="arrow" :size="15" />
          </NuxtLink>
        </article>

        <!-- Speed & Reliability Metric -->
        <article class="tile tile--speed panel">
          <div class="tile-top">
            <span class="tag tag-green">
              <AppIcon name="bolt" :size="13" /> Verified Payouts
            </span>
          </div>
          <div class="speed-content">
            <p class="metric">5–15</p>
            <p class="metric-unit">minutes to your bank</p>
            <p class="tile-desc">
              Direct automated clearing into GTBank, Access, Zenith, OPay, and PalmPay.
            </p>
          </div>
          <div class="uptime-strip">
            <span class="live-dot" />
            <span>99.98% System Uptime · Automated Escrow</span>
          </div>
        </article>

        <!-- Major Gift Cards -->
        <article class="tile tile--cards panel">
          <div class="tile-top">
            <div>
              <h3 class="tile-title tile-title--sm">International Gift Cards</h3>
              <p class="tile-sub">Apple, Steam, Amazon, Google Play & Vouchers</p>
            </div>
            <NuxtLink to="/cards" class="btn btn-ghost btn-sm">View all cards</NuxtLink>
          </div>
          <div class="cards-grid">
            <NuxtLink
              v-for="card in displayedCards"
              :key="card.id"
              :to="`/card/${card.id}`"
              class="mini-card"
            >
              <CardMark :card="card" size="sm" />
              <div class="mini-info">
                <span class="mini-name">{{ card.short }}</span>
                <span class="mini-rate">{{ format(card.sellRate) }}</span>
              </div>
              <span class="mini-arrow"><AppIcon name="arrow" :size="13" /></span>
            </NuxtLink>
          </div>
        </article>

        <!-- Deriv WebSocket Streaming Platform -->
        <article class="tile tile--chart panel">
          <div class="tile-top">
            <div>
              <h3 class="tile-title tile-title--sm">Live WebSocket Terminal</h3>
              <p class="tile-sub">Real-time ticks straight from Deriv</p>
            </div>
            <span class="icon-tile"><AppIcon name="trend" :size="18" /></span>
          </div>
          <p class="tile-desc">
            Direct connection to Deriv's public WebSocket trading infrastructure. Zero broker desk delay.
          </p>
          <div class="chart-preview-box">
            <div class="spark-bars" aria-hidden="true">
              <span
                v-for="(bar, i) in spark"
                :key="i"
                class="spark-bar"
                :class="bar.up ? 'is-up' : 'is-down'"
                :style="{ height: bar.h + '%' }"
              />
            </div>
          </div>
          <NuxtLink to="/markets" class="tile-link">
            Launch live market charts
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

const categories = ['All Markets', 'Trading', 'Crypto', 'Voucher', 'Retail']
const selectedCat = ref('All Markets')

const displayedCards = computed(() => {
  if (selectedCat.value === 'All Markets') {
    return CARDS.filter(c => c.id !== 'deriv').slice(0, 6)
  }
  return CARDS.filter(c => c.category === selectedCat.value).slice(0, 6)
})

const spark = Array.from({ length: 28 }, (_, i) => {
  const wave = Math.sin(i * 0.6) * 0.5 + 0.5
  return { h: 25 + wave * 65, up: i % 3 !== 0 }
})

const gridRef = ref<HTMLElement | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
useReveal(sectionRef)
</script>

<style scoped>
.markets-hub {
  padding-block: clamp(64px, 8vw, 110px);
  border-top: 1px solid var(--hairline);
}

.title-accent {
  color: var(--primary);
}

/* Category Filter Bar */
.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.cat-pill {
  padding: 8px 18px;
  border-radius: var(--r-md);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--muted);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  transition: all 0.15s var(--ease);
}
.cat-pill:hover {
  color: #fff;
  border-color: #3b4252;
}
.cat-pill--active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

/* ── Bento Grid ──────────────────────────────────────────── */
.bento {
  margin-top: clamp(28px, 4vw, 44px);
}

.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: clamp(22px, 2.5vw, 30px);
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
  transition: border-color 0.2s var(--ease);
}
.tile:hover {
  border-color: #383f4f;
}

.tile--hero {
  grid-column: span 6;
  grid-row: span 2;
  justify-content: space-between;
  border-color: rgba(255, 68, 79, 0.22);
}
.tile--hero:hover {
  border-color: rgba(255, 68, 79, 0.45);
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
@media (max-width: 640px) {
  .tile--hero,
  .tile--crypto,
  .tile--speed,
  .tile--cards,
  .tile--chart {
    grid-column: span 12;
    grid-row: auto;
  }
  .tile {
    padding: 20px 18px;
    gap: 14px;
  }
  .rates {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 12px;
  }
  .rate-value {
    font-size: 14px;
  }
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .category-tabs {
    gap: 6px;
  }
  .cat-pill {
    padding: 7px 14px;
    font-size: 13px;
  }
  .metric {
    font-size: 42px;
  }
  .tile-foot {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

.tile-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.deriv-brand-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tile-title {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
}
.tile-title--sm {
  font-size: 17px;
}
.tile-sub {
  font-size: 12px;
  color: var(--muted-2);
  margin-top: 2px;
}
.tile-desc {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

/* Rate Grid */
.rates {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
}
.rate-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-2);
  margin-bottom: 4px;
}
.rate-value {
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #fff;
}
.is-in { color: var(--accent); }
.is-out { color: #f59e0b; }
.is-eta { color: var(--text); }

.tile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.denoms {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted-2);
}

/* Asset List */
.asset-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.asset {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  transition: border-color 0.15s;
}
.asset:hover {
  border-color: #3b4354;
}
.asset-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.asset-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #fff;
}
.asset-eta {
  font-size: 11px;
  color: var(--muted-2);
}
.asset-pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.asset-price {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
}
.asset-trend {
  font-size: 10px;
  font-weight: 700;
  color: var(--accent);
}

/* Speed Box */
.speed-content {
  margin-block: auto;
}
.metric {
  font-family: var(--font-display);
  font-size: clamp(38px, 4.4vw, 52px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #fff;
}
.metric-unit {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 4px;
  margin-bottom: 12px;
}
.uptime-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-2);
  padding-top: 14px;
  border-top: 1px solid var(--hairline);
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}
.mini-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  transition: all 0.15s;
}
.mini-card:hover {
  border-color: #3b4354;
  transform: translateY(-1px);
}
.mini-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.mini-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}
.mini-rate {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
}
.mini-arrow {
  color: var(--muted-3);
  transition: transform 0.15s;
}
.mini-card:hover .mini-arrow {
  color: #fff;
  transform: translateX(2px);
}

/* Chart Preview */
.chart-preview-box {
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  padding: 14px;
}
.spark-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 64px;
}
.spark-bar {
  flex: 1;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  transition: height 0.3s;
}
.spark-bar.is-up {
  background: var(--accent);
}
.spark-bar.is-down {
  background: rgba(255, 68, 79, 0.6);
}

.tile-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
  margin-top: auto;
  transition: color 0.15s;
}
.tile-link:hover {
  color: var(--primary);
}
</style>

