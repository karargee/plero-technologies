<script setup lang="ts">
const { home } = useContent()
const { deriv } = useRates()

const points = [
  { icon: 'bolt', title: 'Deposit in minutes', body: 'Send Naira, trade on Deriv shortly after.' },
  { icon: 'bank', title: 'Withdraw to your bank', body: 'Any Nigerian bank account, paid out fast.' },
  { icon: 'chart', title: 'Watch markets live', body: 'Real-time Deriv prices, right on our site.' },
]
</script>

<template>
  <section class="section show">
    <div class="show__bg" aria-hidden="true" />
    <div class="container show__grid">
      <div v-reveal:zoom class="show__phone">
        <PhoneMockup />
      </div>
      <div>
        <span v-reveal class="eyebrow">{{ home.showcase.eyebrow }}</span>
        <h2 v-reveal="60" class="section-title">{{ home.showcase.title }}</h2>
        <p v-reveal="120" class="section-lead">{{ home.showcase.text }}</p>
        <ul class="show__list">
          <li v-for="(p, i) in points" :key="p.title" v-reveal:right="180 + i * 90">
            <span class="show__icon"><AppIcon :name="p.icon" /></span>
            <span>
              <b>{{ p.title }}</b>
              <small>{{ p.body }}</small>
            </span>
          </li>
        </ul>
        <div v-reveal="460" class="show__cta">
          <NuxtLink to="/deriv" class="btn btn--primary">Get started <AppIcon name="arrow" :size="18" /></NuxtLink>
          <a :href="deriv.signupUrl" target="_blank" rel="noopener" class="btn btn--ghost">Register on Deriv</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.show {
  position: relative;
  overflow: hidden;
}
.show__bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(600px 400px at 20% 50%, var(--indigo-50), transparent 70%);
  pointer-events: none;
}
.show__grid {
  position: relative;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: clamp(40px, 6vw, 80px);
  align-items: center;
}
.show__list {
  list-style: none;
  margin: 28px 0 0;
  padding: 0;
  display: grid;
  gap: 14px;
}
.show__list li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px 18px;
  border-radius: var(--radius);
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
}
.show__list b {
  display: block;
}
.show__list small {
  color: var(--ink-soft);
  font-size: 14.5px;
}
.show__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--indigo-500), var(--navy-700));
  color: #fff;
}
.show__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}
@media (max-width: 900px) {
  .show__grid {
    grid-template-columns: 1fr;
  }
  .show__phone {
    order: 2;
  }
}
</style>
