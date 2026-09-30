<template>
  <div v-if="card" class="page">
    <AppPageHeader :title="card.name" back-to="/cards" to="/support" icon="headset" action-label="Support" />

    <div class="hero" :style="{ '--accent-card': card.color }">
      <CardMark :card="card" size="lg" />
      <div>
        <h1 class="hero-name">{{ card.name }}</h1>
        <p class="hero-cat">{{ card.category }} · from ${{ card.denominations[0] }}</p>
      </div>
      <span v-if="card.instant" class="tag tag-green">
        <AppIcon name="bolt" :size="12" /> Instant
      </span>
    </div>

    <div class="tabs" role="tablist">
      <button
        v-for="option in SIDES"
        :key="option"
        class="tab"
        role="tab"
        type="button"
        :aria-selected="side === option"
        :class="{ 'tab--on': side === option }"
        @click="side = option"
      >
        {{ option === 'buy' ? 'Buy' : 'Sell' }}
      </button>
    </div>

    <div class="rate-box panel">
      <div class="rate-cell">
        <p class="rate-label">Current rate</p>
        <p class="rate-value">₦{{ activeRate.toLocaleString('en-NG') }}</p>
        <p class="rate-note">
          <span class="live-dot" :class="{ 'live-dot--off': !connected }" />
          {{ connected ? 'Live' : 'Cached' }} · per $1
        </p>
      </div>
      <span class="rate-div" />
      <div class="rate-cell">
        <p class="rate-label">Settlement</p>
        <p class="rate-value">{{ card.eta }}</p>
        <p class="rate-note">to your bank account</p>
      </div>
    </div>

    <section class="block">
      <p class="label">Accepted denominations</p>
      <div class="chips">
        <span v-for="value in card.denominations" :key="value" class="chip">${{ value }}</span>
      </div>
    </section>

    <section class="block">
      <p class="label">Before you submit</p>
      <ul class="notes">
        <li v-for="note in NOTES" :key="note">
          <AppIcon name="check" :size="15" />
          {{ note }}
        </li>
      </ul>
    </section>

    <section class="block">
      <NuxtLink :to="side === 'sell' ? '/sell' : '/buy'" class="btn btn-primary btn-block btn-lg">
        {{ side === 'sell' ? `Sell ${card.name}` : `Buy ${card.name}` }}
        <AppIcon name="arrow" :size="17" />
      </NuxtLink>
    </section>
  </div>

  <div v-else class="page missing">
    <AppIcon name="search" :size="26" />
    <h2>We don't settle that brand yet.</h2>
    <p class="muted">Check the full list, or ask support whether we can take it.</p>
    <div class="btn-row">
      <NuxtLink to="/cards" class="btn btn-soft">All gift cards</NuxtLink>
      <NuxtLink to="/support" class="btn btn-primary">Ask support</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCard } from '~/data/cards'

definePageMeta({ layout: 'app' })

const route = useRoute()
const { liveRate, connected } = useDerivRate()

const SIDES = ['buy', 'sell'] as const
const NOTES = [
  'Rate is locked at the moment you submit',
  'Codes are encrypted and purged after settlement',
  'Rejected orders carry no fee',
  'Support available 24/7 on chat and WhatsApp',
]

const card = computed(() => getCard(route.params.id))
const side = ref<(typeof SIDES)[number]>('buy')

const activeRate = computed(() => {
  if (!card.value) return 0
  const basis = side.value === 'buy' ? card.value.buyRate : card.value.sellRate
  return Math.round(basis * liveRate.value)
})

useHead(() => ({
  title: card.value ? `${card.value.name} — Plero Technologies` : 'Gift card — Plero Technologies',
}))
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 26px 20px;
  background: linear-gradient(150deg, color-mix(in srgb, var(--accent-card) 14%, transparent), transparent 70%);
  border-bottom: 1px solid var(--hairline);
}
.hero-name {
  font-size: 20px;
  font-weight: 700;
}
.hero-cat {
  font-size: 13px;
  color: var(--muted-2);
  margin-top: 2px;
}
.hero .tag {
  margin-left: auto;
}

.tabs {
  display: flex;
  gap: 4px;
  margin: 18px 20px 0;
  padding: 4px;
  border-radius: var(--r-full);
  background: var(--surface);
  border: 1px solid var(--hairline);
}
.tab {
  flex: 1;
  padding: 10px;
  border-radius: var(--r-full);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--muted);
  transition: all 0.2s var(--ease);
}
.tab--on {
  background: var(--text);
  color: #0b0b0f;
}

.rate-box {
  display: flex;
  align-items: stretch;
  margin: 14px 20px 0;
  padding: 18px;
}
.rate-cell {
  flex: 1;
  text-align: center;
}
.rate-div {
  width: 1px;
  background: var(--hairline);
}
.rate-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-3);
}
.rate-value {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 5px;
  font-variant-numeric: tabular-nums;
}
.rate-note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--muted-3);
  margin-top: 4px;
}

.block {
  margin: 26px 20px 0;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.chip {
  padding: 8px 16px;
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1px solid var(--hairline);
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.notes {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}
.notes li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: var(--muted-2);
  line-height: 1.6;
}
.notes :deep(.icon) {
  color: var(--accent);
  margin-top: 2px;
  flex-shrink: 0;
}

.missing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 80px 24px;
  text-align: center;
}
.missing h2 {
  font-size: 20px;
  font-weight: 700;
}
.missing .btn-row {
  justify-content: center;
}
</style>
