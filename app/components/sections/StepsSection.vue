<script setup lang="ts">
import { depositSteps, withdrawSteps } from '~/data/site'
withDefaults(defineProps<{ showLink?: boolean }>(), { showLink: true })

const tab = ref<'deposit' | 'withdraw'>('deposit')
const steps = computed(() => (tab.value === 'deposit' ? depositSteps : withdrawSteps))
</script>

<template>
  <section class="section section--dark steps">
    <div class="container">
      <div class="steps__top">
        <div v-reveal class="section-head">
          <span class="eyebrow">How it works</span>
          <h2 class="section-title">Deposit or withdraw in four simple steps</h2>
          <p class="section-lead">Everything runs through Deriv's own payment agent system.</p>
        </div>
        <div class="seg" role="tablist" aria-label="Choose flow">
          <button type="button" role="tab" :aria-selected="tab === 'deposit'" :class="{ on: tab === 'deposit' }" @click="tab = 'deposit'">
            Deposit
          </button>
          <button type="button" role="tab" :aria-selected="tab === 'withdraw'" :class="{ on: tab === 'withdraw' }" @click="tab = 'withdraw'">
            Withdraw
          </button>
        </div>
      </div>

      <ol :key="tab" class="steps__list">
        <li v-for="(s, i) in steps" :key="s.title" class="step" :style="{ animationDelay: `${i * 90}ms` }">
          <span class="step__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.body }}</p>
        </li>
      </ol>

      <NuxtLink v-if="showLink" to="/deriv" class="btn btn--ghost-dark steps__link">
        Full deposit & withdrawal guide <AppIcon name="arrow" :size="18" />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.steps {
  background: radial-gradient(800px 400px at 0% 100%, rgb(76 79 166 / 0.35), transparent 60%), var(--navy-900);
}
.steps__top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: clamp(36px, 5vw, 56px);
}
.steps__top .section-head {
  margin-bottom: 0;
}
.seg {
  display: inline-flex;
  padding: 4px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.06);
  border: 1px solid rgb(255 255 255 / 0.1);
}
.seg button {
  border: 0;
  background: transparent;
  color: rgb(255 255 255 / 0.7);
  padding: 10px 20px;
  border-radius: 9px;
  font-weight: 600;
  cursor: pointer;
}
.seg button.on {
  background: #fff;
  color: var(--navy-800);
}
.steps__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  position: relative;
}
/* Glowing line connecting the steps */
.steps__list::before {
  content: '';
  position: absolute;
  top: 52px;
  left: 40px;
  right: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--indigo-400), #8ee0b9, var(--indigo-400), transparent);
  background-size: 200% 100%;
  animation: shimmer 4s linear infinite;
  opacity: 0.6;
}
@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
.step {
  position: relative;
  padding: 28px 24px;
  border-radius: var(--radius);
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.1);
  backdrop-filter: blur(6px);
  animation: fade 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;
}
.step:hover {
  transform: translateY(-4px);
  background: rgb(255 255 255 / 0.07);
  border-color: rgb(149 153 255 / 0.4);
}
.step__num {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--indigo-500), var(--navy-700));
  box-shadow: 0 0 0 6px var(--navy-900), 0 0 24px rgb(108 112 209 / 0.6);
}
.step h3 {
  margin-top: 22px;
  font-size: 20px;
}
.step p {
  margin-top: 8px;
  color: rgb(255 255 255 / 0.7);
}
.steps__link {
  margin-top: 40px;
}
@media (max-width: 960px) {
  .steps__list {
    grid-template-columns: 1fr 1fr;
  }
  .steps__list::before {
    display: none;
  }
}
@media (max-width: 560px) {
  .steps__list {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .steps__list {
    animation: none;
  }
}
</style>
