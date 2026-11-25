<script setup lang="ts">
import { testimonials } from '~/data/site'
</script>

<template>
  <section v-if="testimonials.length" class="section section--alt">
    <div class="container">
      <div v-reveal class="section-head section-head--center">
        <span class="eyebrow">Customers</span>
        <h2 class="section-title">What people say about trading with us</h2>
      </div>

      <div class="grid">
        <figure v-for="(t, i) in testimonials" :key="i" v-reveal="i * 120" v-spotlight class="quote card">
          <div class="quote__stars" aria-label="5 out of 5 stars">
            <AppIcon v-for="n in 5" :key="n" name="star" :size="16" />
          </div>
          <blockquote>“{{ t.quote }}”</blockquote>
          <figcaption>
            <span class="quote__avatar" aria-hidden="true">{{ t.name.charAt(0) }}</span>
            <span>
              <strong>{{ t.name }}</strong>
              <small>{{ t.role }}</small>
            </span>
          </figcaption>
        </figure>
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
.quote {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.quote:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}
.quote::after {
  content: '\201C';
  position: absolute;
  top: 6px;
  right: 22px;
  font-family: Georgia, serif;
  font-size: 96px;
  line-height: 1;
  color: var(--indigo-100);
  pointer-events: none;
}
.quote__stars {
  display: flex;
  gap: 2px;
  color: #f5b301;
}
.quote__stars :deep(path) {
  fill: currentColor;
}
blockquote {
  margin: 0;
  flex: 1;
  font-size: 16.5px;
  color: var(--ink);
}
figcaption {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
figcaption > span:last-child {
  display: grid;
  line-height: 1.3;
}
small {
  color: var(--ink-mute);
}
.quote__avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--indigo-100);
  color: var(--indigo-600);
  font-weight: 700;
}
@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr;
    max-width: 620px;
    margin-inline: auto;
  }
}
</style>
