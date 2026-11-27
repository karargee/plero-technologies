<script setup lang="ts">
import { deriv, footerNav as nav, payNav, site } from '~/data/site'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <BrandLogo light />
        <p>{{ site.tagline }}</p>
        <RegistrationBadge dark class="footer__reg" />
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
        <h4>Plero Pay</h4>
        <ul>
          <li v-for="item in payNav" :key="item.to">
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

    <div class="container footer__risk">
      <p>
        <strong>Risk warning:</strong> Deriv offers complex derivatives, such as options and CFDs, which carry a
        high risk of losing money. Only trade with money you can afford to lose.
        {{ site.name }} is an independent Deriv payment agent and does not provide investment advice. Market data
        is supplied by Deriv. Plero Pay is a service of {{ site.name }}. Crypto-asset prices can change quickly and
        blockchain transfers cannot be reversed. Deriv, Tether/USDT, Airtm, Alipay, WeChat Pay and gift card brand
        names are trademarks of their respective owners; we are not affiliated with or endorsed by them.
      </p>
    </div>
    <div class="container footer__bottom">
      <span>
        © {{ year }} {{ site.registration.legalName || site.name }}.
        <template v-if="site.registration.rcNumber">{{ site.registration.rcNumber }}. </template>All rights reserved.
      </span>
      <a :href="deriv.signupUrl" target="_blank" rel="noopener">Register on Deriv</a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: radial-gradient(700px 300px at 85% 0%, rgb(76 79 166 / 0.25), transparent 70%), var(--navy-950);
  color: rgb(255 255 255 / 0.7);
  padding-top: 72px;
  font-size: 15px;
}
.footer__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.3fr 0.8fr;
  gap: 40px;
  padding-bottom: 56px;
}
.footer::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--indigo-400), #8ee0b9, var(--indigo-400), transparent);
  background-size: 200% 100%;
  animation: shimmer 6s linear infinite;
}
.footer__reg {
  margin-top: 18px;
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
.footer__risk {
  padding-block: 20px;
  border-top: 1px solid rgb(255 255 255 / 0.1);
  font-size: 12.5px;
  line-height: 1.6;
  color: rgb(255 255 255 / 0.5);
}
.footer__risk strong {
  color: rgb(255 255 255 / 0.75);
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
