<template>
  <header class="nav" :class="{ 'nav--solid': scrolled || menuOpen }">
    <div class="nav-progress" :style="{ transform: `scaleX(${progress})` }" />

    <div class="container nav-inner">
      <!-- Brand -->
      <NuxtLink to="/" class="brand" :aria-label="`${BRAND.legalName} home`" @click="menuOpen = false">
        <img :src="BRAND.logo" alt="" class="brand-img logo-plate" />
        <span class="brand-text">
          <span class="brand-name">{{ BRAND.name }}</span>
          <span class="brand-sub">Technologies</span>
        </span>
      </NuxtLink>

      <!-- Desktop nav links -->
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

      <!-- Desktop actions -->
      <div class="nav-actions">
        <NuxtLink to="/rates" class="rate-pill" :title="hasLiveRate ? 'Live Deriv rate' : 'Cached rate'">
          <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
          <span class="rate-value">$1 = ₦{{ liveRate.toLocaleString('en-NG') }}</span>
        </NuxtLink>
        <NuxtLink to="/login" class="btn btn-ghost nav-auth">Log in</NuxtLink>
        <NuxtLink to="/register" class="btn btn-primary nav-cta">Get started</NuxtLink>

        <!-- Hamburger -->
        <button
          type="button"
          class="burger"
          :aria-expanded="menuOpen"
          aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="burger-bar" :class="{ 'bar--open': menuOpen }" />
          <span class="burger-bar" :class="{ 'bar--open': menuOpen }" />
          <span class="burger-bar" :class="{ 'bar--open': menuOpen }" />
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <Transition name="drawer">
      <div v-if="menuOpen" class="drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <!-- Rate pill -->
        <div class="drawer-rate">
          <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
          <span class="rate-value">$1 = ₦{{ liveRate.toLocaleString('en-NG') }}</span>
          <span class="drawer-rate-label">{{ hasLiveRate ? 'Live' : 'Cached' }}</span>
        </div>

        <!-- Nav links -->
        <nav class="drawer-nav" aria-label="Mobile navigation">
          <NuxtLink
            v-for="(link, i) in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="drawer-link"
            :class="{ 'drawer-link--active': isActive(link.to) }"
            :style="{ transitionDelay: `${i * 40}ms` }"
            @click="menuOpen = false"
          >
            <span class="drawer-link-label">{{ link.label }}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
        </nav>

        <!-- Auth buttons -->
        <div class="drawer-auth">
          <NuxtLink to="/register" class="btn btn-primary btn-block" @click="menuOpen = false">
            Get started — it's free
          </NuxtLink>
          <NuxtLink to="/login" class="btn btn-ghost btn-block" @click="menuOpen = false">
            Log in
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="menuOpen" class="backdrop" @click="menuOpen = false" aria-hidden="true" />
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { BRAND } from '~/data/site'
import { NAV_LINKS } from '~/constants/navigation'

const route = useRoute()
const { liveRate, hasLiveRate } = useDerivRate()

const scrolled = ref(false)
const progress = ref(0)
const menuOpen = ref(false)

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)

// Close drawer on route change
watch(() => route.path, () => { menuOpen.value = false })

// Lock body scroll when drawer is open
watch(menuOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

const onScroll = () => {
  const y = window.scrollY
  scrolled.value = y > 12
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(y / max, 1) : 0
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 200;
  height: var(--nav-h);
  border-bottom: 1px solid transparent;
  transition: background 0.35s var(--ease), border-color 0.35s, backdrop-filter 0.35s;
}
.nav--solid {
  background: rgba(8, 8, 10, 0.92);
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
  gap: 8px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-right: auto;
}
.brand-img {
  height: 36px;
  width: 36px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--hairline);
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

/* Desktop nav */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-right: auto;
}
.nav-link {
  padding: 8px 14px;
  border-radius: var(--r-full);
  font-size: 14.5px;
  font-weight: 500;
  color: var(--muted);
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;
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

.nav-auth {
  padding: 9px 18px;
  font-size: 13.5px;
}
.nav-cta {
  padding: 9px 20px;
  font-size: 13.5px;
}

/* Hamburger */
.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  border: 1px solid var(--hairline);
  background: var(--surface-2);
  cursor: pointer;
  flex-shrink: 0;
}
.burger-bar {
  display: block;
  width: 18px;
  height: 1.5px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.3s var(--ease), opacity 0.3s var(--ease), width 0.3s var(--ease);
  transform-origin: center;
}
/* Animate to X */
.burger[aria-expanded="true"] .burger-bar:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.burger[aria-expanded="true"] .burger-bar:nth-child(2) {
  opacity: 0;
  width: 0;
}
.burger[aria-expanded="true"] .burger-bar:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* ── Mobile drawer ─────────────────────────────────── */
.drawer {
  position: fixed;
  top: var(--nav-h);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 190;
  background: rgba(8, 8, 10, 0.97);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-top: 1px solid var(--hairline);
  display: flex;
  flex-direction: column;
  padding: 24px clamp(20px, 5vw, 40px) 40px;
  overflow-y: auto;
  gap: 8px;
}

.drawer-rate {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-radius: var(--r-lg);
  background: var(--accent-soft);
  border: 1px solid rgb(var(--accent-rgb) / 0.22);
  margin-bottom: 8px;
}
.drawer-rate .rate-value {
  font-size: 15px;
  font-weight: 700;
  color: #2fd4c8;
  font-variant-numeric: tabular-nums;
  flex: 1;
}
.drawer-rate-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.7;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.drawer-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: var(--r-lg);
  font-size: 17px;
  font-weight: 600;
  color: var(--muted);
  border: 1px solid transparent;
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s var(--ease);
}
.drawer-link:hover,
.drawer-link--active {
  background: var(--surface-2);
  color: var(--text);
  border-color: var(--hairline);
}
.drawer-link--active {
  color: var(--primary-light);
  border-color: rgb(var(--primary-rgb) / 0.25);
  background: var(--primary-soft);
}
.drawer-link svg {
  opacity: 0.35;
  flex-shrink: 0;
}

.drawer-auth {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--hairline);
}

/* Backdrop */
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 180;
  background: rgba(0, 0, 0, 0.5);
}

/* Transitions */
.drawer-enter-active {
  transition: transform 0.38s var(--ease-out-expo), opacity 0.3s var(--ease);
}
.drawer-leave-active {
  transition: transform 0.28s var(--ease), opacity 0.25s var(--ease);
}
.drawer-enter-from {
  transform: translateY(-12px);
  opacity: 0;
}
.drawer-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

.fade-enter-active { transition: opacity 0.25s var(--ease); }
.fade-leave-active { transition: opacity 0.2s var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 1024px) {
  .nav-links { display: none; }
  .nav-auth { display: none; }
  .nav-cta { display: none; }
  .rate-pill { display: none; }
  .burger { display: flex; }
}

@media (max-width: 480px) {
  .brand-sub { display: none; }
  .brand-img { height: 32px; width: 32px; }
  .brand-name { font-size: 15.5px; }
}
</style>
