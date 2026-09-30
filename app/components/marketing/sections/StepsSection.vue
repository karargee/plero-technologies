<template>
  <section class="section section--alt">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">How it works</p>
        <h2 class="section-title">Three steps, under fifteen minutes.</h2>
      </div>

      <ol class="steps">
        <li
          v-for="(step, index) in STEPS"
          :key="step.num"
          class="step reveal"
          :ref="revealRef"
          :style="{ transitionDelay: `${index * 80}ms` }"
        >
          <span class="step-index">{{ step.num }}</span>
          <span class="step-icon"><AppIcon :name="step.icon" :size="22" /></span>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-copy">{{ step.desc }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { STEPS } from '~/data/site'

const { revealRef } = useReveal()
</script>

<style scoped>
.steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.step {
  position: relative;
  padding: 30px 26px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  overflow: hidden;
}
.step-index {
  position: absolute;
  top: 14px;
  right: 20px;
  font-family: var(--font-display);
  font-size: 60px;
  font-weight: 800;
  line-height: 1;
  color: rgba(255, 255, 255, 0.045);
}
.step-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: var(--r-md);
  background: var(--primary-soft);
  color: var(--primary-light);
  margin-bottom: 20px;
}
.step-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}
.step-copy {
  font-size: 14.5px;
  color: var(--muted-2);
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .steps {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 720px) {
  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
