<template>
  <section class="cta">
    <span class="glow-orb orb" aria-hidden="true" />
    <div class="container cta-inner">
      <h2 class="cta-title">{{ title }}</h2>
      <p class="cta-lede">{{ lede }}</p>
      <div class="btn-row cta-actions">
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
  padding-block: clamp(72px, 10vw, 128px);
  text-align: center;
  background: radial-gradient(ellipse 60% 100% at 50% 0%, rgb(var(--primary-rgb) / 0.09), transparent 65%);
}
.orb {
  width: 640px;
  height: 400px;
  bottom: -220px;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgb(var(--primary-2-rgb) / 0.16), transparent 70%);
}
.cta-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cta-title {
  font-size: clamp(30px, 5.4vw, 58px);
  font-weight: 800;
  letter-spacing: -0.035em;
  max-width: 18ch;
}
.cta-lede {
  margin-top: 20px;
  font-size: clamp(15px, 1.5vw, 18px);
  color: var(--muted);
  max-width: 50ch;
}
.cta-actions {
  justify-content: center;
  margin-top: 36px;
}
</style>
