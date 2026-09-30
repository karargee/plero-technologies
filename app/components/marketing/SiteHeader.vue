<template>
  <header class="nav" :class="{ 'nav--solid': scrolled || open }">
    <div class="nav-progress" :style="{ transform: `scaleX(${progress})` }" />

    <div class="container nav-inner">
      <NuxtLink to="/" class="brand" :aria-label="`${BRAND.legalName} home`">
        <img :src="BRAND.logo" alt="" class="brand-img logo-plate" />
        <span class="brand-text">
          <span class="brand-name">{{ BRAND.name }}</span>
          <span class="brand-sub">Technologies</span>
        </span>
      </NuxtLink>

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

      <div class="nav-actions">
        <NuxtLink to="/rates" class="rate-pill" :title="connected ? 'Live Deriv rate' : 'Cached rate'">
          <span class="live-dot" :class="{ 'live-dot--off': !connected }" />
          <span class="rate-value">$1 = ₦{{ liveRate.toLocaleString('en-NG') }}</span>
        </NuxtLink>
        <NuxtLink to="/login" class="btn btn-ghost nav-auth">Log in</NuxtLink>
        <NuxtLink to="/register" class="btn btn-primary nav-cta">Get started</NuxtLink>
        <button class="burger" :aria-expanded="open" aria-label="Toggle menu" @click="open = !open">
          <AppIcon :name="open ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <!--
      Teleported to <body> on purpose: the header carries a backdrop-filter,
      which makes it the containing block for position:fixed descendants and
      would collapse this sheet into the 68px header box.
    -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="open" class="sheet" @click.self="close">
          <nav class="sheet-links" aria-label="Mobile">
            <NuxtLink
              v-for="link in NAV_LINKS"
              :key="link.to"
              :to="link.to"
              class="sheet-link"
              :class="{ 'sheet-link--active': isActive(link.to) }"
              @click="close"
            >
              {{ link.label }}
              <AppIcon name="arrow" :size="16" />
            </NuxtLink>
          </nav>
          <div class="sheet-actions">
            <NuxtLink to="/login" class="btn btn-ghost btn-block" @click="close">Log in</NuxtLink>
            <NuxtLink to="/register" class="btn btn-primary btn-block" @click="close">
              Create free account
            </NuxtLink>
          </div>
          <p class="sheet-foot">
            <AppIcon name="headset" :size="15" /> Support available 24/7
          </p>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { BRAND } from '~/data/site'
import { NAV_LINKS } from '~/constants/navigation'

const route = useRoute()
const { liveRate, connected } = useDerivRate()

const scrolled = ref(false)
const progress = ref(0)
const open = ref(false)

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)
const close = () => (open.value = false)

const onScroll = () => {
  const y = window.scrollY
  scrolled.value = y > 12
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(y / max, 1) : 0
}

watch(() => route.fullPath, close)
watch(open, value => {
  document.documentElement.style.overflow = value ? 'hidden' : ''
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  document.documentElement.style.overflow = ''
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

.burger {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  border: 1px solid var(--hairline);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  place-items: center;
}

/* Teleported to <body>, so this is positioned against the viewport. */
.sheet {
  position: fixed;
  inset: var(--nav-h) 0 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px clamp(20px, 5vw, 40px) calc(32px + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  overscroll-behavior: contain;
  background: rgba(9, 9, 13, 0.96);
  backdrop-filter: blur(26px) saturate(160%);
  -webkit-backdrop-filter: blur(26px) saturate(160%);
  border-top: 1px solid var(--hairline);
}
.sheet-links {
  display: flex;
  flex-direction: column;
}
.sheet-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 4px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--muted);
  border-bottom: 1px solid var(--hairline);
}
.sheet-link--active {
  color: var(--text);
}
.sheet-link--active :deep(.icon) {
  color: var(--primary);
}
.sheet-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sheet-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  font-size: 13px;
  color: var(--muted-2);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s var(--ease), transform 0.25s var(--ease);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 1024px) {
  .nav-links,
  .nav-auth {
    display: none;
  }
  .burger {
    display: grid;
  }
}
@media (max-width: 560px) {
  .rate-pill,
  .brand-text {
    display: none;
  }
}
</style>
