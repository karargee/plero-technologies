<script setup lang="ts">
import { deriv } from '~/data/site'
</script>

<template>
  <section class="section register-wrap">
    <div class="container">
      <div v-reveal class="register">
        <div>
          <span class="eyebrow">New to Deriv?</span>
          <h2>Create your free Deriv account in 2 minutes</h2>
          <p>
            Sign up with our link, then message us to fund your account in Naira. We'll guide you through
            your first deposit step by step.
          </p>
          <ul>
            <li><AppIcon name="check" :size="18" /> Free to open</li>
            <li><AppIcon name="check" :size="18" /> Practice with a demo account</li>
            <li><AppIcon name="check" :size="18" /> Fund through Plero in Naira</li>
          </ul>
        </div>
        <div class="register__actions">
          <a :href="deriv.signupUrl" target="_blank" rel="noopener" class="btn btn--primary">
            Register on Deriv <AppIcon name="arrow" :size="18" />
          </a>
          <NuxtLink to="/deriv" class="btn btn--ghost">How deposits work</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.register-wrap {
  padding-block: clamp(48px, 6vw, 72px);
}
.register {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 32px;
  padding: clamp(28px, 5vw, 48px);
  border-radius: 28px;
  background: linear-gradient(135deg, var(--indigo-50), #fff 70%);
  border: 1px solid var(--indigo-100);
}
h2 {
  font-size: clamp(26px, 3.5vw, 36px);
  max-width: 560px;
}
p {
  margin-top: 12px;
  max-width: 560px;
  color: var(--ink-soft);
  font-size: 17px;
}
ul {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  font-size: 14.5px;
  color: var(--ink-soft);
}
li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
li svg {
  color: var(--success);
}
.register__actions {
  display: grid;
  gap: 10px;
}
@media (max-width: 860px) {
  .register {
    grid-template-columns: 1fr;
  }
  .register__actions {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
