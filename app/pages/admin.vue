<script setup lang="ts">
// Private admin app. Runs only in the browser (routeRules in nuxt.config.ts).
// Access = a Supabase Auth user whose email is listed in the `admins` table.
import type { Session } from '@supabase/supabase-js'

definePageMeta({ layout: false, pageTransition: false })
useHead({
  title: 'Plero Admin',
  htmlAttrs: { lang: 'en' },
  bodyAttrs: { style: 'background:#090918' },
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'theme-color', content: '#090918' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'Plero Admin' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
  ],
  link: [
    { rel: 'manifest', href: '/admin.webmanifest' },
    { rel: 'apple-touch-icon', href: '/icons/admin-180.png' },
  ],
})

type Section = 'dashboard' | 'rates' | 'content' | 'reviews' | 'messages'
const nav: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Overview', icon: 'home' },
  { id: 'rates', label: 'Rates', icon: 'chart' },
  { id: 'content', label: 'Content', icon: 'edit' },
  { id: 'reviews', label: 'Reviews', icon: 'star' },
  { id: 'messages', label: 'Inbox', icon: 'mail' },
]

const sb = useSupabase()
const route = useRoute()
const router = useRouter()
const session = ref<Session | null>(null)
const isAdmin = ref<boolean | null>(null)
const booting = ref(true)

// ---------- Sign in ----------
const email = ref('')
const password = ref('')
const showPw = ref(false)
const signingIn = ref(false)
const authError = ref('')

async function checkAdmin() {
  if (!sb || !session.value) return (isAdmin.value = null)
  // RLS only lets a user see their own row in `admins`, so any row back means "is admin".
  const { data, error } = await sb.from('admins').select('email').limit(1).maybeSingle()
  if (error && /jwt|token|auth/i.test(`${error.message} ${error.code ?? ''}`)) {
    await sb.auth.signOut()
    return (isAdmin.value = null)
  }
  isAdmin.value = !error && !!data
  if (isAdmin.value) refreshCounts()
}

async function signIn() {
  if (!sb) return
  authError.value = ''
  signingIn.value = true
  const { error } = await sb.auth.signInWithPassword({ email: email.value.trim(), password: password.value })
  signingIn.value = false
  if (error) authError.value = error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message
  else password.value = ''
}

async function signOut() {
  if (!confirmLeave()) return
  await sb?.auth.signOut()
  isAdmin.value = null
}

// ---------- Navigation (kept in the URL so refresh/back work) ----------
const section = computed<Section>(() => (nav.some((n) => n.id === route.query.s) ? (route.query.s as Section) : 'dashboard'))
const sub = computed(() => String(route.query.sub ?? ''))
const contentRef = ref<{ confirmLeave: () => boolean } | null>(null)
const contentDirty = ref(false)

function confirmLeave() {
  return !contentDirty.value || confirm('You have unsaved changes. Leave without saving?')
}
function go(s: Section | string, subKey?: string) {
  if (s === section.value && !subKey) return
  if (!confirmLeave()) return
  contentDirty.value = false
  router.push({ query: { s, ...(subKey ? { sub: subKey } : {}) } })
  if (import.meta.client) window.scrollTo({ top: 0 })
}
const ratesTab = computed(() => (sub.value === 'cards' ? 'cards' : 'rates'))

// ---------- Badges ----------
const pending = ref(0)
const unread = ref(0)
async function refreshCounts() {
  if (!sb) return
  const [p, m] = await Promise.all([
    sb.from('testimonials').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('messages').select('id', { count: 'exact', head: true }).eq('read', false),
  ])
  pending.value = p.count ?? 0
  unread.value = m.count ?? 0
}
const badge = (id: Section) => (id === 'reviews' ? pending.value : id === 'messages' ? unread.value : 0)

// ---------- Toasts ----------
const toast = ref<{ msg: string; kind: 'ok' | 'err' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined
function showToast(msg: string, kind: 'ok' | 'err' = 'ok') {
  toast.value = { msg, kind }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), kind === 'err' ? 7000 : 3500)
}

onMounted(async () => {
  if (!sb) {
    booting.value = false
    return
  }
  const { data } = await sb.auth.getSession()
  session.value = data.session
  await checkAdmin()
  booting.value = false
  sb.auth.onAuthStateChange(async (_event, s) => {
    session.value = s
    await checkAdmin()
  })
})
</script>

