<template>
  <section class="hero" ref="heroRef">
    <!-- Full-bleed background image -->
    <div class="hero-bg" aria-hidden="true">
      <img src="/hero-image.avif" alt="" class="hero-bg-img" loading="eager" decoding="async" />
      <div class="hero-bg-overlay" />
    </div>

    <!-- Ambient orbs -->
    <span class="orb orb-a" aria-hidden="true" />
    <span class="orb orb-b" aria-hidden="true" />

    <div class="container hero-inner">
      <div class="hero-copy">
        <p class="hero-badge reveal chip chip--neon">
          <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
          {{ hasLiveRate ? 'Live Deriv rates · streaming now' : 'Rates updating · reconnecting' }}
        </p>

        <h1 class="hero-title reveal" style="transition-delay:0.08s">
          Trade your<br />
          <span class="grad-text">digital assets.</span>
        </h1>

        <p class="hero-lede reveal" style="transition-delay:0.16s">
          Plero is the fastest way to convert gift cards, Deriv USD and crypto into naira.
          Live market rates, verified settlement, and payouts straight to your bank in minutes.
        </p>

        <div class="btn-row reveal" style="transition-delay:0.24s">
          <NuxtLink to="/register" class="btn-grad btn-lg">
            Start trading free
            <AppIcon name="arrow" :size="18" />
          </NuxtLink>
          <NuxtLink to="/rates" class="btn-glass btn-lg">
            <AppIcon name="trend" :size="18" />
            See live rates
          </NuxtLink>
        </div>

        <ul class="hero-trust reveal" style="transition-delay:0.32s">
          <li v-for="item in HERO_TRUST" :key="item">
            <AppIcon name="check" :size="15" />
            {{ item }}
          </li>
        </ul>
      </div>

      <div class="hero-visual reveal" style="transition-delay:0.2s">
        <span class="ring-orb" aria-hidden="true" />

        <div ref="quoteRef" class="quote-card glass glass-hover neon-border">
          <span class="glow-spot" aria-hidden="true" />
          <div class="quote-head">
            <p class="quote-label">USD / NGN</p>
            <span class="chip chip--neon">
              <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
              {{ hasLiveRate ? 'Live' : 'Cached' }}
            </span>
          </div>
          <p class="quote-rate grad-text">₦{{ liveRate.toLocaleString('en-NG') }}</p>
          <p class="quote-sub">per $1 · source: {{ rateSource }}</p>

          <ul class="quote-list">
            <li v-for="card in featured" :key="card.id" class="quote-row">
              <CardMark :card="card" size="sm" />
              <div class="quote-meta">
                <p class="quote-name">{{ card.name }}</p>
                <p class="quote-cat">{{ card.eta }} payout</p>
              </div>
              <p class="quote-val">{{ format(card.sellRate) }}</p>
            </li>
          </ul>

          <NuxtLink to="/cards" class="btn-glass btn-block quote-cta">
            Browse all gift cards
            <AppIcon name="arrow" :size="16" />
          </NuxtLink>
        </div>

        <div class="float-card glass glass-hover">
          <span class="icon-tile icon-float">
            <AppIcon name="bolt" :size="16" />
          </span>
          <div>
            <p class="float-value">₦144,000</p>
            <p class="float-label">$100 Deriv · settled in 6 min</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom fade into next section -->
    <div class="hero-fade" aria-hidden="true" />
  </section>
</template>

<script setup lang="ts">
import { getFeaturedCards } from '~/data/cards'
import { HERO_TRUST } from '~/data/site'

const { liveRate, hasLiveRate, rateSource, format } = useDerivRate()
const featured = getFeaturedCards()

const heroRef = ref<HTMLElement | null>(null)
const { el: quoteRef, bind } = useSpotlight()

useReveal(heroRef)

onMounted(() => bind(quoteRef.value))
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding-block: calc(var(--nav-h) + clamp(48px, 7vw, 96px)) clamp(80px, 10vw, 140px);
}

