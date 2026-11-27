<script setup lang="ts">
const { faqs, home } = useContent()
withDefaults(defineProps<{ alt?: boolean }>(), { alt: false })
</script>

<template>
  <section id="faq" class="section" :class="{ 'section--alt': alt }">
    <div class="container faq">
      <div v-reveal class="section-head">
        <span class="eyebrow">{{ home.faq.eyebrow }}</span>
        <h2 class="section-title">{{ home.faq.title }}</h2>
        <p class="section-lead">
          {{ home.faq.text }}
          <NuxtLink to="/support" class="faq__link">Contact support →</NuxtLink>
        </p>
      </div>

      <div v-reveal class="faq__list">
        <details v-for="(f, i) in faqs" :key="f.q" class="faq__item" :open="i === 0">
          <summary>
            {{ f.q }}
            <span class="faq__plus" aria-hidden="true" />
          </summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: clamp(32px, 6vw, 80px);
  align-items: start;
}
.faq__link {
  color: var(--indigo-500);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.faq__list {
  display: grid;
  gap: 12px;
}
.faq__item {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.faq__item[open] {
  border-color: var(--indigo-200);
  box-shadow: var(--shadow-sm);
}
summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker {
  display: none;
}
.faq__plus {
  position: relative;
  flex: none;
  width: 14px;
  height: 14px;
}
.faq__plus::before,
.faq__plus::after {
  content: '';
  position: absolute;
  inset: 6px 0 auto;
  height: 2px;
  border-radius: 2px;
  background: var(--indigo-500);
  transition: transform 0.2s ease;
}
.faq__plus::after {
  transform: rotate(90deg);
}
.faq__item[open] .faq__plus::after {
  transform: rotate(0);
}
.faq__item p {
  padding: 0 22px 20px;
  color: var(--ink-soft);
}
@media (max-width: 860px) {
  .faq {
    grid-template-columns: 1fr;
  }
  .section-head {
    margin-bottom: 0;
  }
}
</style>
