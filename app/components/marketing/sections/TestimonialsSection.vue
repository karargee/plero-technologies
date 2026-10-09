<template>
  <section class="section testimonials section--alt" ref="sectionRef">
    <div class="container">
      <div class="section-head section-head--center reveal">
        <p class="eyebrow">TRADER STORIES</p>
        <h2 class="section-title">What our traders say</h2>
        <p class="section-lede">Rated 4.8/5 by over 50,000 active traders across Lagos, Abuja, Port Harcourt and beyond.</p>
      </div>

      <div class="quote-grid reveal" style="transition-delay:0.15s">
        <div
          v-for="item in TESTIMONIALS"
          :key="item.name"
          class="review-card panel"
        >
          <div class="review-stars" aria-label="5 stars">
            <svg v-for="n in 5" :key="n" viewBox="0 0 20 20" width="16" height="16" fill="#00a767">
              <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32L2.27 6.62l5.34-.78z"/>
            </svg>
            <span class="verified-tag">✓ Verified Trade</span>
          </div>

          <p class="review-quote">"{{ item.quote }}"</p>

          <div class="review-footer">
            <div class="review-avatar">{{ item.initials }}</div>
            <div>
              <p class="review-author">{{ item.name }}</p>
              <p class="review-role">{{ item.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TESTIMONIALS } from '~/data/site'

const sectionRef = ref<HTMLElement | null>(null)
useReveal(sectionRef)
</script>

<style scoped>
.testimonials {
  padding-block: clamp(64px, 8vw, 110px);
  border-top: 1px solid var(--hairline);
  background: var(--bg);
}

.quote-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 40px;
}

.review-card {
  padding: 30px 26px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.review-card:hover {
  border-color: #3b4254;
  transform: translateY(-2px);
}

.review-stars {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 18px;
}

.verified-tag {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  background: rgba(0, 167, 103, 0.1);
  padding: 2px 7px;
  border-radius: var(--r-xs);
}

.review-quote {
  font-size: 15px;
  color: var(--text);
  line-height: 1.65;
  margin-bottom: 24px;
  font-style: italic;
}

.review-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--hairline);
}

.review-avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  font-weight: 700;
  font-size: 13px;
  color: var(--primary);
}

.review-author {
  font-size: 14.5px;
  font-weight: 700;
  color: #fff;
}

.review-role {
  font-size: 12px;
  color: var(--muted-2);
}

@media (max-width: 900px) {
  .quote-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>

