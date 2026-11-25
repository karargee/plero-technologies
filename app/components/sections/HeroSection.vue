<script setup lang="ts">
import { deriv } from '~/data/site'
</script>

<template>
  <section class="hero">
    <!-- Background layers -->
    <div class="hero__photo" aria-hidden="true" />
    <div class="hero__aurora" aria-hidden="true">
      <span class="a1" />
      <span class="a2" />
      <span class="a3" />
    </div>
    <div class="hero__grid-lines" aria-hidden="true" />
    <svg class="hero__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 80 C 240 120 480 20 720 50 S 1200 110 1440 40 V120 H0Z" fill="currentColor" />
    </svg>

    <div class="container hero__grid">
      <div class="hero__copy">
        <span class="hero__badge in" style="--d: 0s">
          <span class="dot" /> Deriv payment agent · Nigeria
        </span>
        <h1 class="in" style="--d: 0.08s">
          Fund &amp; withdraw your Deriv account in <span class="shine">Naira</span>.
        </h1>
        <p class="in" style="--d: 0.16s">
          Plero Technologies tops up your Deriv account in minutes and pays out your withdrawals straight
          to your bank — with clear rates and a real person on WhatsApp.
        </p>
        <div class="hero__actions in" style="--d: 0.24s">
          <NuxtLink to="/deriv" class="btn btn--light">Deposit or withdraw <AppIcon name="arrow" :size="18" /></NuxtLink>
          <a :href="deriv.signupUrl" target="_blank" rel="noopener" class="btn btn--ghost-dark">Register on Deriv</a>
        </div>
        <ul class="hero__points in" style="--d: 0.32s">
          <li><AppIcon name="check" :size="18" /> Funded in {{ deriv.speed }}</li>
          <li><AppIcon name="check" :size="18" /> Fixed, published rates</li>
          <li><AppIcon name="check" :size="18" /> Live Deriv charts</li>
        </ul>
      </div>

      <div class="hero__calc in" style="--d: 0.2s">
        <div class="chip chip--1" aria-hidden="true">
          <span class="chip__icon chip__icon--green"><AppIcon name="bolt" :size="16" /></span>
          <span><b>Fast funding</b><small>{{ deriv.speed }}</small></span>
        </div>
        <div class="chip chip--2" aria-hidden="true">
          <span class="chip__icon"><AppIcon name="shield" :size="16" /></span>
          <span><b>Deriv cashier</b><small>Official agent system</small></span>
        </div>
        <div class="chip chip--3" aria-hidden="true">
          <span class="chip__icon chip__icon--amber"><AppIcon name="bank" :size="16" /></span>
          <span><b>Naira payouts</b><small>Any Nigerian bank</small></span>
        </div>
        <div class="hero__ring" aria-hidden="true" />
        <AgentCalculator />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: linear-gradient(160deg, var(--navy-950) 0%, var(--navy-900) 45%, var(--navy-800) 100%);
  color: #fff;
  padding-block: clamp(56px, 8vw, 110px) clamp(96px, 11vw, 150px);
}

