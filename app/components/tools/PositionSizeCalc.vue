<script setup lang="ts">
// Lot size from account balance, risk % and stop-loss distance.
const balance = ref<number | null>(100)
const riskPct = ref<number | null>(2)
const stopPoints = ref<number | null>(500)
const pointValue = ref<number | null>(1)

const riskUsd = computed(() => ((balance.value ?? 0) * (riskPct.value ?? 0)) / 100)
const lots = computed(() => {
  const d = (stopPoints.value ?? 0) * (pointValue.value ?? 0)
  return d > 0 ? riskUsd.value / d : 0
})
const highRisk = computed(() => (riskPct.value ?? 0) > 5)
</script>

<template>
  <div class="tool card">
    <h3>Position size calculator</h3>
    <p class="tool__lead">How big should your trade be so a stop loss only costs the amount you chose to risk?</p>

    <div class="tool__grid">
      <div class="field">
        <label for="ps-bal">Account balance ($)</label>
        <input id="ps-bal" v-model.number="balance" class="input" type="number" min="0" inputmode="decimal" />
      </div>
      <div class="field">
        <label for="ps-risk">Risk per trade (%)</label>
        <input id="ps-risk" v-model.number="riskPct" class="input" type="number" min="0" step="0.5" inputmode="decimal" />
      </div>
      <div class="field">
        <label for="ps-sl">Stop loss distance (price points)</label>
        <input id="ps-sl" v-model.number="stopPoints" class="input" type="number" min="0" inputmode="decimal" />
      </div>
      <div class="field">
        <label for="ps-pv">$ per 1.0 price move, per 1 lot</label>
        <input id="ps-pv" v-model.number="pointValue" class="input" type="number" min="0" step="0.01" inputmode="decimal" />
      </div>
    </div>

    <div class="tool__out">
      <div>
        <span>Amount at risk</span>
        <strong>${{ riskUsd.toFixed(2) }}</strong>
      </div>
      <div>
        <span>Position size</span>
        <strong>{{ lots.toFixed(3) }} lots</strong>
      </div>
    </div>
    <p v-if="highRisk" class="tool__warn">Risking more than 5% per trade can drain an account very quickly.</p>
    <p class="tool__hint">
      Most Deriv synthetic indices on MT5 move $1 per 1.0 price change per lot. Check the exact value in MT5:
      right-click the symbol → Specification. Round down to the minimum lot step your broker allows.
    </p>
  </div>
</template>

<style src="./tool.css" scoped></style>
