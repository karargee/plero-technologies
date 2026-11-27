<script setup lang="ts">
import { payBrand, payServices } from '~/data/pay'
import { site } from '~/data/site'

useSeoMeta({
  title: 'Plero Pay — USDT, Airtm & China supplier payments',
  description: 'Plero Pay by Plero Technologies: buy and sell USDT and Airtm USD for Naira, and pay suppliers in China in RMB.',
})

const rows = payServices.map((s) =>
  s.kind === 'trade'
    ? { s, a: { label: 'We sell at', value: formatMoney(s.buyRate) + ` / ${s.unit}` }, b: { label: 'We buy at', value: formatMoney(s.sellRate) + ` / ${s.unit}` } }
    : { s, a: { label: 'Rate', value: formatMoney(s.rate) + ' / ¥1' }, b: { label: 'Service fee', value: formatMoney(s.fee) } },
)
</script>

<template>
  <div>
    <section class="page-hero pay-hero">
      <div class="pay-hero__orbs" aria-hidden="true">
        <PayMark v-for="(s, i) in payServices" :key="s.id" :symbol="s.symbol" :color="s.color" :size="64" :class="`orb orb--${i}`" />
      </div>
      <div class="container">
        <PayLogo light :size="40" />
        <h1>Move money your way — in Naira.</h1>
        <p>{{ payBrand.tagline }} Clear rates, fast delivery and a real person on WhatsApp.</p>
        <div class="pay-hero__cta">
          <a href="#calculator" class="btn btn--light">Get a quote <AppIcon name="arrow" :size="18" /></a>
          <a :href="site.contact.whatsapp" target="_blank" rel="noopener" class="btn btn--ghost-dark">Chat on WhatsApp</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-reveal class="section-head section-head--center">
          <span class="eyebrow">Plero Pay services</span>
          <h2 class="section-title">Pick what you need</h2>
        </div>
        <div class="svc-grid">
          <NuxtLink
            v-for="(r, i) in rows"
            :key="r.s.id"
            v-reveal="i * 110"
            v-spotlight
            :to="`/plero-pay/${r.s.id}`"
            class="svc card"
            :style="{ '--c': r.s.color }"
          >
            <PayMark :symbol="r.s.symbol" :color="r.s.color" :size="52" />
            <h3>{{ r.s.short }}</h3>
            <p>{{ r.s.tagline }}</p>
            <dl>
              <div><dt>{{ r.a.label }}</dt><dd>{{ r.a.value }}</dd></div>
              <div><dt>{{ r.b.label }}</dt><dd>{{ r.b.value }}</dd></div>
            </dl>
            <span class="svc__go">Learn more <AppIcon name="arrow" :size="16" /></span>
          </NuxtLink>
          <NuxtLink v-reveal="330" v-spotlight to="/gift-cards" class="svc card" style="--c: #6a3fb5">
            <PayMark symbol="🎁" color="#6a3fb5" :size="52" />
            <h3>Sell gift cards</h3>
            <p>Apple, Amazon, Steam, Google Play and more — paid to your bank.</p>
            <span class="svc__go">See rates <AppIcon name="arrow" :size="16" /></span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="calculator" class="section section--alt calc-sec">
      <div class="container calc-grid">
        <div v-reveal:left>
          <span class="eyebrow">Instant quote</span>
          <h2 class="section-title">Know exactly what you’ll pay or get</h2>
          <p class="section-lead">
            Choose a service, enter the amount and see your Naira total. Tap continue and we pick it up on WhatsApp.
          </p>
          <ul class="ticks">
            <li><AppIcon name="check" :size="18" /> No hidden charges — fees are shown upfront</li>
            <li><AppIcon name="check" :size="18" /> Proof of every payment</li>
            <li><AppIcon name="check" :size="18" /> Real people, 7 days a week</li>
          </ul>
        </div>
        <div v-reveal:right="100">
          <PayCalculator />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-reveal class="trust">
          <AppIcon name="shield" :size="26" />
          <p>
            For your safety and to meet anti-money-laundering rules, we may ask for ID before larger transactions. We
            never ask for your passwords, PINs or one-time codes.
          </p>
        </div>
        <RegistrationBadge class="pay-reg" />
      </div>
    </section>
    <CtaSection />
  </div>
</template>

<style scoped>
.pay-hero {
  padding-bottom: clamp(72px, 9vw, 110px);
}
.pay-hero h1 {
  margin-top: 26px;
}
.pay-hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}
.pay-hero__orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.orb {
  position: absolute;
  opacity: 0.9;
  animation: float 7s ease-in-out infinite;
}
.orb--0 {
  right: 14%;
  top: 22%;
}
.orb--1 {
  right: 6%;
  top: 52%;
  animation-delay: -2.5s;
  transform: scale(0.85);
}
.orb--2 {
  right: 24%;
  top: 60%;
  animation-delay: -4.5s;
}
.svc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.svc {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border-top: 3px solid var(--c);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.svc:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}
.svc h3 {
  margin-top: 8px;
  font-size: 19px;
}
.svc p {
  color: var(--ink-soft);
  font-size: 15px;
  flex: 1;
}
.svc dl {
  margin: 6px 0 0;
  display: grid;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  background: var(--surface-alt);
}
.svc dl div {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 13.5px;
}
.svc dt {
  color: var(--ink-mute);
}
.svc dd {
  margin: 0;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.svc__go {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-weight: 600;
  color: var(--indigo-500);
}
.calc-sec {
  scroll-margin-top: 72px;
}
.calc-grid {
  display: grid;
  grid-template-columns: 1fr 440px;
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
}
.ticks {
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
  display: grid;
  gap: 10px;
}
.ticks li {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ticks svg {
  color: var(--success);
}
.trust {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 22px 26px;
  border-radius: var(--radius);
  background: var(--indigo-50);
  color: var(--navy-700);
}
.pay-reg {
  margin-top: 16px;
}
.trust svg {
  flex: none;
}
@media (max-width: 1100px) {
  .svc-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 960px) {
  .calc-grid {
    grid-template-columns: 1fr;
  }
  .pay-hero__orbs {
    display: none;
  }
}
@media (max-width: 560px) {
  .svc-grid {
    grid-template-columns: 1fr;
  }
}
</style>
