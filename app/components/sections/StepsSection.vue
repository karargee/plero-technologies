<script setup lang="ts">
import { steps } from '~/data/site'
withDefaults(defineProps<{ showLink?: boolean }>(), { showLink: true })
</script>

<template>
  <section class="section section--dark steps">
    <div class="container">
      <div v-reveal class="section-head">
        <span class="eyebrow">How it works</span>
        <h2 class="section-title">From gift card to bank account in four steps</h2>
        <p class="section-lead">No app to install and no account needed for your first trade.</p>
      </div>

      <ol class="steps__list">
        <li v-for="(s, i) in steps" :key="s.title" v-reveal class="step">
          <span class="step__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.body }}</p>
        </li>
      </ol>

      <NuxtLink v-if="showLink" to="/how-it-works" class="btn btn--ghost-dark steps__link">
        Learn more <AppIcon name="arrow" :size="18" />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.steps {
  background: radial-gradient(800px 400px at 0% 100%, rgb(76 79 166 / 0.35), transparent 60%), var(--navy-900);
}
.steps__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  counter-reset: step;
}
.step {
  position: relative;
  padding: 28px 24px;
  border-radius: var(--radius);
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.1);
}
.step__num {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--indigo-200);
  letter-spacing: 0.08em;
}
.step h3 {
  margin-top: 28px;
  font-size: 20px;
}
.step p {
  margin-top: 8px;
  color: rgb(255 255 255 / 0.7);
}
.steps__link {
  margin-top: 40px;
}
@media (max-width: 960px) {
  .steps__list {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 560px) {
  .steps__list {
    grid-template-columns: 1fr;
  }
}
</style>
