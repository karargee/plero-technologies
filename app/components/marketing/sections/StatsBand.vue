<template>
  <section class="stats-band">
    <div class="container stats-grid">
      <div v-for="stat in HOME_STATS" :key="stat.label" class="stat">
        <p class="stat-val">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME_STATS } from '~/data/site'
</script>

<style scoped>
.stats-band {
  border-bottom: 1px solid var(--hairline);
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.stat {
  padding: 34px 24px;
  text-align: center;
  border-right: 1px solid var(--hairline);
}
.stat:last-child {
  border-right: 0;
}
.stat-val {
  font-family: var(--font-display);
  font-size: clamp(26px, 3.2vw, 38px);
  font-weight: 800;
  letter-spacing: -0.035em;
}
.stat-label {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted-2);
}

@media (max-width: 720px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .stat {
    border-right: 0;
    border-bottom: 1px solid var(--hairline);
  }
  .stat:last-child {
    border-bottom: 0;
  }
}
</style>
