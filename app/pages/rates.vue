<template>
  <div>
    <section class="head">
      <div class="container head-inner">
        <div>
          <p class="eyebrow">Live rates</p>
          <h1 class="head-title">The number you get is the number on screen.</h1>
          <p class="head-lede">
            Every rate is the live USD/NGN feed multiplied by a brand and denomination factor.
            Quotes are refreshed continuously and locked when you submit an order.
          </p>
        </div>
        <div class="fx-card glass">
          <div class="fx-top">
            <p class="fx-label">USD / NGN</p>
            <span class="tag" :class="connected ? 'tag-green' : 'tag-yellow'">
              <span class="live-dot" :class="{ 'live-dot--off': !connected }" />
              {{ connected ? 'Streaming' : 'Reconnecting' }}
            </span>
          </div>
          <p class="fx-rate">₦<span>{{ liveRate.toLocaleString('en-NG') }}</span></p>
          <p class="fx-sub">per $1 · source: Deriv exchange feed</p>
          <dl class="fx-meta">
            <div><dt>Margin</dt><dd>0%</dd></div>
            <div><dt>Spread</dt><dd>built into rate</dd></div>
            <div><dt>Settlement</dt><dd>5–15 min</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="toolbar">
        <FilterChips v-model="category" :options="CATEGORIES" />
        <SearchField v-model="query" class="toolbar-search" placeholder="Search brand…" />
      </div>

      <div class="table-wrap panel">
        <div class="tr th">
          <span>Gift card</span>
          <span>Category</span>
          <span>Sell rate</span>
          <span>Buy rate</span>
          <span>Min</span>
          <span />
        </div>
        <div v-for="card in filtered" :key="card.id" class="tr">
          <div class="cell-card">
            <CardMark :card="card" />
            <div>
              <p class="cell-name">{{ card.name }}</p>
              <p class="cell-sub">{{ denominations(card) }}</p>
            </div>
          </div>
          <span class="badge badge-purple hide-sm">{{ card.category }}</span>
          <div>
            <p class="rate rate--out">{{ format(card.sellRate) }}</p>
            <p class="rate-note">you receive</p>
          </div>
          <div>
            <p class="rate rate--in">{{ format(card.buyRate) }}</p>
            <p class="rate-note">you pay</p>
          </div>
          <span class="min hide-sm">${{ card.denominations[0] }}</span>
          <NuxtLink :to="`/card/${card.id}`" class="btn btn-soft row-cta">Trade</NuxtLink>
        </div>

        <EmptyState v-if="!filtered.length" icon="search" action="Clear filters" @action="reset">
          No brand matches that filter.
        </EmptyState>
      </div>

      <p class="footnote">
        <AppIcon name="help" :size="16" />
        Rates are indicative until an order is submitted. Volume and denomination can shift the final
        quote — we lock it at submission so it cannot move underneath you.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CATEGORIES, CARDS } from '~/data/cards'
import type { Card } from '~/types'

const { liveRate, connected, format } = useDerivRate()

const category = ref<string>('All')
const query = ref('')

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  return CARDS.filter(
    card =>
      (category.value === 'All' || card.category === category.value) &&
      (!term || card.name.toLowerCase().includes(term)),
  )
})

const denominations = (card: Card) => card.denominations.map(value => `$${value}`).join(' · ')

const reset = () => {
  category.value = 'All'
  query.value = ''
}

useHead({ title: 'Live Rates — Plero Technologies' })
</script>

<style scoped>
.head {
  padding-block: clamp(40px, 6vw, 76px) clamp(28px, 4vw, 44px);
  background: radial-gradient(ellipse 70% 100% at 20% 0%, rgba(0, 167, 158, 0.08), transparent 60%);
  border-bottom: 1px solid var(--hairline);
}
.head-inner {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: clamp(28px, 4vw, 56px);
  align-items: center;
}
.head-title {
  font-size: clamp(30px, 4.6vw, 52px);
  font-weight: 800;
  letter-spacing: -0.035em;
  max-width: 20ch;
}
.head-lede {
  margin-top: 16px;
  max-width: 54ch;
  color: var(--muted);
  font-size: 16px;
}

.fx-card {
  border-radius: var(--r-xl);
  padding: 24px;
  box-shadow: var(--shadow-md);
}
.fx-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.fx-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--muted-2);
}
.fx-rate {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.1;
  margin-top: 8px;
  font-variant-numeric: tabular-nums;
}
.fx-sub {
  font-size: 12.5px;
  color: var(--muted-3);
  margin-top: 4px;
}
.fx-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--hairline);
}
.fx-meta dt {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-3);
}
.fx-meta dd {
  margin: 3px 0 0;
  font-size: 13.5px;
  font-weight: 600;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-block: clamp(24px, 3vw, 36px) 20px;
}
.toolbar-search {
  min-width: 220px;
}

.table-wrap {
  overflow: hidden;
}
.tr {
  display: grid;
  grid-template-columns: 2.2fr 1fr 1fr 1fr 0.7fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px 22px;
  border-bottom: 1px solid var(--hairline);
}
.tr:last-of-type {
  border-bottom: 0;
}
.th {
  background: var(--bg-alt);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted-3);
}
.tr:not(.th):hover {
  background: var(--surface-2);
}

.cell-card {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}
.cell-name {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cell-sub {
  font-size: 12px;
  color: var(--muted-3);
  font-variant-numeric: tabular-nums;
}
.rate {
  font-size: 16.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.rate--out {
  color: var(--accent);
}
.rate--in {
  color: var(--gold);
}
.rate-note {
  font-size: 11px;
  color: var(--muted-3);
}
.min {
  font-size: 14px;
  color: var(--muted-2);
  font-variant-numeric: tabular-nums;
}
.row-cta {
  padding: 8px 18px;
  font-size: 13.5px;
}

.footnote {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 20px 0 clamp(48px, 7vw, 88px);
  font-size: 13.5px;
  color: var(--muted-3);
  line-height: 1.7;
}
.footnote :deep(.icon) {
  margin-top: 2px;
  color: var(--muted-2);
}

@media (max-width: 900px) {
  .head-inner {
    grid-template-columns: 1fr;
  }
  .hide-sm {
    display: none;
  }
  .tr {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .th {
    display: none;
  }
  .cell-card,
  .row-cta {
    grid-column: 1 / -1;
  }
}
</style>
