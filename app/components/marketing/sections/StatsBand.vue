<template>
  <section v-if="HOME_STATS.length" class="stats stats-band" ref="sectionRef">
    <div class="container">
      <div class="stats-head reveal">
        <p class="eyebrow">PROVEN LIQUIDITY</p>
        <h2 class="stats-title">Numbers backed by verified execution</h2>
        <p class="stats-sub">Over 50,000 Nigerian traders trust Plero for instant settlement and live pricing.</p>
      </div>

      <div class="stats-grid reveal" style="transition-delay:0.15s">
        <div
          v-for="stat in HOME_STATS"
          :key="stat.label"
          class="stat-box panel"
        >
          <p class="stat-val">{{ stat.value }}</p>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME_STATS } from '~/data/site'

const sectionRef = ref<HTMLElement | null>(null)
useReveal(sectionRef)
</script>

<style scoped>
.stats {
  padding-block: clamp(64px, 8vw, 100px);
  border-block: 1px solid var(--hairline);
  background: var(--bg-alt);
}

.stats-head {
  text-align: center;
  max-width: 640px;
  margin-inline: auto;
  margin-bottom: 48px;
}

.stats-title {
  font-family: var(--font-display);
  font-size: clamp(26px, 3.5vw, 38px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  margin-bottom: 12px;
}

.stats-sub {
  font-size: 15px;
  color: var(--muted);
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-box {
  padding: 28px 24px;
  background: var(--glass-surface);
  backdrop-filter: var(--glass-blur-sm);
  -webkit-backdrop-filter: var(--glass-blur-sm);
  border: 1px solid var(--glass-border-glow);
  border-radius: var(--r-lg);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  text-align: center;
  transition: border-color 0.25s var(--ease), transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
}
.stat-box:hover {
  border-color: rgba(255,255,255,0.1);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
}

.stat-val {
  font-family: var(--font-display);
  font-size: clamp(32px, 3.6vw, 44px);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #ffffff;
  margin-bottom: 6px;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--muted-2);
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 500px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

