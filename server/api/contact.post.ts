// Receives the Support page form and emails it to you via Resend (https://resend.com).
// Configure with env vars: NUXT_RESEND_API_KEY, NUXT_CONTACT_TO, NUXT_CONTACT_FROM.

interface ContactBody {
  name?: unknown
  email?: unknown
  topic?: unknown
  message?: unknown
  website?: unknown // honeypot — real visitors never fill this in
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export default defineEventHandler(async (event) => {
  const body = (await readBody<ContactBody>(event)) ?? {}

  // Bots fill hidden fields; pretend success and drop it.
  if (clean(body.website, 200)) return { ok: true }

  const name = clean(body.name, 100)
  const email = clean(body.email, 200)
  const topic = clean(body.topic, 60) || 'General'
  const message = clean(body.message, 5000)

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    throw createError({ statusCode: 400, statusMessage: 'Please fill in your name, a valid email and a message.' })
  }

  const { resendApiKey, contactTo, contactFrom } = useRuntimeConfig(event)
  const { url: sbUrl, serviceKey } = supabaseConfig(event)
  const canEmail = Boolean(resendApiKey && contactTo)
  const canStore = Boolean(sbUrl && serviceKey)

  // Nothing set up yet → the browser falls back to opening the visitor's email app.
  if (!canEmail && !canStore) {
    throw createError({ statusCode: 503, statusMessage: 'Contact form is not configured yet.' })
  }

  let delivered = false

  // 1) Save to Supabase so it appears in /admin → Messages.
  if (canStore) {
    try {
      await supabaseInsert(event, 'messages', { name, email, topic, message })
      delivered = true
    } catch (err) {
      console.error('[contact] Supabase insert failed', err)
    }
  }

  // 2) Also email it, if Resend is set up.
  if (canEmail) {
    try {
      await $fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendApiKey}` },
        body: {
          from: contactFrom,
          to: [contactTo],
          reply_to: email,
          subject: `[Website · ${topic}] ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
        },
      })
      delivered = true
    } catch (err) {
      console.error('[contact] Resend error', err)
    }
  }

  if (!delivered) {
    throw createError({ statusCode: 502, statusMessage: 'Could not send your message. Please try again or use WhatsApp.' })
  }
  return { ok: true }
})
