<template>
  <AuthShell
    headline="Join the traders who trade on"
    accent="live numbers."
    :perks="SIGN_UP_PERKS"
    :quote="{
      text: 'Submitted a $200 card at 11pm. Money was in my account before midnight.',
      by: 'Amaka O. · Lagos',
    }"
  >
    <h2 class="form-title">Create your account</h2>
    <p class="form-sub">Free, and you stay free until you trade.</p>

    <form class="stack" @submit.prevent="submit">
      <div class="grid-2">
        <div>
          <label class="field-label" for="first">First name</label>
          <input id="first" v-model="form.firstName" required class="input-field" placeholder="Ada" autocomplete="given-name" />
        </div>
        <div>
          <label class="field-label" for="last">Last name</label>
          <input id="last" v-model="form.lastName" required class="input-field" placeholder="Okafor" autocomplete="family-name" />
        </div>
      </div>

      <div>
        <label class="field-label" for="email">Email address</label>
        <input id="email" v-model="form.email" type="email" required class="input-field" placeholder="you@email.com" autocomplete="email" />
      </div>

      <div>
        <label class="field-label" for="phone">Phone number</label>
        <input id="phone" v-model="form.phone" type="tel" required class="input-field" placeholder="+234 800 000 0000" autocomplete="tel" />
      </div>

      <div>
        <label class="field-label" for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          minlength="8"
          class="input-field"
          placeholder="Minimum 8 characters"
          autocomplete="new-password"
        />
        <div class="meter">
          <span v-for="level in 4" :key="level" :class="{ 'meter-on': score >= level }" />
        </div>
        <p class="meter-label">{{ STRENGTH_LABELS[score] }}</p>
      </div>

      <div>
        <label class="field-label" for="ref">Referral code <span class="muted-2">(optional)</span></label>
        <input id="ref" v-model="form.ref" class="input-field" placeholder="PLERO-XXXX" />
      </div>

      <label class="terms">
        <input v-model="agreed" type="checkbox" required />
        <span>
          I agree to the <a href="#" class="link-strong">Terms of Service</a> and
          <a href="#" class="link-strong">Privacy Policy</a>.
        </span>
      </label>

      <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
        {{ loading ? 'Creating account…' : 'Create free account' }}
        <AppIcon v-if="!loading" name="arrow" :size="17" />
      </button>
    </form>

    <p class="switch">
      Already registered?
      <NuxtLink to="/login" class="link-strong">Sign in</NuxtLink>
    </p>
  </AuthShell>
</template>

<script setup lang="ts">
import { SIGN_UP_PERKS } from '~/data/site'

definePageMeta({ layout: 'auth' })

const router = useRouter()
const { signIn } = useAuth()

const STRENGTH_LABELS = ['Use 8+ characters', 'Weak', 'Fair', 'Good', 'Strong']

const form = reactive({ firstName: '', lastName: '', email: '', phone: '', password: '', ref: '' })
const agreed = ref(false)
const loading = ref(false)

const score = computed(() => {
  const value = form.password
  if (!value) return 0
  let points = 0
  if (value.length >= 8) points++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) points++
  if (/\d/.test(value)) points++
  if (/[^\w\s]/.test(value)) points++
  return points
})

const submit = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 900))
  signIn({ email: form.email, name: form.firstName, phone: form.phone })
  await router.push('/home')
}

useHead({ title: 'Create account — Plero Technologies' })
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
  gap: 15px;
  margin-top: 28px;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.meter {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin-top: 9px;
}
.meter span {
  height: 3px;
  border-radius: 999px;
  background: var(--surface-3);
  transition: background 0.25s var(--ease);
}
.meter-on {
  background: var(--accent) !important;
}
.meter-label {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted-3);
}
.terms {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: var(--muted-2);
  line-height: 1.55;
  cursor: pointer;
}
.terms input {
  accent-color: var(--primary);
  width: 16px;
  height: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}
.link-strong {
  color: var(--primary-light);
  font-weight: 600;
}
.link-strong:hover {
  color: var(--primary);
}
.switch {
  margin-top: 26px;
  text-align: center;
  font-size: 14px;
  color: var(--muted-2);
}

@media (max-width: 560px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
