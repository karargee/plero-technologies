<script setup lang="ts">
// Two photo cards: someone trading (with a live Deriv price overlay)
// and someone making a transaction on the site (with a real quote from our rates).
import { deriv } from '~/data/site'

const symbol = ref('R_75')
const mode = ref<'ticks' | 'candles'>('ticks')
const { ticks, pipSize, status } = useDerivSeries(symbol, mode)

const W = 200
const H = 56
const spark = computed(() => {
  const pts = ticks.value.slice(-60)
  if (pts.length < 2) return ''
  let lo = Infinity
  let hi = -Infinity
  for (const p of pts) {
    lo = Math.min(lo, p.v)
    hi = Math.max(hi, p.v)
  }
  const span = hi - lo || 1
  return pts
    .map((p, i) => `${i ? 'L' : 'M'}${((i / (pts.length - 1)) * W).toFixed(1)} ${(4 + (1 - (p.v - lo) / span) * (H - 8)).toFixed(1)}`)
    .join(' ')
})
const last = computed(() => ticks.value.at(-1)?.v)
const first = computed(() => ticks.value.at(-60)?.v ?? ticks.value[0]?.v)
const pct = computed(() => (last.value && first.value ? ((last.value - first.value) / first.value) * 100 : 0))

const demoUsd = 50
const demoNaira = demoUsd * deriv.depositRate
</script>

<template>
  <section class="section action">
    <div class="container">
      <div v-reveal class="section-head section-head--center">
        <span class="eyebrow">See it in action</span>
        <h2 class="section-title">Trade on Deriv. Pay with Plero. All from your phone.</h2>
        <p class="section-lead">Fund your account, watch the markets and move your money — in minutes, not days.</p>
      </div>

      <div class="action__grid">
        <!-- Someone trading -->
        <figure v-reveal:left class="shot">
          <div class="shot__media">
          <div class="shot__img">
            <img src="/images/trader.webp" alt="A smiling trader at his desk with his phone and laptop" width="960" height="640" loading="lazy" />
          </div>
          <div class="float float--price" aria-hidden="true">
            <div class="float__row">
              <span class="float__label"><i :class="status" /> Volatility 75 Index</span>
              <span :class="pct >= 0 ? 'up' : 'down'">{{ pct >= 0 ? '▲' : '▼' }} {{ Math.abs(pct).toFixed(2) }}%</span>
            </div>
            <strong>{{ formatPrice(last, pipSize) }}</strong>
            <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none">
              <path :d="spark" fill="none" stroke="#6c70d1" stroke-width="2" vector-effect="non-scaling-stroke" />
            </svg>
          </div>
          <div class="float float--chip" aria-hidden="true">
            <span class="dot dot--green"><AppIcon name="bolt" :size="14" /></span>
            Funded via Plero
          </div>
          </div>
          <figcaption>
            <b>Trade with confidence</b>
            <span>Live Deriv prices on our site — and a funded account in minutes.</span>
            <NuxtLink to="/markets">Open live charts →</NuxtLink>
          </figcaption>
        </figure>

        <!-- Someone making a transaction on the site -->
        <figure v-reveal:right="120" class="shot">
          <div class="shot__media">
          <div class="shot__img">
            <img src="/images/paying.webp" alt="A smiling woman making a payment on her phone" width="960" height="760" loading="lazy" />
          </div>
          <div class="float float--quote" aria-hidden="true">
            <div class="q__head">
              <LogoMark :size="22" />
              <b>Deposit to Deriv</b>
              <span class="q__badge">Quote</span>
            </div>
            <div class="q__row"><span>Amount</span><b>${{ demoUsd }}.00</b></div>
            <div class="q__row"><span>Rate</span><b>{{ formatMoney(deriv.depositRate) }}/$</b></div>
            <div class="q__total"><span>You pay</span><strong>{{ formatMoney(demoNaira) }}</strong></div>
            <span class="q__btn">Continue on WhatsApp →</span>
          </div>
          <div class="float float--bubble" aria-hidden="true">
            <span class="dot"><AppIcon name="check" :size="14" /></span>
            Quote ready in seconds
          </div>
          </div>
          <figcaption>
            <b>Pay in a few taps</b>
            <span>Get your quote on our site, then finish on WhatsApp with a real person.</span>
            <NuxtLink to="/deriv">Make a deposit →</NuxtLink>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.action__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(24px, 4vw, 40px);
}
.shot {
  position: relative;
  margin: 0;
}
.shot__media {
  position: relative;
}
.shot__img {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  aspect-ratio: 4 / 3;
  box-shadow: var(--shadow-lg);
  background: var(--surface-alt);
}
.shot__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.shot:hover .shot__img img {
  transform: scale(1.05);
}
.shot__img::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 28px;
  background: linear-gradient(180deg, transparent 55%, rgb(19 18 58 / 0.25));
  pointer-events: none;
}

