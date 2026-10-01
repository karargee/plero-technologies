<template>
  <section class="stats">
    <div class="container stats__inner">
      <div class="stats__text">
        <h2 class="stats__title">Trade with confidence</h2>
        <p class="stats__sub">Plero is built on live market data and verified settlement — no guesswork, no agents.</p>
      </div>

      <div class="stats__card">
        <div class="stats__track">
          <div class="stats__fade stats__fade--top" aria-hidden="true" />
          <div class="stats__fade stats__fade--bottom" aria-hidden="true" />
          <div
            v-for="(stat, i) in HOME_STATS"
            :key="stat.label"
            class="stats__stat"
            :class="{ 'stats__stat--active': activeIndex === i }"
            :aria-hidden="activeIndex !== i"
          >
            <span class="stats__val">{{ stat.value }}</span>
            <span class="stats__label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME_STATS } from '~/data/site'

const activeIndex = ref(0)

onMounted(() => {
  const timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % HOME_STATS.length
  }, 2800)
  onBeforeUnmount(() => clearInterval(timer))
})
</script>

<style scoped>
.stats {
  padding-block: clamp(64px, 9vw, 116px);
  border-block: 1px solid var(--hairline);
}
.stats__inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 64px;
  align-items: center;
}
.stats__title {
  font-size: clamp(26px, 3.5vw, 40px);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 14px;
}
.stats__sub {
  font-size: 16px;
  color: var(--muted);
  max-width: 44ch;
  line-height: 1.7;
}

/* Slot machine card */
.stats__card {
  width: 220px;
  height: 120px;
  position: relative;
  overflow: hidden;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  flex-shrink: 0;
}
.stats__track {
  position: relative;
  width: 100%;
  height: 100%;
}
.stats__fade {
  position: absolute;
  left: 0;
  right: 0;
  height: 36px;
  z-index: 2;
  pointer-events: none;
}
.stats__fade--top {
  top: 0;
  background: linear-gradient(to bottom, var(--surface), transparent);
}
.stats__fade--bottom {
  bottom: 0;
  background: linear-gradient(to top, var(--surface), transparent);
}
.stats__stat {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transform: translateY(110%);
  opacity: 0;
  transition: transform 0.7s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1);
}
.stats__stat--active {
  transform: translateY(0);
  opacity: 1;
}
.stats__val {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}
.stats__label {
  font-size: 13px;
  color: var(--muted-2);
  text-align: center;
}

@media (max-width: 720px) {
  .stats__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .stats__card {
    width: 100%;
  }
}
</style>
