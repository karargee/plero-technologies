// Live market data from Deriv's public WebSocket feed (browser only).
import { deriv } from '~/data/site'

type Msg = Record<string, any>
type Stream = { req: Msg; onMsg: (m: Msg) => void; subId?: string }

/** One shared socket for the whole page; streams re-subscribe after reconnects. */
class DerivClient {
  private ws: WebSocket | null = null
  private streams = new Map<number, Stream>()
  private nextId = 1
  private retry = 0
  private pingTimer: ReturnType<typeof setInterval> | undefined
  readonly connected = ref(false)

  constructor(private url: string) {
    this.open()
  }

  private open() {
    const ws = new WebSocket(this.url)
    this.ws = ws
    ws.onopen = () => {
      this.retry = 0
      this.connected.value = true
      for (const [id, s] of this.streams) {
        s.subId = undefined
        this.raw({ ...s.req, req_id: id })
      }
      this.pingTimer = setInterval(() => this.raw({ ping: 1 }), 25_000)
    }
    ws.onmessage = (e) => {
      const m: Msg = JSON.parse(e.data)
      if (!m.req_id) return
      const s = this.streams.get(m.req_id)
      if (!s) {
        // Answer arrived after the stream was closed — stop it on the server.
        if (m.subscription?.id) this.raw({ forget: m.subscription.id })
        return
      }
      if (m.subscription?.id) s.subId = m.subscription.id
      s.onMsg(m)
    }
    ws.onclose = () => {
      clearInterval(this.pingTimer)
      this.connected.value = false
      const delay = Math.min(30_000, 1000 * 2 ** this.retry++)
      setTimeout(() => this.open(), delay)
    }
  }

  private raw(payload: Msg) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(payload))
  }

  /** Starts a request/stream and returns a function that stops it. */
  subscribe(req: Msg, onMsg: (m: Msg) => void) {
    const id = this.nextId++
    this.streams.set(id, { req, onMsg })
    this.raw({ ...req, req_id: id })
    return () => {
      const s = this.streams.get(id)
      this.streams.delete(id)
      if (s?.subId) this.raw({ forget: s.subId })
    }
  }
}

let client: DerivClient | null = null
export function useDerivClient() {
  client ??= new DerivClient(`${deriv.wsUrl}?app_id=${deriv.appId}`)
  return client
}

export interface Candle {
  t: number
  o: number
  h: number
  l: number
  c: number
}
export interface TickPoint {
  t: number
  v: number
}

/** Live ticks or 1-minute candles for one symbol. Call from onMounted / client only. */
export function useDerivSeries(symbol: Ref<string>, mode: Ref<'ticks' | 'candles'>) {
  const ticks = shallowRef<TickPoint[]>([])
  const candles = shallowRef<Candle[]>([])
  const pipSize = ref(2)
  const status = ref<'loading' | 'live' | 'error'>('loading')
  const error = ref('')
  let stop: (() => void) | null = null

  const MAX_TICKS = 300
  const MAX_CANDLES = 120

  function start() {
    stop?.()
    ticks.value = []
    candles.value = []
    status.value = 'loading'
    error.value = ''
    const isCandles = mode.value === 'candles'
    const req: Msg = isCandles
      ? { ticks_history: symbol.value, style: 'candles', granularity: 60, count: MAX_CANDLES, end: 'latest', subscribe: 1 }
      : { ticks_history: symbol.value, style: 'ticks', count: MAX_TICKS, end: 'latest', subscribe: 1 }

    stop = useDerivClient().subscribe(req, (m) => {
      if (m.error) {
        status.value = 'error'
        error.value =
          m.error.code === 'MarketIsClosed'
            ? 'This market is closed right now. Synthetic indices trade 24/7 — try one of those.'
            : m.error.message || 'Could not load this market.'
        return
      }
      if (m.pip_size != null) pipSize.value = Number(m.pip_size)
      switch (m.msg_type) {
        case 'history':
          ticks.value = m.history.times.map((t: number, i: number) => ({ t, v: Number(m.history.prices[i]) }))
          status.value = 'live'
          break
        case 'tick':
          ticks.value = [...ticks.value, { t: m.tick.epoch, v: Number(m.tick.quote) }].slice(-MAX_TICKS)
          if (m.tick.pip_size != null) pipSize.value = Number(m.tick.pip_size)
          status.value = 'live'
          break
        case 'candles':
          candles.value = m.candles.map((c: Msg) => ({ t: c.epoch, o: +c.open, h: +c.high, l: +c.low, c: +c.close }))
          status.value = 'live'
          break
        case 'ohlc': {
          const o = m.ohlc
          const bar: Candle = { t: o.open_time, o: +o.open, h: +o.high, l: +o.low, c: +o.close }
          const list = candles.value.slice()
          if (list.length && list[list.length - 1]!.t === bar.t) list[list.length - 1] = bar
          else list.push(bar)
          candles.value = list.slice(-MAX_CANDLES)
          status.value = 'live'
          break
        }
      }
    })
  }

  watch([symbol, mode], start)
  onMounted(start)
  onBeforeUnmount(() => stop?.())

  return { ticks, candles, pipSize, status, error }
}

