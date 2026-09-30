<template>
  <div>
    <section class="head">
      <span class="glow-orb orb" aria-hidden="true" />
      <div class="container head-inner">
        <p class="eyebrow">About</p>
        <h1 class="head-title">We build the plumbing, not the queues.</h1>
        <p class="head-lede">
          Plero Technologies exists because trading a gift card in Nigeria still means standing in
          line, guessing at a rate, and hoping the slip in your pocket is a record of anything. We
          replaced that with priced, logged, auditable settlement.
        </p>
      </div>
    </section>

    <section class="container stats">
      <div v-for="stat in ABOUT_STATS" :key="stat.label" class="stat">
        <p class="stat-val">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head section-head--center">
          <p class="eyebrow">What we hold to</p>
          <h2 class="section-title">Four principles, applied literally.</h2>
        </div>
        <div class="grid">
          <article
            v-for="(principle, index) in PRINCIPLES"
            :key="principle.title"
            class="item reveal"
            :ref="revealRef"
            :style="{ transitionDelay: `${index * 70}ms` }"
          >
            <span class="item-icon"><AppIcon :name="principle.icon" :size="20" /></span>
            <h3 class="item-title">{{ principle.title }}</h3>
            <p class="item-copy">{{ principle.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="container split">
      <div>
        <p class="eyebrow">Trajectory</p>
        <h2 class="section-title">From one desk to a market.</h2>
        <p class="split-copy">
          Plero started as a small settlement desk solving one problem: traders losing margin to stale
          rates and unrecorded trades. Automating the pricing feed came first, verification came next,
          and the platform you can use today is the result.
        </p>
        <p class="split-copy">
          The roadmap is deliberately unglamorous — more brands, tighter settlement windows, better
          rate transparency. None of it needs to be revolutionary to be worth doing properly.
        </p>
      </div>
      <ol class="timeline">
        <li
          v-for="(milestone, index) in MILESTONES"
          :key="milestone.year + milestone.title"
          class="tl-item reveal"
          :ref="revealRef"
          :style="{ transitionDelay: `${index * 60}ms` }"
        >
          <span class="tl-year">{{ milestone.year }}</span>
          <div>
            <p class="tl-title">{{ milestone.title }}</p>
            <p class="tl-copy">{{ milestone.desc }}</p>
          </div>
        </li>
      </ol>
    </section>

    <CtaSection
      title="Trade on the live number."
      lede="Create a free account and settle your first card today."
      primary-label="Get started"
      secondary-label="See how it works"
      secondary-to="/how-it-works"
    />
  </div>
</template>

<script setup lang="ts">
import { ABOUT_STATS, MILESTONES, PRINCIPLES } from '~/data/site'

const { revealRef } = useReveal()

useHead({ title: 'About — Plero Technologies' })
</script>

<style scoped>
.head {
  position: relative;
  overflow: hidden;
  padding-block: clamp(48px, 7vw, 96px);
  border-bottom: 1px solid var(--hairline);
}
.orb {
  width: 520px;
  height: 420px;
  top: -220px;
  left: -140px;
  background: radial-gradient(circle, rgb(var(--primary-rgb) / 0.14), transparent 70%);
}
.head-inner {
  position: relative;
  z-index: 1;
}
.head-title {
  font-size: clamp(34px, 5.6vw, 62px);
  font-weight: 800;
  letter-spacing: -0.035em;
  max-width: 20ch;
}
.head-lede {
  margin-top: 18px;
  max-width: 62ch;
  color: var(--muted);
  font-size: 16.5px;
  line-height: 1.75;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-block: clamp(40px, 5vw, 64px);
}
.stat {
  padding: 16px 20px;
  text-align: center;
  border-right: 1px solid var(--hairline);
}
.stat:last-child {
  border-right: 0;
}
.stat-val {
  font-family: var(--font-display);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.035em;
}
.stat-label {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted-2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.item {
  padding: 28px 26px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
}
.item-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  background: var(--primary-soft);
  color: var(--primary-light);
  margin-bottom: 18px;
}
.item-title {
  font-size: 16.5px;
  font-weight: 600;
  margin-bottom: 8px;
}
.item-copy {
  font-size: 14.5px;
  color: var(--muted-2);
  line-height: 1.7;
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 72px);
  padding-block: clamp(56px, 8vw, 104px);
  align-items: start;
}
.split-copy {
  margin-top: 16px;
  color: var(--muted);
  font-size: 15.5px;
  line-height: 1.75;
}
.timeline {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 26px;
  border-left: 1px solid var(--hairline);
  padding-left: 26px;
}
.tl-item {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 14px;
  position: relative;
}
.tl-item::before {
  content: '';
  position: absolute;
  left: -31px;
  top: 8px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 0 4px rgb(var(--primary-rgb) / 0.16);
}
.tl-year {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted-2);
  padding-top: 2px;
}
.tl-title {
  font-weight: 600;
  font-size: 15.5px;
}
.tl-copy {
  margin-top: 4px;
  font-size: 14.5px;
  color: var(--muted-2);
  line-height: 1.7;
}

@media (max-width: 860px) {
  .split {
    grid-template-columns: 1fr;
  }
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 560px) {
  .stats {
    grid-template-columns: 1fr;
  }
  .stat {
    border-right: 0;
    border-bottom: 1px solid var(--hairline);
  }
  .stat:last-child {
    border-bottom: 0;
  }
}
</style>
