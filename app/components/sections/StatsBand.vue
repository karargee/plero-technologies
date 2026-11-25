<script setup lang="ts">
import { stats } from '~/data/site'
</script>

<template>
  <section v-if="stats.length" class="stats">
    <div class="container stats__grid">
      <div v-for="(s, i) in stats" :key="s.label" v-reveal="i * 90" class="stat">
        <strong><CountUp :value="s.value" /></strong>
        <span>{{ s.label }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats {
  padding-block: 48px;
  border-bottom: 1px solid var(--line);
}
.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.stat {
  display: grid;
  gap: 4px;
  text-align: center;
}
.stat + .stat {
  border-left: 1px solid var(--line);
}
strong {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 38px);
  color: var(--navy-700);
}
.stat > span {
  font-size: 14.5px;
  color: var(--ink-mute);
}
@media (max-width: 720px) {
  .stats__grid {
    grid-template-columns: 1fr 1fr;
    row-gap: 32px;
  }
  .stat:nth-child(3) {
    border-left: 0;
  }
}
</style>
