/**
 * USD/NGN rate for pricing.
 *
 * Deriv's current public WebSocket does not expose a USD/NGN pair: the legacy
 * `exchange_rates` request returns UnrecognisedRequest on
 * `api.derivws.com`, and there is no `frxUSDNGN` symbol on the public feed.
 * The authenticated alternative, `GET /wallet/v1/exchange-rate`, needs a
 * payment-scoped PAT and returns a transfer quote rather than a display rate.
 *
 * So this tries, in order:
 *   1. the legacy Deriv `exchange_rates` stream, which is still the only
 *      Deriv-sourced USD/NGN and works from hosts that can reach
 *      `ws.binaryws.com`;
 *   2. a keyless public FX source.
 *
 * Runs server-side so the third-party fallback is not a client dependency, and
 * the result is cached briefly to keep this off the critical path.
 */

const CACHE_TTL_MS = 60_000
const LEGACY_TIMEOUT_MS = 4_000
const LEGACY_URL = 'wss://ws.binaryws.com/websockets/v3?app_id='

interface RateResult {
  rate: number
  source: string
  asOf: string
}

let cached: RateResult | null = null
let cachedAt = 0
let inflight: Promise<RateResult> | null = null

/** Legacy Deriv stream. Resolves null if the host is unreachable or rejects. */
function fromDerivLegacy(appId: string): Promise<RateResult | null> {
  return new Promise(resolve => {
    let socket: WebSocket
    try {
      socket = new WebSocket(`${LEGACY_URL}${encodeURIComponent(appId)}`)
    } catch {
      resolve(null)
      return
    }

    let settled = false
    const finish = (value: RateResult | null) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      try {
        socket.close()
      } catch {
        /* already closing */
      }
      resolve(value)
    }

    const timer = setTimeout(() => finish(null), LEGACY_TIMEOUT_MS)

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          exchange_rates: 1,
          base_currency: 'USD',
          target_currency: 'NGN',
          subscribe: 1,
        }),
      )
    }

    socket.onmessage = ({ data }) => {
      let message: {
        msg_type?: string
        exchange_rates?: { rates?: { NGN?: string | number } }
      }
      try {
        message = JSON.parse(data)
      } catch {
        return
      }
      if (message.msg_type !== 'exchange_rates') return
      const ngn = message.exchange_rates?.rates?.NGN
      const value = Number(ngn)
      if (!Number.isFinite(value) || value <= 0) return
      finish({ rate: value, source: 'deriv', asOf: new Date().toISOString() })
    }

    socket.onerror = () => finish(null)
    socket.onclose = () => finish(null)
  })
}

async function fromPublicFxApi(): Promise<RateResult | null> {
  try {
    const response = await $fetch<{ rates?: { NGN?: number } }>('https://open.er-api.com/v6/latest/USD', {
      timeout: 6_000,
    })
    const value = Number(response?.rates?.NGN)
    if (!Number.isFinite(value) || value <= 0) return null
    return { rate: value, source: 'open.er-api.com', asOf: new Date().toISOString() }
  } catch {
    return null
  }
}

export default defineEventHandler(async (): Promise<RateResult> => {
  const now = Date.now()
  if (cached && now - cachedAt < CACHE_TTL_MS) return cached

  // Collapse concurrent callers onto one lookup.
  inflight ??= (async () => {
    const config = useRuntimeConfig()
    const appId = config.public.derivAppId || '1089'

    const deriv = await fromDerivLegacy(appId).catch(() => null)
    const result = deriv ?? (await fromPublicFxApi())

    if (!result) {
      // Serve the last good rate rather than nothing.
      if (cached) return cached
      throw createError({ statusCode: 503, statusMessage: 'USD/NGN rate unavailable' })
    }

    cached = result
    cachedAt = Date.now()
    return result
  })()

  try {
    return await inflight
  } finally {
    inflight = null
  }
})
