<template>
  <section class="tv panel">
    <!-- Toolbar -->
    <header class="bar">
      <div class="bar-left">
        <button
          type="button"
          class="toggle"
          aria-label="Show markets"
          @click="sidebarOpen = !sidebarOpen"
        >
          <AppIcon name="menu" :size="18" />
        </button>
        <div class="ident">
          <span class="ident-name">{{ active?.label ?? symbol }}</span>
          <span class="ident-code">{{ symbol }}</span>
        </div>
      </div>

      <div class="bar-right">
        <span class="tag" :class="status === 'live' ? 'tag-green' : 'tag-yellow'">
          <span class="live-dot" :class="{ 'live-dot--off': status !== 'live' }" />
          {{ status === 'live' ? 'Live' : status === 'error' ? 'Unavailable' : 'Connecting' }}
        </span>

        <div class="zoom">
          <button type="button" aria-label="Zoom out" @click="zoomOut">−</button>
          <button type="button" aria-label="Zoom in" @click="zoomIn">+</button>
        </div>

        <div class="styles" role="group" aria-label="Chart style">
          <button
            v-for="option in styleOptions"
            :key="option.value"
            type="button"
            class="style-btn"
            :class="{ 'style-btn--on': chartStyle === option.value }"
            :aria-label="option.label"
            :title="option.label"
            @click="setChartStyle(option.value)"
          >
            <svg viewBox="0 0 16 12" width="16" height="12" aria-hidden="true">
              <template v-if="option.value === 'candles'">
                <rect x="1" y="3" width="3" height="7" rx="1" />
                <rect x="6" y="1" width="3" height="6" rx="1" />
                <rect x="11" y="5" width="3" height="6" rx="1" />
              </template>
              <path v-else-if="option.value === 'line'" d="M1 10 L5 5 L9 7 L15 2" fill="none" />
              <path v-else d="M1 10 L5 5 L9 7 L15 2 L15 11 L1 11 Z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Timeframes -->
    <nav class="frames" aria-label="Timeframe">
      <button
        v-for="option in GRANULARITIES"
        :key="option.seconds"
        type="button"
        class="frame"
        :class="{ 'frame--on': granularity === option.seconds }"
        :title="option.full"
        @click="setGranularity(option.seconds)"
      >
        {{ option.label }}
      </button>
    </nav>

    <div class="tv-body">
      <div class="tv-side" :class="{ 'tv-side--open': sidebarOpen }">
        <MarketSidebar
          :symbol="symbol"
          :quotes="quotes"
          :groups="groups"
          :format-quote="formatQuote"
          @select="onSelect"
        />
      </div>

      <div class="tv-main">
        <div class="tv-quote">
          <div>
            <span class="tv-price">{{ formatPrice(lastPrice) }}</span>
            <span
              v-if="change !== null"
              class="tv-change"
              :class="change >= 0 ? 'is-up' : 'is-down'"
            >
              {{ change >= 0 ? '▲' : '▼' }} {{ Math.abs(change * 100).toFixed(2) }}%
            </span>
          </div>
          <span class="tv-range">
            H {{ formatPrice(highOfWindow) }} · L {{ formatPrice(lowOfWindow) }}
          </span>
        </div>

        <MarketChart
          :candles="candles"
          :symbol="symbol"
          :style="chartStyle"
          :granularity="granularity"
          :visible-count="visibleCount"
          :last-price="lastPrice"
          :status="status"
          :error-message="errorMessage"
          :format-price="formatPrice"
        />

        <p class="tv-foot">
          Market data is streamed from the Deriv public feed for information only. It is not the
          rate used to settle a gift card — quotes lock when you submit an order.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { GRANULARITIES } from '~/composables/useDerivMarket'
import type { ChartStyle } from '~/composables/useDerivMarket'

const market = useDerivMarket()
const {
  symbol,
  granularity,
  chartStyle,
  visibleCount,
  candles,
  status,
  quotes,
  lastPrice,
  change,
  errorMessage,
  formatPrice,
  formatQuote,
  setSymbol,
  setGranularity,
  setChartStyle,
  zoomIn,
  zoomOut,
  groups,
} = market

