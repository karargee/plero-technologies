import type { DerivCandle } from '~/composables/useDerivSocket'

export interface MarketSymbol {
  code: string
  label: string
  group: string
}

/** Instruments offered in the sidebar. All resolve on the public feed. */
export const MARKET_SYMBOLS: MarketSymbol[] = [
  { code: 'R_10', label: 'Volatility 10 Index', group: 'Volatility' },
  { code: 'R_25', label: 'Volatility 25 Index', group: 'Volatility' },
  { code: 'R_50', label: 'Volatility 50 Index', group: 'Volatility' },
  { code: 'R_75', label: 'Volatility 75 Index', group: 'Volatility' },
  { code: 'R_100', label: 'Volatility 100 Index', group: 'Volatility' },
  { code: '1HZ100V', label: 'Volatility 100 (1s)', group: 'Volatility' },
  { code: 'OTC_DJI', label: 'Wall Street 30', group: 'Indices' },
  { code: 'OTC_NDX', label: 'US Tech 100', group: 'Indices' },
  { code: 'frxEURUSD', label: 'Euro/US Dollar', group: 'Forex' },
  { code: 'frxGBPUSD', label: 'British Pound/US Dollar', group: 'Forex' },
  { code: 'frxUSDJPY', label: 'US Dollar/Japanese Yen', group: 'Forex' },
]

/** Candle widths the API accepts, in seconds, in Deriv's toolbar order. */
export const GRANULARITIES = [
  { seconds: 60, label: '1m', full: '1 minute' },
  { seconds: 120, label: '2m', full: '2 minutes' },
  { seconds: 180, label: '3m', full: '3 minutes' },
  { seconds: 300, label: '5m', full: '5 minutes' },
  { seconds: 600, label: '10m', full: '10 minutes' },
  { seconds: 900, label: '15m', full: '15 minutes' },
  { seconds: 1800, label: '30m', full: '30 minutes' },
  { seconds: 3600, label: '1H', full: '1 hour' },
  { seconds: 7200, label: '2H', full: '2 hours' },
  { seconds: 14400, label: '4H', full: '4 hours' },
  { seconds: 86400, label: '1D', full: '1 day' },
] as const

export type ChartStyle = 'candles' | 'line' | 'area'

export interface Quote {
  price: number
  pipSize: number
  /** Fractional move since the previous daily open, e.g. 0.0123 = +1.23%. */
  change: number | null
  updatedAt: number | null
}

export type MarketStatus = 'connecting' | 'live' | 'error'

const HISTORY_COUNT = 80
const DAILY_COUNT = 2
const DAILY_GRANULARITY = 86400

/**
 * Deriv market data for the chart and the instrument sidebar.
 *
 * Candles come from `ticks_history` with `style: 'candles'` (the series
 * arrives once, then streams single-candle updates tagged `msg_type: 'ohlc'`).
 * Quotes for every sidebar instrument stream from a single `ticks` request
 * that takes an array of symbols, and each instrument's daily move is seeded
 * from one small daily-candle request.
 */
