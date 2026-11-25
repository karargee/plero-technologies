<script setup lang="ts">
// Live Deriv chart (ticks line or 1-minute candles), drawn on a canvas.
import { markets } from '~/data/site'
import type { Candle, TickPoint } from '~/composables/useDeriv'

const props = withDefaults(defineProps<{ compact?: boolean; height?: number }>(), { compact: false, height: 380 })
const symbol = defineModel<string>('symbol', { default: 'R_75' })
const mode = ref<'ticks' | 'candles'>('ticks')

const { ticks, candles, pipSize, status, error } = useDerivSeries(symbol, mode)

const groups = computed(() => {
  const out: Record<string, typeof markets> = {}
  for (const m of markets) (out[m.group] ??= []).push(m)
  return out
})
const market = computed(() => markets.find((m) => m.symbol === symbol.value))

const last = computed(() =>
  mode.value === 'ticks' ? ticks.value.at(-1)?.v : candles.value.at(-1)?.c,
)
const first = computed(() => (mode.value === 'ticks' ? ticks.value[0]?.v : candles.value[0]?.o))
const changePct = computed(() =>
  last.value != null && first.value ? ((last.value - first.value) / first.value) * 100 : 0,
)
const prevTick = computed(() => ticks.value.at(-2)?.v)
const dir = computed(() =>
  mode.value === 'ticks' && last.value != null && prevTick.value != null
    ? Math.sign(last.value - prevTick.value)
    : Math.sign(changePct.value),
)

// ---------- Canvas drawing ----------
const wrap = ref<HTMLDivElement>()
const canvas = ref<HTMLCanvasElement>()
const hoverIdx = ref<number | null>(null)
const hover = computed(() => {
  const i = hoverIdx.value
  if (i == null) return null
  if (mode.value === 'ticks') {
    const p = ticks.value[i]
    return p ? { t: p.t, text: formatPrice(p.v, pipSize.value) } : null
  }
  const c = candles.value[i]
  return c
    ? {
        t: c.t,
        text: `O ${formatPrice(c.o, pipSize.value)}  H ${formatPrice(c.h, pipSize.value)}  L ${formatPrice(c.l, pipSize.value)}  C ${formatPrice(c.c, pipSize.value)}`,
      }
    : null
})

const PAD = { top: 16, right: 76, bottom: 26, left: 8 }
const C = {
  grid: 'rgba(255,255,255,0.06)',
  axis: 'rgba(255,255,255,0.45)',
  line: '#9599ff',
  up: '#2ebd85',
  down: '#f6465d',
}
let raf = 0
let geom = { x0: PAD.left, step: 1, n: 0 }

