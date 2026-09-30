<template>
  <div class="page">
    <AppPageHeader title="My orders" to="/sell" icon="plus" action-label="New order" />

    <div class="stats">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <p class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>

    <div class="filters">
      <FilterChips v-model="status" :options="ORDER_FILTERS" />
    </div>

    <div class="list">
      <article v-for="order in filtered" :key="order.id" class="order panel">
        <div class="order-top">
          <CardMark v-if="cardOf(order)" :card="cardOf(order)!" />
          <div class="order-meta">
            <p class="order-name">{{ cardOf(order)?.name ?? order.cardId }}</p>
            <p class="order-sub">{{ order.id }} · {{ order.date }}</p>
          </div>
          <span class="status" :style="statusStyle(order.status)">{{ order.status }}</span>
        </div>
        <div class="order-bottom">
          <span>Card value <b>{{ order.amount }}</b></span>
          <span>Payout <b class="accent">₦{{ order.payout }}</b></span>
        </div>
      </article>

      <EmptyState v-if="!filtered.length" icon="receipt" action="Show all orders" @action="status = 'All'">
        No {{ status === 'All' ? '' : status.toLowerCase() }} orders yet.
      </EmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCard } from '~/data/cards'
import { ORDERS, ORDER_FILTERS } from '~/data/site'
import type { Card, Order, OrderStatus } from '~/types'

definePageMeta({ layout: 'app' })

const STATUS_COLORS: Record<OrderStatus, { color: string; bg: string }> = {
  completed: { color: '#10b981', bg: 'rgba(16,185,129,0.13)' },
  processing: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.14)' },
  pending: { color: '#f5a524', bg: 'rgba(245,165,36,0.13)' },
  failed: { color: '#ef4444', bg: 'rgba(239,68,68,0.13)' },
}

const status = ref<string>('All')

const cardOf = (order: Order): Card | undefined => getCard(order.cardId)

const statusStyle = (value: OrderStatus) => {
  const palette = STATUS_COLORS[value] ?? STATUS_COLORS.pending
  return { color: palette.color, background: palette.bg, borderColor: palette.color }
}

const filtered = computed(() =>
  status.value === 'All' ? ORDERS : ORDERS.filter(order => order.status === status.value),
)

const stats = computed(() => [
  { label: 'Total', value: ORDERS.length, color: '#f7f7f8' },
  { label: 'Completed', value: ORDERS.filter(o => o.status === 'completed').length, color: '#10b981' },
  {
    label: 'In flight',
    value: ORDERS.filter(o => o.status === 'pending' || o.status === 'processing').length,
    color: '#f5a524',
  },
])
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 16px 20px 0;
}
.stat {
  padding: 15px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  text-align: center;
}
.stat-value {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.stat-label {
  margin-top: 2px;
  font-size: 11.5px;
  color: var(--muted-3);
}

.filters {
  padding: 16px 20px 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 20px 0;
}
.order {
  padding: 15px 16px;
}
.order-top {
  display: flex;
  align-items: center;
  gap: 13px;
}
.order-meta {
  flex: 1;
  min-width: 0;
}
.order-name {
  font-size: 14.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.order-sub {
  font-size: 12px;
  color: var(--muted-3);
  margin-top: 2px;
  font-variant-numeric: tabular-nums;
}
.status {
  padding: 4px 11px;
  border-radius: var(--r-full);
  border: 1px solid;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}
.order-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 13px;
  padding-top: 12px;
  border-top: 1px solid var(--hairline);
  font-size: 13px;
  color: var(--muted-2);
}
.order-bottom b {
  color: var(--text);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.accent {
  color: var(--accent) !important;
}
</style>
