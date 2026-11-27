<script setup lang="ts">
import type { PayId } from '~/data/pay'
import { site } from '~/data/site'

const props = withDefaults(defineProps<{ fixed?: PayId; initial?: PayId }>(), { initial: 'usdt' })

const active = ref<PayId>(props.fixed ?? props.initial)
const { payServices } = useRates()
const service = computed(() => payServices.value.find((s) => s.id === active.value)!)
const side = ref<'buy' | 'sell'>('buy')
const amount = ref<number | null>(100)
const network = ref('')
const method = ref('')

watch(
  service,
  (s) => {
    amount.value = s.kind === 'supplier' ? 5000 : 100
    network.value = s.kind === 'trade' ? (s.networks?.[0] ?? '') : ''
    method.value = s.kind === 'supplier' ? s.methods[0]! : ''
  },
  { immediate: true },
)

const tooLow = computed(() => !!amount.value && amount.value > 0 && amount.value < service.value.min)
const tooHigh = computed(() => !!amount.value && amount.value > service.value.max)
const valid = computed(() => !!amount.value && amount.value > 0 && !tooLow.value && !tooHigh.value)

const rate = computed(() => {
  const s = service.value
  if (s.kind === 'supplier') return s.rate
  return side.value === 'buy' ? s.buyRate : s.sellRate
})
const subtotal = computed(() => (valid.value ? amount.value! * rate.value : 0))
const fee = computed(() => (service.value.kind === 'supplier' && valid.value ? service.value.fee : 0))
const total = computed(() => subtotal.value + fee.value)

const resultLabel = computed(() => {
  if (service.value.kind === 'supplier') return 'You pay (incl. fee)'
  return side.value === 'buy' ? 'You pay' : 'You receive'
})
const unitPrefix = computed(() => (service.value.kind === 'supplier' ? '¥' : service.value.id === 'airtm' ? '$' : ''))
const amountLabel = computed(() => {
  const s = service.value
  if (s.kind === 'supplier') return 'Amount to pay supplier (RMB ¥)'
  return side.value === 'buy' ? `${s.unit} you want to buy` : `${s.unit} you want to sell`
})

const whatsappHref = computed(() => {
  const s = service.value
  const a = amount.value ?? 0
  let text = ''
  if (s.kind === 'supplier') text = `Hi Plero Pay, I want to pay a supplier in China: ¥${a} via ${method.value}. Quote: ${formatMoney(total.value)}.`
  else if (s.id === 'usdt') text = `Hi Plero Pay, I want to ${side.value} ${a} USDT (${network.value}). Quote: ${formatMoney(total.value)}.`
  else text = `Hi Plero Pay, I want to ${side.value} $${a} Airtm USD. Quote: ${formatMoney(total.value)}.`
  return `${site.contact.whatsapp}?text=${encodeURIComponent(text)}`
})
</script>

