<script setup lang="ts">
import { nav, site } from '~/data/site'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <BrandLogo light />
        <p>{{ site.tagline }}</p>
      </div>

      <div>
        <h4>Company</h4>
        <ul>
          <li v-for="item in nav" :key="item.to">
            <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h4>Contact</h4>
        <ul>
          <li><a :href="`mailto:${site.contact.email}`">{{ site.contact.email }}</a></li>
          <li><a :href="`tel:${site.contact.phone.replace(/\s/g, '')}`">{{ site.contact.phone }}</a></li>
          <li><a :href="site.contact.whatsapp" target="_blank" rel="noopener">WhatsApp</a></li>
          <li>{{ site.contact.address }}</li>
        </ul>
      </div>

      <div>
        <h4>Follow us</h4>
        <ul>
          <li v-for="s in site.socials" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener">{{ s.label }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container footer__bottom">
      <span>© {{ year }} {{ site.name }}. All rights reserved.</span>
      <span>Gift card brand names belong to their respective owners.</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--navy-950);
  color: rgb(255 255 255 / 0.7);
  padding-top: 72px;
  font-size: 15px;
}
.footer__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.3fr 1fr;
  gap: 40px;
  padding-bottom: 56px;
}
.footer__brand p {
  margin-top: 18px;
  max-width: 300px;
}
h4 {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 16px;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
a {
  overflow-wrap: anywhere;
  transition: color 0.15s ease;
}
a:hover {
  color: #fff;
}
.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  padding-block: 24px;
  border-top: 1px solid rgb(255 255 255 / 0.1);
  font-size: 13px;
  color: rgb(255 255 255 / 0.5);
}
@media (max-width: 900px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer__brand {
    grid-column: 1 / -1;
  }
}
@media (max-width: 480px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
