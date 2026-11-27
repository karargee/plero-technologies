<script setup lang="ts">
const { site } = useContent()

const route = useRoute()
const { payServices } = useRates()
const service = computed(() => payServices.value.find((x) => x.id === String(route.params.service)))
if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found', fatal: true })
}
const s = computed(() => service.value!)

useSeoMeta({
  title: () => `${service.value!.short} in Naira — Plero Pay`,
  description: () => service.value!.description,
})

const flow = ref<'buy' | 'sell'>('buy')
const steps = computed(() => {
  const sv = service.value!
  if (sv.kind === 'supplier') return sv.steps
  return flow.value === 'buy' ? sv.buySteps : sv.sellSteps
})
const others = computed(() => payServices.value.filter((x) => x.id !== service.value!.id))
</script>

<template>
  <div v-if="service">
    <section class="page-hero svc-hero" :style="{ '--c': s.color }">
      <div class="container svc-hero__grid">
        <div>
          <NuxtLink to="/plero-pay" class="back">← Plero Pay</NuxtLink>
          <div class="svc-hero__title">
            <PayMark :symbol="s.symbol" :color="s.color" :size="56" />
            <span class="eyebrow" style="color: var(--indigo-200); margin: 0">Plero Pay · {{ s.name }}</span>
          </div>
          <h1>{{ s.tagline }}</h1>
          <p>{{ s.description }}</p>
          <div class="svc-hero__rates">
            <template v-if="s.kind === 'trade'">
              <div><small>You buy at</small><b>{{ formatMoney(s.buyRate) }}</b></div>
              <div><small>You sell at</small><b>{{ formatMoney(s.sellRate) }}</b></div>
              <div><small>Speed</small><b>{{ s.speed }}</b></div>
            </template>
            <template v-else>
              <div><small>Rate per ¥1</small><b>{{ formatMoney(s.rate) }}</b></div>
              <div><small>Service fee</small><b>{{ formatMoney(s.fee) }}</b></div>
              <div><small>Speed</small><b>Same day</b></div>
            </template>
          </div>
        </div>
        <div class="svc-hero__calc">
          <PayCalculator :fixed="s.id" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="steps-top">
          <div v-reveal class="section-head">
            <span class="eyebrow">How it works</span>
            <h2 class="section-title">
              {{ s.kind === 'supplier' ? 'Paying a supplier in 4 steps' : `${flow === 'buy' ? 'Buying' : 'Selling'} ${s.name} in 4 steps` }}
            </h2>
          </div>
          <div v-if="s.kind === 'trade'" class="seg" role="tablist" aria-label="Flow">
            <button type="button" role="tab" :aria-selected="flow === 'buy'" :class="{ on: flow === 'buy' }" @click="flow = 'buy'">Buy</button>
            <button type="button" role="tab" :aria-selected="flow === 'sell'" :class="{ on: flow === 'sell' }" @click="flow = 'sell'">Sell</button>
          </div>
        </div>
        <ol :key="flow" class="flow">
          <li v-for="(st, i) in steps" :key="st.title" :style="{ animationDelay: `${i * 90}ms` }">
            <span class="num">{{ i + 1 }}</span>
            <h3>{{ st.title }}</h3>
            <p>{{ st.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container two">
        <div v-reveal:left class="card box">
          <h3><AppIcon name="check" :size="20" /> What you’ll need</h3>
          <ul>
            <li v-for="n in s.needs" :key="n">{{ n }}</li>
          </ul>
          <template v-if="s.kind === 'supplier'">
            <h4>We can pay via</h4>
            <div class="tags">
              <span v-for="m in s.methods" :key="m">{{ m }}</span>
            </div>
          </template>
          <template v-if="s.kind === 'trade' && s.networks">
            <h4>Supported networks</h4>
            <div class="tags">
              <span v-for="n in s.networks" :key="n">{{ n }}</span>
            </div>
          </template>
        </div>
        <div v-reveal:right="100" class="card box box--warn">
          <h3><AppIcon name="shield" :size="20" /> Stay safe</h3>
          <ul>
            <li v-for="n in s.safety" :key="n">{{ n }}</li>
          </ul>
          <a :href="site.contact.whatsapp" target="_blank" rel="noopener" class="btn btn--primary">Ask us anything</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container faq">
        <div v-reveal>
          <span class="eyebrow">FAQ</span>
          <h2 class="section-title">{{ s.name }} questions</h2>
        </div>
        <div v-reveal="80" class="faq__list">
          <details v-for="(f, i) in s.faqs" :key="f.q" :open="i === 0">
            <summary>{{ f.q }} <span aria-hidden="true">+</span></summary>
            <p>{{ f.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <h2 class="more-title">More from Plero Pay</h2>
        <div class="more">
          <NuxtLink v-for="o in others" :key="o.id" v-spotlight :to="`/plero-pay/${o.id}`" class="card more__item">
            <PayMark :symbol="o.symbol" :color="o.color" :size="40" />
            <span><b>{{ o.short }}</b><small>{{ o.tagline }}</small></span>
          </NuxtLink>
          <NuxtLink v-spotlight to="/deriv" class="card more__item">
            <LogoMark :size="40" />
            <span><b>Deriv deposits &amp; withdrawals</b><small>Fund and cash out your Deriv account in Naira.</small></span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.svc-hero {
  background: radial-gradient(800px 400px at 90% 10%, color-mix(in srgb, var(--c) 45%, transparent), transparent 60%),
    radial-gradient(700px 400px at 0% 100%, rgb(76 79 166 / 0.35), transparent 60%), var(--navy-900);
}
.svc-hero__grid {
  display: grid;
  grid-template-columns: 1fr 430px;
  gap: clamp(32px, 5vw, 64px);
  align-items: center;
}
.back {
  display: inline-block;
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 600;
  color: var(--indigo-200);
}
.svc-hero__title {
  display: flex;
  align-items: center;
  gap: 14px;
}
.svc-hero h1 {
  margin-top: 20px;
  font-size: clamp(30px, 4.4vw, 48px);
}
.svc-hero__rates {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.svc-hero__rates div {
  display: grid;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.07);
  border: 1px solid rgb(255 255 255 / 0.12);
}
.svc-hero__rates small {
  font-size: 12px;
  color: rgb(255 255 255 / 0.6);
}
.svc-hero__rates b {
  font-size: 17px;
  font-variant-numeric: tabular-nums;
}
.steps-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 36px;
}
.steps-top .section-head {
  margin-bottom: 0;
}
.seg {
  display: inline-flex;
  padding: 4px;
  border-radius: 12px;
  background: var(--surface-alt);
  border: 1px solid var(--line);
}
.seg button {
  border: 0;
  background: transparent;
  padding: 10px 22px;
  border-radius: 9px;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
}
.seg button.on {
  background: var(--navy-800);
  color: #fff;
}
.flow {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.flow li {
  position: relative;
  padding: 26px 22px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: #fff;
  animation: rise-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.flow .num {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--indigo-500), var(--navy-700));
  color: #fff;
  font-weight: 700;
}
.flow h3 {
  margin-top: 16px;
  font-size: 18px;
}
.flow p {
  margin-top: 6px;
  color: var(--ink-soft);
  font-size: 15px;
}
.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  align-items: start;
}
.box {
  display: grid;
  gap: 14px;
  padding: clamp(22px, 3vw, 32px);
}
.box h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
}
.box h3 svg {
  color: var(--success);
}
.box--warn h3 svg {
  color: #b7791f;
}
.box ul {
  margin: 0;
  padding-left: 1.2em;
  display: grid;
  gap: 8px;
  color: var(--ink-soft);
}
.box h4 {
  font-family: var(--font-body);
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tags span {
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--indigo-50);
  color: var(--indigo-600);
  font-size: 13.5px;
  font-weight: 600;
}
.box .btn {
  justify-self: start;
}
.faq {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;
  gap: clamp(28px, 5vw, 64px);
  align-items: start;
}
.faq__list {
  display: grid;
  gap: 10px;
}
.faq__list details {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
}
.faq__list details[open] {
  border-color: var(--indigo-200);
}
.faq__list summary {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}
.faq__list summary::-webkit-details-marker {
  display: none;
}
.faq__list summary span {
  color: var(--indigo-500);
  font-size: 20px;
  line-height: 1;
  transition: transform 0.2s ease;
}
.faq__list details[open] summary span {
  transform: rotate(45deg);
}
.faq__list p {
  padding: 0 20px 18px;
  color: var(--ink-soft);
}
.more-title {
  font-size: 24px;
  margin-bottom: 18px;
}
.more {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.more__item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 18px;
  transition: transform 0.2s ease;
}
.more__item:hover {
  transform: translateY(-3px);
}
.more__item b {
  display: block;
}
.more__item small {
  color: var(--ink-soft);
}
@media (max-width: 1020px) {
  .svc-hero__grid {
    grid-template-columns: 1fr;
  }
  .svc-hero__calc {
    max-width: 480px;
  }
  .flow {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 800px) {
  .two,
  .faq,
  .more {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .flow {
    grid-template-columns: 1fr;
  }
}
</style>