<template>
  <div class="adm">
    <!-- Not configured -->
    <div v-if="!sb" class="center">
      <div class="a-card a-card--pad box">
        <PayLogo light :size="34" />
        <h1>Admin isn’t connected yet</h1>
        <p class="a-muted">Supabase settings are missing. Add them in Vercel → Settings → Environment Variables, then redeploy.</p>
        <a href="/" class="a-btn">← Back to website</a>
      </div>
    </div>

    <div v-else-if="booting" class="center"><span class="spinner" aria-label="Loading" /></div>

    <!-- Sign in -->
    <div v-else-if="!session" class="login">
      <div class="login__art" aria-hidden="true">
        <div class="orb o1" />
        <div class="orb o2" />
        <div class="art__in">
          <PayLogo light :size="44" />
          <h2>Run Plero from anywhere.</h2>
          <p>Rates, content, reviews and messages — on your phone or computer.</p>
          <div class="art__chips">
            <span><AppIcon name="chart" :size="16" /> Live rates</span>
            <span><AppIcon name="edit" :size="16" /> Edit any text</span>
            <span><AppIcon name="star" :size="16" /> Approve reviews</span>
          </div>
        </div>
      </div>
      <div class="login__form">
        <form class="a-card a-card--pad box" @submit.prevent="signIn">
          <div class="login__logo"><LogoMark :size="48" light /></div>
          <h1>Welcome back</h1>
          <p class="a-muted">Sign in to the Plero admin.</p>
          <label class="a-label">
            Email
            <input v-model="email" class="a-input" type="email" autocomplete="username" inputmode="email" required />
          </label>
          <label class="a-label">
            Password
            <span class="pw">
              <input v-model="password" class="a-input" :type="showPw ? 'text' : 'password'" autocomplete="current-password" required />
              <button type="button" class="pw__t" :aria-label="showPw ? 'Hide password' : 'Show password'" @click="showPw = !showPw">
                {{ showPw ? 'Hide' : 'Show' }}
              </button>
            </span>
          </label>
          <p v-if="authError" class="err" role="alert">{{ authError }}</p>
          <button class="a-btn a-btn--primary big" type="submit" :disabled="signingIn">
            {{ signingIn ? 'Signing in…' : 'Sign in' }}
          </button>
          <a href="/" class="back">← Back to website</a>
        </form>
      </div>
    </div>

    <!-- Signed in, not an admin -->
    <div v-else-if="isAdmin === false" class="center">
      <div class="a-card a-card--pad box">
        <h1>No admin access</h1>
        <p class="a-muted"><b>{{ session.user.email }}</b> is signed in but isn’t on the admin list.</p>
        <button class="a-btn" type="button" @click="signOut">Sign out</button>
      </div>
    </div>

    <!-- App -->
    <div v-else-if="isAdmin" class="app">
      <!-- Sidebar (desktop) -->
      <aside class="side">
        <div class="side__brand"><PayLogo light :size="34" /></div>
        <nav class="side__nav" aria-label="Admin">
          <button
            v-for="n in nav"
            :key="n.id"
            type="button"
            class="side__link"
            :class="{ on: section === n.id }"
            :aria-current="section === n.id ? 'page' : undefined"
            @click="go(n.id)"
          >
            <AppIcon :name="n.icon" :size="19" />
            <span>{{ n.label === 'Inbox' ? 'Messages' : n.label }}</span>
            <b v-if="badge(n.id)" class="a-count">{{ badge(n.id) }}</b>
          </button>
        </nav>
        <div class="side__foot">
          <a href="/" target="_blank" rel="noopener" class="side__link"><AppIcon name="arrow" :size="19" /><span>View website</span></a>
          <div class="me">
            <span class="me__av">{{ (session.user.email ?? '?')[0]!.toUpperCase() }}</span>
            <span class="me__mail">{{ session.user.email }}</span>
            <button type="button" class="me__out" aria-label="Sign out" title="Sign out" @click="signOut">
              <AppIcon name="logout" :size="18" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Top bar (mobile) -->
      <header class="top">
        <PayLogo light :size="28" />
        <div class="top__r">
          <a href="/" target="_blank" rel="noopener" class="a-btn a-btn--sm">Site ↗</a>
          <button type="button" class="a-btn a-btn--sm a-btn--icon" aria-label="Sign out" @click="signOut"><AppIcon name="logout" :size="17" /></button>
        </div>
      </header>

      <main class="main">
        <AdminDashboard
          v-if="section === 'dashboard'"
          :sb="sb"
          :email="session.user.email ?? ''"
          @go="go"
          @toast="showToast"
          @counts="(c) => ((pending = c.pending), (unread = c.unread))"
        />
        <template v-else-if="section === 'rates'">
          <div class="a-seg sub">
            <button type="button" :class="{ on: ratesTab === 'rates' }" @click="go('rates', 'rates')">Rates</button>
            <button type="button" :class="{ on: ratesTab === 'cards' }" @click="go('rates', 'cards')">Gift cards</button>
          </div>
          <AdminRates v-if="ratesTab === 'rates'" :sb="sb" @toast="showToast" />
          <AdminGiftCards v-else :sb="sb" @toast="showToast" />
        </template>
        <AdminContent
          v-else-if="section === 'content'"
          ref="contentRef"
          :key="sub"
          :sb="sb"
          :initial="sub"
          @toast="showToast"
          @dirty="contentDirty = $event"
        />
        <AdminTestimonials v-else-if="section === 'reviews'" :sb="sb" @toast="showToast" @pending="pending = $event" />
        <AdminMessages v-else :sb="sb" @toast="showToast" @unread="unread = $event" />
      </main>

      <!-- Bottom tabs (mobile) -->
      <nav class="tabs" aria-label="Admin">
        <button
          v-for="n in nav"
          :key="n.id"
          type="button"
          :class="{ on: section === n.id }"
          :aria-current="section === n.id ? 'page' : undefined"
          @click="go(n.id)"
        >
          <span class="tabs__i">
            <AppIcon :name="n.icon" :size="22" />
            <b v-if="badge(n.id)" class="tabs__b">{{ badge(n.id) }}</b>
          </span>
          {{ n.label }}
        </button>
      </nav>
    </div>

    <div v-else class="center"><span class="spinner" aria-label="Loading" /></div>

    <Transition name="a-fade">
      <div v-if="toast" class="toast" :class="toast.kind" role="status">
        <span class="toast__i">{{ toast.kind === 'err' ? '!' : '✓' }}</span>{{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<style src="../assets/css/admin.css"></style>
<style scoped>
.center {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
}
.box {
  width: 100%;
  max-width: 420px;
  display: grid;
  gap: 16px;
  box-shadow: var(--a-shadow);
}
.box h1 {
  font-size: 26px;
}
.spinner {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid var(--a-panel-3);
  border-top-color: var(--a-accent);
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ---------- Login ---------- */
.login {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
}
.login__art {
  position: relative;
  overflow: hidden;
  display: grid;
  align-items: end;
  padding: 56px;
  background: linear-gradient(160deg, #15154a 0%, #0b0b24 70%);
  border-right: 1px solid var(--a-line);
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: drift 18s ease-in-out infinite;
}
.o1 {
  width: 480px;
  height: 480px;
  top: -120px;
  right: -100px;
  background: rgb(129 135 255 / 0.45);
}
.o2 {
  width: 360px;
  height: 360px;
  bottom: -80px;
  left: -80px;
  background: rgb(52 211 153 / 0.25);
  animation-delay: -8s;
}
@keyframes drift {
  50% {
    transform: translate(30px, 20px) scale(1.08);
  }
}
.art__in {
  position: relative;
  display: grid;
  gap: 18px;
  max-width: 460px;
}
.art__in h2 {
  font-size: clamp(32px, 3.6vw, 46px);
  letter-spacing: -0.03em;
  line-height: 1.08;
}
.art__in p {
  color: var(--a-soft);
  font-size: 17px;
}
.art__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.art__chips span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.07);
  border: 1px solid var(--a-line);
  font-size: 13.5px;
  font-weight: 600;
}
.login__form {
  display: grid;
  place-items: center;
  padding: 32px 20px;
}
.login__logo {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgb(129 135 255 / 0.35), rgb(91 96 230 / 0.15));
  border: 1px solid var(--a-line-2);
}
.pw {
  position: relative;
  display: flex;
}
.pw .a-input {
  padding-right: 64px;
}
.pw__t {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: var(--a-panel-2);
  color: var(--a-soft);
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.err {
  padding: 10px 12px;
  border-radius: 10px;
  background: rgb(255 107 129 / 0.12);
  color: var(--a-red);
  font-size: 14px;
}
.big {
  height: 50px;
  font-size: 16px;
}
.back {
  justify-self: center;
  font-size: 14px;
  color: var(--a-mute);
}

/* ---------- App shell ---------- */
.app {
  min-height: 100dvh;
}
.side {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 30;
  width: 256px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px 14px;
  background: rgb(8 8 22 / 0.75);
  border-right: 1px solid var(--a-line);
  backdrop-filter: blur(18px);
}
.side__brand {
  padding: 4px 10px 12px;
}
.side__nav {
  display: grid;
  gap: 4px;
}
.side__link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 12px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--a-soft);
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.side__link:hover {
  background: var(--a-panel);
  color: var(--a-text);
}
.side__link.on {
  background: linear-gradient(90deg, rgb(129 135 255 / 0.22), rgb(129 135 255 / 0.06));
  color: #fff;
  box-shadow: inset 2px 0 0 var(--a-accent);
}
.side__link span {
  flex: 1;
}
.side__foot {
  margin-top: auto;
  display: grid;
  gap: 8px;
}
.me {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  background: var(--a-panel);
  border: 1px solid var(--a-line);
}
.me__av {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--a-accent), var(--a-accent-2));
  font-weight: 700;
}
.me__mail {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: var(--a-soft);
}
.me__out {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--a-soft);
  cursor: pointer;
}
.me__out:hover {
  background: rgb(255 107 129 / 0.12);
  color: var(--a-red);
}
.top {
  display: none;
}
.main {
  margin-left: 256px;
  max-width: 1180px;
  padding: 32px clamp(16px, 3vw, 40px) 64px;
}
.sub {
  margin-bottom: 20px;
}
.tabs {
  display: none;
}