const sidebarOpen = ref(false)

const styleOptions: { value: ChartStyle; label: string }[] = [
  { value: 'candles', label: 'Candlestick chart' },
  { value: 'line', label: 'Line chart' },
  { value: 'area', label: 'Area chart' },
]

const active = computed(() => MARKET_SYMBOLS.find(item => item.code === symbol.value))

const visible = computed(() => candles.value.slice(-Math.max(10, visibleCount.value)))
const highOfWindow = computed(() =>
  visible.value.length ? Math.max(...visible.value.map(c => c.high)) : null,
)
const lowOfWindow = computed(() =>
  visible.value.length ? Math.min(...visible.value.map(c => c.low)) : null,
)

function onSelect(code: string) {
  setSymbol(code)
  sidebarOpen.value = false
}
</script>

<style scoped>
.tv {
  padding: 0;
  overflow: hidden;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 12px 14px;
  border-bottom: 1px solid var(--hairline);
}
.bar-left,
.bar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.bar-right {
  flex-wrap: wrap;
}

.toggle {
  display: none;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: var(--r-md);
  border: 1px solid var(--hairline);
  background: var(--surface-2);
  color: var(--text);
}

.ident {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.2;
}
.ident-name {
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ident-code {
  font-size: 10.5px;
  color: var(--muted-3);
  letter-spacing: 0.05em;
}

.zoom {
  display: flex;
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  overflow: hidden;
}
.zoom button {
  width: 30px;
  height: 30px;
  font-size: 15px;
  line-height: 1;
  color: var(--muted);
  background: var(--surface-2);
}
.zoom button:hover {
  color: var(--text);
  background: var(--surface-3, rgba(255, 255, 255, 0.06));
}

.styles {
  display: flex;
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  overflow: hidden;
}
.style-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 30px;
  color: var(--muted-2);
  background: var(--surface-2);
}
.style-btn svg {
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 1.4;
}
.style-btn svg path[fill='none'] {
  fill: none;
}
.style-btn:hover {
  color: var(--text);
}
.style-btn--on {
  color: #fff;
  background: var(--primary);
}

.frames {
  display: flex;
  gap: 2px;
  padding: 8px 14px;
  overflow-x: auto;
  scrollbar-width: none;
  border-bottom: 1px solid var(--hairline);
}
.frames::-webkit-scrollbar {
  display: none;
}
.frame {
  padding: 6px 11px;
  border-radius: var(--r-sm);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--muted-2);
  white-space: nowrap;
  transition: color 0.15s, background 0.15s;
}
.frame:hover {
  color: var(--text);
  background: var(--surface-2);
}
.frame--on {
  color: #fff;
  background: var(--primary);
}

.tv-body {
  display: grid;
  grid-template-columns: 268px minmax(0, 1fr);
}
.tv-side {
  border-right: 1px solid var(--hairline);
  max-height: 470px;
}
.tv-side :deep(.sidebar) {
  height: 100%;
  border: 0;
  border-radius: 0;
}
.tv-main {
  padding: 14px;
  min-width: 0;
}

.tv-quote {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding-bottom: 10px;
}
.tv-price {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.tv-change {
  margin-left: 9px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
}
.tv-range {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--muted-3);
}
.is-up {
  color: #26a69a;
}
.is-down {
  color: #ef5350;
}

.tv-foot {
  margin-top: 12px;
  font-size: 12px;
  color: var(--muted-3);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .tv-body {
    grid-template-columns: minmax(0, 1fr);
  }
  .toggle {
    display: grid;
  }
  .tv-side {
    position: absolute;
    z-index: 20;
    inset: auto 12px auto 12px;
    width: min(320px, calc(100% - 24px));
    max-height: 60vh;
    border: 1px solid var(--hairline);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-lg);
  }
  .tv-side:not(.tv-side--open) {
    display: none;
  }
}
</style>
