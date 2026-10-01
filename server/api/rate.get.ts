/**
 * USD/NGN rate for pricing.
 *
 * Deriv's public market WebSocket carries no USD/NGN pair: the legacy
 * `exchange_rates` request is rejected on `api.derivws.com`, and there is no
 * FX symbol on the public options feed.
 *
 * The real Deriv-sourced rate is the authenticated Wallet API:
 *   GET https://api.derivws.com/wallet/v1/exchange-rate
 *       ?source_currency=USD&destination_currency=NGN
 * It needs `Authorization: Bearer <PAT>` plus the `Deriv-App-ID` header, and a
 * PAT with the **payment** scope (an insufficient scope returns 403). The
 * response is a transfer quote: an `exchange_rate` plus a `rate_token` that
 * must be echoed back to execute the transfer, so the rate is not scraped.
 *
 * Order of preference:
 *   1. the authenticated Deriv Wallet endpoint (source: 'deriv')
 *   2. the legacy Deriv `exchange_rates` stream, for hosts that can still
 *      reach `ws.binaryws.com`
 *   3. a keyless public FX source (source: 'open.er-api.com')
 *
 * This runs server-side so the PAT never reaches the browser and the third
 * party fallback is not a client dependency. Results are cached to keep the
 * upstream off the critical path.
 */

const CACHE_TTL_MS = 60_000
const DERIV_REST_TIMEOUT_MS = 6_000
const LEGACY_TIMEOUT_MS = 4_000
const LEGACY_URL = 'wss://ws.binaryws.com/websockets/v3?app_id='
const DERIV_API_BASE = 'https://api.derivws.com'

interface RateResult {
  rate: number
  source: string
  asOf: string
}

let cached: RateResult | null = null
let cachedAt = 0
let inflight: Promise<RateResult> | null = null

/**
 * Authenticated Deriv quote. Resolves null when no PAT is configured, so an
 * unconfigured deployment degrades to the sources below instead of erroring.
 */
async function fromDerivWallet(config: {
  derivToken: string
  public: { derivAppId: string }
}): Promise<RateResult | null> {
  const token = config.derivToken?.trim()
  if (!token) return null

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` }
  const appId = config.public.derivAppId?.trim()
  if (appId) headers['Deriv-App-ID'] = appId

  try {
    const response = await $fetch<Record<string, unknown>>(
      `${DERIV_API_BASE}/wallet/v1/exchange-rate?source_currency=USD&destination_currency=NGN`,
      { headers, timeout: DERIV_REST_TIMEOUT_MS },
    )

    // The quote's field name has varied across revisions; accept the known
    // shapes rather than failing on an unexpected one.
    const candidates = [
      response?.exchange_rate,
      response?.rate,
      (response?.exchange_rate as { value?: number } | undefined)?.value,
      (response?.rate as { value?: number } | undefined)?.value,
    ]
    for (const candidate of candidates) {
      const value = Number(candidate)
      if (Number.isFinite(value) && value > 0) {
        return { rate: value, source: 'deriv', asOf: new Date().toISOString() }
      }
    }
    return null
  } catch (error) {
    // 401/403 mean the PAT is missing or lacks the payment scope. Log it: a
    // silently falling back hides a misconfiguration that matters.
    const status = (error as { statusCode?: number; status?: number })?.statusCode
      ?? (error as { status?: number })?.status
    if (status === 401 || status === 403) {
      console.warn(
        `[rate] Deriv rejected the PAT (${status}). ` +
          'Check NUXT_DERIV_TOKEN and that the token has the payment scope.',
      )
    }
    return null
  }
}

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
      finish({ rate: value, source: 'deriv-legacy', asOf: new Date().toISOString() })
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

    const wallet = await fromDerivWallet(config)
    const legacy = wallet ? null : await fromDerivLegacy(appId).catch(() => null)
    const result = wallet ?? legacy ?? (await fromPublicFxApi())

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