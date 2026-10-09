<template>
  <section class="hero" ref="heroRef">
    <div class="container hero-inner">
      <div class="hero-copy">
        <div class="hero-badge reveal chip chip--neon">
          <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
          <span>{{ hasLiveRate ? 'Live Deriv WebSocket · 24/7 Liquidity' : 'Connecting to Deriv WebSocket…' }}</span>
        </div>

        <h1 class="hero-title reveal" style="transition-delay:0.08s">
          Trade with<br />
          <span class="hero-accent">confidence.</span>
        </h1>

        <p class="hero-lede reveal" style="transition-delay:0.16s">
          Nigeria's institutional exchange for Deriv USD, crypto, vouchers, and gift cards.
          Pegged to live market feeds with verified settlement straight to your bank in 5–15 minutes.
        </p>

        <div class="btn-row hero-actions reveal" style="transition-delay:0.24s">
          <NuxtLink to="/register" class="btn btn-primary btn-lg">
            Start trading free
            <AppIcon name="arrow" :size="18" />
          </NuxtLink>
          <NuxtLink to="/rates" class="btn btn-ghost btn-lg">
            <AppIcon name="trend" :size="18" />
            Explore live rates
          </NuxtLink>
        </div>

        <ul class="hero-trust reveal" style="transition-delay:0.32s">
          <li v-for="item in HERO_TRUST" :key="item">
            <AppIcon name="check" :size="15" />
            <span>{{ item }}</span>
          </li>
          <li>
            <AppIcon name="shield" :size="15" />
            <span>50,000+ active traders</span>
          </li>
        </ul>
      </div>

      <!-- Right Column: Institutional Deriv Exchange Terminal -->
      <div class="hero-visual reveal" style="transition-delay:0.2s">
        <div class="terminal-card">
          <!-- Terminal Tab Bar -->
          <div class="terminal-nav">
            <div class="terminal-tabs">
              <button
                v-for="tab in marketTabs"
                :key="tab.id"
                type="button"
                class="terminal-tab"
                :class="{ 'terminal-tab--active': activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>
            <div class="terminal-status" :title="`Feed source: ${rateSource}`">
              <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
              <span>{{ hasLiveRate ? 'Live Feed' : 'Connecting' }}</span>
            </div>
          </div>

          <!-- Market Price Header -->
          <div class="terminal-quote">
            <div class="terminal-pair">
              <span class="terminal-symbol">{{ activeAsset.name }}</span>
              <span class="terminal-badge">+2.45% ▲</span>
            </div>
            <div class="terminal-rate-row">
              <p class="terminal-rate">₦{{ Math.round(unitPrice).toLocaleString('en-NG') }}</p>
              <span class="terminal-unit">/ $1.00 USD</span>
            </div>
            <p class="terminal-source">Pegged to Deriv WebSocket · Zero hidden markup</p>
          </div>

          <!-- Quick Converter Terminal -->
          <div class="terminal-calc">
            <div class="calc-type-bar">
              <button
                type="button"
                class="calc-type-btn"
                :class="{ 'calc-type-btn--active': tradeType === 'sell' }"
                @click="tradeType = 'sell'"
              >
                I want to Sell
              </button>
              <button
                type="button"
                class="calc-type-btn"
                :class="{ 'calc-type-btn--active': tradeType === 'buy' }"
                @click="tradeType = 'buy'"
              >
                I want to Buy
              </button>
            </div>

            <div class="terminal-inputs">
              <div class="calc-field">
                <label class="calc-label">You {{ tradeType === 'sell' ? 'send' : 'receive' }}</label>
                <div class="calc-input-wrap">
                  <span class="calc-currency">$</span>
                  <input
                    v-model.number="amount"
                    type="number"
                    min="10"
                    step="10"
                    placeholder="100"
                    class="calc-input"
                  />
                  <span class="calc-asset-tag">USD</span>
                </div>
              </div>

              <div class="calc-arrow">
                <AppIcon name="trend" :size="16" />
              </div>

              <div class="calc-field">
                <label class="calc-label">You {{ tradeType === 'sell' ? 'receive' : 'pay' }}</label>
                <div class="calc-payout-box">
                  <span class="calc-payout-val">₦{{ estimatedPayout.toLocaleString('en-NG') }}</span>
                  <span class="calc-asset-tag">NGN</span>
                </div>
              </div>
            </div>

            <div class="terminal-meta-row">
              <span class="meta-item"><AppIcon name="bolt" :size="14" /> {{ activeAsset.eta }} settlement</span>
              <span class="meta-item"><AppIcon name="bank" :size="14" /> All Nigerian banks</span>
              <span class="meta-item meta-item--fee">0% fee</span>
            </div>

            <NuxtLink :to="tradeType === 'sell' ? '/sell' : '/register'" class="btn btn-primary btn-block terminal-action">
              {{ tradeType === 'sell' ? `Sell ${activeAsset.name} Now` : `Buy ${activeAsset.name}` }}
              <AppIcon name="arrow" :size="17" />
            </NuxtLink>
          </div>

          <!-- Recent Verified Settlements Strip -->
          <div class="terminal-recent">
            <div class="recent-title">
              <span class="live-dot" />
              <span>Recent Settlements</span>
            </div>
            <div class="recent-item">
              <span class="recent-text">{{ currentFeedItem }}</span>
              <span class="recent-tag">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CARDS } from '~/data/cards'
