<script setup lang="ts">
const { site, home, images, bg } = useContent()
</script>

<template>
  <section class="section cta-wrap">
    <div class="container">
      <div v-reveal:zoom class="cta" :style="{ '--img': bg(images.cta) }">
        <LogoMark class="cta__mark" :size="220" light />
        <div class="cta__copy">
          <h2>{{ home.cta.title }}</h2>
          <p>{{ home.cta.text }}</p>
        </div>
        <div class="cta__actions">
          <NuxtLink to="/deriv" class="btn btn--light">Deposit now</NuxtLink>
          <a :href="site.contact.whatsapp" target="_blank" rel="noopener" class="btn btn--ghost-dark">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-wrap {
  padding-top: 0;
}
.cta-wrap:first-child {
  padding-top: clamp(64px, 9vw, 112px);
}
.cta {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 32px;
  padding: clamp(36px, 6vw, 64px);
  border-radius: 28px;
  background: linear-gradient(110deg, rgb(19 18 58 / 0.96) 0%, rgb(38 36 107 / 0.88) 50%, rgb(76 79 166 / 0.7) 100%),
    var(--img) center 30% / cover no-repeat, var(--navy-800);
  color: #fff;
  box-shadow: var(--shadow-lg);
}
.cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 20%, rgb(255 255 255 / 0.08) 45%, transparent 60%);
  background-size: 250% 100%;
  animation: shimmer 7s linear infinite;
  pointer-events: none;
}
.cta__mark {
  animation: float 9s ease-in-out infinite;
}
.cta__mark {
  position: absolute;
  right: -40px;
  top: -50px;
  opacity: 0.12;
  pointer-events: none;
}
.cta__copy {
  position: relative;
}
h2 {
  font-size: clamp(28px, 4vw, 40px);
}
p {
  margin-top: 12px;
  font-size: 18px;
  color: rgb(255 255 255 / 0.78);
}
.cta__actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
@media (max-width: 860px) {
  .cta {
    grid-template-columns: 1fr;
  }
}
</style>
