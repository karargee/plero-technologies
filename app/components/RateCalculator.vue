<template>
  <div class="calc">
    <div class="calc-header">
      <p class="calc-title">Rate Calculator</p>
      <div class="live-pill" v-if="connected">
        <span class="live-dot" />
        <span>Live</span>
      </div>
    </div>

    <!-- Asset Select -->
    <div class="field">
      <label class="lbl">Select Asset</label>
      <div class="select-grid">
        <button v-for="c in CARDS.slice(0,6)" :key="c.id"
          class="asset-btn" :class="{active: selected===c.id}"
          @click="selected=c.id">
          <span>{{ c.logo }}</span>
          <span style="font-size:11px">{{ c.short }}</span>
        </button>
      </div>
    </div>

    <!-- Amount -->
    <div class="field">
      <label class="lbl">Amount (USD)</label>
      <div class="amount-wrap">
        <span class="amount-prefix">$</span>
        <input v-model.number="amount" type="number" min="1" placeholder="100" class="amount-input" />
      </div>
    </div>

    <!-- Type -->
    <div class="field">
      <div class="type-tabs">
        <button class="type-tab" :class="{active: type==='sell'}" @click="type='sell'">I want to Sell</button>
        <button class="type-tab" :class="{active: type==='buy'}" @click="type='buy'">I want to Buy</button>
      </div>
    </div>

    <!-- Result -->
    <div class="result" v-if="card && amount">
      <div class="result-row">
        <span class="result-lbl">Rate</span>
        <span class="result-rate">₦{{ Math.round((type==='sell' ? card.sellRate : card.buyRate) * liveRate) }} / $1</span>
      </div>
      <div class="result-row">
        <span class="result-lbl">You {{ type==='sell' ? 'Receive' : 'Pay' }}</span>
        <span class="result-amount">₦{{ payout.toLocaleString('en-NG') }}</span>
      </div>
      <div class="result-row">
        <span class="result-lbl">Settlement</span>
        <span style="color:#f59e0b;font-size:13px;font-weight:600">{{ card.eta }}</span>
      </div>
    </div>

    <NuxtLink :to="type==='sell' ? '/sell' : '/register'" class="calc-btn">
      {{ type==='sell' ? 'Sell Now' : 'Buy Now' }} →
    </NuxtLink>
  </div>
</template>

<script setup>
import { CARDS } from '~/data/cards'

const { liveRate, connected } = useDerivRate()
const selected = ref('deriv')
const amount = ref(100)
const type = ref('sell')

const card = computed(() => CARDS.find(c => c.id === selected.value))
const payout = computed(() => {
  if (!card.value || !amount.value) return 0
  const rate = type.value === 'sell' ? card.value.sellRate : card.value.buyRate
  return Math.round(amount.value * rate * liveRate.value)
})
</script>

<style scoped>
.calc {
  background: #111; border: 1px solid #1e1e1e;
  border-radius: 12px; padding: 24px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}
.calc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.calc-title { font-size: 16px; font-weight: 700; color: #fff; }
.live-pill { display: flex; align-items: center; gap: 5px; background: rgba(0,167,158,0.1); border: 1px solid rgba(0,167,158,0.2); border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #00a79e; }
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: #00a79e; animation: pulse 1.5s infinite; }
.field { margin-bottom: 16px; }
.lbl { display: block; color: #555; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.select-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
.asset-btn { background: #0e0e0e; border: 1px solid #1e1e1e; border-radius: 6px; padding: 10px 6px; display: flex; flex-direction: column; align-items: center; gap: 4px; color: #555; font-size: 18px; transition: all 0.2s; }
.asset-btn.active { border-color: #ff444f; background: rgba(255,68,79,0.08); color: #fff; }
.asset-btn:hover:not(.active) { border-color: #333; color: #fff; }
.amount-wrap { display: flex; align-items: center; background: #0e0e0e; border: 1px solid #1e1e1e; border-radius: 6px; overflow: hidden; }
.amount-prefix { padding: 0 14px; color: #555; font-size: 16px; font-weight: 600; border-right: 1px solid #1e1e1e; }
.amount-input { flex: 1; background: transparent; border: none; color: #fff; font-size: 18px; font-weight: 700; padding: 13px 14px; }
.amount-input::placeholder { color: #333; }
.type-tabs { display: flex; background: #0e0e0e; border: 1px solid #1e1e1e; border-radius: 6px; padding: 3px; }
.type-tab { flex: 1; padding: 10px; border-radius: 4px; background: transparent; color: #555; font-size: 13px; font-weight: 600; transition: all 0.2s; }
.type-tab.active { background: #ff444f; color: #fff; }
.result { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
.result-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.result-row:last-child { margin-bottom: 0; }
.result-lbl { color: #444; font-size: 13px; }
.result-rate { color: #00a79e; font-size: 14px; font-weight: 700; }
.result-amount { color: #fff; font-size: 22px; font-weight: 900; }
.calc-btn { display: block; width: 100%; padding: 14px; border-radius: 6px; background: #ff444f; color: #fff; font-size: 15px; font-weight: 700; text-align: center; text-decoration: none; transition: background 0.2s; }
.calc-btn:hover { background: #e03038; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
</style>
