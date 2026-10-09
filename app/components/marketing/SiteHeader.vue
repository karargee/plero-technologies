<template>
  <header class="nav">
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

      <!-- Desktop actions + hamburger -->
      <div class="nav-actions">
        <NuxtLink to="/rates" class="rate-pill" :title="hasLiveRate ? 'Live Deriv rate' : 'Cached rate'">
          <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
          <span class="rate-value">$1 = ₦{{ liveRate.toLocaleString('en-NG') }}</span>
        </NuxtLink>
        <NuxtLink to="/login" class="btn btn-ghost nav-auth">Log in</NuxtLink>
        <NuxtLink to="/register" class="btn btn-primary nav-cta">Get started</NuxtLink>

        <button
          type="button"
          class="burger"
          :aria-expanded="String(menuOpen)"
          aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="burger-line" />
          <span class="burger-line" />
          <span class="burger-line" />
        </button>
      </div>
    </div>
  </header>

  <!-- Teleport drawer + backdrop outside header to avoid stacking context issues -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="menuOpen" class="backdrop" @click="menuOpen = false" aria-hidden="true" />
    </Transition>

    <Transition name="drawer">
      <div
        v-if="menuOpen"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <!-- Live rate -->
        <div class="drawer-rate">
          <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
          <span class="drawer-rate-value">$1 = ₦{{ liveRate.toLocaleString('en-NG') }}</span>
          <span class="drawer-rate-badge">{{ hasLiveRate ? 'Live' : 'Cached' }}</span>
        </div>

        <!-- Nav links -->
        <nav class="drawer-nav" aria-label="Mobile navigation">
          <NuxtLink
            v-for="link in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="drawer-link"
            :class="{ 'drawer-link--active': isActive(link.to) }"
            @click="menuOpen = false"
          >
            <span>{{ link.label }}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
        </nav>

        <!-- Auth -->
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
  </Teleport>
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

watch(() => route.path, () => { menuOpen.value = false })

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
  background: rgba(14, 14, 14, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--hairline);
  transition: border-color 0.25s;
}

.nav-progress {
  position: absolute;
  left: 0;
  bottom: -1px;
  height: 2px;
  width: 100%;
  transform-origin: 0 50%;
  transform: scaleX(0);
  background: var(--primary);
  opacity: 0.9;
}

.nav-inner {
  height: var(--nav-h);
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-right: 28px;
}
.brand-img {
  height: 36px;
  width: 36px;
  object-fit: cover;
  border-radius: var(--r-md);
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
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
}
.nav-link {
  padding: 8px 14px;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
}
.nav-link:hover { color: #fff; background: rgba(255,255,255,0.05); }
.nav-link--active { color: #fff; background: rgba(255,255,255,0.07); font-weight: 600; }

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
  padding: 5px 12px;
  border-radius: var(--r-full);
  background: rgba(0, 167, 103, 0.08);
  border: 1px solid rgba(0, 167, 103, 0.25);
  color: var(--accent);
  font-size: 12.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.nav-auth { padding: 8px 16px; font-size: 13.5px; border-radius: var(--r-md); }
.nav-cta  { padding: 8px 18px; font-size: 13.5px; border-radius: var(--r-md); }

/* ── Hamburger ─────────────────────────────────────── */
.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  border-radius: var(--r-md);
  border: 1px solid var(--hairline);
  background: var(--surface-2);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
}
.burger:hover { background: var(--surface-3); border-color: var(--hairline-strong); }

.burger-line {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.3s var(--ease), opacity 0.3s var(--ease);
  transform-origin: center;
}
.burger[aria-expanded="true"] .burger-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger[aria-expanded="true"] .burger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
.burger[aria-expanded="true"] .burger-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 1024px) {
  .nav-links, .nav-auth, .nav-cta, .rate-pill { display: none; }
  .burger { display: flex; }
}
@media (max-width: 480px) {
  .brand-sub { display: none; }
  .brand-img { height: 32px; width: 32px; }
  .brand-name { font-size: 15.5px; }
}
</style>

<!-- Unscoped styles for teleported elements (outside this component's DOM) -->
<style>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 201;
  background: rgba(0, 0, 0, 0.6);
}

.drawer {
  position: fixed;
  top: var(--nav-h);
  left: 0;
  right: 0;
  height: calc(100dvh - var(--nav-h));
  z-index: 202;
  background: #08080a;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  padding: 20px 24px 40px;
  gap: 6px;
  overflow-y: auto;
}

.drawer-rate {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(20, 184, 146, 0.1);
  border: 1px solid rgba(20, 184, 146, 0.2);
  margin-bottom: 8px;
}
.drawer-rate-value {
  font-size: 15px;
  font-weight: 700;
  color: #2fd4c8;
  font-variant-numeric: tabular-nums;
  flex: 1;
}
.drawer-rate-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #14b892;
  background: rgba(20, 184, 146, 0.15);
  padding: 3px 8px;
  border-radius: 999px;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.drawer-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(247, 247, 248, 0.6);
  border: 1px solid transparent;
  text-decoration: none;
  transition: background 0.18s, color 0.18s, border-color 0.18s;
}
.drawer-link:hover {
  background: rgba(255,255,255,0.05);
  color: #f7f7f8;
  border-color: rgba(255,255,255,0.07);
}
.drawer-link--active {
  background: rgba(111, 107, 242, 0.12);
  color: #a5a2fb;
  border-color: rgba(111, 107, 242, 0.22);
}
.drawer-link svg { opacity: 0.3; flex-shrink: 0; }
.drawer-link--active svg { opacity: 0.6; }

.drawer-auth {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
  margin-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.07);
}

/* Transitions */
.drawer-enter-active { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease; }
.drawer-leave-active { transition: transform 0.25s ease, opacity 0.2s ease; }
.drawer-enter-from  { transform: translateY(-16px); opacity: 0; }
.drawer-leave-to    { transform: translateY(-8px);  opacity: 0; }

.fade-enter-active { transition: opacity 0.25s ease; }
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
