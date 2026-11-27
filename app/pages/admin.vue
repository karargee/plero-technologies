<script setup lang="ts">
// Private admin dashboard. Runs only in the browser (see routeRules in nuxt.config.ts).
// Access = a Supabase Auth user whose email is listed in the `admins` table.
import type { Session } from '@supabase/supabase-js'

definePageMeta({ layout: false })
useHead({ title: 'Admin', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const sb = useSupabase()
const session = ref<Session | null>(null)
const isAdmin = ref<boolean | null>(null)
const booting = ref(true)

const email = ref('')
const password = ref('')
const signingIn = ref(false)
const authError = ref('')

const tab = ref<'rates' | 'cards' | 'messages'>('rates')
const unread = ref(0)

const toast = ref<{ msg: string; kind: 'ok' | 'err' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined
function showToast(msg: string, kind: 'ok' | 'err' = 'ok') {
  toast.value = { msg, kind }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), kind === 'err' ? 7000 : 3500)
}

async function checkAdmin() {
  if (!sb || !session.value) return (isAdmin.value = null)
  // RLS only lets a user see their own row in `admins`, so any row back means "is admin".
  const { data, error } = await sb.from('admins').select('email').limit(1).maybeSingle()
  if (error && /jwt|token|auth/i.test(`${error.message} ${error.code ?? ''}`)) {
    // Expired or invalid session → show the sign-in form again.
    await sb.auth.signOut()
    return (isAdmin.value = null)
  }
  isAdmin.value = !error && !!data
  if (isAdmin.value) {
    const { count } = await sb.from('messages').select('id', { count: 'exact', head: true }).eq('read', false)
    unread.value = count ?? 0
  }
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
  await sb?.auth.signOut()
  isAdmin.value = null
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
  <div class="admin">
    <!-- Supabase not set up yet -->
    <div v-if="!sb" class="center">
      <div class="card box">
        <PayLogo :size="34" />
        <h1>Admin isn’t connected yet</h1>
        <p>
          Add <code>NUXT_PUBLIC_SUPABASE_URL</code> and <code>NUXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment
          variables (Vercel → Settings → Environment Variables), then redeploy.
        </p>
        <NuxtLink to="/" class="btn btn--ghost">← Back to website</NuxtLink>
      </div>
    </div>

    <div v-else-if="booting" class="center"><span class="spinner" aria-label="Loading" /></div>

    <!-- Sign in -->
    <div v-else-if="!session" class="center">
      <form class="card box" @submit.prevent="signIn">
        <PayLogo :size="34" />
        <h1>Admin sign in</h1>
        <label class="field">
          <span>Email</span>
          <input v-model="email" class="input" type="email" autocomplete="username" required />
        </label>
        <label class="field">
          <span>Password</span>
          <input v-model="password" class="input" type="password" autocomplete="current-password" required />
        </label>
        <p v-if="authError" class="err" role="alert">{{ authError }}</p>
        <button class="btn btn--primary btn--block" type="submit" :disabled="signingIn">
          {{ signingIn ? 'Signing in…' : 'Sign in' }}
        </button>
        <NuxtLink to="/" class="back">← Back to website</NuxtLink>
      </form>
    </div>

    <!-- Signed in but not on the admin list -->
    <div v-else-if="isAdmin === false" class="center">
      <div class="card box">
        <h1>No admin access</h1>
        <p>
          <b>{{ session.user.email }}</b> is signed in but isn’t on the admin list. Add this email to the
          <code>admins</code> table in Supabase.
        </p>
        <button class="btn btn--ghost" type="button" @click="signOut">Sign out</button>
      </div>
    </div>

    <!-- Dashboard -->
    <template v-else-if="isAdmin">
      <header class="bar">
        <div class="bar__in">
          <PayLogo light :size="30" />
          <nav class="tabs" aria-label="Admin sections">
            <button type="button" :class="{ on: tab === 'rates' }" @click="tab = 'rates'">Rates</button>
            <button type="button" :class="{ on: tab === 'cards' }" @click="tab = 'cards'">Gift cards</button>
            <button type="button" :class="{ on: tab === 'messages' }" @click="tab = 'messages'">
              Messages <b v-if="unread" class="badge">{{ unread }}</b>
            </button>
          </nav>
          <div class="who">
            <a href="/" target="_blank" rel="noopener" class="view">View site ↗</a>
            <span class="mail">{{ session.user.email }}</span>
            <button type="button" class="out" @click="signOut">Sign out</button>
          </div>
        </div>
      </header>
      <main class="main">
        <AdminRates v-if="tab === 'rates'" :sb="sb" @toast="showToast" />
        <AdminGiftCards v-else-if="tab === 'cards'" :sb="sb" @toast="showToast" />
        <AdminMessages v-else :sb="sb" @toast="showToast" @unread="unread = $event" />
      </main>
    </template>

    <div v-else class="center"><span class="spinner" aria-label="Loading" /></div>

    <Transition name="toast">
      <div v-if="toast" class="toast" :class="toast.kind" role="status">{{ toast.msg }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100vh;
  background: var(--surface-alt);
}
.center {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
}
.box {
  width: 100%;
  max-width: 420px;
  display: grid;
  gap: 16px;
  padding: 32px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
.box h1 {
  font-size: 24px;
}
.box p {
  color: var(--ink-soft);
}
code {
  font-size: 13px;
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--indigo-50);
  color: var(--indigo-600);
  overflow-wrap: anywhere;
}
.field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
}
.err {
  color: #b42318 !important;
  font-size: 14px;
}
.back {
  justify-self: center;
  font-size: 14px;
  color: var(--ink-mute);
}
.btn:disabled {
  opacity: 0.6;
}
.spinner {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid var(--line);
  border-top-color: var(--indigo-500);
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--navy-900);
  color: #fff;
}
.bar__in {
  max-width: 1240px;
  margin: 0 auto;
  padding: 12px var(--gutter);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 24px;
}
.tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.08);
}
.tabs button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: rgb(255 255 255 / 0.75);
  padding: 8px 14px;
  border-radius: 9px;
  font-weight: 600;
  cursor: pointer;
}
.tabs button.on {
  background: #fff;
  color: var(--navy-800);
}
.badge {
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #f6465d;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}
.who {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
}
.view {
  color: var(--indigo-200);
  font-weight: 600;
}
.mail {
  color: rgb(255 255 255 / 0.6);
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.out {
  border: 1px solid rgb(255 255 255 / 0.2);
  background: transparent;
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}
.main {
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px var(--gutter) 64px;
}
.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 100;
  max-width: min(92vw, 560px);
  padding: 12px 18px;
  border-radius: 12px;
  background: var(--navy-900);
  color: #fff;
  box-shadow: var(--shadow-lg);
  font-size: 14.5px;
}
.toast.err {
  background: #b42318;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
@media (max-width: 720px) {
  .who {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
  .mail {
    display: none;
  }
}
</style>
