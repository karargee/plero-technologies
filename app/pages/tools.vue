<script setup lang="ts">
const { pages } = useContent()
useSeoMeta({
  title: 'Trading tools',
  description: 'Free position size, profit & loss and Naira converter calculators for Deriv traders.',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">{{ pages.tools.eyebrow }}</span>
        <h1>{{ pages.tools.title }}</h1>
        <p>{{ pages.tools.text }}</p>
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
