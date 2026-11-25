<script setup lang="ts">
useSeoMeta({
  title: 'Trading tools',
  description: 'Free position size, profit & loss and Naira converter calculators for Deriv traders.',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">Tools</span>
        <h1>Free calculators for Deriv traders.</h1>
        <p>Size your trades, check your profit or loss, and plan deposits and withdrawals in Naira.</p>
      </div>
    </section>

    <section class="section">
      <div class="container tools">
        <PositionSizeCalc v-reveal:left v-spotlight />
        <ProfitCalc v-reveal:right v-spotlight />
        <NairaConverter v-reveal v-spotlight class="tools__wide" />
      </div>
      <div class="container">
        <p class="risk">
          These tools are for planning only and are not financial advice. Trading derivatives is high-risk and you can
          lose the money you invest.
        </p>
      </div>
    </section>

    <RegisterBand />
  </div>
</template>

<style scoped>
.tools {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
.tools__wide {
  grid-column: 1 / -1;
}
.risk {
  margin-top: 28px;
  font-size: 13px;
  color: var(--ink-mute);
}
@media (max-width: 900px) {
  .tools {
    grid-template-columns: 1fr;
  }
}
</style>
