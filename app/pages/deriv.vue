<script setup lang="ts">
const { site, steps: stepsDoc, pages, images, bg } = useContent()
const depositSteps = computed(() => stepsDoc.value.deposit)
const withdrawSteps = computed(() => stepsDoc.value.withdraw)

const { deriv } = useRates()

useSeoMeta({
  title: 'Deposit & withdraw on Deriv',
  description: 'Deposit to and withdraw from your Deriv account in Naira through Plero Technologies, a Deriv payment agent.',
})
</script>

<template>
  <div>
    <section class="page-hero page-hero--photo" :style="{ '--hero-img': bg(images.derivHeader) }">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">{{ pages.deriv.eyebrow }}</span>
        <h1>{{ pages.deriv.title }}</h1>
        <p>{{ pages.deriv.text }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container rates">
        <div class="rates__cards">
          <div v-reveal v-spotlight class="rate card">
            <span class="rate__label"><AppIcon name="up" :size="18" /> Deposit rate</span>
            <strong>{{ formatMoney(deriv.depositRate) }}</strong>
            <small>You pay this for every $1 added to your Deriv account.</small>
          </div>
          <div v-reveal="100" v-spotlight class="rate card">
            <span class="rate__label rate__label--w"><AppIcon name="down" :size="18" /> Withdrawal rate</span>
            <strong>{{ formatMoney(deriv.withdrawRate) }}</strong>
            <small>You receive this for every $1 you withdraw to us.</small>
          </div>
          <div v-reveal class="rate rate--meta card">
            <div><span>Limits</span><b>${{ deriv.min }} – ${{ deriv.max.toLocaleString() }}</b></div>
            <div><span>Speed</span><b>{{ deriv.speed }}</b></div>
            <div><span>Hours</span><b>{{ site.contact.hours }}</b></div>
          </div>
        </div>
        <div v-reveal class="rates__calc">
          <AgentCalculator />
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container guides">
        <article id="deposit" v-reveal class="guide card">
          <span class="eyebrow">Deposit</span>
          <h2>How to deposit to Deriv</h2>
          <ol>
            <li v-for="(s, i) in depositSteps" :key="s.title">
              <span class="num">{{ i + 1 }}</span>
              <div>
                <h3>{{ s.title }}</h3>
                <p>{{ s.body }}</p>
              </div>
            </li>
          </ol>
          <a :href="site.contact.whatsapp" target="_blank" rel="noopener" class="btn btn--primary">
            Start a deposit on WhatsApp
          </a>
        </article>

        <article id="withdraw" v-reveal class="guide card">
          <span class="eyebrow">Withdraw</span>
          <h2>How to withdraw from Deriv</h2>
          <ol>
            <li v-for="(s, i) in withdrawSteps" :key="s.title">
              <span class="num">{{ i + 1 }}</span>
              <div>
                <h3>{{ s.title }}</h3>
                <p>{{ s.body }}</p>
              </div>
            </li>
          </ol>
          <AgentDetails />
        </article>
      </div>
    </section>

    <section class="section safety-wrap">
      <div class="container">
        <div v-reveal class="safety">
          <AppIcon name="shield" :size="28" />
          <div>
            <h3>Stay safe</h3>
            <p>
              Only send money to the bank account we give you on our official WhatsApp
              ({{ site.contact.phone }}). We will never ask for your Deriv password or ask you to log in for
              you. Always confirm withdrawals yourself inside Deriv's cashier.
            </p>
          </div>
        </div>
      </div>
    </section>

    <RegisterBand />
    <FaqSection alt />
  </div>
</template>

<style scoped>
.rates {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 28px;
  align-items: start;
}
.rates__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.rate {
  display: grid;
  gap: 8px;
  padding: 26px;
}
.rate__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--success);
}
.rate__label--w {
  color: var(--indigo-500);
}
.rate strong {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 42px);
  color: var(--navy-700);
  font-variant-numeric: tabular-nums;
}
.rate small {
  color: var(--ink-mute);
  font-size: 14px;
}
.rate--meta {
  grid-column: 1 / -1;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.rate--meta div {
  display: grid;
  gap: 2px;
}
.rate--meta span {
  font-size: 13px;
  color: var(--ink-mute);
}
.rate--meta b {
  font-weight: 600;
}
.guides {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
.guide {
  display: grid;
  gap: 22px;
  padding: clamp(22px, 4vw, 36px);
  scroll-margin-top: 96px;
}
.guide .eyebrow {
  margin-bottom: -12px;
}
.guide h2 {
  font-size: clamp(24px, 3vw, 30px);
}
.guide ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 18px;
}
.guide li {
  display: flex;
  gap: 14px;
}
.num {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--indigo-50);
  color: var(--indigo-600);
  font-weight: 700;
  font-size: 14px;
}
.guide h3 {
  font-size: 17px;
}
.guide li p {
  margin-top: 2px;
  color: var(--ink-soft);
}
.guide .btn {
  justify-self: start;
}
.guide :deep(.agent) {
  box-shadow: none;
  border-color: var(--indigo-100);
}
.safety-wrap {
  padding-bottom: 0;
}
.safety {
  display: flex;
  gap: 18px;
  padding: 24px 28px;
  border-radius: var(--radius);
  background: #fff8e6;
  border: 1px solid #f5dfa3;
  color: #7a5200;
}
.safety svg {
  flex: none;
}
.safety h3 {
  font-size: 18px;
  color: #5c3d00;
}
.safety p {
  margin-top: 4px;
}
@media (max-width: 1080px) {
  .rates {
    grid-template-columns: 1fr;
  }
  .rates__calc {
    max-width: 480px;
  }
}
@media (max-width: 860px) {
  .guides {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .rates__cards,
  .rate--meta {
    grid-template-columns: 1fr;
  }
}
</style>
