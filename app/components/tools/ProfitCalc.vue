<script setup lang="ts">
// Profit / loss for a trade from entry, exit and lot size.
const side = ref<'buy' | 'sell'>('buy')
const lots = ref<number | null>(0.01)
const entry = ref<number | null>(1000)
const exit = ref<number | null>(1050)
const pointValue = ref<number | null>(1)

const move = computed(() => ((exit.value ?? 0) - (entry.value ?? 0)) * (side.value === 'buy' ? 1 : -1))
const pnl = computed(() => move.value * (lots.value ?? 0) * (pointValue.value ?? 0))
</script>

<template>
  <div class="tool card">
    <h3>Profit &amp; loss calculator</h3>
    <p class="tool__lead">See what a trade makes or loses before you place it.</p>

    <div class="seg" role="group" aria-label="Direction">
      <button type="button" :class="{ on: side === 'buy' }" @click="side = 'buy'">Buy</button>
      <button type="button" :class="{ on: side === 'sell' }" @click="side = 'sell'">Sell</button>
    </div>

    <div class="tool__grid">
      <div class="field">
        <label for="pl-lots">Lot size</label>
        <input id="pl-lots" v-model.number="lots" class="input" type="number" min="0" step="0.01" inputmode="decimal" />
      </div>
      <div class="field">
        <label for="pl-pv">$ per 1.0 price move, per 1 lot</label>
        <input id="pl-pv" v-model.number="pointValue" class="input" type="number" min="0" step="0.01" inputmode="decimal" />
      </div>
      <div class="field">
        <label for="pl-entry">Entry price</label>
        <input id="pl-entry" v-model.number="entry" class="input" type="number" inputmode="decimal" />
      </div>
      <div class="field">
        <label for="pl-exit">Exit price</label>
        <input id="pl-exit" v-model.number="exit" class="input" type="number" inputmode="decimal" />
      </div>
    </div>

    <div class="tool__out">
      <div>
        <span>Price move</span>
        <strong>{{ move >= 0 ? '+' : '' }}{{ move.toLocaleString('en-US', { maximumFractionDigits: 5 }) }}</strong>
      </div>
      <div>
        <span>Profit / loss</span>
        <strong :class="pnl > 0 ? 'pos' : pnl < 0 ? 'neg' : ''">
          {{ pnl >= 0 ? '+' : '−' }}${{ Math.abs(pnl).toFixed(2) }}
        </strong>
      </div>
    </div>
    <p class="tool__hint">Excludes spread and swap. Results are estimates.</p>
  </div>
</template>

<style src="./tool.css" scoped></style>
