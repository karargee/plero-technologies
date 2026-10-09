<template>
  <div>
    <section class="head">
      <div class="container head-inner">
        <p class="eyebrow">How it works</p>
        <h1 class="head-title">From card to cash,<br />without the queue.</h1>
        <p class="head-lede">
          Plero removes the agent counter entirely. You submit a card, our system prices and verifies
          it, and your bank gets paid. Here is the whole flow.
        </p>
      </div>
    </section>

    <section class="container flow">
      <article v-for="step in FLOW_STEPS" :key="step.num" class="flow-item reveal" :ref="revealRef">
        <div class="flow-side">
          <span class="flow-num">{{ step.num }}</span>
        </div>
        <div class="flow-body">
          <span class="flow-icon"><AppIcon :name="step.icon" :size="20" /></span>
          <h2 class="flow-title">{{ step.title }}</h2>
          <p class="flow-copy">{{ step.desc }}</p>
          <ul v-if="step.points" class="flow-points">
            <li v-for="point in step.points" :key="point">
              <AppIcon name="check" :size="14" />{{ point }}
            </li>
          </ul>
        </div>
      </article>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head section-head--center">
          <p class="eyebrow">Comparison</p>
          <h2 class="section-title">Agent counter vs Plero.</h2>
        </div>
        <div class="compare panel">
          <div class="compare-row compare-head">
            <span />
            <span>Walk-in agent</span>
            <span class="compare-us">Plero</span>
          </div>
          <div v-for="row in COMPARISON" :key="row.label" class="compare-row">
            <span class="compare-label">{{ row.label }}</span>
            <span class="compare-them">{{ row.them }}</span>
            <span class="compare-us">{{ row.us }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="container faq-wrap">
      <div>
        <p class="eyebrow">Good to know</p>
        <h2 class="section-title">Before you submit.</h2>
      </div>
      <div class="faq">
        <div v-for="item in FLOW_FAQS" :key="item.q" class="faq-item">
          <h3 class="faq-q">{{ item.q }}</h3>
          <p class="faq-a">{{ item.a }}</p>
        </div>
      </div>
    </section>

    <CtaSection
      title="Ready when you are."
      lede="Create a free account and your first trade can be submitted today."
      primary-label="Create free account"
      secondary-label="Browse gift cards"
      secondary-to="/cards"
    />
  </div>
</template>

<script setup lang="ts">
import { COMPARISON, FLOW_FAQS, FLOW_STEPS } from '~/data/site'

const { revealRef } = useReveal()

useHead({ title: 'How it works — Plero Technologies' })
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
  right: -120px;
  background: radial-gradient(circle, rgb(var(--accent-rgb) / 0.14), transparent 70%);
}
.head-inner {
  position: relative;
  z-index: 1;
}
.head-title {
  font-size: clamp(34px, 5.6vw, 62px);
  font-weight: 800;
  letter-spacing: -0.035em;
}
.head-lede {
  margin-top: 18px;
  max-width: 58ch;
  color: var(--muted);
  font-size: 16.5px;
}

.flow {
  display: flex;
  flex-direction: column;
  padding-block: clamp(40px, 6vw, 80px);
}
.flow-item {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: clamp(20px, 3vw, 40px);
  padding-block: clamp(28px, 4vw, 48px);
  border-bottom: 1px solid var(--hairline);
}
.flow-item:last-child {
  border-bottom: 0;
}
.flow-num {
  font-family: var(--font-display);
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.03));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.flow-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  background: var(--primary-soft);
  color: var(--primary-light);
  margin-bottom: 18px;
}
.flow-title {
  font-size: clamp(20px, 2.4vw, 27px);
  font-weight: 700;
  letter-spacing: -0.025em;
}
.flow-copy {
  margin-top: 12px;
  max-width: 62ch;
  color: var(--muted);
  font-size: 15.5px;
  line-height: 1.75;
}
.flow-points {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}
.flow-points li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 13px;
  border-radius: var(--r-full);
  background: var(--surface);
  border: 1px solid var(--hairline);
  font-size: 13px;
  color: var(--muted);
}
.flow-points :deep(.icon) {
  color: var(--accent);
}

.compare {
  overflow: hidden;
}
.compare-row {
  display: grid;
  grid-template-columns: 1.1fr 1fr 1fr;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--hairline);
  font-size: 15px;
  align-items: center;
}
.compare-row:last-child {
  border-bottom: 0;
}
.compare-head {
  background: var(--bg-alt);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted-3);
}
.compare-head .compare-us {
  color: var(--primary-light);
}
.compare-label {
  font-weight: 600;
}
.compare-them {
  color: var(--muted-3);
}
.compare-us {
  color: var(--text);
  font-weight: 500;
}

.faq-wrap {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: clamp(28px, 4vw, 64px);
  padding-block: clamp(56px, 8vw, 104px);
  align-items: start;
}
.faq {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.faq-q {
  font-size: 16.5px;
  font-weight: 600;
  margin-bottom: 8px;
}
.faq-a {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.75;
}

@media (max-width: 860px) {
  .flow-item,
  .faq-wrap {
    grid-template-columns: 1fr;
  }
  .compare-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px 16px;
  }
  .compare-row > :first-child {
    grid-column: 1 / -1;
  }
  .compare-head {
    display: none;
  }
}
</style>
