/**
 * USD/NGN rate used for pricing.
 *
 * Deriv's current public WebSocket has no USD/NGN pair, so this reads the
 * server route that resolves the rate (Deriv legacy stream first, keyless FX
 * source second) and refreshes it periodically.
 *
 * `connected` still reports the shared Deriv market socket, which is what the
 * trade view streams from.
 */

export const FALLBACK_RATE = 1330
const REFRESH_MS = 60_000

interface RatePayload {
  rate: number
  source: string
  asOf: string
}

export function useDerivRate() {
  const socket = useDerivSocket()
  const { connected, balance, accountId, authError, lastTickAt } = socket

  const rate = useState<number | null>('deriv-rate', () => null)
  const updatedAt = useState<number | null>('deriv-updated', () => null)
  const rateSource = useState<string>('deriv-rate-source', () => 'fallback')
  const rateStarted = useState<boolean>('deriv-rate-started', () => false)

  if (import.meta.client && !rateStarted.value) {
    rateStarted.value = true

    let timer: ReturnType<typeof setInterval> | undefined

    const load = async () => {
      try {
        const payload = await $fetch<RatePayload>('/api/rate')
        if (Number.isFinite(payload?.rate) && payload.rate > 0) {
          rate.value = payload.rate
          rateSource.value = payload.source ?? 'unknown'
          updatedAt.value = Date.now()
        }
      } catch {
        // Keep the last good rate; `hasLiveRate` still tells the UI it is stale.
      }
    }

    void load()
    timer = setInterval(load, REFRESH_MS)

    if (import.meta.hot) {
      import.meta.hot.dispose(() => clearInterval(timer))
    }
  }

  const liveRate = computed(() => {
    const value = Number(rate.value)
    return Number.isFinite(value) && value > 0 ? value : FALLBACK_RATE
  })

  /** True once a real quote has replaced the fallback. */
  const hasLiveRate = computed(() => rate.value !== null && Number(rate.value) > 0)

  /** Formats a USD amount as naira at the current rate, e.g. format(0.9) → "₦1,197". */
  const format = (usdAmount: number): string =>
    `₦${Math.round(usdAmount * liveRate.value).toLocaleString('en-NG')}`

  return {
    rate,
    connected,
    balance,
    accountId,
    authError,
    lastTickAt,
    updatedAt,
    rateSource,
    liveRate,
    hasLiveRate,
    format,
  }
}