function timeLabel(t: number) {
  const d = new Date(t * 1000)
  return mode.value === 'ticks'
    ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function draw() {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx) return
  const dpr = window.devicePixelRatio || 1
  const w = el.clientWidth
  const h = el.clientHeight
  if (el.width !== Math.round(w * dpr) || el.height !== Math.round(h * dpr)) {
    el.width = Math.round(w * dpr)
    el.height = Math.round(h * dpr)
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const isTicks = mode.value === 'ticks'
  const data: Array<TickPoint | Candle> = isTicks ? ticks.value : candles.value
  const n = data.length
  if (n < 2) return

  let lo = Infinity
  let hi = -Infinity
  for (const d of data) {
    if ('v' in d) {
      lo = Math.min(lo, d.v)
      hi = Math.max(hi, d.v)
    } else {
      lo = Math.min(lo, d.l)
      hi = Math.max(hi, d.h)
    }
  }
  const span = hi - lo || Math.abs(hi) * 0.001 || 1
  lo -= span * 0.08
  hi += span * 0.08

  const plotW = w - PAD.left - PAD.right
  const plotH = h - PAD.top - PAD.bottom
  const step = isTicks ? plotW / (n - 1) : plotW / n
  const x = (i: number) => PAD.left + (isTicks ? i * step : i * step + step / 2)
  const y = (v: number) => PAD.top + (1 - (v - lo) / (hi - lo)) * plotH
  geom = { x0: PAD.left, step, n }

  // Grid + price labels
  ctx.font = '11px Inter, system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.lineWidth = 1
  const rows = props.compact ? 4 : 5
  for (let r = 0; r <= rows; r++) {
    const v = lo + ((hi - lo) * r) / rows
    const yy = Math.round(y(v)) + 0.5
    ctx.strokeStyle = C.grid
    ctx.beginPath()
    ctx.moveTo(PAD.left, yy)
    ctx.lineTo(w - PAD.right, yy)
    ctx.stroke()
    ctx.fillStyle = C.axis
    ctx.textAlign = 'left'
    ctx.fillText(formatPrice(v, pipSize.value), w - PAD.right + 8, yy)
  }
  // Time labels
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  const cols = props.compact ? 3 : 5
  for (let k = 0; k <= cols; k++) {
    const i = Math.min(n - 1, Math.round(((n - 1) * k) / cols))
    const tx = Math.min(Math.max(x(i), PAD.left + 28), w - PAD.right - 28)
    ctx.fillStyle = C.axis
    ctx.fillText(timeLabel(data[i]!.t), tx, h - 8)
  }

  if (isTicks) {
    const pts = data as TickPoint[]
    // Area
    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + plotH)
    grad.addColorStop(0, 'rgba(149,153,255,0.35)')
    grad.addColorStop(1, 'rgba(149,153,255,0)')
    ctx.beginPath()
    pts.forEach((p, i) => (i ? ctx.lineTo(x(i), y(p.v)) : ctx.moveTo(x(i), y(p.v))))
    ctx.lineTo(x(n - 1), PAD.top + plotH)
    ctx.lineTo(x(0), PAD.top + plotH)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()
    // Line
    ctx.beginPath()
    pts.forEach((p, i) => (i ? ctx.lineTo(x(i), y(p.v)) : ctx.moveTo(x(i), y(p.v))))
    ctx.strokeStyle = C.line
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.stroke()
    // Last point
    const lx = x(n - 1)
    const ly = y(pts[n - 1]!.v)
    ctx.fillStyle = 'rgba(149,153,255,0.25)'
    ctx.beginPath()
    ctx.arc(lx, ly, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(lx, ly, 3, 0, Math.PI * 2)
    ctx.fill()
  } else {
    const bars = data as Candle[]
    const bw = Math.max(1, Math.min(14, step * 0.65))
    for (let i = 0; i < n; i++) {
      const c = bars[i]!
      const color = c.c >= c.o ? C.up : C.down
      const cx = Math.round(x(i)) + 0.5
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx, y(c.h))
      ctx.lineTo(cx, y(c.l))
      ctx.stroke()
      const top = y(Math.max(c.o, c.c))
      const bh = Math.max(1, Math.abs(y(c.o) - y(c.c)))
      ctx.fillStyle = color
      ctx.fillRect(cx - bw / 2, top, bw, bh)
    }
  }

  // Current price line + tag
  const lastVal = isTicks ? (data[n - 1] as TickPoint).v : (data[n - 1] as Candle).c
  const py = Math.round(y(lastVal)) + 0.5
  const tagColor = isTicks ? '#6c70d1' : lastVal >= (data[n - 1] as Candle).o ? C.up : C.down
  ctx.setLineDash([4, 4])
  ctx.strokeStyle = tagColor
  ctx.beginPath()
  ctx.moveTo(PAD.left, py)
  ctx.lineTo(w - PAD.right, py)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = tagColor
  ctx.fillRect(w - PAD.right + 2, py - 10, PAD.right - 4, 20)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.font = '600 11px Inter, system-ui, sans-serif'
  ctx.fillText(formatPrice(lastVal, pipSize.value), w - PAD.right + 8, py)

  // Hover crosshair
  if (hoverIdx.value != null && hoverIdx.value < n) {
    const hx = Math.round(x(hoverIdx.value)) + 0.5
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.beginPath()
    ctx.moveTo(hx, PAD.top)
    ctx.lineTo(hx, PAD.top + plotH)
    ctx.stroke()
  }
}

function schedule() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(draw)
}

function onMove(e: PointerEvent) {
  const el = canvas.value
  if (!el || geom.n < 2) return
  const rx = e.clientX - el.getBoundingClientRect().left
  const raw = mode.value === 'ticks' ? (rx - geom.x0) / geom.step : (rx - geom.x0 - geom.step / 2) / geom.step
  hoverIdx.value = Math.max(0, Math.min(geom.n - 1, Math.round(raw)))
}

