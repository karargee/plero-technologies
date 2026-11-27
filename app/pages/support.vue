<script setup lang="ts">
const { site, pages, images, bg } = useContent()

useSeoMeta({
  title: 'Support',
  description: 'Get help with a trade or contact the Plero Technologies team.',
})

const channels = computed(() => {
  const c = site.value.contact
  return [
    { icon: 'chat', label: 'WhatsApp', value: 'Chat with the trade desk', href: c.whatsapp, external: true },
    { icon: 'mail', label: 'Email', value: c.email, href: `mailto:${c.email}` },
    { icon: 'phone', label: 'Phone', value: c.phone, href: `tel:${c.phone.replace(/\s/g, '')}` },
    { icon: 'clock', label: 'Hours', value: c.hours },
  ].filter((x) => x.value)
})

const form = reactive({ name: '', email: '', topic: 'Deriv deposit', message: '', website: '' })
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMsg = ref('')

function openMailFallback() {
  const subject = `[${form.topic}] Message from ${form.name}`
  const body = `${form.message}\n\n— ${form.name} (${form.email})`
  window.location.href = `mailto:${site.value.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

async function submit() {
  status.value = 'sending'
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    status.value = 'sent'
    Object.assign(form, { name: '', email: '', message: '', website: '' })
  } catch (err: any) {
    // Server email not set up yet → hand off to the visitor's email app instead.
    if (err?.statusCode === 503) {
      status.value = 'idle'
      openMailFallback()
      return
    }
    status.value = 'error'
    errorMsg.value = err?.statusMessage || 'Something went wrong. Please try again or use WhatsApp.'
  }
}
</script>

<template>
  <div>
    <section class="page-hero page-hero--photo" :style="{ '--hero-img': bg(images.supportHeader) }">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">{{ pages.support.eyebrow }}</span>
        <h1>{{ pages.support.title }}</h1>
        <p>{{ pages.support.text }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container support">
        <div class="channels">
          <component
            :is="c.href ? 'a' : 'div'"
            v-for="c in channels"
            :key="c.label"
            v-reveal
            class="channel card"
            :href="c.href"
            :target="c.external ? '_blank' : undefined"
            :rel="c.external ? 'noopener' : undefined"
          >
            <span class="channel__icon"><AppIcon :name="c.icon" /></span>
            <span>
              <small>{{ c.label }}</small>
              <strong>{{ c.value }}</strong>
            </span>
          </component>
        </div>

        <form v-reveal class="form card" @submit.prevent="submit">
          <h2>Send us a message</h2>
          <div class="form__row">
            <div class="field">
              <label for="f-name">Your name</label>
              <input id="f-name" v-model="form.name" class="input" required autocomplete="name" />
            </div>
            <div class="field">
              <label for="f-email">Email</label>
              <input id="f-email" v-model="form.email" class="input" type="email" required autocomplete="email" />
            </div>
          </div>
          <div class="field">
            <label for="f-topic">Topic</label>
            <select id="f-topic" v-model="form.topic" class="input">
              <option>Deriv deposit</option>
              <option>Deriv withdrawal</option>
              <option>Opening a Deriv account</option>
              <option>USDT</option>
              <option>Airtm USD</option>
              <option>China supplier payment</option>
              <option>Gift cards</option>
              <option>Partnerships</option>
              <option>Something else</option>
            </select>
          </div>
          <div class="field">
            <label for="f-msg">Message</label>
            <textarea id="f-msg" v-model="form.message" class="input" required />
          </div>
          <!-- honeypot: hidden from people, catches bots -->
          <input v-model="form.website" class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />

          <p v-if="status === 'sent'" class="form__msg form__msg--ok" role="status">
            <AppIcon name="check" :size="18" /> Thanks! Your message was sent — we'll reply soon.
          </p>
          <p v-else-if="status === 'error'" class="form__msg form__msg--err" role="alert">{{ errorMsg }}</p>

          <button type="submit" class="btn btn--primary" :disabled="status === 'sending'">
            {{ status === 'sending' ? 'Sending…' : 'Send message' }}
            <AppIcon v-if="status !== 'sending'" name="arrow" :size="18" />
          </button>
        </form>
      </div>
    </section>

    <FaqSection alt />
  </div>
</template>

<style scoped>
.support {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
  align-items: start;
}
.channels {
  display: grid;
  gap: 14px;
}
.channel {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
a.channel:hover {
  border-color: var(--indigo-200);
  box-shadow: var(--shadow);
}
.channel > span:last-child {
  display: grid;
  min-width: 0;
}
.channel small {
  color: var(--ink-mute);
  font-size: 13px;
}
.channel strong {
  overflow-wrap: anywhere;
}
.channel__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--indigo-50);
  color: var(--indigo-500);
}
.form {
  display: grid;
  gap: 18px;
  padding: clamp(22px, 4vw, 36px);
}
.form h2 {
  font-size: 24px;
}
.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form .btn {
  justify-self: start;
}
.form .btn:disabled {
  opacity: 0.7;
  cursor: progress;
}
.hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.form__msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  font-size: 15px;
}
.form__msg--ok {
  background: #e7f6ef;
  color: var(--success);
}
.form__msg--err {
  background: #fdecea;
  color: #b42318;
}
@media (max-width: 900px) {
  .support {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .form__row {
    grid-template-columns: 1fr;
  }
  .form .btn {
    justify-self: stretch;
  }
}
</style>
