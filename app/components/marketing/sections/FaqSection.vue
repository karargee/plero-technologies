<template>
  <component
    :is="embedded ? 'div' : 'section'"
    :class="['faq-root', !embedded && 'section container', { 'faq-root--embedded': embedded }]"
  >
    <div v-if="!embedded" class="section-head">
      <p class="eyebrow">FAQ</p>
      <h2 class="section-title">Questions, answered.</h2>
    </div>

    <div class="faq">
      <div v-for="(item, index) in items" :key="item.q" class="faq-item" :class="{ 'faq-item--open': open === index }">
        <button class="faq-q" :aria-expanded="open === index" @click="open = open === index ? -1 : index">
          {{ item.q }}
          <AppIcon name="chevron" :size="18" class="faq-chevron" />
        </button>
        <Transition name="faq">
          <p v-if="open === index" class="faq-a">{{ item.a }}</p>
        </Transition>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { FaqItem } from '~/types'

withDefaults(defineProps<{ items: FaqItem[]; embedded?: boolean }>(), {
  items: () => [],
  embedded: false,
})

/** First entry starts open so the block never reads as an empty list. */
const open = ref(0)
</script>

<style scoped>
.faq-root {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
}
.faq-root--embedded {
  display: block;
}

.faq {
  border-top: 1px solid var(--hairline);
}
.faq-item {
  border-bottom: 1px solid var(--hairline);
}
.faq-q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 2px;
  text-align: left;
  font-family: var(--font-display);
  font-size: 16.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text);
}
.faq-chevron {
  color: var(--muted-2);
  transition: transform 0.28s var(--ease), color 0.28s;
}
.faq-item--open .faq-chevron {
  transform: rotate(180deg);
  color: var(--primary);
}
.faq-a {
  padding: 0 44px 24px 2px;
  font-size: 15px;
  line-height: 1.75;
  color: var(--muted);
}
.faq-enter-active,
.faq-leave-active {
  transition: opacity 0.22s var(--ease), transform 0.22s var(--ease);
}
.faq-enter-from,
.faq-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 900px) {
  .faq-root {
    grid-template-columns: 1fr;
  }
}
</style>
