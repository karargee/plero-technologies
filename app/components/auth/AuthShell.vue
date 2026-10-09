<template>
  <div class="auth">
    <aside class="auth-aside">
      <NuxtLink to="/" class="aside-back">
        <AppIcon name="arrow" :size="16" class="flip" />
        Back to site
      </NuxtLink>

      <div class="aside-body">
        <img :src="BRAND.logo" alt="" class="aside-logo logo-plate" />
        <h1 class="aside-title">
          {{ headline }}<br /><span class="grad">{{ accent }}</span>
        </h1>

        <ul class="perks">
          <li v-for="perk in perks" :key="perk">
            <AppIcon name="check" :size="15" />{{ perk }}
          </li>
        </ul>

        <blockquote v-if="quote" class="quote">
          <p class="quote-text">“{{ quote.text }}”</p>
          <p class="quote-by">{{ quote.by }}</p>
        </blockquote>

        <div v-else-if="rate" class="rate-box">
          <span class="live-dot" :class="{ 'live-dot--off': !connected }" />
          Live rate $1 = ₦{{ rate.toLocaleString('en-NG') }}
        </div>
      </div>
    </aside>

    <main class="auth-main">
      <NuxtLink to="/" class="aside-back auth-back">
        <AppIcon name="arrow" :size="16" class="flip" />
        Back to site
      </NuxtLink>
      <div class="form">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { BRAND } from '~/data/site'

defineProps<{
  headline: string
  accent: string
  perks: string[]
  quote?: { text: string; by: string }
}>()

const { rate, connected } = useDerivRate()
</script>

<style scoped>
.auth {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  min-height: 100dvh;
}

.auth-aside {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: clamp(28px, 4vw, 48px);
  background: var(--bg-alt);
  border-right: 1px solid var(--hairline);
}
.auth-aside::after {
  content: '';
  position: absolute;
  width: 520px;
  height: 520px;
  bottom: -260px;
  left: -120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(var(--primary-rgb) / 0.18), transparent 70%);
}
.aside-back {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: var(--muted-2);
  transition: color 0.2s;
}
.aside-back:hover {
  color: var(--text);
}
.flip {
  transform: rotate(180deg);
}
.aside-body {
  position: relative;
  z-index: 1;
  margin-block: auto;
  max-width: 420px;
  padding-block: 40px;
}
.aside-logo {
  height: 46px;
  width: 46px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--hairline);
  margin-bottom: 30px;
}
.aside-title {
  font-size: clamp(30px, 3.6vw, 44px);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.1;
}
.grad {
  color: var(--primary);
}
.perks {
  list-style: none;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.perks li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14.5px;
  color: var(--muted);
}
.perks :deep(.icon) {
  color: var(--accent);
}
.rate-box {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 32px;
  padding: 8px 16px;
  border-radius: var(--r-full);
  background: rgba(0, 167, 103, 0.08);
  border: 1px solid rgba(0, 167, 103, 0.25);
  color: var(--accent);
  font-size: 13.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.quote {
  margin-top: 34px;
  padding: 18px 20px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
}
.quote-text {
  font-size: 15px;
  line-height: 1.65;
}
.quote-by {
  margin-top: 10px;
  font-size: 12.5px;
  color: var(--muted-3);
}

.auth-main {
  display: grid;
  place-items: center;
  padding: clamp(28px, 5vw, 64px) clamp(20px, 4vw, 48px);
}
.form {
  width: 100%;
  max-width: 440px;
}

/* The aside is hidden on small screens, so the back link moves here. */
.auth-back {
  display: none;
}

@media (max-width: 900px) {
  .auth {
    grid-template-columns: 1fr;
  }
  .auth-aside {
    display: none;
  }
  .auth-main {
    grid-template-rows: auto 1fr;
    justify-items: start;
    align-content: start;
    gap: 28px;
    padding-top: 24px;
  }
  .auth-back {
    display: inline-flex;
  }
  .form {
    margin-top: 12px;
  }
}
</style>
