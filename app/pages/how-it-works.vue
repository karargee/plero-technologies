<script setup lang="ts">
useSeoMeta({
  title: 'How it works',
  description: 'How to sell a gift card with Plero Technologies in four simple steps.',
})

const tips = [
  'Take a clear, well-lit photo where the full code is readable.',
  'Include the receipt for physical cards when you have it.',
  'Do not share the card code with anyone else before or after the trade.',
  'Double-check your bank details — payouts go exactly where you tell us.',
]
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">How it works</span>
        <h1>Selling a gift card takes about as long as reading this page.</h1>
        <p>Here's exactly what happens from the moment you check a rate to the moment you get paid.</p>
      </div>
    </section>

    <StepsSection :show-link="false" />

    <section class="section">
      <div class="container tips">
        <div v-reveal>
          <span class="eyebrow">Tips</span>
          <h2 class="section-title">Get paid even faster</h2>
          <p class="section-lead">A few small things that help our trade desk verify your card in seconds.</p>
          <NuxtLink to="/rates" class="btn btn--primary tips__btn">Check rates <AppIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <ul v-reveal class="tips__list">
          <li v-for="t in tips" :key="t" class="card">
            <span><AppIcon name="check" :size="18" /></span>
            {{ t }}
          </li>
        </ul>
      </div>
    </section>

    <FaqSection alt />
    <CtaSection />
  </div>
</template>

<style scoped>
.tips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 80px);
  align-items: center;
}
.tips__btn {
  margin-top: 28px;
}
.tips__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}
.tips__list li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
}
.tips__list span {
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e7f6ef;
  color: var(--success);
}
@media (max-width: 860px) {
  .tips {
    grid-template-columns: 1fr;
  }
}
</style>
