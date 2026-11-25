<script setup lang="ts">
// Grid of live prices; clicking one selects it in the chart.
import { markets } from '~/data/site'

const selected = defineModel<string>({ required: true })
const prices = useDerivPrices(markets.map((m) => m.symbol))
const open = useDerivMarketStatus()

function pct(s: string) {
  const p = prices[s]
  if (!p?.open || !p.price) return null
  return ((p.price - p.open) / p.open) * 100
}
</script>

<template>
  <div class="board">
    <button
      v-for="m in markets"
      :key="m.symbol"
      type="button"
      class="tile"
      :class="{ on: selected === m.symbol }"
      :aria-pressed="selected === m.symbol"
      @click="selected = m.symbol"
    >
      <span class="tile__top">
        <span class="tile__group">{{ m.group }}</span>
        <span v-if="open[m.symbol] !== undefined" class="tile__status" :class="{ closed: !open[m.symbol] }">
          {{ open[m.symbol] ? 'Open' : 'Closed' }}
        </span>
      </span>
      <span class="tile__name">{{ m.name }}</span>
      <span class="tile__row">
        <strong :class="{ up: prices[m.symbol]?.dir === 1, down: prices[m.symbol]?.dir === -1 }">
          {{ formatPrice(prices[m.symbol]?.price, prices[m.symbol]?.pip) }}
        </strong>
        <small v-if="pct(m.symbol) != null" :class="pct(m.symbol)! >= 0 ? 'up' : 'down'">
          {{ pct(m.symbol)! >= 0 ? '+' : '' }}{{ pct(m.symbol)!.toFixed(2) }}%
        </small>
      </span>
    </button>
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;
}
.tile {
  display: grid;
  gap: 4px;
  text-align: left;
  padding: 14px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.tile:hover {
  border-color: var(--indigo-200);
  transform: translateY(-2px);
}
.tile.on {
  border-color: var(--indigo-500);
  box-shadow: 0 0 0 3px rgb(108 112 209 / 0.18);
}
.tile__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.tile__status {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 999px;
  background: #e7f6ef;
  color: var(--success);
}
.tile__status.closed {
  background: var(--surface-alt);
  color: var(--ink-mute);
}
.tile__group {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.tile__name {
  font-weight: 600;
  font-size: 14.5px;
}
.tile__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.tile__row strong {
  font-variant-numeric: tabular-nums;
  font-size: 16px;
  transition: color 0.3s ease;
}
.tile__row small {
  font-weight: 600;
  font-size: 12.5px;
}
.up {
  color: var(--success);
}
.down {
  color: #b42318;
}
</style>
