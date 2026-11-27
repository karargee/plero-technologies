<script setup lang="ts">
const { guides } = useContent()

const items = computed(() => [
  { to: '/tools', icon: 'chart', title: 'Trading tools', body: 'Position size, profit & loss and Naira converter calculators.' },
  { to: '/guides', icon: 'cards', title: `${guides.value.length} beginner guides`, body: 'Open, verify, fund and withdraw from your Deriv account.' },
  { to: '/markets', icon: 'bolt', title: 'Live charts', body: '17 Deriv markets streaming live, with open/closed status.' },
])
</script>

<template>
  <section class="section section--alt">
    <div class="container">
      <div v-reveal class="section-head section-head--center">
        <span class="eyebrow">Free resources</span>
        <h2 class="section-title">Everything you need to trade with confidence</h2>
      </div>
      <div class="grid">
        <NuxtLink v-for="(i, n) in items" :key="i.to" v-reveal="n * 110" v-spotlight :to="i.to" class="res card">
          <span class="res__icon"><AppIcon :name="i.icon" /></span>
          <h3>{{ i.title }}</h3>
          <p>{{ i.body }}</p>
          <span class="res__go">Open <AppIcon name="arrow" :size="16" /></span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.res {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 26px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.res:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--indigo-100);
}
.res__icon {
  display: inline-grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: var(--navy-800);
  color: #fff;
  margin-bottom: 8px;
}
h3 {
  font-size: 19px;
}
p {
  flex: 1;
  color: var(--ink-soft);
}
.res__go {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-weight: 600;
  color: var(--indigo-500);
}
@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
