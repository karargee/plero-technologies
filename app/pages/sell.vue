<template>
  <div class="page">
    <AppPageHeader title="Sell a gift card" :back-to="step > 1 ? undefined : '/home'" @back="back" />

    <ol class="steps">
      <li v-for="(label, index) in STEP_LABELS" :key="label" class="step" :class="{ 'step--on': step >= index + 1 }">
        <span class="step-dot">
          <AppIcon v-if="step > index + 1" name="check" :size="13" />
          <template v-else>{{ index + 1 }}</template>
        </span>
        {{ label }}
      </li>
    </ol>

    <!-- 1 · Choose the card -->
    <div v-if="step === 1" class="grid">
      <button
        v-for="card in CARDS"
        :key="card.id"
        class="card-btn"
        :style="{ '--accent-card': card.color }"
        type="button"
        @click="select(card.id)"
      >
        <CardMark :card="card" />
        <p class="card-name">{{ card.name }}</p>
        <p class="card-rate">{{ format(card.sellRate) }}/$</p>
      </button>
    </div>

    <!-- 2 · Amount -->
    <div v-else-if="step === 2 && selectedCard" class="form">
      <SelectedCardRow
        :card="selectedCard"
        :rate="format(selectedCard.sellRate)"
        @change="step = 1"
      />

      <p class="label">Denomination</p>
      <div class="denoms">
        <button
          v-for="value in selectedCard.denominations"
          :key="value"
          class="denom"
          :class="{ 'denom--on': Number(amount) === value }"
          type="button"
          @click="amount = value"
        >
          ${{ value }}
        </button>
      </div>

      <p class="label">Or enter a custom amount</p>
      <input v-model="amount" type="number" min="1" inputmode="numeric" placeholder="Amount in USD" class="input-field" />

      <div class="payout">
        <span>You receive</span>
        <b>₦{{ payout }}</b>
      </div>

      <button class="btn btn-red btn-block btn-lg" type="button" :disabled="!amount" @click="step = 3">
        Continue
        <AppIcon name="arrow" :size="17" />
      </button>
    </div>

    <!-- 3 · Submit -->
    <div v-else-if="step === 3 && selectedCard" class="form">
      <SelectedCardRow
        :card="selectedCard"
        :rate="`Payout ₦${payout}`"
        :title="`${selectedCard.name} — $${amount}`"
        :highlight="true"
        @change="step = 2"
      />

      <p class="label">Card code or PIN</p>
      <textarea v-model="code" rows="4" class="input-field code" placeholder="Enter the code exactly as printed on the card" />

      <p class="label">Card image <span class="muted-2">(optional, speeds up review)</span></p>
      <button class="upload" type="button">
        <AppIcon name="scan" :size="20" />
        Tap to attach a photo
      </button>

      <button class="btn btn-red btn-block btn-lg" type="button" :disabled="!code.trim()" @click="submitted = true">
        Submit for review
      </button>
    </div>

    <SellConfirmation
      v-if="submitted && selectedCard"
      :card-name="selectedCard.name"
      :amount="String(amount)"
      :payout="payout"
    />
  </div>
</template>

<script setup lang="ts">
import { CARDS, getCard } from '~/data/cards'

definePageMeta({ layout: 'app' })

const router = useRouter()
const { liveRate, format } = useDerivRate()

const STEP_LABELS = ['Card', 'Amount', 'Submit'] as const

const step = ref(1)
const selectedId = ref<string | null>(null)
const amount = ref<string | number>('')
const code = ref('')
const submitted = ref(false)

const selectedCard = computed(() => (selectedId.value ? getCard(selectedId.value) : undefined))

const payout = computed(() => {
  const card = selectedCard.value
  if (!card || Number(amount.value) <= 0) return '0.00'
  return (Number(amount.value) * card.sellRate * liveRate.value).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const select = (id: string) => {
  selectedId.value = id
  amount.value = ''
  step.value = 2
}

const back = () => {
  if (step.value > 1) step.value -= 1
  else router.push('/home')
}
</script>

<style scoped>
.steps {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 18px 0 6px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--muted-3);
  transition: color 0.2s;
}
.step--on {
  color: var(--text);
}
.step-dot {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface-3);
  color: var(--muted-2);
  font-size: 13px;
  font-weight: 700;
}
.step--on .step-dot {
  background: linear-gradient(140deg, var(--primary-light), var(--primary-dark));
  color: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 18px 20px 0;
}
.card-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 18px 12px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  transition: all 0.22s var(--ease);
}
.card-btn:hover {
  border-color: color-mix(in srgb, var(--accent-card) 50%, transparent);
  background: var(--surface-2);
  transform: translateY(-2px);
}
.card-name {
  font-size: 13.5px;
  font-weight: 600;
  text-align: center;
}
.card-rate {
  font-size: 12px;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px 0;
}
.form .label {
  margin-top: 6px;
}

.denoms {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.denom {
  padding: 9px 17px;
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1px solid var(--hairline);
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s var(--ease);
}
.denom--on {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary-light);
}
.code {
  resize: none;
  font-family: var(--font-mono);
  font-size: 14px;
}
.upload {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  border-radius: var(--r-md);
  border: 1.5px dashed var(--hairline-strong);
  color: var(--muted-2);
  font-size: 14px;
  transition: all 0.2s;
}
.upload:hover {
  border-color: var(--primary);
  color: var(--text);
}
.payout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 17px;
  border-radius: var(--r-md);
  background: var(--accent-soft);
  border: 1px solid rgba(0, 167, 158, 0.24);
  font-size: 14.5px;
  color: var(--muted);
}
.payout b {
  font-family: var(--font-display);
  font-size: 21px;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
</style>