/* Floating UI on top of the photos */
.float {
  position: absolute;
  background: rgb(255 255 255 / 0.94);
  backdrop-filter: blur(12px);
  border: 1px solid rgb(255 255 255 / 0.7);
  border-radius: 18px;
  box-shadow: 0 24px 50px -20px rgb(19 18 58 / 0.45);
  color: var(--ink);
}
.float--price {
  top: 22px;
  right: -14px;
  width: 230px;
  padding: 14px 16px 10px;
  animation: float 7s ease-in-out infinite;
}
.float__row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
}
.float__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-soft);
}
.float__label i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ink-mute);
}
.float__label i.live {
  background: #2ebd85;
  box-shadow: 0 0 0 3px rgb(46 189 133 / 0.2);
}
.float--price strong {
  display: block;
  margin-top: 4px;
  font-family: var(--font-display);
  font-size: 22px;
  font-variant-numeric: tabular-nums;
}
.float--price svg {
  width: 100%;
  height: 56px;
}
.float--chip,
.float--bubble {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 10px 10px;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 999px;
}
.float--chip {
  bottom: 22px;
  left: -14px;
  animation: float 8s ease-in-out infinite;
  animation-delay: -3s;
}
.dot {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--indigo-500);
  color: #fff;
}
.dot--green {
  background: #2ebd85;
}
.float--quote {
  top: 22px;
  left: -14px;
  width: 240px;
  padding: 14px 16px;
  display: grid;
  gap: 8px;
  animation: float 7.5s ease-in-out infinite;
  animation-delay: -1.5s;
}
.q__head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
}
.q__badge {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  color: var(--success);
  background: #e7f6ef;
  padding: 2px 8px;
  border-radius: 999px;
}
.q__row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--ink-soft);
}
.q__row b {
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.q__total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--indigo-50);
  font-size: 12.5px;
  color: var(--ink-soft);
}
.q__total strong {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--navy-700);
  font-variant-numeric: tabular-nums;
}
.q__btn {
  display: grid;
  place-items: center;
  height: 34px;
  border-radius: 999px;
  background: var(--indigo-500);
  color: #fff;
  font-size: 12.5px;
  font-weight: 600;
}
.float--bubble {
  bottom: 22px;
  right: -14px;
  animation: float 6.5s ease-in-out infinite;
  animation-delay: -4s;
}

figcaption {
  display: grid;
  gap: 4px;
  margin-top: 22px;
  padding: 0 6px;
}
figcaption b {
  font-family: var(--font-display);
  font-size: 22px;
}
figcaption span {
  color: var(--ink-soft);
}
figcaption a {
  margin-top: 6px;
  font-weight: 600;
  color: var(--indigo-500);
}
.up {
  color: var(--success);
}
.down {
  color: #b42318;
}

@media (max-width: 1240px) {
  .float--price,
  .float--bubble {
    right: 12px;
  }
  .float--chip,
  .float--quote {
    left: 12px;
  }
}
@media (max-width: 900px) {
  .action__grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin-inline: auto;
  }
}
@media (max-width: 520px) {
  .float--price {
    width: 190px;
    top: 12px;
    padding: 10px 12px 6px;
  }
  .float--price strong {
    font-size: 18px;
  }
  .float--price svg {
    height: 40px;
  }
  .float--quote {
    width: 200px;
    top: 12px;
    padding: 10px 12px;
    gap: 6px;
  }
  .float--chip,
  .float--bubble {
    bottom: 12px;
    font-size: 12px;
  }
}
</style>
