<template>
  <div class="page">
    <AppPageHeader title="Buy gift cards" to="/rates" icon="trend" />

    <div class="tools">
      <SearchField v-model="query" placeholder="Search gift cards…" />
      <FilterChips v-model="category" :options="CATEGORIES" />
    </div>

    <div class="list panel">
      <NuxtLink v-for="card in filtered" :key="card.id" :to="`/card/${card.id}`" class="row">
        <CardMark :card="card" />
        <div class="row-meta">
          <p class="row-name">{{ card.name }}</p>
          <p class="row-sub">{{ card.category }} · from ${{ card.denominations[0] }}</p>
        </div>
        <div class="row-right">
          <p class="row-rate">{{ format(card.buyRate) }}</p>
          <span class="row-tag">Buy</span>
        </div>
      </NuxtLink>

      <EmptyState v-if="!filtered.length" icon="search" action="Clear filters" @action="reset">
        No cards match that search.
      </EmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORIES, CARDS } from '~/data/cards'

definePageMeta({ layout: 'app' })

const { format } = useDerivRate()

const query = ref('')
const category = ref<string>('All')

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  return CARDS.filter(
    card =>
      (category.value === 'All' || card.category === category.value) &&
      (!term || card.name.toLowerCase().includes(term)),
  )
})

const reset = () => {
  query.value = ''
  category.value = 'All'
}
</script>

<style scoped>
.tools {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px 0;
}
.tools :deep(.search) {
  width: 100%;
}

.list {
  margin: 14px 20px 0;
  overflow: hidden;
}
.row {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 16px;
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
  font-size: 14.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-sub {
  font-size: 12px;
  color: var(--muted-3);
  margin-top: 2px;
}
.row-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.row-rate {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--gold);
  font-variant-numeric: tabular-nums;
}
.row-tag {
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(245, 165, 36, 0.13);
  color: var(--gold);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
