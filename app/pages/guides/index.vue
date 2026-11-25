<script setup lang="ts">
import { guides } from '~/data/guides'

useSeoMeta({
  title: 'Guides',
  description: 'Simple guides to opening, verifying, funding and withdrawing from your Deriv account.',
})

const categories = ['All', ...new Set(guides.map((g) => g.category))]
const active = ref('All')
const list = computed(() => (active.value === 'All' ? guides : guides.filter((g) => g.category === active.value)))
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">Guides</span>
        <h1>Learn the basics, step by step.</h1>
        <p>Plain-English guides to opening a Deriv account, moving money in and out, and trading more safely.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="chips" role="tablist" aria-label="Filter guides">
          <button
            v-for="c in categories"
            :key="c"
            type="button"
            role="tab"
            :aria-selected="active === c"
            :class="{ on: active === c }"
            @click="active = c"
          >
            {{ c }}
          </button>
        </div>

        <div class="grid">
          <NuxtLink v-for="g in list" :key="g.slug" :to="`/guides/${g.slug}`" class="guide card">
            <span class="guide__cat">{{ g.category }}</span>
            <h2>{{ g.title }}</h2>
            <p>{{ g.summary }}</p>
            <span class="guide__meta">
              {{ g.minutes }} min read
              <AppIcon name="arrow" :size="18" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <RegisterBand />
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}
.chips button {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  font-weight: 600;
  font-size: 14px;
  color: var(--ink-soft);
  cursor: pointer;
}
.chips button.on {
  background: var(--navy-800);
  border-color: var(--navy-800);
  color: #fff;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.guide {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 26px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.guide:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--indigo-100);
}
.guide__cat {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--indigo-500);
}
.guide h2 {
  font-size: 20px;
}
.guide p {
  flex: 1;
  color: var(--ink-soft);
}
.guide__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  font-size: 14px;
  color: var(--ink-mute);
}
.guide__meta svg {
  color: var(--indigo-500);
}
@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
