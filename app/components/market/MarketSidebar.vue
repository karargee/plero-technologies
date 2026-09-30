<template>
  <aside class="sidebar" :class="{ 'sidebar--open': open }">
    <div class="search">
      <AppIcon name="search" :size="15" />
      <input
        v-model="term"
        type="search"
        class="search-input"
        placeholder="Search markets"
        aria-label="Search markets"
      />
    </div>

    <div class="list">
      <section v-for="group in filtered" :key="group.name" class="group">
        <h3 class="group-name">{{ group.name }}</h3>
        <button
          v-for="item in group.items"
          :key="item.code"
          type="button"
          class="row"
          :class="{ 'row--on': item.code === symbol }"
          @click="pick(item.code)"
        >
          <span class="row-id">
            <span class="row-label">{{ item.label }}</span>
            <span class="row-code">{{ item.code }}</span>
          </span>
          <span class="row-nums">
            <span class="row-price">{{ priceOf(item.code) }}</span>
            <span
              class="row-change"
              :class="changeClass(item.code)"
            >
              {{ changeText(item.code) }}
            </span>
          </span>
        </button>
      </section>

      <p v-if="!filtered.length" class="none">No market matches “{{ term }}”.</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Quote } from '~/composables/useDerivMarket'

const props = defineProps<{
  symbol: string
  quotes: Record<string, Quote>
  groups: { name: string; items: { code: string; label: string; group: string }[] }[]
  formatQuote: (value: number | null | undefined, pip: number) => string
  open?: boolean
}>()

const emit = defineEmits<{ select: [code: string] }>()

const term = ref('')

const filtered = computed(() => {
  const q = term.value.trim().toLowerCase()
  if (!q) return props.groups
  return props.groups
    .map(group => ({
      name: group.name,
      items: group.items.filter(
        item => item.label.toLowerCase().includes(q) || item.code.toLowerCase().includes(q),
      ),
    }))
    .filter(group => group.items.length)
})

const priceOf = (code: string) => {
  const quote = props.quotes[code]
  return props.formatQuote(quote?.price ?? null, quote?.pipSize ?? 2)
}

const changeOf = (code: string) => props.quotes[code]?.change ?? null

const changeText = (code: string) => {
  const change = changeOf(code)
  if (change === null || !Number.isFinite(change)) return '—'
  return `${change >= 0 ? '+' : ''}${(change * 100).toFixed(2)}%`
}

const changeClass = (code: string) => {
  const change = changeOf(code)
  if (change === null || !Number.isFinite(change)) return 'is-flat'
  return change >= 0 ? 'is-up' : 'is-down'
}

function pick(code: string) {
  emit('select', code)
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  overflow: hidden;
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--hairline);
  color: var(--muted-3);
}
.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  outline: none;
}
.search-input::placeholder {
  color: var(--muted-3);
}

.list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 6px 0 10px;
}

.group + .group {
  margin-top: 6px;
}
.group-name {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 8px 12px 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted-3);
  background: var(--surface);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  border-left: 2px solid transparent;
  transition: background 0.15s;
}
.row:hover {
  background: var(--surface-2);
}
.row--on {
  background: rgb(var(--primary-rgb) / 0.1);
  border-left-color: var(--primary-light);
}

.row-id {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 1px;
}
.row-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-code {
  font-size: 10px;
  color: var(--muted-3);
  letter-spacing: 0.04em;
}

.row-nums {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  flex-shrink: 0;
}
.row-price {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}
.row-change {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-variant-numeric: tabular-nums;
}
.is-up {
  color: #26a69a;
}
.is-down {
  color: #ef5350;
}
.is-flat {
  color: var(--muted-3);
}

.none {
  padding: 18px 12px;
  font-size: 12.5px;
  color: var(--muted-3);
  text-align: center;
}
</style>