/* ── Full-bleed background ─────────────────────────── */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  mix-blend-mode: luminosity;
  opacity: 0.28;
}
.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 40%, rgb(var(--neon-2-rgb) / 0.12), transparent 65%),
    radial-gradient(ellipse 60% 80% at 20% 60%, rgb(var(--neon-4-rgb) / 0.08), transparent 65%),
    linear-gradient(to bottom, rgb(8 8 10 / 0.3) 0%, rgb(8 8 10 / 0.6) 60%, rgb(8 8 10 / 1) 100%);
}

/* ── Orbs ──────────────────────────────────────────── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  z-index: 1;
}
.orb-a {
  width: 700px;
  height: 700px;
  top: -300px;
  left: -200px;
  background: radial-gradient(circle, rgb(var(--neon-2-rgb) / 0.28), transparent 70%);
}
.orb-b {
  width: 600px;
  height: 600px;
  top: -100px;
  right: -200px;
  background: radial-gradient(circle, rgb(var(--neon-4-rgb) / 0.22), transparent 70%);
}

/* ── Layout ────────────────────────────────────────── */
.hero-inner {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(40px, 5vw, 80px);
  align-items: center;
}
.hero-inner > * { min-width: 0; }

/* ── Copy ──────────────────────────────────────────── */
.hero-badge { margin-bottom: 28px; }

.hero-title {
  font-size: clamp(48px, 7.5vw, 88px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.0;
}

.hero-lede {
  margin-top: 24px;
  font-size: clamp(16px, 1.6vw, 19px);
  color: var(--muted);
  max-width: 50ch;
  line-height: 1.7;
}

.hero-trust {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
  margin-top: 32px;
}
.hero-trust li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  color: var(--muted-2);
}
.hero-trust :deep(.icon) { color: var(--accent); }

/* ── Visual ────────────────────────────────────────── */
.hero-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quote-card {
  position: relative;
  padding: 26px;
  z-index: 1;
}
.quote-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.quote-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--muted-2);
}
.quote-rate {
  font-family: var(--font-display);
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin-top: 8px;
  font-variant-numeric: tabular-nums;
}
.quote-sub {
  font-size: 12.5px;
  color: var(--muted-3);
  margin-top: 4px;
}
.quote-list {
  list-style: none;
  margin: 22px 0 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.quote-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  background: rgb(255 255 255 / 0.03);
  border: 1px solid var(--glass-border);
  transition: background 0.25s var(--ease), border-color 0.25s var(--ease), transform 0.25s var(--ease);
}
.quote-row:hover {
  background: rgb(255 255 255 / 0.06);
  border-color: rgb(var(--neon-2-rgb) / 0.35);
  transform: translateX(3px);
}
.quote-meta { flex: 1; min-width: 0; }
.quote-name {
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.quote-cat { font-size: 11.5px; color: var(--muted-3); }
.quote-val {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--neon-5);
  font-variant-numeric: tabular-nums;
}
.quote-cta { font-size: 14px; }

.float-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  align-self: flex-end;
  padding: 13px 17px;
  border-radius: var(--r-lg);
  z-index: 2;
  animation: float 7s var(--ease) 0.6s infinite;
}
.float-value { font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums; }
.float-label { font-size: 11.5px; color: var(--muted-3); }

/* ── Bottom fade ───────────────────────────────────── */
.hero-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: linear-gradient(to bottom, transparent, var(--bg));
  z-index: 2;
  pointer-events: none;
}

/* ── Reveal overrides (hero items start visible after delay) */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.75s var(--ease), transform 0.75s var(--ease);
}
.reveal.is-in {
  opacity: 1;
  transform: none;
}

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 1024px) {
  .hero-inner { grid-template-columns: 1fr; }
  .hero-visual { max-width: 480px; }
}
@media (max-width: 720px) {
  .hero { min-height: 100svh; padding-block: calc(var(--nav-h) + 32px) 64px; }
  .hero-bg-img { object-position: 65% 30%; }
  .hero-visual { max-width: none; }
  .quote-card { padding: 20px; }
  .float-card { padding: 12px 14px; gap: 10px; animation: float-subtle 7.5s var(--ease) 0.6s infinite; }
  .float-value { font-size: 14px; }
  .float-label { font-size: 11px; }
}
</style>
