<template>
  <section class="hero">
    <div class="hero-bg" aria-hidden="true" />
    <div class="hero-overlay" aria-hidden="true" />
    <div class="hero-grid" aria-hidden="true" />
    <span class="glow-orb orb-a" aria-hidden="true" />
    <span class="glow-orb orb-b" aria-hidden="true" />

    <div class="container hero-inner">
      <div class="hero-copy">
        <p class="hero-badge fade-up chip chip--neon">
          <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
          {{ hasLiveRate ? 'Live Deriv rates · streaming now' : 'Rates updating · reconnecting' }}
        </p>

        <h1 class="hero-title fade-up" style="animation-delay: 0.06s">
          Turn unused gift cards<br class="br-wide" />
          into <span class="grad-text">cash in minutes.</span>
        </h1>

        <p class="hero-lede fade-up" style="animation-delay: 0.12s">
          Plero is the exchange layer for Nigerian gift cards. Live market pricing, verified
          settlement, and payouts straight to your bank — no agents, no queues, no guesswork.
        </p>

        <div class="btn-row fade-up" style="animation-delay: 0.18s">
          <NuxtLink to="/register" class="btn-grad">
            Start trading free
            <AppIcon name="arrow" :size="17" />
          </NuxtLink>
          <NuxtLink to="/rates" class="btn-glass">
            <AppIcon name="trend" :size="17" />
            See live rates
          </NuxtLink>
        </div>

        <ul class="hero-trust fade-up" style="animation-delay: 0.24s">
          <li v-for="item in HERO_TRUST" :key="item">
            <AppIcon name="check" :size="15" />
            {{ item }}
          </li>
        </ul>
      </div>

      <div class="hero-visual fade-up" style="animation-delay: 0.2s">
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
  </section>
</template>

<script setup lang="ts">
import { getFeaturedCards } from '~/data/cards'
import { HERO_TRUST } from '~/data/site'

const { liveRate, hasLiveRate, rateSource, format } = useDerivRate()
const featured = getFeaturedCards()

const { el: quoteRef, bind } = useSpotlight()
onMounted(() => bind(quoteRef.value))
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(56px, 8vw, 104px) clamp(64px, 9vw, 120px);
}
.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('/hero-image.avif');
  background-size: cover;
  background-position: center 30%;
  opacity: 0.18;
  z-index: 0;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    var(--bg) 0%,
    rgba(8, 8, 10, 0.82) 45%,
    rgba(8, 8, 10, 0.55) 100%
  );
  z-index: 0;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%);
  pointer-events: none;
}
.orb-a {
  width: 620px;
  height: 620px;
  top: -280px;
  left: -140px;
  background: radial-gradient(circle, rgb(var(--neon-2-rgb) / 0.3), transparent 70%);
}
.orb-b {
  width: 560px;
  height: 560px;
  top: -120px;
  right: -160px;
  background: radial-gradient(circle, rgb(var(--neon-4-rgb) / 0.26), transparent 70%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: clamp(40px, 5vw, 72px);
  align-items: center;
}
/* Grid children must be allowed to shrink or long rates push the column wide. */
.hero-inner > * {
  min-width: 0;
}

.hero-badge {
  margin-bottom: 26px;
}

.hero-title {
  font-size: clamp(38px, 6vw, 68px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.02;
}

.hero-lede {
  margin-top: 22px;
  font-size: clamp(15.5px, 1.5vw, 18px);
  color: var(--muted);
  max-width: 52ch;
  line-height: 1.7;
}
.hero-trust {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  margin-top: 30px;
}
.hero-trust li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  color: var(--muted-2);
}
.hero-trust :deep(.icon) {
  color: var(--accent);
}

.hero-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 0 0;
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
  font-size: 46px;
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
  transition:
    background 0.25s var(--ease),
    border-color 0.25s var(--ease),
    transform 0.25s var(--ease);
}
.quote-row:hover {
  background: rgb(255 255 255 / 0.06);
  border-color: rgb(var(--neon-2-rgb) / 0.35);
  transform: translateX(3px);
}
.quote-meta {
  flex: 1;
  min-width: 0;
}
.quote-name {
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.quote-cat {
  font-size: 11.5px;
  color: var(--muted-3);
}
.quote-val {
  flex-shrink: 0;
  text-align: right;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 700;
  color: var(--neon-5);
  font-variant-numeric: tabular-nums;
}
.quote-cta {
  font-size: 14px;
}

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
.float-value {
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.float-label {
  font-size: 11.5px;
  color: var(--muted-3);
}

@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }
  .hero-visual {
    max-width: 460px;
  }
}

@media (max-width: 720px) {
  .hero {
    padding-block: 32px 48px;
  }
  .hero-badge {
    margin-bottom: 20px;
    font-size: 11.5px;
  }
  .hero-lede {
    margin-top: 18px;
  }
  /* Let the headline wrap naturally instead of forcing a desktop break. */
  .br-wide {
    display: none;
  }
  .hero-trust {
    flex-direction: column;
    gap: 8px;
    margin-top: 24px;
  }
  .hero-visual {
    max-width: none;
  }
  .quote-card {
    padding: 20px;
  }
  .quote-rate {
    font-size: 36px;
  }
  /* Keep the drift on mobile, just with less travel and a longer, calmer cycle
     so it reads as motion instead of jitter. */
  .quote-card {
    animation: float-subtle 9s var(--ease) infinite;
  }
  .float-card {
    display: flex;
    align-self: flex-end;
    padding: 12px 14px;
    gap: 10px;
    animation: float-subtle 7.5s var(--ease) 0.6s infinite;
  }
  .float-value {
    font-size: 14px;
  }
  .float-label {
    font-size: 11px;
  }
  /* Stagger the two cards so they do not rise in lockstep. */
  .quote-card {
    animation-delay: 0.9s;
  }
}
</style>
