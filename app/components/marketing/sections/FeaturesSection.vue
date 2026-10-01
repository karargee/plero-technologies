<template>
  <section class="fs">
    <div class="fs__inner container">
      <h2 class="fs__header">Everything you need to trade smarter</h2>
      <div class="fs__layout">
        <!-- Sticky visual panel -->
        <div class="fs__media-col" aria-hidden="true">
          <div class="fs__media-sticky">
            <div class="fs__media-wrap">
              <transition name="fade" mode="out-in">
                <div :key="activeIndex" class="fs__media-item">
                  <div class="fs__visual">
                    <span class="fs__visual-icon">
                      <AppIcon :name="activeFeature.icon" :size="56" />
                    </span>
                    <div class="fs__visual-ring" />
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Scrolling content -->
        <div class="fs__content-col">
          <div
            v-for="(feature, i) in FEATURES"
            :key="feature.title"
            class="fs__item"
            :ref="el => setItemRef(el, i)"
            :class="{ 'fs__item--active': activeIndex === i }"
          >
            <span class="fs__item-icon"><AppIcon :name="feature.icon" :size="20" /></span>
            <h3 class="fs__item-title">{{ feature.title }}</h3>
            <p class="fs__item-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Mobile: simple grid -->
      <div class="fs__mobile">
        <div v-for="feature in FEATURES" :key="feature.title" class="fs__mobile-item">
          <span class="fs__mobile-icon"><AppIcon :name="feature.icon" :size="22" /></span>
          <h3 class="fs__item-title">{{ feature.title }}</h3>
          <p class="fs__item-desc">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FEATURES } from '~/data/site'

const activeIndex = ref(0)
const itemRefs = ref<(Element | null)[]>([])

/** Active feature, with a defined fallback so an out-of-range index cannot
 *  produce an undefined access in the template. */
const activeFeature = computed(() => FEATURES[activeIndex.value] ?? FEATURES[0]!)

function setItemRef(el: Element | ComponentPublicInstance | null, i: number) {
  itemRefs.value[i] = el as Element | null
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const i = itemRefs.value.indexOf(entry.target)
          if (i !== -1) activeIndex.value = i
        }
      }
    },
    { threshold: 0.5 },
  )
  for (const el of itemRefs.value) {
    if (el) observer.observe(el)
  }
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<style scoped>
.fs {
  padding-block: clamp(64px, 9vw, 116px);
}
.fs__header {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: clamp(48px, 7vw, 80px);
  max-width: 22ch;
}
.fs__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
.fs__media-col {
  position: sticky;
  top: calc(var(--nav-h) + 40px);
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fs__media-sticky {
  width: 100%;
  height: 100%;
}
.fs__media-wrap {
  width: 100%;
  height: 100%;
  border-radius: var(--r-xl);
  background: var(--surface);
  border: 1px solid var(--hairline);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.fs__visual {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.fs__visual-icon {
  display: grid;
  place-items: center;
  width: 120px;
  height: 120px;
  border-radius: 32px;
  background: var(--primary-soft);
  color: var(--primary-light);
  position: relative;
  z-index: 1;
}
.fs__visual-ring {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 1px solid var(--hairline);
  animation: ring-spin 12s linear infinite;
}
.fs__visual-ring::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-light);
  transform: translateX(-50%);
}

.fs__content-col {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.fs__item {
  padding: 32px 0;
  border-bottom: 1px solid var(--hairline);
  opacity: 0.4;
  transition: opacity 0.4s var(--ease);
  cursor: default;
}
.fs__item:first-child { padding-top: 0; }
.fs__item--active { opacity: 1; }
.fs__item-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  color: var(--primary-light);
  margin-bottom: 16px;
}
.fs__item-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}
.fs__item-desc {
  font-size: 15px;
  color: var(--muted);
  line-height: 1.7;
  max-width: 48ch;
}

/* Mobile grid — hidden on desktop */
.fs__mobile { display: none; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes ring-spin { to { transform: rotate(1turn); } }

@media (max-width: 900px) {
  .fs__layout { display: none; }
  .fs__mobile {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .fs__mobile-item {
    padding: 24px;
    border-radius: var(--r-lg);
    background: var(--surface);
    border: 1px solid var(--hairline);
    transition: transform 0.28s var(--ease), border-color 0.28s;
  }
  .fs__mobile-item:hover {
    transform: translateY(-3px);
    border-color: var(--hairline-strong);
  }
  .fs__mobile-icon {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--r-md);
    background: var(--surface-2);
    border: 1px solid var(--hairline);
    color: var(--primary-light);
    margin-bottom: 14px;
  }
}
@media (max-width: 560px) {
  .fs__mobile { grid-template-columns: 1fr; }
}
</style>
