<script setup lang="ts">

const props = withDefaults(defineProps<{ initial?: 'deposit' | 'withdraw' }>(), { initial: 'deposit' })
const { deriv } = useRates()
const { site } = useContent()
const type = ref<'deposit' | 'withdraw'>(props.initial)
const amount = ref<number | null>(50)

const rate = computed(() => (type.value === 'deposit' ? deriv.value.depositRate : deriv.value.withdrawRate))
const tooLow = computed(() => amount.value != null && amount.value > 0 && amount.value < deriv.value.min)
const tooHigh = computed(() => amount.value != null && amount.value > deriv.value.max)
const naira = computed(() => {
  if (!amount.value || amount.value <= 0 || tooLow.value || tooHigh.value) return 0
  return amount.value * rate.value
})
const whatsappHref = computed(() => {
  const text =
    type.value === 'deposit'
      ? `Hi Plero, I want to deposit $${amount.value ?? 0} to my Deriv account. My Deriv ID (CR number) is: `
      : `Hi Plero, I have withdrawn $${amount.value ?? 0} from Deriv to you. My bank details are: `
  return `${site.value.contact.whatsapp}?text=${encodeURIComponent(text)}`
})
</script>

<template>
  <div class="calc card">
    <div class="calc__head">
      <h3>Deriv rate calculator</h3>
      <span class="calc__badge">Payment agent</span>
    </div>

    <div class="tabs" role="tablist" aria-label="Transaction type">
      <button
        type="button"
        role="tab"
        :aria-selected="type === 'deposit'"
        :class="{ on: type === 'deposit' }"
        @click="type = 'deposit'"
      >
        Deposit
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="type === 'withdraw'"
        :class="{ on: type === 'withdraw' }"
        @click="type = 'withdraw'"
      >
        Withdraw
      </button>
    </div>

    <div class="field">
      <label for="agent-amount">{{ type === 'deposit' ? 'Amount to add to Deriv (USD)' : 'Amount withdrawn from Deriv (USD)' }}</label>
      <div class="calc__amount">
        <span>$</span>
        <input
          id="agent-amount"
          v-model.number="amount"
          class="input"
          type="number"
          inputmode="decimal"
          min="0"
          placeholder="50"
        />
      </div>
      <small v-if="tooLow" class="calc__warn">Minimum is ${{ deriv.min }}.</small>
      <small v-else-if="tooHigh" class="calc__warn">Maximum is ${{ deriv.max.toLocaleString() }} per transaction.</small>
      <small v-else class="calc__hint">Rate: {{ formatMoney(rate) }} per $1</small>
    </div>

    <div class="calc__result">
      <span>{{ type === 'deposit' ? 'You pay' : 'You receive' }}</span>
      <strong>{{ formatMoney(naira) }}</strong>
    </div>

    <a :href="whatsappHref" target="_blank" rel="noopener" class="btn btn--primary btn--block">
      {{ type === 'deposit' ? 'Deposit now' : 'Request payout' }} <AppIcon name="arrow" :size="18" />
    </a>
    <p class="calc__note">
      No Deriv account?
      <a :href="deriv.signupUrl" target="_blank" rel="noopener">Register free on Deriv</a>
    </p>
  </div>
</template>

<style scoped>
.calc {
  display: grid;
  gap: 18px;
  padding: clamp(20px, 3vw, 28px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  color: var(--ink);
}
.calc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.calc__head h3 {
  font-size: 20px;
}
.calc__badge {
  font-size: 12px;
  font-weight: 600;
  color: var(--indigo-600);
  background: var(--indigo-50);
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  border-radius: 12px;
  background: var(--surface-alt);
  border: 1px solid var(--line);
}
.tabs button {
  height: 40px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.tabs button.on {
  background: #fff;
  color: var(--navy-700);
  box-shadow: var(--shadow-sm);
}
.calc__amount {
  position: relative;
  display: flex;
  align-items: center;
}
.calc__amount span {
  position: absolute;
  left: 14px;
  font-weight: 600;
  color: var(--ink-mute);
}
.calc__amount input {
  padding-left: 28px;
}
.calc__hint {
  color: var(--ink-mute);
}
.calc__warn {
  color: #b42318;
}
.calc__result {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-radius: var(--radius);
  background: var(--indigo-50);
}
.calc__result span {
  font-size: 14px;
  color: var(--ink-soft);
}
.calc__result strong {
  font-family: var(--font-display);
  font-size: clamp(24px, 4vw, 30px);
  color: var(--navy-700);
  font-variant-numeric: tabular-nums;
}
.calc__note {
  font-size: 13.5px;
  color: var(--ink-mute);
  text-align: center;
}
.calc__note a {
  color: var(--indigo-500);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
