<script setup lang="ts">
import { features } from '~/data/site'
</script>

<template>
  <section class="section">
    <div class="container">
      <div v-reveal class="section-head section-head--center">
        <span class="eyebrow">Why Plero</span>
        <h2 class="section-title">Built to make selling gift cards simple</h2>
        <p class="section-lead">Fair rates, fast payouts and people who actually answer when you need them.</p>
      </div>

      <div class="grid">
        <article v-for="f in features" :key="f.title" v-reveal class="feature card">
          <span class="feature__icon"><AppIcon :name="f.icon" /></span>
          <h3>{{ f.title }}</h3>
          <p>{{ f.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature {
  padding: 28px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.feature:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--indigo-100);
}
.feature__icon {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--indigo-50);
  color: var(--indigo-500);
}
h3 {
  margin-top: 20px;
  font-size: 19px;
}
p {
  margin-top: 8px;
  color: var(--ink-soft);
}
@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
