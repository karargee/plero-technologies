<template>
  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">
      <span v-for="(card, index) in doubled" :key="index" class="ticker-item">
        <span class="ticker-dot" :style="{ background: card.color }" />
        {{ card.name }}
        <b>{{ format(card.sellRate) }}</b>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CARDS } from '~/data/cards'

const { format } = useDerivRate()

/** Duplicated once so the marquee loops seamlessly at -50% translate. */
const doubled = [...CARDS, ...CARDS]
</script>

<style scoped>
.ticker {
  overflow: hidden;
  border-block: 1px solid var(--hairline);
  background: var(--bg-alt);
  padding-block: 14px;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.ticker-track {
  display: flex;
  width: max-content;
  animation: marquee 38s linear infinite;
}
.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding-inline: 22px;
  font-size: 13.5px;
  color: var(--muted-2);
  white-space: nowrap;
}
.ticker-item b {
  color: var(--text);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.ticker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
