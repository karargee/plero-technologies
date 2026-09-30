<template>
  <div class="done">
    <span class="done-icon"><AppIcon name="check" :size="30" /></span>
    <h2 class="done-title">Order submitted</h2>
    <p class="done-copy">
      We're verifying the card now. You'll get a notification the moment payout is released.
    </p>

    <div class="panel done-card">
      <div class="done-row"><span>Card</span><b>{{ cardName }}</b></div>
      <div class="done-row"><span>Amount</span><b>${{ amount }}</b></div>
      <div class="done-row"><span>Payout</span><b class="accent">₦{{ payout }}</b></div>
      <div class="done-row"><span>Status</span><b>Verifying</b></div>
    </div>

    <NuxtLink to="/orders" class="btn btn-soft btn-block">Track this order</NuxtLink>
    <NuxtLink to="/home" class="btn btn-red btn-block">Back to dashboard</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cardName: string
  amount: string
  payout: string
}>()
</script>

<style scoped>
.done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 48px 20px 60px;
  text-align: center;
}
.done-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
}
.done-title {
  font-size: 24px;
  font-weight: 700;
}
.done-copy {
  font-size: 14.5px;
  color: var(--muted-2);
  max-width: 36ch;
  line-height: 1.65;
}
.done-card {
  width: 100%;
  max-width: 380px;
  text-align: left;
}
.done-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid var(--hairline);
  font-size: 14px;
  color: var(--muted-2);
}
.done-row:last-child {
  border-bottom: 0;
}
.done-row b {
  color: var(--text);
  font-weight: 600;
}
.accent {
  color: var(--accent) !important;
}
.done .btn {
  max-width: 380px;
}
</style>
