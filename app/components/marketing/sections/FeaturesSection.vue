<template>
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Why Plero</p>
        <h2 class="section-title">Built like infrastructure, priced like a market.</h2>
      </div>

      <div class="feature-grid">
        <article
          v-for="(feature, index) in FEATURES"
          :key="feature.title"
          class="feature reveal"
          :ref="revealRef"
          :style="{ transitionDelay: `${(index % 3) * 70}ms` }"
        >
          <span class="feature-icon"><AppIcon :name="feature.icon" :size="21" /></span>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-copy">{{ feature.desc }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FEATURES } from '~/data/site'

const { revealRef } = useReveal()
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.feature {
  padding: 28px 26px;
  border-radius: var(--r-lg);
  border: 1px solid var(--hairline);
  background: linear-gradient(180deg, var(--surface), var(--bg-alt));
  transition: transform 0.28s var(--ease), border-color 0.28s;
}
.feature:hover {
  transform: translateY(-3px);
  border-color: var(--hairline-strong);
}
.feature-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  background: var(--surface-3);
  border: 1px solid var(--hairline);
  color: var(--text);
  margin-bottom: 18px;
}
.feature-title {
  font-size: 16.5px;
  font-weight: 600;
  margin-bottom: 8px;
}
.feature-copy {
  font-size: 14.5px;
  color: var(--muted-2);
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 720px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
