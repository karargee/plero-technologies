<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <NuxtLink to="/" class="brand-row">
            <img :src="BRAND.logo" alt="" class="footer-logo logo-plate" />
            <span class="brand-name">{{ BRAND.legalName }}</span>
          </NuxtLink>
          <p class="footer-desc">
            The trading infrastructure behind fast, transparent gift card exchange in Nigeria.
            Live rates, instant settlement, always-on support.
          </p>
          <div class="socials">
            <a v-for="social in SOCIAL_LINKS" :key="social.label" :href="social.href" class="social" :aria-label="social.label">
              <AppIcon :name="social.icon" :size="17" />
            </a>
          </div>
        </div>

        <nav v-for="column in FOOTER_COLUMNS" :key="column.title" class="footer-col" :aria-label="column.title">
          <p class="col-title">{{ column.title }}</p>
          <NuxtLink v-for="link in column.links" :key="link.to + link.label" :to="link.to" class="col-link">
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="footer-col footer-col--wide">
          <p class="col-title">Stay on the rate</p>
          <p class="col-copy">Get rate movement alerts before the market does.</p>
          <form class="subscribe" @submit.prevent="subscribed = true">
            <input
              v-model="email"
              type="email"
              required
              class="subscribe-input"
              placeholder="you@email.com"
              :disabled="subscribed"
            />
            <button type="submit" class="btn btn-primary subscribe-btn" :aria-label="subscribed ? 'Subscribed' : 'Subscribe'">
              <AppIcon :name="subscribed ? 'check' : 'send'" :size="17" />
            </button>
          </form>
          <p v-if="subscribed" class="subscribe-ok">You're on the list. We'll be in touch.</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ year }} {{ BRAND.legalName }} All rights reserved.</p>
        <div class="bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">AML Policy</a>
          <span class="status"><span class="live-dot" /> All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { BRAND, FOOTER_COLUMNS, SOCIAL_LINKS } from '~/data/site'

const year = new Date().getFullYear()
const email = ref('')
const subscribed = ref(false)
</script>

<style scoped>
.footer {
  background: var(--bg-alt);
  border-top: 1px solid var(--hairline);
  padding-top: clamp(56px, 7vw, 88px);
  margin-top: auto;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.6fr repeat(3, 0.8fr) 1.3fr;
  gap: 40px;
  padding-bottom: 56px;
}

.brand-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.footer-logo {
  height: 34px;
  width: 34px;
  object-fit: cover;
  border-radius: 9px;
  border: 1px solid var(--hairline);
}
.brand-name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.footer-desc {
  color: var(--muted-2);
  font-size: 14px;
  line-height: 1.75;
  max-width: 34ch;
  margin-bottom: 22px;
}

.socials {
  display: flex;
  gap: 8px;
}
.social {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  color: var(--muted);
  transition: all 0.2s var(--ease);
}
.social:hover {
  color: var(--text);
  border-color: var(--hairline-strong);
  background: var(--surface-3);
  transform: translateY(-2px);
}

.col-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text);
  margin-bottom: 18px;
}
.col-link {
  display: block;
  font-size: 14px;
  color: var(--muted-2);
  padding: 6px 0;
  transition: color 0.2s, transform 0.2s;
}
.col-link:hover {
  color: var(--text);
  transform: translateX(3px);
}
.col-copy {
  font-size: 13.5px;
  color: var(--muted-2);
  margin-bottom: 14px;
}

.subscribe {
  display: flex;
  gap: 8px;
}
.subscribe-input {
  flex: 1;
  min-width: 0;
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  border-radius: var(--r-full);
  padding: 10px 16px;
  font-size: 14px;
}
.subscribe-input::placeholder {
  color: var(--muted-3);
}
.subscribe-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-soft);
}
.subscribe-btn {
  width: 42px;
  height: 42px;
  padding: 0;
  flex-shrink: 0;
}
.subscribe-ok {
  margin-top: 10px;
  font-size: 13px;
  color: var(--accent);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  padding: 24px 0 32px;
  border-top: 1px solid var(--hairline);
  font-size: 13px;
  color: var(--muted-3);
}
.bottom-links {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}
.bottom-links a {
  color: var(--muted-2);
  transition: color 0.2s;
}
.bottom-links a:hover {
  color: var(--text);
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

@media (max-width: 1024px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }
  .footer-brand,
  .footer-col--wide {
    grid-column: 1 / -1;
  }
}
@media (max-width: 560px) {
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
