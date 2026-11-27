<script setup lang="ts">

const props = withDefaults(defineProps<{ initialCard?: string }>(), { initialCard: 'apple' })
const { cards } = useRates()
const { site } = useContent()

const cardId = ref(props.initialCard)
const amount = ref<number | null>(100)

const card = computed(() => cards.value.find((c) => c.id === cardId.value) ?? cards.value[0]!)
const tooLow = computed(() => amount.value != null && amount.value > 0 && amount.value < card.value.min)
const tooHigh = computed(() => amount.value != null && amount.value > card.value.max)
const payout = computed(() => {
  if (!amount.value || amount.value <= 0 || tooLow.value || tooHigh.value) return 0
  return amount.value * card.value.rate
})
const whatsappHref = computed(() => {
  const text = `Hi Plero, I'd like to sell a $${amount.value ?? 0} ${card.value.name} gift card.`
  return `${site.value.contact.whatsapp}?text=${encodeURIComponent(text)}`
})
</script>

<template>
  <div class="calc card">
    <div class="calc__head">
      <h3>Rate calculator</h3>
      <span class="calc__live"><i /> Today's rates</span>
    </div>

    <div class="field">
      <label for="calc-card">Gift card</label>
      <div class="calc__select">
        <CardMark :name="card.name" :color="card.color" :size="30" />
        <select id="calc-card" v-model="cardId" class="input">
          <option v-for="c in cards" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
    </div>

    <div class="field">
      <label for="calc-amount">Card value (USD)</label>
      <div class="calc__amount">
        <span>$</span>
        <input
          id="calc-amount"
          v-model.number="amount"
          class="input"
          type="number"
          inputmode="decimal"
          min="0"
          placeholder="100"
        />
      </div>
      <small v-if="tooLow" class="calc__warn">Minimum for this card is ${{ card.min }}.</small>
      <small v-else-if="tooHigh" class="calc__warn">Maximum for this card is ${{ card.max }}.</small>
      <small v-else class="calc__hint">Rate: {{ formatMoney(card.rate) }} per $1</small>
    </div>

    <div class="calc__result">
      <span>You receive</span>
      <strong>{{ formatMoney(payout) }}</strong>
    </div>

    <a :href="whatsappHref" target="_blank" rel="noopener" class="btn btn--primary btn--block">
      Start this trade <AppIcon name="arrow" :size="18" />
    </a>
    <p class="calc__note">Rates update during the day. Final payout is confirmed before you send.</p>
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
.calc__live {
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
.calc__live i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}
.calc__select,
.calc__amount {
  position: relative;
  display: flex;
  align-items: center;
}
.calc__select :deep(.mark) {
  position: absolute;
  left: 9px;
  pointer-events: none;
}
.calc__select select {
  padding-left: 50px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%2377778f' stroke-width='1.8'%3E%3Cpath d='m1 1 5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
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
  font-size: 12.5px;
  color: var(--ink-mute);
  text-align: center;
}
</style>
