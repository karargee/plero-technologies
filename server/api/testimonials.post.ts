// Visitors submit a review → saved as "pending" until approved in /admin.

const recent = new Map<string, number[]>() // ip → timestamps (simple flood protection)

function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : ''
}

export default defineEventHandler(async (event) => {
  const body = (await readBody<Record<string, unknown>>(event)) ?? {}
  if (clean(body.website, 100)) return { ok: true } // honeypot

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  if (hits.length >= 3) {
    throw createError({ statusCode: 429, statusMessage: 'Too many reviews from you just now. Please try again later.' })
  }

  const name = clean(body.name, 80)
  const location = clean(body.location, 80)
  const service = clean(body.service, 60)
  const quote = clean(body.quote, 1000)
  const rating = Math.round(Number(body.rating))

  if (!name || quote.length < 10 || !(rating >= 1 && rating <= 5)) {
    throw createError({ statusCode: 400, statusMessage: 'Please add your name, a rating and at least a sentence about your experience.' })
  }

  try {
    await supabaseInsert(event, 'testimonials', { name, location, service, quote, rating, status: 'pending', source: 'visitor' })
  } catch (err) {
    const notSetUp = err instanceof Error && err.message.includes('not configured')
    if (!notSetUp) console.error('[testimonials] insert failed', err)
    throw createError({
      statusCode: notSetUp ? 503 : 502,
      statusMessage: 'Reviews can’t be received right now. Please try again later.',
    })
  }

  hits.push(now)
  recent.set(ip, hits)
  return { ok: true }
})
