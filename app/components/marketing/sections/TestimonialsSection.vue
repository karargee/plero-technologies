<template>
  <section class="tp section--alt">
    <div class="container">
      <div class="tp__head">
        <h2 class="tp__title">What our traders say</h2>
      </div>

      <div class="tp__bleed">
        <div class="tp__carousel" ref="trackRef">
          <a
            v-for="item in TESTIMONIALS"
            :key="item.name"
            class="tp__card"
            href="#"
            @click.prevent
          >
            <div class="tp__stars" aria-label="5 stars">
              <svg v-for="n in 5" :key="n" viewBox="0 0 20 20" width="18" height="18" fill="#00b67a">
                <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32L2.27 6.62l5.34-.78z"/>
              </svg>
            </div>
            <p class="tp__quote">"{{ item.quote }}"</p>
            <p class="tp__author">{{ item.name }}</p>
            <p class="tp__role">{{ item.role }}</p>
          </a>
        </div>
      </div>

      <div class="tp__foot">
        <div class="tp__nav">
          <button type="button" class="tp__nav-btn" aria-label="Previous" @click="scroll(-1)" :disabled="atStart">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button type="button" class="tp__nav-btn" aria-label="Next" @click="scroll(1)" :disabled="atEnd">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TESTIMONIALS } from '~/data/site'

const trackRef = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function scroll(dir: 1 | -1) {
  const el = trackRef.value
  if (!el) return
  el.scrollBy({ left: dir * 340, behavior: 'smooth' })
}

onMounted(() => {
  const el = trackRef.value
  if (!el) return
  const update = () => {
    atStart.value = el.scrollLeft <= 4
    atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
  }
  update()
  el.addEventListener('scroll', update, { passive: true })
  onBeforeUnmount(() => el.removeEventListener('scroll', update))
})
</script>

<style scoped>
.tp {
  padding-block: clamp(64px, 9vw, 116px);
  background: var(--bg-alt);
  border-block: 1px solid var(--hairline);
}
.tp__head {
  margin-bottom: 40px;
}
.tp__title {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
}
.tp__bleed {
  margin-inline: calc(clamp(20px, 5vw, 40px) * -1);
  padding-inline: clamp(20px, 5vw, 40px);
  overflow: hidden;
}
.tp__carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding-bottom: 4px;
}
.tp__carousel::-webkit-scrollbar { display: none; }
.tp__card {
  flex-shrink: 0;
  width: 320px;
  scroll-snap-align: start;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-lg);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.28s var(--ease), border-color 0.28s, box-shadow 0.28s;
  cursor: default;
}
.tp__card:hover {
  transform: translateY(-4px);
  border-color: var(--hairline-strong);
  box-shadow: var(--shadow-md);
}
.tp__stars {
  display: flex;
  gap: 2px;
}
.tp__quote {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text);
  flex: 1;
}
.tp__author {
  font-size: 14px;
  font-weight: 600;
}
.tp__role {
  font-size: 12px;
  color: var(--muted-3);
}
.tp__foot {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
}
.tp__nav {
  display: flex;
  gap: 8px;
}
.tp__nav-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--hairline);
  background: var(--surface);
  color: var(--text);
  transition: background 0.2s, border-color 0.2s;
}
.tp__nav-btn:hover:not(:disabled) {
  background: var(--surface-2);
  border-color: var(--hairline-strong);
}
.tp__nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
