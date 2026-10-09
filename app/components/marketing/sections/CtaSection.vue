<template>
  <section class="cta" ref="sectionRef">
    <div class="container cta-inner">
      <h2 class="cta-title reveal">{{ title }}</h2>
      <p class="cta-lede reveal" style="transition-delay:0.1s">{{ lede }}</p>
      <div class="btn-row cta-actions reveal" style="transition-delay:0.2s">
        <NuxtLink to="/register" class="btn btn-primary btn-lg">
          {{ primaryLabel }}
          <AppIcon name="arrow" :size="17" />
        </NuxtLink>
        <NuxtLink :to="secondaryTo" class="btn btn-ghost btn-lg">{{ secondaryLabel }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
useReveal(sectionRef)

withDefaults(
  defineProps<{
    title: string
    lede: string
    primaryLabel?: string
    secondaryLabel?: string
    secondaryTo?: string
  }>(),
  {
    primaryLabel: 'Create free account',
    secondaryLabel: 'I already have one',
    secondaryTo: '/login',
  },
)
</script>

<style scoped>
.cta {
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--hairline);
  padding-block: clamp(72px, 9vw, 120px);
  text-align: center;
  background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255, 68, 79, 0.05), transparent 70%), var(--bg);
}

.cta-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cta-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 54px);
  font-weight: 800;
  letter-spacing: -0.035em;
  max-width: 20ch;
  color: #fff;
}

.cta-lede {
  margin-top: 18px;
  font-size: clamp(15px, 1.4vw, 18px);
  color: var(--muted);
  max-width: 52ch;
  line-height: 1.65;
}

.cta-actions {
  justify-content: center;
  margin-top: 32px;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .cta {
    padding-block: 56px;
  }
  .cta-actions {
    flex-direction: column;
    width: 100%;
  }
  .cta-actions .btn-lg {
    width: 100%;
    justify-content: center;
  }
}
</style>