/* ---------- Toast ---------- */
.toast {
  position: fixed;
  z-index: 400;
  left: 50%;
  top: calc(16px + env(safe-area-inset-top));
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(92vw, 560px);
  padding: 12px 16px 12px 12px;
  border-radius: 14px;
  background: rgb(22 22 52 / 0.96);
  border: 1px solid var(--a-line-2);
  box-shadow: var(--a-shadow);
  font-size: 14.5px;
  font-weight: 600;
  backdrop-filter: blur(12px);
}
.toast__i {
  flex: none;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgb(52 211 153 / 0.18);
  color: var(--a-green);
  font-size: 14px;
}
.toast.err .toast__i {
  background: rgb(255 107 129 / 0.18);
  color: var(--a-red);
}

/* ---------- Mobile / tablet ---------- */
@media (max-width: 1023px) {
  .side {
    display: none;
  }
  .top {
    position: sticky;
    top: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: calc(10px + env(safe-area-inset-top)) 16px 10px;
    background: rgb(9 9 24 / 0.82);
    border-bottom: 1px solid var(--a-line);
    backdrop-filter: blur(16px);
  }
  .top__r {
    display: flex;
    gap: 6px;
  }
  .main {
    margin-left: 0;
    padding: 20px 16px calc(100px + env(safe-area-inset-bottom));
  }
  .tabs {
    position: fixed;
    z-index: 30;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
    background: rgb(9 9 24 / 0.9);
    border-top: 1px solid var(--a-line);
    backdrop-filter: blur(18px);
  }
  .tabs button {
    display: grid;
    justify-items: center;
    gap: 3px;
    padding: 6px 2px;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: var(--a-mute);
    font: inherit;
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
  }
  .tabs button.on {
    color: #fff;
  }
  .tabs button.on .tabs__i {
    background: rgb(129 135 255 / 0.22);
    color: #c7c9ff;
  }
  .tabs__i {
    position: relative;
    display: grid;
    place-items: center;
    width: 52px;
    height: 32px;
    border-radius: 999px;
    transition: background-color 0.15s ease;
  }
  .tabs__b {
    position: absolute;
    top: -3px;
    right: 6px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--a-red);
    color: #fff;
    font-size: 10.5px;
    line-height: 18px;
  }
  .login {
    grid-template-columns: 1fr;
  }
  .login__art {
    min-height: 240px;
    padding: 32px 24px;
    border-right: 0;
    border-bottom: 1px solid var(--a-line);
  }
  .art__in p,
  .art__chips {
    display: none;
  }
  .login__form {
    align-items: start;
    padding-top: 24px;
  }
}
</style>
