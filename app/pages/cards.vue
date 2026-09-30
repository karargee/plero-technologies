<template>
  <div>
    <section class="head">
      <div class="container">
        <p class="eyebrow">Gift cards</p>
        <h1 class="head-title">Every card we settle.</h1>
        <p class="head-lede">
          Rates are derived live from the USD/NGN feed and refreshed continuously. Pick a card to see
          its full rate card, accepted denominations and payout window.
        </p>

        <div class="toolbar">
          <FilterChips v-model="category" :options="CATEGORIES" />
          <SearchField v-model="query" class="toolbar-search" placeholder="Search gift cards…" />
        </div>
      </div>
    </section>

    <section class="container listing">
      <p class="count">{{ filtered.length }} {{ filtered.length === 1 ? 'card' : 'cards' }} available</p>

      <div v-if="filtered.length" class="grid">
        <NuxtLink
          v-for="card in filtered"
          :key="card.id"
          :to="`/card/${card.id}`"
          class="tile"
          :style="{ '--accent-card': card.color }"
        >
          <div class="tile-top">
            <CardMark :card="card" size="lg" />
            <span v-if="card.instant" class="tag tag-green">
              <AppIcon name="bolt" :size="12" /> Instant
            </span>
          </div>
          <h2 class="tile-name">{{ card.name }}</h2>
          <p class="tile-cat">{{ card.category }}</p>

          <div class="denoms">
            <span v-for="value in card.denominations" :key="value" class="denom">${{ value }}</span>
          </div>

          <div class="tile-rates">
            <div>
              <p class="rate-label">Sell rate</p>
              <p class="rate rate--out">{{ format(card.sellRate) }}</p>
            </div>
            <div class="right">
              <p class="rate-label">Buy rate</p>
              <p class="rate rate--in">{{ format(card.buyRate) }}</p>
            </div>
          </div>

          <p class="tile-foot">
            <span>{{ card.eta }} settlement</span>
            <span class="tile-cta">Trade <AppIcon name="arrow" :size="15" /></span>
          </p>
        </NuxtLink>
      </div>

      <EmptyState v-else icon="search" action="Clear filters" @action="reset">
        No gift cards match “{{ query }}”.
      </EmptyState>
    </section>

    <section class="container">
      <div class="note">
        <AppIcon name="help" :size="18" />
        <p>
          Don't see your card? We settle additional brands on request —
          <NuxtLink to="/support" class="note-link">ask support</NuxtLink> and we will confirm within
          minutes.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CATEGORIES, CARDS } from '~/data/cards'

const { format } = useDerivRate()

const category = ref<string>('All')
const query = ref('')

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  return CARDS.filter(
    card =>
      (category.value === 'All' || card.category === category.value) &&
      (!term || card.name.toLowerCase().includes(term) || card.category.toLowerCase().includes(term)),
  )
})

const reset = () => {
  category.value = 'All'
  query.value = ''
}

useHead({ title: 'Gift Cards — Plero Technologies' })
</script>

<style scoped>
.head {
  padding-block: clamp(40px, 6vw, 72px) clamp(24px, 3vw, 36px);
  background: radial-gradient(ellipse 70% 100% at 20% 0%, rgba(255, 68, 79, 0.08), transparent 60%);
  border-bottom: 1px solid var(--hairline);
}
.head-title {
  font-size: clamp(32px, 5vw, 54px);
  font-weight: 800;
  letter-spacing: -0.035em;
}
.head-lede {
  margin-top: 16px;
  max-width: 60ch;
  color: var(--muted);
  font-size: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 30px;
}
.toolbar-search {
  min-width: 260px;
}

.listing {
  padding-block: clamp(32px, 5vw, 56px);
}
.count {
  font-size: 13px;
  color: var(--muted-3);
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}
.tile {
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  transition: transform 0.28s var(--ease), border-color 0.28s, background 0.28s, box-shadow 0.28s;
}
.tile:hover {
  transform: translateY(-4px);
  background: var(--surface-2);
  border-color: color-mix(in srgb, var(--accent-card) 45%, transparent);
  box-shadow: var(--shadow-md);
}
.tile-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}
.tile-name {
  font-size: 17px;
  font-weight: 600;
}
.tile-cat {
  font-size: 12.5px;
  color: var(--muted-3);
  margin-top: 3px;
}
.denoms {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
}
.denom {
  padding: 4px 10px;
  border-radius: var(--r-sm);
  background: var(--bg-alt);
  border: 1px solid var(--hairline);
  font-size: 12px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.tile-rates {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  padding: 14px;
  border-radius: var(--r-md);
  background: var(--bg-alt);
  border: 1px solid var(--hairline);
}
.right {
  text-align: right;
}
.rate-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-3);
}
.rate {
  margin-top: 3px;
  font-size: 18px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.rate--out {
  color: var(--accent);
}
.rate--in {
  color: var(--gold);
}
.tile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12.5px;
  color: var(--muted-3);
}
.tile-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text);
  font-weight: 600;
}
.tile:hover .tile-cta {
  color: var(--primary);
}

.note {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 18px 20px;
  margin-bottom: clamp(40px, 6vw, 72px);
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  color: var(--muted-2);
  font-size: 14.5px;
}
.note :deep(.icon) {
  color: var(--primary);
  margin-top: 2px;
}
.note-link {
  color: var(--text);
  font-weight: 600;
  border-bottom: 1px solid var(--hairline-strong);
}
</style>
