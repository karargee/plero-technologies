<template>
  <div class="ticker">
    <span class="ticker-live">
      <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
      Live
    </span>

    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <span v-for="(card, index) in doubled" :key="index" class="marquee__item">
          <span class="ticker-dot" :style="{ background: card.color }" />
          <b>{{ card.name }}</b>
          <span>{{ format(card.sellRate) }}</span>
        </span>
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
  gap: 14px;
  border-block: 1px solid var(--hairline);
  background: linear-gradient(
    90deg,
    rgb(var(--neon-2-rgb) / 0.07),
    transparent 40%,
    transparent 60%,
    rgb(var(--neon-4-rgb) / 0.07)
  );
  padding-block: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.ticker-live {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: var(--r-full);
  background: var(--brand-grad);
  color: #0a0a12;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.marquee {
  flex: 1;
  min-width: 0;
}

.ticker-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
