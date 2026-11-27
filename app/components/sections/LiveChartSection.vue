<script setup lang="ts">
const { home } = useContent()
const symbol = ref('R_75')
</script>

<template>
  <section class="section">
    <div class="container live">
      <div v-reveal:left class="live__copy">
        <span class="eyebrow">{{ home.live.eyebrow }}</span>
        <h2 class="section-title">{{ home.live.title }}</h2>
        <p class="section-lead">{{ home.live.text }}</p>
        <NuxtLink to="/markets" class="btn btn--primary live__btn">
          Open full charts <AppIcon name="arrow" :size="18" />
        </NuxtLink>
      </div>
      <div v-reveal:right="120" class="live__chart">
        <DerivChart v-model:symbol="symbol" compact :height="300" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.live {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: center;
}
.live__btn {
  margin-top: 28px;
}
.live__chart {
  min-width: 0;
}
@media (max-width: 960px) {
  .live {
    grid-template-columns: 1fr;
  }
}
</style>
