<template>
  <section class="section section--alt">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Trusted daily</p>
        <h2 class="section-title">What traders say.</h2>
      </div>

      <div class="quote-grid">
        <figure
          v-for="(item, index) in TESTIMONIALS"
          :key="item.name"
          class="testimonial reveal"
          :ref="revealRef"
          :style="{ transitionDelay: `${index * 80}ms` }"
        >
          <div class="stars">
            <AppIcon v-for="star in 5" :key="star" name="star" :size="14" fill />
          </div>
          <blockquote>“{{ item.quote }}”</blockquote>
          <figcaption>
            <span class="avatar">{{ item.initials }}</span>
            <span>
              <b>{{ item.name }}</b>
              <small>{{ item.role }}</small>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TESTIMONIALS } from '~/data/site'

const { revealRef } = useReveal()
</script>

<style scoped>
.quote-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.testimonial {
  margin: 0;
  padding: 28px 26px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
}
.stars {
  display: flex;
  gap: 3px;
  color: var(--gold);
  margin-bottom: 16px;
}
.testimonial blockquote {
  margin: 0 0 20px;
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--text);
}
.testimonial figcaption {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(140deg, var(--primary), var(--violet));
  font-size: 12.5px;
  font-weight: 700;
}
.testimonial b {
  display: block;
  font-size: 14px;
  font-weight: 600;
}
.testimonial small {
  font-size: 12px;
  color: var(--muted-3);
}

@media (max-width: 1024px) {
  .quote-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 720px) {
  .quote-grid {
    grid-template-columns: 1fr;
  }
}
</style>
