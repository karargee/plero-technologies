<template>
  <div class="ticker">
    <div class="ticker-live-badge">
      <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
      <span>LIVE DERIV RATES</span>
    </div>

    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <div v-for="(card, index) in doubled" :key="index" class="marquee__item">
          <span class="ticker-dot" :style="{ background: card.color }" />
          <b>{{ card.name }}</b>
          <span class="ticker-rate">{{ format(card.sellRate) }}</span>
          <span class="ticker-trend">▲</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CARDS } from '~/data/cards'

const { format, hasLiveRate } = useDerivRate()

/** Duplicated once so the marquee loops seamlessly at -50% translate. */
const doubled = [...CARDS, ...CARDS]
</script>

<style scoped>
.ticker {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  border-block: 1px solid var(--hairline);
  background: #0f1115;
  padding-block: 10px;
}

.ticker-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 20px;
  padding: 5px 12px;
  border-radius: var(--r-sm);
  background: rgba(0, 167, 103, 0.1);
  border: 1px solid rgba(0, 167, 103, 0.25);
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.marquee {
  flex: 1;
  min-width: 0;
}

.ticker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ticker-rate {
  font-family: var(--font-mono);
  color: var(--text) !important;
  font-weight: 700;
}

.ticker-trend {
  color: var(--accent);
  font-size: 9px;
  font-weight: 800;
}
</style>

