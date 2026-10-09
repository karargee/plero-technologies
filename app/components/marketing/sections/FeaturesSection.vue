<template>
  <section class="section fs" ref="sectionRef">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">THE PLERO ADVANTAGE</p>
        <h2 class="section-title">
          Built for speed, engineered for <span class="title-accent">security.</span>
        </h2>
        <p class="section-lede">
          Institutional features designed to provide traders, cardholders, and merchants with the best execution and liquidity in West Africa.
        </p>
      </div>

      <div class="feature-grid reveal reveal-stagger" style="transition-delay:0.15s">
        <div
          v-for="feature in FEATURES"
          :key="feature.title"
          class="feature-card panel"
        >
          <div class="feature-icon-wrap">
            <AppIcon :name="feature.icon" :size="22" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FEATURES } from '~/data/site'

const sectionRef = ref<HTMLElement | null>(null)
useReveal(sectionRef)
</script>

<style scoped>
.fs {
  padding-block: clamp(64px, 8vw, 110px);
  border-top: 1px solid var(--hairline);
  background: var(--bg-alt);
}

.title-accent {
  color: var(--primary);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 36px;
}

.feature-card {
  padding: 28px 24px;
  background: var(--glass-surface);
  backdrop-filter: var(--glass-blur-sm);
  -webkit-backdrop-filter: var(--glass-blur-sm);
  border: 1px solid var(--glass-border-glow);
  border-radius: var(--r-lg);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  transition: border-color 0.25s var(--ease), transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
}
.feature-card:hover {
  border-color: rgba(255,255,255,0.1);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
}

.feature-icon-wrap {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  background: rgba(255, 68, 79, 0.08);
  border: 1px solid rgba(255, 68, 79, 0.2);
  color: var(--primary);
  margin-bottom: 20px;
}

.feature-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
  margin-bottom: 10px;
}

.feature-desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.65;
}

@media (max-width: 900px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 560px) {
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .feature-card {
    padding: 22px 20px;
  }
  .feature-icon-wrap {
    margin-bottom: 14px;
  }
}
</style>