/** Latest price + direction for several symbols at once. */
export function useDerivPrices(symbols: string[]) {
  const prices = reactive<Record<string, { price: number; pip: number; dir: 1 | -1 | 0; open?: number }>>({})
  const stops: Array<() => void> = []

  onMounted(() => {
    const c = useDerivClient()
    for (const s of symbols) {
      // Stream ticks, and fetch today's daily candle so we can show the % change since today's open.
      stops.push(
        c.subscribe({ ticks: s, subscribe: 1 }, (m) => {
          if (m.msg_type !== 'tick' || m.error) return
          const prev = prices[s]
          const price = Number(m.tick.quote)
          prices[s] = {
            price,
            pip: Number(m.tick.pip_size ?? 2),
            dir: prev ? (price > prev.price ? 1 : price < prev.price ? -1 : prev.dir) : 0,
            open: prev?.open,
          }
        }),
      )
      stops.push(
        // count: 1 returns yesterday's candle; ask for 2 and use the newest (today's).
        c.subscribe({ ticks_history: s, style: 'candles', granularity: 86400, count: 2, end: 'latest' }, (m) => {
          const open = m.candles?.at(-1)?.open
          if (open == null) return
          prices[s] = { ...(prices[s] ?? { price: Number(open), pip: Number(m.pip_size ?? 2), dir: 0 }), open: Number(open) }
        }),
      )
    }
  })
  onBeforeUnmount(() => stops.forEach((f) => f()))

  return prices
}

/** Which markets are open right now (refreshed every minute). Shared across components. */
const marketOpen = reactive<Record<string, boolean>>({})
let statusUsers = 0
let statusTimer: ReturnType<typeof setInterval> | undefined
let statusStop: (() => void) | null = null

function refreshStatus() {
  statusStop?.()
  statusStop = useDerivClient().subscribe({ active_symbols: 'brief' }, (m) => {
    for (const s of m.active_symbols ?? []) {
      const sym = s.underlying_symbol ?? s.symbol
      marketOpen[sym] = s.exchange_is_open === 1 && !s.is_trading_suspended
    }
  })
}

export function useDerivMarketStatus() {
  onMounted(() => {
    if (statusUsers++ === 0) {
      refreshStatus()
      statusTimer = setInterval(refreshStatus, 60_000)
    }
  })
  onBeforeUnmount(() => {
    if (--statusUsers === 0) {
      clearInterval(statusTimer)
      statusStop?.()
      statusStop = null
    }
  })
  return marketOpen
}

export function formatPrice(v: number | undefined, pip = 2) {
  if (v == null || Number.isNaN(v)) return '—'
  return v.toLocaleString('en-US', { minimumFractionDigits: pip, maximumFractionDigits: pip })
}
