<script setup lang="ts">
import { deriv } from '~/data/site'
</script>

<template>
  <section class="hero">
    <div class="hero__glow" aria-hidden="true" />
    <div class="container hero__grid">
      <div class="hero__copy">
        <span class="hero__badge"><AppIcon name="shield" :size="15" /> Deriv payment agent</span>
        <h1>Fund &amp; withdraw your Deriv account in <span>Naira</span>.</h1>
        <p>
          Plero Technologies tops up your Deriv account in minutes and pays out your withdrawals straight
          to your bank — with clear rates and a real person on WhatsApp.
        </p>
        <div class="hero__actions">
          <NuxtLink to="/deriv" class="btn btn--light">Deposit or withdraw <AppIcon name="arrow" :size="18" /></NuxtLink>
          <a :href="deriv.signupUrl" target="_blank" rel="noopener" class="btn btn--ghost-dark">Register on Deriv</a>
        </div>
        <ul class="hero__points">
          <li><AppIcon name="check" :size="18" /> Funded in {{ deriv.speed }}</li>
          <li><AppIcon name="check" :size="18" /> Fixed, published rates</li>
          <li><AppIcon name="check" :size="18" /> Live Deriv charts</li>
        </ul>
      </div>

      <div class="hero__calc">
        <AgentCalculator />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, var(--navy-900) 0%, var(--navy-800) 55%, var(--indigo-600) 140%);
  color: #fff;
  padding-block: clamp(56px, 8vw, 104px);
}
.hero__glow {
  position: absolute;
  inset: auto -20% -60% auto;
  width: 900px;
  height: 900px;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(108 112 209 / 0.45), transparent 60%);
  pointer-events: none;
}
.hero__glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgb(255 255 255 / 0.18) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(circle, #000 20%, transparent 60%);
}
.hero__grid {
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: clamp(36px, 6vw, 72px);
}
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
  border: 1px solid rgb(255 255 255 / 0.15);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--indigo-200);
}
h1 {
  margin-top: 22px;
  font-size: clamp(36px, 5.6vw, 62px);
  font-weight: 800;
  letter-spacing: -0.03em;
}
h1 span {
  background: linear-gradient(90deg, #b9bcff, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero__copy > p {
  margin-top: 20px;
  max-width: 540px;
  font-size: clamp(17px, 2vw, 19px);
  color: rgb(255 255 255 / 0.75);
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}
.hero__points {
  list-style: none;
  padding: 0;
  margin: 32px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  font-size: 14.5px;
  color: rgb(255 255 255 / 0.8);
}
.hero__points li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.hero__points svg {
  color: #8ee0b9;
}
@media (max-width: 960px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }
  .hero__calc {
    max-width: 480px;
  }
}
</style>