<template>
  <div class="pcalc card">
    <div class="pcalc__head">
      <PayLogo :size="28" />
      <span class="pcalc__badge">Live quote</span>
    </div>

    <div v-if="!fixed" class="svc" role="tablist" aria-label="Service">
      <button
        v-for="s in payServices"
        :key="s.id"
        type="button"
        role="tab"
        :aria-selected="active === s.id"
        :class="{ on: active === s.id }"
        @click="active = s.id"
      >
        <PayMark :symbol="s.symbol" :color="s.color" :size="22" />
        {{ s.id === 'china' ? 'China pay' : s.name }}
      </button>
    </div>

    <div v-if="service.kind === 'trade'" class="side" role="tablist" aria-label="Buy or sell">
      <button type="button" role="tab" :aria-selected="side === 'buy'" :class="{ on: side === 'buy' }" @click="side = 'buy'">
        Buy {{ service.name }}
      </button>
      <button type="button" role="tab" :aria-selected="side === 'sell'" :class="{ on: side === 'sell' }" @click="side = 'sell'">
        Sell {{ service.name }}
      </button>
    </div>

    <div class="field">
      <label :for="`pc-amt-${active}`">{{ amountLabel }}</label>
      <div class="amt">
        <span v-if="unitPrefix">{{ unitPrefix }}</span>
        <input
          :id="`pc-amt-${active}`"
          v-model.number="amount"
          class="input"
          :class="{ 'input--pad': unitPrefix }"
          type="number"
          min="0"
          inputmode="decimal"
        />
        <em v-if="service.id === 'usdt'">USDT</em>
      </div>
      <small v-if="tooLow" class="warn">Minimum is {{ unitPrefix }}{{ service.min.toLocaleString() }}.</small>
      <small v-else-if="tooHigh" class="warn">Maximum is {{ unitPrefix }}{{ service.max.toLocaleString() }} — contact us for more.</small>
      <small v-else class="hint">Rate: {{ formatMoney(rate) }} per {{ service.kind === 'supplier' ? '¥1' : `1 ${service.unit}` }}</small>
    </div>

    <div v-if="service.kind === 'trade' && service.networks" class="field">
      <label :for="`pc-net-${active}`">Network</label>
      <select :id="`pc-net-${active}`" v-model="network" class="input">
        <option v-for="n in service.networks" :key="n">{{ n }}</option>
      </select>
    </div>
    <div v-if="service.kind === 'supplier'" class="field">
      <label :for="`pc-m-${active}`">Pay supplier via</label>
      <select :id="`pc-m-${active}`" v-model="method" class="input">
        <option v-for="m in service.methods" :key="m">{{ m }}</option>
      </select>
    </div>

    <div class="result">
      <div v-if="service.kind === 'supplier'" class="result__rows">
        <span>Supplier amount</span><b>{{ formatMoney(subtotal) }}</b>
        <span>Service fee</span><b>{{ formatMoney(fee) }}</b>
      </div>
      <div class="result__main">
        <span>{{ resultLabel }}</span>
        <strong>{{ formatMoney(total) }}</strong>
      </div>
    </div>

    <a :href="whatsappHref" target="_blank" rel="noopener" class="btn btn--primary btn--block">
      Continue on WhatsApp <AppIcon name="arrow" :size="18" />
    </a>
    <p class="note">Typical time: {{ service.speed }}. Final rate is confirmed before you pay.</p>
  </div>
</template>

<style scoped>
.pcalc {
  display: grid;
  gap: 16px;
  padding: clamp(20px, 3vw, 28px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  color: var(--ink);
}
.pcalc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.pcalc__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--success);
  background: #e7f6ef;
  padding: 4px 10px;
  border-radius: 999px;
}
.svc {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.svc button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 6px 8px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}
.svc button.on {
  border-color: var(--indigo-500);
  background: var(--indigo-50);
  color: var(--navy-700);
}
.side {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  border-radius: 12px;
  background: var(--surface-alt);
  border: 1px solid var(--line);
}
.side button {
  height: 40px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
}
.side button.on {
  background: #fff;
  color: var(--navy-700);
  box-shadow: var(--shadow-sm);
}
.amt {
  position: relative;
  display: flex;
  align-items: center;
}
.amt span {
  position: absolute;
  left: 14px;
  font-weight: 600;
  color: var(--ink-mute);
}
.amt em {
  position: absolute;
  right: 14px;
  font-style: normal;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-mute);
}
.input--pad {
  padding-left: 30px;
}
.hint {
  color: var(--ink-mute);
}
.warn {
  color: #b42318;
}
.result {
  display: grid;
  gap: 10px;
  padding: 16px 18px;
  border-radius: var(--radius);
  background: var(--indigo-50);
}
.result__rows {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 12px;
  font-size: 14px;
  color: var(--ink-soft);
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--indigo-200);
}
.result__rows b {
  text-align: right;
  font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.result__main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}
.result__main span {
  font-size: 14px;
  color: var(--ink-soft);
}
.result__main strong {
  font-family: var(--font-display);
  font-size: clamp(24px, 4vw, 30px);
  color: var(--navy-700);
  font-variant-numeric: tabular-nums;
}
.note {
  font-size: 12.5px;
  color: var(--ink-mute);
  text-align: center;
}
@media (max-width: 420px) {
  .svc {
    grid-template-columns: 1fr;
  }
}
</style>
