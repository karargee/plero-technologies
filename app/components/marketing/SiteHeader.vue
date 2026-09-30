<template>
    <header class="nav" :class="{ 'nav--solid': scrolled }">
    <div class="nav-progress" :style="{ transform: `scaleX(${progress})` }" />

    <div class="container nav-inner">
      <!--
        `display: contents` on desktop, so the three parts sit directly in the
        flex row. Below 1024px it becomes a real block and the header stacks
        into two rows, keeping the same links visible instead of hiding them
        behind a burger.
      -->
      <div class="nav-top">
        <NuxtLink to="/" class="brand" :aria-label="`${BRAND.legalName} home`">
          <img :src="BRAND.logo" alt="" class="brand-img logo-plate" />
          <span class="brand-text">
            <span class="brand-name">{{ BRAND.name }}</span>
            <span class="brand-sub">Technologies</span>
          </span>
        </NuxtLink>

        <div class="nav-actions">
          <NuxtLink
            to="/rates"
            class="rate-pill"
            :title="hasLiveRate ? 'Live Deriv rate' : 'Cached rate'"
          >
            <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
            <span class="rate-value">$1 = ₦{{ liveRate.toLocaleString('en-NG') }}</span>
          </NuxtLink>
          <NuxtLink to="/login" class="btn btn-ghost nav-auth">Log in</NuxtLink>
          <NuxtLink to="/register" class="btn btn-primary nav-cta">Get started</NuxtLink>
        </div>
      </div>

      <nav class="nav-links" aria-label="Main">
        <NuxtLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link--active': isActive(link.to) }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { BRAND } from '~/data/site'
import { NAV_LINKS } from '~/constants/navigation'

const route = useRoute()
const { liveRate, hasLiveRate } = useDerivRate()

const scrolled = ref(false)
const progress = ref(0)

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)

const onScroll = () => {
  const y = window.scrollY
  scrolled.value = y > 12
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(y / max, 1) : 0
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: var(--nav-h);
  border-bottom: 1px solid transparent;
  transition: background 0.35s var(--ease), border-color 0.35s, backdrop-filter 0.35s;
}
.nav--solid {
  background: rgba(8, 8, 10, 0.78);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  border-bottom-color: var(--hairline);
}

.nav-progress {
  position: absolute;
  left: 0;
  bottom: -1px;
  height: 2px;
  width: 100%;
  transform-origin: 0 50%;
  transform: scaleX(0);
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
  opacity: 0.9;
}

.nav-inner {
  height: var(--nav-h);
  display: flex;
  align-items: center;
  gap: 28px;
}

/* On desktop the wrapper is transparent to layout, so the brand, links and
   actions share one flex row exactly as before. */
.nav-top {
  display: contents;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.brand-img {
  height: 36px;
  width: 36px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--hairline);
  position: relative;
  z-index: 1;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}
.brand-name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.brand-sub {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}
.nav-link {
  padding: 8px 14px;
  border-radius: var(--r-full);
  font-size: 14.5px;
  font-weight: 500;
  color: var(--muted);
  transition: color 0.2s, background 0.2s;
}
.nav-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}
.nav-link--active {
  color: var(--text);
  background: rgba(255, 255, 255, 0.07);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.rate-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 13px;
  border-radius: var(--r-full);
  background: var(--accent-soft);
  border: 1px solid rgb(var(--accent-rgb) / 0.22);
  color: #2fd4c8;
  font-size: 12.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.live-dot--off {
  background: var(--gold);
  animation: none;
}

.nav-auth {
  padding: 9px 18px;
  font-size: 13.5px;
}
.nav-cta {
  padding: 9px 20px;
  font-size: 13.5px;
}

@media (max-width: 1024px) {
  /* Two rows: brand + actions on top, the same nav links underneath. No burger,
     so every destination stays one tap away and matches the desktop order. */
  .nav-inner {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 0;
  }
  .nav-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .nav-links {
    flex: none;
    margin-top: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    /* Bleed to the screen edges so a scrolled link is not clipped by the
       container padding. */
    margin-inline: calc(clamp(20px, 5vw, 40px) * -1);
    padding-inline: clamp(20px, 5vw, 40px);
  }
  .nav-links::-webkit-scrollbar {
    display: none;
  }
  .nav-link {
    padding: 6px 12px;
    font-size: 13.5px;
    white-space: nowrap;
  }
  .nav-auth {
    display: none;
  }
}

@media (max-width: 560px) {
  /* Tighten the row 1 controls rather than dropping the wordmark: the brand
     stays, the secondary login link and the padding go. */
  .rate-pill {
    padding: 5px 10px;
    gap: 5px;
    font-size: 11.5px;
  }
  .nav-cta {
    padding: 8px 14px;
    font-size: 12.5px;
  }
  .brand-name {
    font-size: 15.5px;
  }
  .brand-img {
    height: 32px;
    width: 32px;
  }
}

@media (max-width: 380px) {
  .rate-pill {
    display: none;
  }
}
</style>
