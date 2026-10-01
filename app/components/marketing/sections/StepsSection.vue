<template>
  <section class="ssc" ref="sectionRef">
    <div class="ssc__inner container">
      <h2 class="ssc__header reveal">Get started in 3 simple steps</h2>
      <div class="ssc__track" ref="trackRef">
        <div
          v-for="(step, i) in STEPS"
          :key="step.num"
          class="ssc__card"
          :class="`ssc__card--${COLORS[i]}`"
          :style="{ zIndex: i + 1, top: `calc(var(--ssc-top) + ${i} * var(--ssc-peek))` }"
        >
          <div class="ssc__card-content">
            <p class="ssc__num">{{ step.num }}</p>
            <h3 class="ssc__title">{{ step.title }}</h3>
            <p class="ssc__desc">{{ step.desc }}</p>
          </div>
          <div class="ssc__card-visual">
            <span class="ssc__icon"><AppIcon :name="step.icon" :size="48" /></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { STEPS } from '~/data/site'

const COLORS = ['light', 'coral', 'dark']
const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
useReveal(sectionRef)
</script>

<style scoped>
.ssc {
  padding-block: clamp(64px, 9vw, 116px);
  background: var(--bg-alt);
  border-block: 1px solid var(--hairline);
}
.ssc__inner {
  position: relative;
}
.ssc__header {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: clamp(40px, 6vw, 72px);
  text-align: center;
}
.ssc__track {
  --ssc-top: calc(var(--nav-h) + 24px);
  --ssc-peek: 18px;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.ssc__card {
  position: sticky;
  border-radius: var(--r-xl);
  padding: clamp(32px, 5vw, 56px);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 32px;
  margin-bottom: 16px;
  transition: transform 0.4s var(--ease);
}
.ssc__card--light {
  background: #f0f0f5;
  color: #0b0b0f;
}
.ssc__card--coral {
  background: var(--primary);
  color: #fff;
}
.ssc__card--dark {
  background: #0e0e14;
  color: var(--text);
  border: 1px solid var(--hairline);
}
.ssc__num {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 12px;
}
.ssc__title {
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 14px;
}
.ssc__desc {
  font-size: 16px;
  line-height: 1.7;
  opacity: 0.7;
  max-width: 48ch;
}
.ssc__icon {
  display: grid;
  place-items: center;
  width: 100px;
  height: 100px;
  border-radius: 28px;
  background: rgba(0,0,0,0.08);
  opacity: 0.6;
  flex-shrink: 0;
}
.ssc__card--dark .ssc__icon {
  background: rgba(255,255,255,0.06);
}

@media (max-width: 640px) {
  .ssc__card {
    grid-template-columns: 1fr;
  }
  .ssc__icon { display: none; }
}
</style>
