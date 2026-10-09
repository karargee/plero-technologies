<template>
  <section class="section steps-section" ref="sectionRef">
    <div class="container">
      <div class="section-head section-head--center reveal">
        <p class="eyebrow">HOW IT WORKS</p>
        <h2 class="section-title">Get started in 3 simple steps</h2>
        <p class="section-lede">
          From registration to funds cleared in your Nigerian bank account in under 15 minutes.
        </p>
      </div>

      <div class="steps-grid reveal" style="transition-delay:0.15s">
        <div
          v-for="step in STEPS"
          :key="step.num"
          class="step-card panel"
        >
          <div class="step-card-top">
            <span class="step-index">{{ step.num }}</span>
            <div class="step-icon-tile">
              <AppIcon :name="step.icon" :size="20" />
            </div>
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { STEPS } from '~/data/site'

const sectionRef = ref<HTMLElement | null>(null)
useReveal(sectionRef)
</script>

<style scoped>
.steps-section {
  padding-block: clamp(64px, 8vw, 110px);
  border-top: 1px solid var(--hairline);
  background: var(--bg);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 40px;
}

.step-card {
  padding: 32px 28px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.step-card:hover {
  border-color: #3b4254;
  transform: translateY(-2px);
}

.step-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.step-index {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--primary);
  background: rgba(255, 68, 79, 0.08);
  padding: 4px 10px;
  border-radius: var(--r-sm);
  border: 1px solid rgba(255, 68, 79, 0.2);
}

.step-icon-tile {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  color: var(--text);
}

.step-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
  margin-bottom: 12px;
}

.step-desc {
  font-size: 14.5px;
  color: var(--muted);
  line-height: 1.65;
}

@media (max-width: 860px) {
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .step-card {
    padding: 24px 20px;
  }
}
</style>