export function useDerivMarket(initialSymbol = 'R_100') {
  const socket = useDerivSocket()
  const { connected, lastError } = socket

  const symbol = useState<string>('market-symbol', () => initialSymbol)
  const granularity = useState<number>('market-granularity', () => 300)
  const chartStyle = useState<ChartStyle>('market-style', () => 'candles')
  const visibleCount = useState<number>('market-visible', () => 60)

  const candles = useState<DerivCandle[]>('market-candles', () => [])
  const spot = useState<number | null>('market-spot', () => null)
  const pipSize = useState<number>('market-pip-size', () => 2)
  const quotes = useState<Record<string, Quote>>('market-quotes', () => ({}))
  const status = useState<MarketStatus>('market-status', () => 'connecting')
  const subscribed = useState<boolean>('market-subscribed', () => false)

  let candleSubscription: string | null = null
  let quoteSubscription: string | null = null

  const currentSymbol = () => symbol.value

  /** Seed each instrument's daily move so the sidebar shows a real percentage. */
  const requestDailyOpens = () => {
    for (const item of MARKET_SYMBOLS) {
      socket.send({
        ticks_history: item.code,
        count: DAILY_COUNT,
        end: 'latest',
        granularity: DAILY_GRANULARITY,
        style: 'candles',
        // Both candle requests answer with msg_type "candles" as a flat array,
        // so passthrough is what tells them apart.
        passthrough: { plero: 'daily', code: item.code },
      })
    }
  }

  const requestAll = () => {
    // Subscription ids belong to one connection; onOpen clears them before
    // calling this, so a forget here always targets the current socket.
    if (candleSubscription) socket.forget(candleSubscription)
    if (quoteSubscription) socket.forget(quoteSubscription)
    candleSubscription = null
    quoteSubscription = null

    const code = currentSymbol()

    socket.send({
      ticks_history: code,
      adjust_start_time: 1,
      count: HISTORY_COUNT,
      end: 'latest',
      granularity: granularity.value,
      style: 'candles',
      subscribe: 1,
      passthrough: { plero: 'series', code },
    })

    // One request streams every sidebar instrument.
    socket.send({ ticks: MARKET_SYMBOLS.map(item => item.code), subscribe: 1 })

    requestDailyOpens()
  }

  if (import.meta.client && !subscribed.value) {
    subscribed.value = true

    socket.onOpen(() => {
      candleSubscription = null
      quoteSubscription = null
      status.value = 'connecting'
      requestAll()
    })

    socket.subscribe((message) => {
      const code = currentSymbol()

      if (message.msg_type === 'candles') {
        // Accept either the flat array or a nested { candles, pip_size } body.
        const payload = message.candles
        const nested = payload as { candles?: DerivCandle[]; pip_size?: number } | undefined
        const list = Array.isArray(payload) ? payload : (nested?.candles ?? [])

        const series = list
          .filter(c => Number.isFinite(c?.close) && Number.isFinite(c?.epoch))
          .sort((a, b) => a.epoch - b.epoch)

        const passthrough = message.echo_req?.passthrough as
          | { plero?: string; code?: string }
          | undefined

        // Daily-open seed: one candle pair per instrument, no subscription.
        if (passthrough?.plero === 'daily') {
          const key = passthrough.code
          const open = series[0]?.open
          const existing = key ? quotes.value[key] : undefined
          if (key && open && open > 0 && existing) {
            quotes.value = {
              ...quotes.value,
              [key]: { ...existing, change: (existing.price - open) / open },
            }
          }
          return
        }

        if (passthrough?.plero === 'series' && series.length) {
          candles.value = series
          pipSize.value = nested?.pip_size ?? message.pip_size ?? pipSize.value
          status.value = 'live'
        }
        const id = (message.subscription as { id?: string } | undefined)?.id
        if (id) candleSubscription = id
        return
      }

      if (message.msg_type === 'ohlc' && message.ohlc) {
        // Live candle update: replace the candle for that epoch, or append it.
        const incoming = message.ohlc
        if (!Number.isFinite(incoming.close) || !Number.isFinite(incoming.epoch)) return
        const series = candles.value
        const last = series.at(-1)
        if (last && last.epoch === incoming.epoch) {
          candles.value = [...series.slice(0, -1), incoming]
        } else if (!last || incoming.epoch > last.epoch) {
          candles.value = [...series.slice(-(HISTORY_COUNT - 1)), incoming]
        }
        spot.value = incoming.close
        status.value = 'live'
        return
      }

      if (message.msg_type === 'tick') {
        const tick = message.tick
        if (!tick || typeof tick.quote !== 'number' || !Number.isFinite(tick.quote)) return
        const key = tick.symbol
        if (!key) return
        const existing = quotes.value[key]
        quotes.value = {
          ...quotes.value,
          [key]: {
            price: tick.quote,
            pipSize: typeof tick.pip_size === 'number' ? tick.pip_size : (existing?.pipSize ?? 2),
            change: existing?.change ?? null,
            updatedAt: Date.now(),
          },
        }
        if (key === code) {
          spot.value = tick.quote
          pipSize.value = typeof tick.pip_size === 'number' ? tick.pip_size : pipSize.value
        }
        const id = (message.subscription as { id?: string } | undefined)?.id ?? tick.id
        if (id) quoteSubscription = id
        status.value = 'live'
        return
      }

      if (message.msg_type === 'error' && connected.value && !candles.value.length) {
        status.value = 'error'
      }
    })

    // Switching symbol or timeframe clears the stale series first.
    watch([symbol, granularity], () => {
      if (!import.meta.client) return
      candles.value = []
      spot.value = null
      requestAll()
    })
  }

  const lastPrice = computed<number | null>(() => {
    if (spot.value !== null) return spot.value
    return candles.value.at(-1)?.close ?? null
  })

  const firstPrice = computed<number | null>(() => candles.value.at(0)?.open ?? null)

  /** Move across the visible window, e.g. 0.0123 for +1.23%. */
  const change = computed(() => {
    const from = firstPrice.value
    const to = lastPrice.value
    if (from === null || to === null || from === 0) return null
    return (to - from) / from
  })

  const decimals = computed(() => Math.max(0, Math.min(pipSize.value, 8)))

  const formatPrice = (value: number | null | undefined): string =>
    value === null || value === undefined || !Number.isFinite(value)
      ? '—'
      : value.toLocaleString('en-US', {
          minimumFractionDigits: decimals.value,
          maximumFractionDigits: decimals.value,
        })

  /** Formats using an instrument's own pip size, for the sidebar. */
  const formatQuote = (value: number | null | undefined, pip: number): string => {
    if (value === null || value === undefined || !Number.isFinite(value)) return '—'
    const d = Math.max(0, Math.min(pip, 8))
    return value.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
  }

  const setSymbol = (code: string) => {
    if (code !== symbol.value) symbol.value = code
  }

  const setGranularity = (seconds: number) => {
    if (seconds !== granularity.value) granularity.value = seconds
  }

  const setChartStyle = (style: ChartStyle) => {
    if (style !== chartStyle.value) chartStyle.value = style
  }

  const zoomIn = () => {
    visibleCount.value = Math.min(HISTORY_COUNT, visibleCount.value + 10)
  }

  const zoomOut = () => {
    visibleCount.value = Math.max(20, visibleCount.value - 10)
  }

  const groups = computed(() => {
    const order: string[] = []
    const map = new Map<string, MarketSymbol[]>()
    for (const item of MARKET_SYMBOLS) {
      if (!map.has(item.group)) {
        map.set(item.group, [])
        order.push(item.group)
      }
      map.get(item.group)?.push(item)
    }
    return order.map(name => ({ name, items: map.get(name) ?? [] }))
  })

  return {
    symbol,
    granularity,
    chartStyle,
    visibleCount,
    candles,
    spot,
    status,
    connected,
    quotes,
    lastPrice,
    change,
    errorMessage: computed(() => lastError.value),
    decimals,
    formatPrice,
    formatQuote,
    setSymbol,
    setGranularity,
    setChartStyle,
    zoomIn,
    zoomOut,
    groups,
  }
}
