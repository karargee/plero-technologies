<script setup lang="ts">
import { cards } from '~/data/site'
const top = cards.slice(0, 6)
</script>

<template>
  <section class="section">
    <div class="container teaser">
      <div v-reveal>
        <span class="eyebrow">Also from Plero</span>
        <h2 class="section-title">Sell your unused gift cards</h2>
        <p class="section-lead">
          Got an Apple, Amazon, Steam or other gift card you won't use? We buy those too — and pay to your
          bank.
        </p>
        <NuxtLink to="/gift-cards" class="btn btn--ghost teaser__btn">
          See gift card rates <AppIcon name="arrow" :size="18" />
        </NuxtLink>
      </div>
      <ul v-reveal class="teaser__list">
        <li v-for="c in top" :key="c.id" class="card">
          <CardMark :name="c.name" :color="c.color" :size="36" />
          <span>{{ c.name }}</span>
          <strong>{{ formatMoney(c.rate) }}/$</strong>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.teaser {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
}
.teaser__btn {
  margin-top: 28px;
}
.teaser__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.teaser__list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  font-size: 14.5px;
  font-weight: 500;
}
.teaser__list span {
  flex: 1;
  min-width: 0;
}
.teaser__list strong {
  font-variant-numeric: tabular-nums;
  color: var(--navy-700);
  font-size: 14px;
}
@media (max-width: 860px) {
  .teaser {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 480px) {
  .teaser__list {
    grid-template-columns: 1fr;
  }
}
</style>
