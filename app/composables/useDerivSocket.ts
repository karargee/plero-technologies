export interface DerivCandle {
  epoch: number
  open: number
  high: number
  low: number
  close: number
}

export interface DerivMessage {
  msg_type?: string
  echo_req?: Record<string, unknown>
  error?: { code?: string; message?: string }
  /** Streaming spot price. */
  tick?: { epoch?: number; quote?: number; pip_size?: number; symbol?: string; id?: string }
  /** Streaming candle update when candles are requested with subscribe. */
  ohlc?: DerivCandle
  /** OHLC series. Some deployments nest the array, some return it flat. */
  candles?: DerivCandle[] | { candles?: DerivCandle[]; pip_size?: number }
  pip_size?: number
  authorize?: { account_id?: string; balance?: number | string; currency?: string }
  [key: string]: unknown
}

export type DerivRequest = Record<string, unknown>

type Listener = (message: DerivMessage) => void
/** Re-run on every (re)connect so subscriptions survive a dropped socket. */
type OpenHook = () => void

const SOCKET_URL = 'wss://ws.binaryws.com/websockets/v3'
const MAX_RETRY_DELAY = 30_000

interface Connection {
  socket: WebSocket | null
  listeners: Set<Listener>
  openHooks: Set<OpenHook>
  /** Requests made before the socket opened. */
  pending: DerivRequest[]
  retries: number
  stopped: boolean
  timer?: ReturnType<typeof setTimeout>
  setConnected: (value: boolean) => void
  setLastTick: (epoch: number) => void
  setAccount: (message: DerivMessage) => void
  setError: (message: DerivMessage) => void
}

/**
 * Client-only singleton. The WebSocket and its bookkeeping live at module
 * scope so every consumer shares one connection; the reactive values are
 * `useState` refs so templates track them.
 */
let connection: Connection | null = null

export function useDerivSocket() {
  const config = useRuntimeConfig()

  const connected = useState<boolean>('deriv-connected', () => false)
  const accountId = useState<string | null>('deriv-account', () => null)
  const balance = useState<string | null>('deriv-balance', () => null)
  const authError = useState<string | null>('deriv-auth-error', () => null)
  const lastTickAt = useState<number | null>('deriv-last-tick', () => null)
  const lastError = useState<string | null>('deriv-last-error', () => null)

  const ensure = (): Connection => {
    if (connection) return connection

    const appId = config.public.derivAppId || '1089'
    const baseUrl = SOCKET_URL
    const url: string = `${baseUrl}?app_id=${appId}`

    const state: Connection = {
      socket: null,
      listeners: new Set(),
      openHooks: new Set(),
      pending: [],
      retries: 0,
      stopped: false,
      setConnected: value => {
        connected.value = value
      },
      setLastTick: epoch => {
        lastTickAt.value = epoch
      },
      setAccount: message => {
        const account = message.authorize
        if (account?.account_id !== undefined) accountId.value = String(account.account_id)
        if (account?.balance !== undefined) balance.value = String(account.balance)
        authError.value = null
      },
      setError: message => {
        // Rate feeds are unauthenticated, so an error here is usually a bad
        // symbol or a malformed request rather than a session problem.
        lastError.value = message.error?.message ?? 'Deriv request failed'
      },
    }
    connection = state

    // No client-side authorize. The PAT lives in private runtimeConfig and is
    // only readable server-side; sending it from the browser would publish it in
    // the bundle. Market data on this socket is public, so nothing here needs
    // authentication. `balance` / `accountId` stay empty by design — a public
    // page should not display the business account balance. If an internal view
    // ever needs it, expose a server route rather than a browser token.
    const scheduleReconnect = (immediate = false) => {
      if (state.stopped) return
      state.retries += 1
      const delay = immediate ? 0 : Math.min(1000 * 2 ** (state.retries - 1), MAX_RETRY_DELAY)
      clearTimeout(state.timer)
      state.timer = setTimeout(connect, delay)
    }

    const dispatch = (message: DerivMessage) => {
      if (message.msg_type === 'tick' && message.tick?.epoch) {
        state.setLastTick(message.tick.epoch)
      }
      if (message.msg_type === 'authorize') {
        // A rejected token comes back as msg_type "authorize" with an error
        // and no account: surface it without dropping the price feed, which
        // shares this socket.
        if (message.error) {
          authError.value = message.error.message ?? 'Authorize failed'
          console.warn('[deriv] authorize failed:', message.error.code, message.error.message)
        } else {
          state.setAccount(message)
        }
      }
      if (message.msg_type === 'error') state.setError(message)

      for (const listener of state.listeners) {
        try {
          listener(message)
        } catch (error) {
          console.warn('[deriv] listener threw:', error)
        }
      }
    }

    function connect() {
      if (state.stopped) return

      let current: WebSocket
      try {
        current = new WebSocket(url)
      } catch {
        scheduleReconnect()
        return
      }
      state.socket = current

      // A superseded socket can still fire events; ignore anything that is
      // not the one we currently own, or a late close would reconnect twice.
      const isCurrent = () => state.socket === current

      current.onopen = () => {
        if (!isCurrent()) {
          current.close()
          return
        }
        state.retries = 0
        state.setConnected(true)
        lastError.value = null

        // Re-issue every subscription, then flush anything queued while the
        // socket was down.
        for (const hook of state.openHooks) {
          try {
            hook()
          } catch (error) {
            console.warn('[deriv] open hook threw:', error)
          }
        }
        for (const request of state.pending.splice(0)) {
          current.send(JSON.stringify(request))
        }
      }

      current.onmessage = ({ data }) => {
        if (!isCurrent()) return
        try {
          dispatch(JSON.parse(data) as DerivMessage)
        } catch {
          /* Ignore frames that are not JSON. */
        }
      }

      current.onerror = () => {
        if (isCurrent()) state.setConnected(false)
      }

      current.onclose = () => {
        if (!isCurrent()) return
        state.socket = null
        state.setConnected(false)
        scheduleReconnect()
      }
    }

    // Coming back online is the one case worth retrying at once: the socket is
    // already dead, so sitting out the backoff just shows stale prices.
    const onOnline = () => {
      if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
        state.retries = 0
        state.socket?.close()
        scheduleReconnect(true)
      }
    }
    window.addEventListener('online', onOnline)

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        state.stopped = true
        clearTimeout(state.timer)
        window.removeEventListener('online', onOnline)
        state.socket?.close()
        connection = null
      })
    }

    connect()
    return state
  }

  /** Send a request now, or queue it until the socket opens. */
  const send = (request: DerivRequest) => {
    const state = ensure()
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      state.socket.send(JSON.stringify(request))
    } else {
      state.pending.push(request)
    }
  }

  /** Unsubscribe a streaming request by the id the API returned. */
  const forget = (subscriptionId: string) => send({ forget: subscriptionId })

  const subscribe = (listener: Listener) => {
    const state = ensure()
    state.listeners.add(listener)
    return () => {
      state.listeners.delete(listener)
    }
  }

  /**
   * Register work to run on every open, and immediately if already open.
   * Returns a teardown function.
   */
  const onOpen = (hook: OpenHook) => {
    const state = ensure()
    state.openHooks.add(hook)
    if (connected.value) hook()
    return () => {
      state.openHooks.delete(hook)
    }
  }

  return { connected, accountId, balance, authError, lastTickAt, lastError, send, forget, subscribe, onOpen }
}
