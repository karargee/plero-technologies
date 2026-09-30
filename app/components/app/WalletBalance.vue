<template>
  <div class="balance">
    <div class="balance-top">
      <p class="balance-label">Wallet balance</p>
      <span class="badge">
        <span class="live-dot" :class="{ 'live-dot--off': !connected }" />
        {{ connected ? 'Deriv live' : 'Offline' }}
      </span>
    </div>

    <p class="balance-value">
      <span class="balance-cur">₦</span>{{ formatted }}
    </p>
    <p v-if="rate" class="balance-rate">Live rate $1 = ₦{{ rate.toLocaleString('en-NG') }}</p>

    <div class="balance-actions">
      <NuxtLink to="/sell" class="btn btn-white btn-block">
        <AppIcon name="send" :size="16" /> Sell a card
      </NuxtLink>
      <NuxtLink to="/buy" class="btn btn-block balance-ghost">
        <AppIcon name="card" :size="16" /> Buy a card
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  connected: boolean
  rate: number | null
  balance: string | null
}>()

const formatted = computed(() =>
  props.balance
    ? Number(props.balance).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00',
)
</script>

<style scoped>
.balance {
  margin: 18px 20px 0;
  padding: 24px;
  border-radius: var(--r-xl);
  background: linear-gradient(140deg, var(--primary-light), var(--primary) 45%, var(--primary-deep));
  box-shadow: 0 20px 50px -24px rgb(var(--primary-rgb) / 0.7);
}
.balance-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.balance-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.78);
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border-radius: var(--r-full);
  background: rgba(0, 0, 0, 0.22);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}
.balance-value {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.035em;
  margin-top: 10px;
  font-variant-numeric: tabular-nums;
}
.balance-cur {
  font-size: 24px;
  margin-right: 3px;
  opacity: 0.75;
}
.balance-rate {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.72);
  margin-top: 2px;
}
.balance-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 22px;
}
.balance-ghost {
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.24);
}
.balance-ghost:hover {
  background: rgba(0, 0, 0, 0.32);
}
</style>