import { HERO_TRUST } from '~/data/site'

const { liveRate, hasLiveRate, rateSource } = useDerivRate()

const heroRef = ref<HTMLElement | null>(null)
useReveal(heroRef)

const activeTab = ref('deriv')
const tradeType = ref<'sell' | 'buy'>('sell')
const amount = ref<number>(100)

const marketTabs = [
  { id: 'deriv', label: 'Deriv USD' },
  { id: 'usdt', label: 'USDT' },
  { id: 'apple', label: 'Apple' },
  { id: 'steam', label: 'Steam' },
]

const activeAsset = computed(() => {
  return CARDS.find(c => c.id === activeTab.value) || CARDS[0]!
})

const unitPrice = computed(() => {
  const rateFactor = tradeType.value === 'sell' ? activeAsset.value.sellRate : activeAsset.value.buyRate
  return rateFactor * liveRate.value
})

const estimatedPayout = computed(() => {
  const amt = amount.value || 0
  return Math.round(amt * unitPrice.value)
})

const recentTrades = [
  '$150 Deriv USD settled to GTBank (2m ago)',
  '$200 Steam Card settled to OPay (4m ago)',
  '$500 USDT settled to Access Bank (6m ago)',
  '$100 Apple Card settled to Kuda (8m ago)',
  '$300 Deriv USD settled to Zenith Bank (11m ago)',
]

const feedIndex = ref(0)
const currentFeedItem = computed(() => recentTrades[feedIndex.value % recentTrades.length]!)

onMounted(() => {
  const timer = setInterval(() => {
    feedIndex.value = (feedIndex.value + 1) % recentTrades.length
  }, 4000)
  onBeforeUnmount(() => clearInterval(timer))
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: calc(100dvh - var(--nav-h));
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding-block: clamp(48px, 6vw, 84px) clamp(64px, 8vw, 100px);
  background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 68, 79, 0.05), transparent 70%);
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: clamp(36px, 5vw, 64px);
  align-items: center;
}
.hero-inner > * { min-width: 0; }

/* ── Copy Column ─────────────────────────────────────────── */
.hero-badge {
  margin-bottom: 24px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(44px, 6.5vw, 76px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: #ffffff;
}

.hero-accent {
  color: var(--primary);
  display: inline-block;
}

.hero-lede {
  margin-top: 22px;
  font-size: clamp(16px, 1.4vw, 18px);
  color: var(--muted);
  max-width: 50ch;
  line-height: 1.65;
}

.hero-actions {
  margin-top: 32px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.hero-trust {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid var(--hairline);
}
.hero-trust li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--muted-2);
}
.hero-trust :deep(.icon) { color: var(--accent); }

