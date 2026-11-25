<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <section class="section cta-wrap">
    <div class="container">
      <div v-reveal class="cta">
        <LogoMark class="cta__mark" :size="220" light />
        <div class="cta__copy">
          <h2>Got a gift card you won't use?</h2>
          <p>Check today's rate and get paid in minutes. It takes less time than making tea.</p>
        </div>
        <div class="cta__actions">
          <NuxtLink to="/rates" class="btn btn--light">Check rates</NuxtLink>
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
  background: linear-gradient(120deg, var(--navy-800), var(--indigo-500));
  color: #fff;
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
