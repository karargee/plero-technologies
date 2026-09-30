export const FALLBACK_RATE = 1600

const RATE_URL = 'wss://ws.binaryws.com/websockets/v3'
const MAX_RETRY_DELAY = 30_000

/**
 * Single shared connection to the Deriv pricing feed.
 *
 * Every consumer reads the same `useState` refs, so mounting ten components
 * still opens one socket. Reconnection uses exponential backoff and the
 * derived `liveRate` always returns a usable number.
 */
export function useDerivRate() {
  const config = useRuntimeConfig()

  const rate = useState<number | null>('deriv-rate', () => null)
  const connected = useState<boolean>('deriv-connected', () => false)
  const balance = useState<string | null>('deriv-balance', () => null)
  const updatedAt = useState<number | null>('deriv-updated', () => null)
  const started = useState<boolean>('deriv-started', () => false)

  const start = () => {
    if (!import.meta.client || started.value) return
    started.value = true

    const appId = config.public.derivAppId || '1089'
    const token = config.public.derivToken || ''

    let socket: WebSocket | null = null
    let retries = 0
    let stopped = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const scheduleReconnect = () => {
      if (stopped) return
      retries += 1
      const delay = Math.min(1000 * 2 ** (retries - 1), MAX_RETRY_DELAY)
      clearTimeout(timer)
      timer = setTimeout(connect, delay)
    }

    const connect = () => {
      if (stopped) return

      try {
        socket = new WebSocket(`${RATE_URL}?app_id=${encodeURIComponent(appId)}`)
      } catch {
        scheduleReconnect()
        return
      }

      socket.onopen = () => {
        retries = 0
        connected.value = true
        socket?.send(
          JSON.stringify({ exchange_rates: 1, base_currency: 'USD', target_currency: 'NGN', subscribe: 1 }),
        )
        if (token) socket?.send(JSON.stringify({ authorize: token }))
      }

      socket.onmessage = ({ data }) => {
        let message: DerivMessage
        try {
          message = JSON.parse(data)
        } catch {
          return
        }

        if (message.msg_type === 'exchange_rates') {
          const ngn = message.exchange_rates?.rates?.NGN
          if (ngn) {
            rate.value = Number(Number(ngn).toFixed(2))
            updatedAt.value = Date.now()
          }
        }

        if (message.msg_type === 'authorize' && message.authorize?.balance !== undefined) {
          balance.value = String(message.authorize.balance)
        }
      }

      socket.onerror = () => {
        connected.value = false
      }

      socket.onclose = () => {
        connected.value = false
        scheduleReconnect()
      }
    }

    connect()

    window.addEventListener('online', () => {
      if (socket && socket.readyState > WebSocket.OPEN) socket.close()
    })

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        stopped = true
        clearTimeout(timer)
        socket?.close()
      })
    }
  }

  if (import.meta.client) onNuxtReady(start)

  const liveRate = computed(() => {
    const value = Number(rate.value)
    return Number.isFinite(value) && value > 0 ? value : FALLBACK_RATE
  })

  /** Formats a USD amount as naira at the current rate, e.g. format(0.9) → "₦1,440". */
  const format = (usdAmount: number): string =>
    `₦${Math.round(usdAmount * liveRate.value).toLocaleString('en-NG')}`

  return { rate, connected, balance, updatedAt, liveRate, format }
}

interface DerivMessage {
  msg_type?: string
  exchange_rates?: { rates?: { NGN?: string | number } }
  authorize?: { balance?: number | string }
}