watch([ticks, candles, hoverIdx], schedule)
let ro: ResizeObserver | undefined
onMounted(() => {
  ro = new ResizeObserver(schedule)
  if (wrap.value) ro.observe(wrap.value)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="chart" :class="{ 'chart--compact': compact }">
    <div class="chart__head">
      <div class="chart__pick">
        <label class="sr-only" for="chart-symbol">Market</label>
        <select id="chart-symbol" v-model="symbol" class="chart__select">
          <optgroup v-for="(list, g) in groups" :key="g" :label="String(g)">
            <option v-for="m in list" :key="m.symbol" :value="m.symbol">{{ m.name }}</option>
          </optgroup>
        </select>
        <div class="chart__price">
          <strong :class="{ up: dir > 0, down: dir < 0 }">{{ formatPrice(last, pipSize) }}</strong>
          <span :class="changePct >= 0 ? 'up' : 'down'">
            {{ changePct >= 0 ? '+' : '' }}{{ changePct.toFixed(2) }}%
          </span>
        </div>
      </div>

      <div class="chart__tools">
        <span class="chart__live" :class="status">
          <i />{{ status === 'live' ? 'Live' : status === 'loading' ? 'Connecting…' : 'Offline' }}
        </span>
        <div class="seg" role="group" aria-label="Chart type">
          <button type="button" :class="{ on: mode === 'ticks' }" @click="mode = 'ticks'">Ticks</button>
          <button type="button" :class="{ on: mode === 'candles' }" @click="mode = 'candles'">1m candles</button>
        </div>
      </div>
    </div>

    <div
      ref="wrap"
      class="chart__plot"
      :style="{ height: `${height}px` }"
      @pointermove="onMove"
      @pointerleave="hoverIdx = null"
    >
      <canvas ref="canvas" role="img" :aria-label="`Live ${market?.name ?? symbol} price chart`" />
      <div v-if="hover" class="chart__tip">
        <span>{{ timeLabel(hover.t) }}</span> {{ hover.text }}
      </div>
      <div v-if="status !== 'live'" class="chart__overlay">
        <span v-if="status === 'loading'" class="spinner" aria-hidden="true" />
        <p>{{ status === 'loading' ? 'Loading live prices from Deriv…' : error }}</p>
      </div>
    </div>

    <p class="chart__src">Live data from Deriv · {{ market?.name ?? symbol }} · Prices are indicative.</p>
  </div>
</template>

<style scoped>
.chart {
  background: var(--navy-950);
  color: #fff;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: var(--radius-lg);
  padding: clamp(16px, 2.5vw, 24px);
  box-shadow: var(--shadow-lg);
}
.chart__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}
.chart__pick {
  display: grid;
  gap: 6px;
  min-width: 0;
}
.chart__select {
  appearance: none;
  max-width: 100%;
  padding: 6px 34px 6px 12px;
  border-radius: 10px;
  border: 1px solid rgb(255 255 255 / 0.14);
  background: rgb(255 255 255 / 0.06)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23c9cbf2' stroke-width='1.8'%3E%3Cpath d='m1 1 5 5 5-5'/%3E%3C/svg%3E")
    no-repeat right 12px center;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.chart__select option,
.chart__select optgroup {
  color: var(--ink);
  background: #fff;
}
.chart__price {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.chart__price strong {
  font-family: var(--font-display);
  font-size: clamp(24px, 3.5vw, 32px);
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
}
.chart--compact .chart__price strong {
  font-size: 24px;
}
.chart__price span {
  font-size: 14px;
  font-weight: 600;
}
.up {
  color: #2ebd85;
}
.down {
  color: #f6465d;
}
.chart__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.chart__live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: rgb(255 255 255 / 0.6);
}
.chart__live i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.chart__live.live {
  color: #2ebd85;
}
.chart__live.live i {
  animation: blink 1.6s ease-in-out infinite;
}
.chart__live.error {
  color: #f6a7b1;
}
@keyframes blink {
  50% {
    opacity: 0.3;
  }
}
.seg {
  display: inline-flex;
  padding: 3px;
  border-radius: 10px;
  background: rgb(255 255 255 / 0.06);
}
.seg button {
  border: 0;
  background: transparent;
  color: rgb(255 255 255 / 0.65);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.seg button.on {
  background: var(--indigo-500);
  color: #fff;
}
.chart__plot {
  position: relative;
  touch-action: pan-y;
}
canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}
.chart__tip {
  position: absolute;
  top: 6px;
  left: 8px;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgb(12 12 36 / 0.9);
  border: 1px solid rgb(255 255 255 / 0.1);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  white-space: pre;
}
.chart__tip span {
  color: rgb(255 255 255 / 0.55);
  margin-right: 6px;
}
.chart__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  text-align: center;
  padding: 24px;
  color: rgb(255 255 255 / 0.7);
}
.spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid rgb(255 255 255 / 0.15);
  border-top-color: var(--indigo-400);
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.chart__src {
  margin-top: 10px;
  font-size: 12px;
  color: rgb(255 255 255 / 0.45);
}
</style>
