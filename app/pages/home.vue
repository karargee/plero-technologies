<template>
  <div class="page">
    <AppPageHeader title="Dashboard" to="/rates" icon="trend" />

    <WalletBalance :connected="connected" :rate="rate" :balance="balance" />

    <section class="block">
      <p class="label">Quick actions</p>
      <div class="quick">
        <NuxtLink v-for="action in QUICK_ACTIONS" :key="action.label" :to="action.to" class="quick-item">
          <span class="quick-icon"><AppIcon :name="action.icon" :size="19" /></span>
          {{ action.label }}
        </NuxtLink>
      </div>
    </section>

    <section class="block">
      <div class="block-head">
        <p class="label">Featured cards</p>
        <NuxtLink to="/cards" class="link">All cards <AppIcon name="arrow" :size="14" /></NuxtLink>
      </div>
      <div class="rail">
        <NuxtLink
          v-for="card in featured"
          :key="card.id"
          :to="`/card/${card.id}`"
          class="rail-card"
          :style="{ '--accent-card': card.color }"
        >
          <CardMark :card="card" />
          <p class="rail-name">{{ card.short }}</p>
          <p class="rail-rate">{{ format(card.sellRate) }}/$</p>
        </NuxtLink>
      </div>
    </section>

    <section class="block block--last">
      <p class="label">Rate snapshot</p>
      <div class="list panel">
        <NuxtLink v-for="card in CARDS" :key="card.id" :to="`/card/${card.id}`" class="row">
          <CardMark :card="card" size="sm" />
          <div class="row-meta">
            <p class="row-name">{{ card.name }}</p>
            <p class="row-sub">{{ card.category }}</p>
          </div>
          <div class="row-rates">
            <span class="row-buy">{{ format(card.buyRate) }}</span>
            <span class="row-sell">{{ format(card.sellRate) }}</span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CARDS, getFeaturedCards } from '~/data/cards'
import { QUICK_ACTIONS } from '~/data/site'

definePageMeta({ layout: 'app' })

const { rate, connected, balance, format } = useDerivRate()
const featured = getFeaturedCards()
</script>

<style scoped>
.block {
  margin: 30px 20px 0;
}
.block--last {
  margin-bottom: 8px;
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--muted);
}
.link:hover {
  color: var(--text);
}

.quick {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 12px;
}
.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--muted);
  transition: all 0.22s var(--ease);
}
.quick-item:hover {
  color: var(--text);
  background: var(--surface-2);
  transform: translateY(-2px);
}
.quick-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  background: var(--surface-3);
  color: var(--text);
}

.rail {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scroll-snap-type: x mandatory;
}
.rail-card {
  scroll-snap-align: start;
  flex: 0 0 auto;
  width: 118px;
  padding: 16px 12px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  transition: all 0.22s var(--ease);
}
.rail-card:hover {
  border-color: color-mix(in srgb, var(--accent-card) 45%, transparent);
  transform: translateY(-2px);
}
.rail-name {
  font-size: 12.5px;
  font-weight: 600;
  text-align: center;
}
.rail-rate {
  font-size: 11.5px;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.list {
  overflow: hidden;
  margin-top: 12px;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--hairline);
  transition: background 0.2s;
}
.row:last-child {
  border-bottom: 0;
}
.row:hover {
  background: var(--surface-2);
}
.row-meta {
  flex: 1;
  min-width: 0;
}
.row-name {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-sub {
  font-size: 12px;
  color: var(--muted-3);
}
.row-rates {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.row-buy {
  color: var(--gold);
}
.row-sell {
  color: var(--accent);
}
</style>
