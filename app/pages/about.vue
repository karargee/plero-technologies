<script setup lang="ts">
useSeoMeta({
  title: 'About us',
  description: 'Plero Technologies is a Deriv payment agent helping traders deposit and withdraw in Naira.',
})

const values = [
  { icon: 'chart', title: 'Honest pricing', body: 'We publish our rates openly and stick to them.' },
  { icon: 'bolt', title: 'Speed matters', body: 'Your time is valuable, so we pay out as fast as we can verify.' },
  { icon: 'shield', title: 'Trust first', body: 'We protect your data and treat every trade with care.' },
]
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">About</span>
        <h1>We make moving money in and out of Deriv simple.</h1>
        <p>
          Plero Technologies is a Deriv payment agent. We started with a simple idea: funding or withdrawing
          from your trading account should be as easy and as trustworthy as sending a bank transfer.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container story">
        <div v-reveal class="story__img">
          <img src="/images/team.avif" alt="A customer completing a purchase at a shop counter" loading="lazy" />
        </div>
        <div v-reveal>
          <span class="eyebrow">Our story</span>
          <h2 class="section-title">Fair rates, real people, fast transfers</h2>
          <p class="section-lead">
            Too many traders struggle to fund their Deriv accounts locally — unclear rates, slow transfers,
            or agents who disappear. We built Plero to fix that.
          </p>
          <p class="story__body">
            Every deposit and withdrawal runs through Deriv's own payment agent system, our rates are
            published openly, and our support team is a real group of people you can message any time. We
            also buy gift cards, with the same honest treatment.
          </p>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div v-reveal class="section-head section-head--center">
          <span class="eyebrow">What we stand for</span>
          <h2 class="section-title">Our values</h2>
        </div>
        <div class="values">
          <article v-for="v in values" :key="v.title" v-reveal class="card value">
            <span class="value__icon"><AppIcon :name="v.icon" /></span>
            <h3>{{ v.title }}</h3>
            <p>{{ v.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <StatsBand />
    <CtaSection />
  </div>
</template>

<style scoped>
.story {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
}
.story__img {
  position: relative;
}
.story__img img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
.story__img::after {
  content: '';
  position: absolute;
  inset: auto -14px -14px auto;
  width: 45%;
  height: 45%;
  z-index: -1;
  border-radius: var(--radius-lg);
  background: var(--indigo-100);
}
.story__body {
  margin-top: 16px;
  color: var(--ink-soft);
}
.values {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.value {
  padding: 28px;
  text-align: center;
}
.value__icon {
  display: inline-grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--indigo-50);
  color: var(--indigo-500);
}
.value h3 {
  margin-top: 16px;
  font-size: 19px;
}
.value p {
  margin-top: 8px;
  color: var(--ink-soft);
}
@media (max-width: 860px) {
  .story,
  .values {
    grid-template-columns: 1fr;
  }
}
</style>