/* Lagos photo, very faint, for depth */
.hero__photo {
  position: absolute;
  inset: 0;
  z-index: -3;
  background: url('/images/lagos-aerial.webp') center 40% / cover no-repeat;
  opacity: 0.16;
  mix-blend-mode: luminosity;
  mask-image: linear-gradient(90deg, transparent 0%, #000 55%, #000 100%);
}

/* Moving colour blobs */
.hero__aurora {
  position: absolute;
  inset: 0;
  z-index: -2;
  filter: blur(70px);
  opacity: 0.85;
}
.hero__aurora span {
  position: absolute;
  border-radius: 50%;
  animation: aurora 20s ease-in-out infinite;
}
.a1 {
  width: 520px;
  height: 520px;
  right: 5%;
  top: -12%;
  background: rgb(108 112 209 / 0.55);
}
.a2 {
  width: 420px;
  height: 420px;
  right: 28%;
  bottom: -20%;
  background: rgb(61 63 147 / 0.6);
  animation-delay: -7s !important;
  animation-duration: 24s !important;
}
.a3 {
  width: 300px;
  height: 300px;
  left: -6%;
  top: 30%;
  background: rgb(46 189 133 / 0.18);
  animation-delay: -13s !important;
  animation-duration: 28s !important;
}

/* Faint perspective grid */
.hero__grid-lines {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: linear-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 70% 60% at 70% 40%, #000 10%, transparent 70%);
}

/* Soft wave into the next section */
.hero__wave {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  width: 100%;
  height: clamp(40px, 6vw, 90px);
  color: var(--navy-950);
}

.hero__grid {
  position: relative;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: clamp(40px, 6vw, 80px);
}

/* Entrance animation */
.in {
  animation: rise-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--d, 0s);
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 16px 7px 12px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.07);
  border: 1px solid rgb(255 255 255 / 0.14);
  backdrop-filter: blur(8px);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--indigo-200);
}
.dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2ebd85;
}
.dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid #2ebd85;
  animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
h1 {
  margin-top: 22px;
  font-size: clamp(38px, 5.8vw, 66px);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.05;
}
.shine {
  background: linear-gradient(90deg, #b9bcff 0%, #ffffff 25%, #8ee0b9 50%, #b9bcff 75%, #ffffff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmer 6s linear infinite;
}
.hero__copy > p {
  margin-top: 22px;
  max-width: 540px;
  font-size: clamp(17px, 2vw, 19px);
  color: rgb(255 255 255 / 0.75);
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}
.hero__points {
  list-style: none;
  padding: 0;
  margin: 34px 0 0;
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

/* Calculator + floating chips */
.hero__calc {
  position: relative;
}
.hero__calc :deep(.calc) {
  position: relative;
  z-index: 2;
  box-shadow: 0 40px 80px -30px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(255 255 255 / 0.08);
}
.hero__ring {
  position: absolute;
  inset: -18px;
  z-index: 1;
  border-radius: 34px;
  background: conic-gradient(from 0deg, transparent, rgb(108 112 209 / 0.6), transparent 30%, transparent 60%, rgb(142 224 185 / 0.45), transparent);
  filter: blur(18px);
  opacity: 0.7;
  animation: spin 12s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.chip {
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px 10px 10px;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.92);
  color: var(--ink);
  box-shadow: 0 18px 40px -16px rgb(0 0 0 / 0.5);
  backdrop-filter: blur(10px);
  white-space: nowrap;
}
.chip b {
  display: block;
  font-size: 13px;
  line-height: 1.2;
}
.chip small {
  display: block;
  font-size: 11.5px;
  color: var(--ink-mute);
}
.chip__icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--indigo-50);
  color: var(--indigo-500);
}
.chip__icon--green {
  background: #e7f6ef;
  color: var(--success);
}
.chip__icon--amber {
  background: #fff4dc;
  color: #b7791f;
}
.chip--1 {
  top: -26px;
  left: -48px;
  animation: float 6s ease-in-out infinite;
}
.chip--2 {
  top: 42%;
  right: -56px;
  animation: float-x 7s ease-in-out infinite;
  animation-delay: -2s;
}
.chip--3 {
  bottom: -24px;
  left: -32px;
  animation: float 8s ease-in-out infinite;
  animation-delay: -4s;
}

@media (max-width: 1180px) {
  .chip--2 {
    right: -20px;
  }
  .chip--1 {
    left: -16px;
  }
  .chip--3 {
    left: -8px;
  }
}
@media (max-width: 960px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }
  .hero__calc {
    max-width: 480px;
  }
  .hero__photo {
    mask-image: linear-gradient(180deg, transparent 0%, #000 60%);
  }
}
@media (max-width: 600px) {
  .chip {
    display: none;
  }
  .hero__ring {
    inset: -8px;
  }
}
</style>
