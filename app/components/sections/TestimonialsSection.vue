<script setup lang="ts">
// Shows APPROVED reviews only (approved in /admin). Visitors can submit one; it waits for review.
const { testimonials, home } = useContent()
const head = computed(() => home.value.testimonials)

const open = ref(false)
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMsg = ref('')
const form = reactive({ name: '', location: '', service: 'Deriv deposit', quote: '', rating: 5, website: '' })
const services = ['Deriv deposit', 'Deriv withdrawal', 'USDT', 'Airtm USD', 'China supplier payment', 'Gift cards']

function openForm() {
  status.value = 'idle'
  errorMsg.value = ''
  open.value = true
}

async function submit() {
  status.value = 'sending'
  errorMsg.value = ''
  try {
    await $fetch('/api/testimonials', { method: 'POST', body: form })
    status.value = 'sent'
    Object.assign(form, { name: '', location: '', quote: '', rating: 5, website: '' })
  } catch (err: any) {
    status.value = 'error'
    errorMsg.value = err?.statusMessage || err?.data?.statusMessage || 'Something went wrong. Please try again.'
  }
}

const initials = (n: string) =>
  n
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
watch(open, (v) => {
  if (import.meta.client) {
    document.documentElement.style.overflow = v ? 'hidden' : ''
    v ? window.addEventListener('keydown', onKey) : window.removeEventListener('keydown', onKey)
  }
})
onBeforeUnmount(() => {
  if (import.meta.client) {
    document.documentElement.style.overflow = ''
    window.removeEventListener('keydown', onKey)
  }
})
</script>

<template>
  <section class="section section--alt reviews">
    <div class="container">
      <div v-reveal class="section-head section-head--center">
        <span class="eyebrow">{{ head.eyebrow }}</span>
        <h2 class="section-title">{{ head.title }}</h2>
        <p class="section-lead">{{ head.text }}</p>
      </div>

      <div v-if="testimonials.length" class="grid">
        <figure
          v-for="(t, i) in testimonials"
          :key="t.id"
          v-reveal="(i % 3) * 110"
          v-spotlight
          class="quote card"
          :class="{ featured: t.featured }"
        >
          <div class="quote__stars" :aria-label="`${t.rating} out of 5 stars`">
            <AppIcon v-for="n in 5" :key="n" name="star" :size="16" :class="{ off: n > t.rating }" />
          </div>
          <blockquote>“{{ t.quote }}”</blockquote>
          <figcaption>
            <span class="quote__avatar" aria-hidden="true">{{ initials(t.name) }}</span>
            <span>
              <strong>{{ t.name }}</strong>
              <small>{{ [t.location, t.service].filter(Boolean).join(' · ') }}</small>
            </span>
          </figcaption>
        </figure>
      </div>

      <div v-else v-reveal class="empty card">
        <span class="empty__stars" aria-hidden="true">
          <AppIcon v-for="n in 5" :key="n" name="star" :size="22" />
        </span>
        <h3>Be the first to share your experience</h3>
        <p>Traded with Plero? Your review helps other traders choose with confidence.</p>
      </div>

      <div v-reveal class="cta-row">
        <button type="button" class="btn btn--primary" @click="openForm">
          <AppIcon name="star" :size="18" /> Write a review
        </button>
        <span class="muted">Reviews are checked by our team before they appear.</span>
      </div>
    </div>

    <!-- Review form -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="open" class="overlay" @click.self="open = false">
          <div class="modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
            <button type="button" class="modal__close" aria-label="Close" @click="open = false">
              <AppIcon name="close" :size="20" />
            </button>

            <div v-if="status === 'sent'" class="done">
              <span class="done__icon"><AppIcon name="check" :size="30" /></span>
              <h3 id="review-title">Thank you!</h3>
              <p>Your review has been received. It will appear on the site once our team has checked it.</p>
              <button type="button" class="btn btn--primary" @click="open = false">Close</button>
            </div>

            <form v-else @submit.prevent="submit">
              <h3 id="review-title">Share your experience</h3>
              <p class="modal__sub">How was trading with Plero?</p>

              <div class="rate" role="radiogroup" aria-label="Your rating">
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  role="radio"
                  :aria-checked="form.rating === n"
                  :aria-label="`${n} star${n > 1 ? 's' : ''}`"
                  :class="{ on: n <= form.rating }"
                  @click="form.rating = n"
                >
                  <AppIcon name="star" :size="30" />
                </button>
              </div>

              <div class="row">
                <label class="field">
                  <span>Your name</span>
                  <input v-model="form.name" class="input" required maxlength="80" autocomplete="name" placeholder="e.g. Tunde A." />
                </label>
                <label class="field">
                  <span>City (optional)</span>
                  <input v-model="form.location" class="input" maxlength="80" placeholder="e.g. Lagos" />
                </label>
              </div>
              <label class="field">
                <span>Service you used</span>
                <select v-model="form.service" class="input">
                  <option v-for="s in services" :key="s">{{ s }}</option>
                </select>
              </label>
              <label class="field">
                <span>Your review</span>
                <textarea v-model="form.quote" class="input" required minlength="10" maxlength="1000" rows="4" placeholder="Tell other traders what it was like…" />
                <small class="count">{{ form.quote.length }}/1000</small>
              </label>
              <input v-model="form.website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />

              <p v-if="status === 'error'" class="err" role="alert">{{ errorMsg }}</p>
              <button type="submit" class="btn btn--primary btn--block" :disabled="status === 'sending'">
                {{ status === 'sending' ? 'Sending…' : 'Submit review' }}
              </button>
              <p class="fine">Please don’t include account numbers or personal financial details.</p>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.quote {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.quote:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}
