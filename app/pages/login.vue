<template>
  <AuthShell
    headline="Trade gift cards with the market,"
    accent="not against it."
    :perks="SIGN_IN_PERKS"
  >
    <h2 class="form-title">Welcome back</h2>
    <p class="form-sub">Sign in to settle your next order.</p>

    <form class="stack" @submit.prevent="submit">
      <div>
        <label class="field-label" for="email">Email address</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="input-field"
          placeholder="you@email.com"
          autocomplete="email"
        />
      </div>

      <div>
        <label class="field-label" for="password">Password</label>
        <div class="pw">
          <input
            id="password"
            v-model="form.password"
            :type="show ? 'text' : 'password'"
            required
            class="input-field"
            placeholder="Enter your password"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="pw-toggle"
            :aria-label="show ? 'Hide password' : 'Show password'"
            @click="show = !show"
          >
            <AppIcon :name="show ? 'lock' : 'globe'" :size="17" />
          </button>
        </div>
      </div>

      <div class="row-between">
        <label class="remember">
          <input v-model="remember" type="checkbox" />
          <span>Keep me signed in</span>
        </label>
        <a href="#" class="link">Forgot password?</a>
      </div>

      <button type="submit" class="btn btn-red btn-block btn-lg" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Sign in' }}
        <AppIcon v-if="!loading" name="arrow" :size="17" />
      </button>
    </form>

    <div class="divider"><span>or continue with</span></div>
    <div class="socials">
      <button v-for="option in PROVIDERS" :key="option.label" class="social" type="button">
        <AppIcon :name="option.icon" :size="16" />{{ option.label }}
      </button>
    </div>

    <p class="switch">
      No account yet?
      <NuxtLink to="/register" class="link-strong">Create one free</NuxtLink>
    </p>
  </AuthShell>
</template>

<script setup lang="ts">
import { SIGN_IN_PERKS } from '~/data/site'
import type { IconName } from '~/types'

definePageMeta({ layout: 'auth' })

const router = useRouter()
const { signIn } = useAuth()

const PROVIDERS: { label: string; icon: IconName }[] = [
  { label: 'Google', icon: 'globe' },
  { label: 'Apple', icon: 'spark' },
]

const form = reactive({ email: '', password: '' })
const show = ref(false)
const remember = ref(true)
const loading = ref(false)

const submit = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  signIn({ email: form.email })
  await router.push('/home')
}

useHead({ title: 'Sign in — Plero Technologies' })
</script>

<style scoped>
.form-title {
  font-size: clamp(26px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: -0.03em;
}
.form-sub {
  margin-top: 6px;
  color: var(--muted-2);
  font-size: 15px;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 30px;
}
.pw {
  position: relative;
}
.pw-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-2);
  display: grid;
  place-items: center;
}
.pw-toggle:hover {
  color: var(--text);
}
.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.remember {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 13.5px;
  color: var(--muted-2);
  cursor: pointer;
}
.remember input {
  accent-color: var(--primary);
  width: 16px;
  height: 16px;
}
.link {
  font-size: 13.5px;
  color: var(--muted-2);
  transition: color 0.2s;
}
.link:hover {
  color: var(--text);
}
.link-strong {
  color: var(--primary-light);
  font-weight: 600;
}
.link-strong:hover {
  color: var(--primary);
}
.divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 26px 0 18px;
  font-size: 12.5px;
  color: var(--muted-3);
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--hairline);
}
.socials {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px;
  border-radius: var(--r-full);
  background: var(--surface);
  border: 1px solid var(--hairline);
  color: var(--muted);
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.2s var(--ease);
}
.social:hover {
  color: var(--text);
  border-color: var(--hairline-strong);
  background: var(--surface-2);
}
.switch {
  margin-top: 28px;
  text-align: center;
  font-size: 14px;
  color: var(--muted-2);
}
</style>