/* ── Right Column: Terminal ──────────────────────────────── */
.hero-visual {
  position: relative;
  display: flex;
  flex-direction: column;
}

.terminal-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
  box-shadow: 0 16px 48px -12px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  transition: border-color 0.2s var(--ease);
}
.terminal-card:hover {
  border-color: #383e4d;
}

/* Terminal Tab Bar */
.terminal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--hairline);
}

.terminal-tabs {
  display: flex;
  gap: 4px;
}

.terminal-tab {
  padding: 6px 14px;
  border-radius: var(--r-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  background: transparent;
  transition: all 0.15s;
}
.terminal-tab:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}
.terminal-tab--active {
  color: #fff;
  background: #111317;
  border: 1px solid var(--hairline);
}

.terminal-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--accent);
}

/* Rate Header */
.terminal-quote {
  padding: 24px 24px 18px;
  border-bottom: 1px solid var(--hairline);
}

.terminal-pair {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.terminal-symbol {
  font-size: 15px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.terminal-badge {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  background: rgba(0, 167, 103, 0.1);
  padding: 3px 8px;
  border-radius: var(--r-sm);
  font-variant-numeric: tabular-nums;
}

.terminal-rate-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 8px;
}

.terminal-rate {
  font-family: var(--font-display);
  font-size: clamp(34px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
}

.terminal-unit {
  font-size: 14px;
  color: var(--muted-2);
}

.terminal-source {
  font-size: 12.5px;
  color: var(--muted-2);
  margin-top: 4px;
}

/* Converter Form */
.terminal-calc {
  padding: 20px 24px;
}

.calc-type-bar {
  display: flex;
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  padding: 3px;
  margin-bottom: 16px;
}

.calc-type-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--r-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  transition: all 0.15s;
  text-align: center;
}
.calc-type-btn--active {
  background: #111317;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
}

.terminal-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calc-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.calc-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.calc-input-wrap,
.calc-payout-box {
  display: flex;
  align-items: center;
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  padding: 4px 14px;
  transition: border-color 0.2s;
}
.calc-input-wrap:focus-within {
  border-color: var(--primary);
}

.calc-currency {
  font-size: 16px;
  font-weight: 700;
  color: var(--muted);
  margin-right: 8px;
}

.calc-input {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  padding: 8px 0;
  border: none;
  background: transparent;
  outline: none;
}

.calc-payout-box {
  padding: 12px 14px;
  justify-content: space-between;
}

.calc-payout-val {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
}

.calc-asset-tag {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted-2);
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 7px;
  border-radius: var(--r-xs);
}

.calc-arrow {
  display: flex;
  justify-content: center;
  color: var(--muted-3);
  margin-block: -4px;
}

.terminal-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  font-size: 12.5px;
  color: var(--muted);
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.meta-item--fee {
  color: var(--accent);
  font-weight: 700;
}

.terminal-action {
  margin-top: 18px;
  padding: 13px 20px;
  font-size: 15px;
}

/* Recent Settlements Strip */
.terminal-recent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #0f1014;
  border-top: 1px solid var(--hairline);
  font-size: 12px;
}

.recent-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted-2);
  font-weight: 600;
}

.recent-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.recent-text {
  color: var(--text);
  font-weight: 500;
}

.recent-tag {
  background: rgba(0, 167, 103, 0.12);
  color: var(--accent);
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--r-xs);
  font-size: 10.5px;
}

/* Reveal transition */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
}
.reveal.is-in {
  opacity: 1;
  transform: none;
}

@media (max-width: 980px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
@media (max-width: 640px) {
  .hero-title {
    font-size: 40px;
  }
  .terminal-nav {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>

