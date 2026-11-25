<script setup lang="ts">
import { deriv, nav } from '~/data/site'

const open = ref(false)
const scrolled = ref(false)
const route = useRoute()

watch(() => route.fullPath, () => (open.value = false))

function onScroll() {
  scrolled.value = window.scrollY > 8
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled || open }">
    <div class="container header__inner">
      <BrandLogo />

      <nav class="header__nav" aria-label="Main">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="header__link">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="header__actions">
        <a :href="deriv.signupUrl" target="_blank" rel="noopener" class="btn btn--primary header__cta">Register on Deriv</a>
        <button
          class="header__toggle"
          type="button"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          @click="open = !open"
        >
          <span class="sr-only">{{ open ? 'Close menu' : 'Open menu' }}</span>
          <AppIcon :name="open ? 'close' : 'menu'" />
        </button>
      </div>
    </div>

    <Transition name="drop">
      <nav v-if="open" id="mobile-nav" class="mobile-nav" aria-label="Mobile">
        <div class="container">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="mobile-nav__link">
            {{ item.label }}
          </NuxtLink>
          <a :href="deriv.signupUrl" target="_blank" rel="noopener" class="btn btn--primary btn--block">Register on Deriv</a>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgb(255 255 255 / 0.85);
  backdrop-filter: saturate(160%) blur(12px);
  -webkit-backdrop-filter: saturate(160%) blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.header.is-scrolled {
  border-bottom-color: var(--line);
  box-shadow: 0 6px 24px -18px rgb(20 20 43 / 0.4);
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 72px;
}
.header__nav {
  display: flex;
  gap: 4px;
}
.header__link {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 500;
  color: var(--ink-soft);
  transition: color 0.15s ease, background-color 0.15s ease;
}
.header__link:hover {
  color: var(--ink);
  background: var(--surface-alt);
}
.header__link.router-link-exact-active {
  color: var(--indigo-600);
  background: var(--indigo-50);
}
.header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header__cta {
  height: 42px;
  padding: 0 18px;
}
.header__toggle {
  display: none;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
}
.mobile-nav {
  border-top: 1px solid var(--line);
  background: #fff;
  padding-block: 12px 20px;
}
.mobile-nav .container {
  display: grid;
  gap: 4px;
}
.mobile-nav__link {
  padding: 12px 4px;
  font-weight: 500;
  border-bottom: 1px solid var(--line);
}
.mobile-nav__link.router-link-exact-active {
  color: var(--indigo-600);
}
.mobile-nav .btn {
  margin-top: 12px;
}
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 1100px) {
  .header__nav {
    display: none;
  }
  .header__toggle {
    display: grid;
  }
}
@media (max-width: 560px) {
  .header__cta {
    display: none;
  }
}
</style>
