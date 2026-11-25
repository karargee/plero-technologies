<script setup lang="ts">
// "I have ₦X — how many dollars is that on Deriv?" and the reverse, using Plero's rates.
import { deriv } from '~/data/site'

const naira = ref<number | null>(100000)
const usd = ref<number | null>(100)

const depositUsd = computed(() => (naira.value ?? 0) / deriv.depositRate)
const withdrawNaira = computed(() => (usd.value ?? 0) * deriv.withdrawRate)
</script>

<template>
  <div class="tool card">
    <h3>Naira ⇄ Deriv converter</h3>
    <p class="tool__lead">Plan your deposit or withdrawal using our current rates.</p>

    <div class="tool__grid">
      <div class="field">
        <label for="nc-ngn">I want to spend (₦)</label>
        <input id="nc-ngn" v-model.number="naira" class="input" type="number" min="0" inputmode="decimal" />
      </div>
      <div class="field">
        <label for="nc-usd">I want to withdraw ($)</label>
        <input id="nc-usd" v-model.number="usd" class="input" type="number" min="0" inputmode="decimal" />
      </div>
    </div>

    <div class="tool__out">
      <div>
        <span>Added to Deriv</span>
        <strong>${{ depositUsd.toFixed(2) }}</strong>
      </div>
      <div>
        <span>You receive</span>
        <strong>{{ formatMoney(withdrawNaira) }}</strong>
      </div>
    </div>
    <p class="tool__hint">
      Deposit rate {{ formatMoney(deriv.depositRate) }}/$ · Withdrawal rate {{ formatMoney(deriv.withdrawRate) }}/$ ·
      Limits ${{ deriv.min }}–${{ deriv.max.toLocaleString() }}
    </p>
  </div>
</template>

<style src="./tool.css" scoped></style>
