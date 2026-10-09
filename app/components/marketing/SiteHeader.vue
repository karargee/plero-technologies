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

      <!-- Desktop actions -->
      <div class="nav-actions">
        <NuxtLink to="/rates" class="rate-pill" :title="hasLiveRate ? 'Live Deriv rate' : 'Cached rate'">
          <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
          <span class="rate-value">$1 = ₦{{ liveRate.toLocaleString('en-NG') }}</span>
        </NuxtLink>
        <NuxtLink to="/login" class="btn btn-ghost nav-auth">Log in</NuxtLink>
        <NuxtLink to="/register" class="btn btn-primary nav-cta">Get started</NuxtLink>

        <!-- Hamburger (mobile only) -->
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

    <!-- Mobile rate bar — visible below 1024px, above the drawer -->
    <div class="mobile-rate-bar">
      <NuxtLink to="/rates" class="mobile-rate-pill" @click="menuOpen = false">
        <span class="live-dot" :class="{ 'live-dot--off': !hasLiveRate }" />
        <span>$1 = ₦{{ liveRate.toLocaleString('en-NG') }}</span>
        <span class="mobile-rate-label">{{ hasLiveRate ? 'Live rate' : 'Cached' }}</span>
      </NuxtLink>
      <NuxtLink to="/register" class="mobile-cta-btn" @click="menuOpen = false">
        Get started
      </NuxtLink>
    </div>
  </header>

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
        <!-- Nav section label -->
        <p class="drawer-section-label">Navigation</p>

        <nav class="drawer-nav" aria-label="Mobile navigation">
          <NuxtLink
            v-for="link in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="drawer-link"
            :class="{ 'drawer-link--active': isActive(link.to) }"
            @click="menuOpen = false"
          >
            <span class="drawer-link-icon">
              <svg v-if="link.to === '/markets'" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12 6 7l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <svg v-else-if="link.to === '/rates'" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              <svg v-else-if="link.to === '/cards'" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M2 7h12" stroke="currentColor" stroke-width="1.5"/></svg>
              <svg v-else-if="link.to === '/how-it-works'" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 7.5V11M8 5.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM8 7v4M8 5.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </span>
            <span class="drawer-link-label">{{ link.label }}</span>
            <svg class="drawer-link-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
        </nav>

        <!-- Divider -->
        <div class="drawer-divider" />

        <!-- Account section -->
        <p class="drawer-section-label">Account</p>
        <div class="drawer-account">
          <NuxtLink to="/register" class="btn btn-primary btn-block drawer-btn" @click="menuOpen = false">
            Create free account
          </NuxtLink>
          <NuxtLink to="/login" class="btn btn-ghost btn-block drawer-btn" @click="menuOpen = false">
            Log in to Plero
          </NuxtLink>
        </div>

        <!-- Footer strip -->
        <div class="drawer-footer">
          <NuxtLink to="/support" class="drawer-support-link" @click="menuOpen = false">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M6.5 6.5a1.5 1.5 0 0 1 3 .5c0 1-1.5 1.5-1.5 2.5M8 11.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            Need help? Contact support
          </NuxtLink>
          <span class="drawer-version">Plero Technologies</span>
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
  background: rgba(14, 14, 14, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--hairline);
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
  z-index: 1;
}

.nav-inner {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ── Brand ─────────────────────────────────────────── */
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

/* ── Desktop nav ───────────────────────────────────── */
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
  width: 40px;
  height: 40px;
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

/* ── Mobile rate bar (shown below nav bar on mobile) ── */
.mobile-rate-bar {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--surface);
  border-top: 1px solid var(--hairline);
}

.mobile-rate-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.mobile-rate-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-2);
  padding: 2px 7px;
  border-radius: var(--r-full);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
}

.mobile-cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 7px 16px;
  border-radius: var(--r-md);
  background: var(--primary);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s;
}
.mobile-cta-btn:hover { background: var(--primary-hover); }

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 1024px) {
  .nav-links, .nav-auth, .nav-cta, .rate-pill { display: none; }
  .burger { display: flex; }
  .mobile-rate-bar { display: flex; }
}
@media (max-width: 480px) {
  .brand-sub { display: none; }
  .brand-img { height: 32px; width: 32px; }
  .brand-name { font-size: 15.5px; }
}
</style>

<!-- Unscoped: teleported drawer lives outside this component's DOM -->
<style>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 201;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
}

.drawer {
  position: fixed;
  top: var(--nav-h);
  left: 0;
  right: 0;
  height: calc(100dvh - var(--nav-h));
  z-index: 202;
  background: #0c0c0f;
  border-top: 1px solid var(--hairline);
  display: flex;
  flex-direction: column;
  padding: 20px 16px 32px;
  overflow-y: auto;
}

.drawer-section-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted-3);
  padding: 0 4px;
  margin-bottom: 8px;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 8px;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--muted);
  border: 1px solid transparent;
  text-decoration: none;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.drawer-link:hover {
  background: rgba(255,255,255,0.04);
  color: #fff;
  border-color: var(--hairline);
}
.drawer-link--active {
  background: rgba(255, 68, 79, 0.07);
  color: #fff;
  border-color: rgba(255, 68, 79, 0.18);
}

.drawer-link-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  color: var(--muted);
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.drawer-link:hover .drawer-link-icon,
.drawer-link--active .drawer-link-icon {
  background: rgba(255, 68, 79, 0.1);
  border-color: rgba(255, 68, 79, 0.2);
  color: var(--primary);
}

.drawer-link-label {
  flex: 1;
}

.drawer-link-arrow {
  opacity: 0.2;
  flex-shrink: 0;
  transition: opacity 0.15s, transform 0.15s;
}
.drawer-link:hover .drawer-link-arrow {
  opacity: 0.5;
  transform: translateX(2px);
}
.drawer-link--active .drawer-link-arrow {
  opacity: 0.4;
  color: var(--primary);
}

.drawer-divider {
  height: 1px;
  background: var(--hairline);
  margin: 16px 0;
}

.drawer-account {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 8px;
}

.drawer-btn {
  height: 48px;
  font-size: 14.5px;
  border-radius: var(--r-lg);
}

.drawer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid var(--hairline);
}

.drawer-support-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-2);
  transition: color 0.15s;
}
.drawer-support-link:hover { color: var(--text); }

.drawer-version {
  font-size: 12px;
  color: var(--muted-3);
  font-weight: 500;
}

/* Transitions */
.drawer-enter-active { transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease; }
.drawer-leave-active { transition: transform 0.22s ease, opacity 0.18s ease; }
.drawer-enter-from  { transform: translateY(-12px); opacity: 0; }
.drawer-leave-to    { transform: translateY(-6px);  opacity: 0; }

.fade-enter-active { transition: opacity 0.22s ease; }
.fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