.quote.featured {
  border-color: var(--indigo-200);
  background: linear-gradient(180deg, #fff, var(--indigo-50));
}
.quote::after {
  content: '\201C';
  position: absolute;
  top: 6px;
  right: 22px;
  font-family: Georgia, serif;
  font-size: 96px;
  line-height: 1;
  color: var(--indigo-100);
  pointer-events: none;
}
.quote__stars,
.empty__stars {
  display: flex;
  gap: 2px;
  color: #f5b301;
}
.quote__stars :deep(path),
.empty__stars :deep(path) {
  fill: currentColor;
}
.quote__stars .off {
  color: var(--line);
}
blockquote {
  margin: 0;
  flex: 1;
  font-size: 16.5px;
  color: var(--ink);
  overflow-wrap: anywhere;
}
figcaption {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
figcaption > span:last-child {
  display: grid;
  line-height: 1.3;
}
small {
  color: var(--ink-mute);
}
.quote__avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--indigo-500), var(--navy-700));
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}
.empty {
  display: grid;
  justify-items: center;
  gap: 10px;
  max-width: 560px;
  margin: 0 auto;
  padding: 36px 28px;
  text-align: center;
}
.empty h3 {
  font-size: 21px;
}
.empty p {
  color: var(--ink-soft);
}
.cta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px 18px;
  margin-top: 32px;
}
.cta-row .btn :deep(path) {
  fill: currentColor;
}
.muted {
  font-size: 14px;
  color: var(--ink-mute);
}

/* Modal */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgb(12 12 36 / 0.6);
  backdrop-filter: blur(6px);
  overflow-y: auto;
}
.modal {
  position: relative;
  width: 100%;
  max-width: 520px;
  padding: clamp(22px, 4vw, 32px);
  border-radius: 24px;
  background: #fff;
  box-shadow: var(--shadow-lg);
}
.modal form {
  display: grid;
  gap: 14px;
}
.modal h3 {
  font-size: 24px;
}
.modal__sub {
  margin-top: -8px;
  color: var(--ink-soft);
}
.modal__close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  background: var(--surface-alt);
  cursor: pointer;
}
.rate {
  display: flex;
  gap: 4px;
}
.rate button {
  border: 0;
  background: transparent;
  padding: 2px;
  color: var(--line);
  cursor: pointer;
  transition: transform 0.15s ease, color 0.15s ease;
}
.rate button:hover {
  transform: scale(1.12);
}
.rate button.on {
  color: #f5b301;
}
.rate :deep(path) {
  fill: currentColor;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.count {
  justify-self: end;
  font-size: 12px;
}
.hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.err {
  padding: 10px 12px;
  border-radius: 10px;
  background: #fdecea;
  color: #b42318;
  font-size: 14px;
}
.fine {
  text-align: center;
  font-size: 12.5px;
  color: var(--ink-mute);
}
.btn:disabled {
  opacity: 0.6;
}
.done {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 12px 0;
  text-align: center;
}
.done__icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e7f6ef;
  color: var(--success);
}
.done p {
  color: var(--ink-soft);
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(20px) scale(0.97);
}
@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr;
    max-width: 620px;
    margin-inline: auto;
  }
}
@media (max-width: 480px) {
  .row {
    grid-template-columns: 1fr;
  }
  .overlay {
    place-items: end center;
    padding: 0;
  }
  .modal {
    border-radius: 24px 24px 0 0;
    max-height: 92vh;
    overflow-y: auto;
  }
}
</style>
