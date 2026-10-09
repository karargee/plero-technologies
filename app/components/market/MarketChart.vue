<template>
  <div ref="wrapRef" class="chart" :style="{ height: H + 'px' }">
    <!-- OHLC legend, follows the crosshair or the last candle -->
    <div class="legend">
      <span class="legend-sym">{{ symbol }}</span>
      <template v-if="legend">
        <span>O <b>{{ label(legend.candle.open) }}</b></span>
        <span>H <b>{{ label(legend.candle.high) }}</b></span>
        <span>L <b>{{ label(legend.candle.low) }}</b></span>
        <span>C <b>{{ label(legend.candle.close) }}</b></span>
        <span :class="legend.up ? 'is-up' : 'is-down'">
          {{ legend.up ? '▲' : '▼' }} {{ Math.abs(legend.move * 100).toFixed(2) }}%
        </span>
      </template>
      <span v-else class="legend-muted">awaiting data</span>
    </div>

    <svg
      :width="width"
      :height="H"
      class="svg"
      role="img"
      :aria-label="`${symbol} ${style} chart`"
      @pointermove="onMove"
      @pointerleave="hoverIndex = null"
      @pointerdown="dragging = true"
    >
      <!-- Grid -->
      <g>
        <line
          v-for="line in gridLines"
          :key="'h' + line.value"
          :x1="PAD.l"
          :x2="width - PAD.r"
          :y1="line.y"
          :y2="line.y"
          class="grid"
        />
        <line
          v-for="line in timeLines"
          :key="'v' + line.epoch"
          :x1="line.x"
          :x2="line.x"
          :y1="PAD.t"
          :y2="H - PAD.b"
          class="grid"
        />
      </g>

      <!-- Price axis labels. Skipped while empty, otherwise the placeholder
           0..1 domain prints prices that were never quoted. -->
      <template v-if="series.length">
        <text
          v-for="line in gridLines"
          :key="'pl' + line.value"
          :x="width - PAD.r + 8"
          :y="line.y + 4"
          class="axis"
        >
          {{ label(line.value) }}
        </text>

        <text
          v-for="line in timeLines"
          :key="'tl' + line.epoch"
          :x="line.x"
          :y="H - PAD.b + 17"
          class="axis axis--time"
        >
          {{ line.text }}
        </text>
      </template>

      <!-- Series -->
      <g v-if="series.length">
        <!-- Area -->
        <path v-if="style === 'area'" :d="areaPath" class="area" />

        <!-- Line -->
        <path v-if="style !== 'candles'" :d="linePath" class="line" />

        <!-- Candles -->
        <template v-else>
          <line
            v-for="candle in series"
            :key="'w' + candle.epoch"
            :x1="xAt(candle.epoch)"
            :x2="xAt(candle.epoch)"
            :y1="yAt(candle.high)"
            :y2="yAt(candle.low)"
            class="wick"
            :class="candle.close >= candle.open ? 'up' : 'down'"
          />
          <rect
            v-for="candle in series"
            :key="'b' + candle.epoch"
            :x="xAt(candle.epoch) - bodyWidth / 2"
            :y="yAt(Math.max(candle.open, candle.close))"
            :width="bodyWidth"
            :height="bodyHeight(candle)"
            :rx="Math.min(1.5, bodyWidth / 3)"
            class="body"
            :class="candle.close >= candle.open ? 'up' : 'down'"
          />
        </template>
      </g>

      <!-- Live price marker -->
      <g v-if="lastPrice !== null">
        <line
          :x1="PAD.l"
          :x2="width - PAD.r"
          :y1="yAt(lastPrice)"
          :y2="yAt(lastPrice)"
          class="last-line"
        />
        <rect :x="width - PAD.r + 2" :y="yAt(lastPrice) - 9" width="66" height="18" rx="3" class="last-tag" />
        <text :x="width - PAD.r + 8" :y="yAt(lastPrice) + 4" class="last-text">{{ label(lastPrice) }}</text>
      </g>

      <!-- Crosshair -->
      <template v-if="hover">
        <line :x1="hover.x" :x2="hover.x" :y1="PAD.t" :y2="H - PAD.b" class="cross" />
        <line :x1="PAD.l" :x2="width - PAD.r" :y1="hover.y" :y2="hover.y" class="cross" />
        <rect :x="width - PAD.r + 2" :y="hover.y - 9" width="66" height="18" rx="3" class="cross-tag" />
        <text :x="width - PAD.r + 8" :y="hover.y + 4" class="cross-text">{{ label(hover.candle.close) }}</text>
        <rect :x="Math.min(hover.x + 4, width - PAD.r - 46)" :y="H - PAD.b - 20" width="44" height="17" rx="3" class="cross-tag" />
        <text :x="Math.min(hover.x + 8, width - PAD.r - 42)" :y="H - PAD.b - 8" class="cross-text">
          {{ timeAt(hover.candle.epoch) }}
        </text>
      </template>
    </svg>

    <!-- Overlay states -->
    <div v-if="!series.length" class="overlay">
      <template v-if="status === 'error'">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="overlay-icon">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 7v5M12 16v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p class="overlay-msg">{{ emptyMessage }}</p>
        <p class="overlay-sub">Deriv's public feed may be temporarily unavailable.</p>
        <button type="button" class="overlay-retry" @click="$emit('retry')">
          Try again
        </button>
      </template>
      <template v-else>
        <span class="spinner" />
        <p class="overlay-msg">Connecting to Deriv live feed…</p>
        <p class="overlay-sub">Streaming from wss://ws.derivws.com</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartStyle } from '~/composables/useDerivMarket'
import type { DerivCandle } from '~/composables/useDerivSocket'

const props = defineProps<{
  candles: DerivCandle[]
  symbol: string
  style: ChartStyle
  granularity: number
  visibleCount: number
  lastPrice: number | null
  status: 'connecting' | 'live' | 'error'
  errorMessage?: string | null
  formatPrice: (value: number | null | undefined) => string
}>()

defineEmits<{ retry: [] }>()

const H = 420
const PAD = { l: 10, r: 74, t: 34, b: 26 }

const wrapRef = ref<HTMLElement | null>(null)
const width = ref(720)
const hoverIndex = ref<number | null>(null)
const dragging = ref(false)

// Render at real pixel size instead of scaling a viewBox, so strokes stay
// even and axis text stays legible at any container width.
onMounted(() => {
  const el = wrapRef.value
  if (!el) return
  const measure = () => {
    width.value = Math.max(320, Math.round(el.clientWidth))
  }
  measure()
  const observer = new ResizeObserver(measure)
  observer.observe(el)
  onBeforeUnmount(() => observer.disconnect())
})

const series = computed(() => props.candles.slice(-Math.max(10, props.visibleCount)))

const plotW = computed(() => Math.max(10, width.value - PAD.l - PAD.r))
const plotH = H - PAD.t - PAD.b

const low = computed(() =>
  series.value.length ? Math.min(...series.value.map(c => c.low)) : 0,
)
const high = computed(() =>
  series.value.length ? Math.max(...series.value.map(c => c.high)) : 1,
)

const domain = computed(() => {
  if (!series.value.length) return { min: 0, max: 1 }
  const pad = (high.value - low.value) * 0.1 || Math.abs(high.value) * 0.0005 || 1
  return { min: low.value - pad, max: high.value + pad }
})

function yAt(value: number) {
  const { min, max } = domain.value
  const span = max - min || 1
  return PAD.t + plotH * (1 - (value - min) / span)
}

function xAt(epoch: number) {
  const first = series.value[0]
  const last = series.value.at(-1)
  if (!first || !last || last.epoch === first.epoch) return PAD.l + plotW.value / 2
  const ratio = (epoch - first.epoch) / (last.epoch - first.epoch)
  return PAD.l + plotW.value * ratio
}

const bodyWidth = computed(() => {
  const count = series.value.length || 1
  const step = plotW.value / count
  return Math.max(1.5, Math.min(14, step * 0.7))
})

/** A flat candle would otherwise render as a zero-height rect. */
const bodyHeight = (candle: DerivCandle) =>
  Math.max(1, Math.abs(yAt(candle.open) - yAt(candle.close)))

const gridLines = computed(() => {
  const count = 5
  const { min, max } = domain.value
  return Array.from({ length: count + 1 }, (_, i) => {
    const value = max - ((max - min) / count) * i
    return { value, y: PAD.t + (plotH / count) * i }
  })
})

const timeLines = computed(() => {
  const count = series.value.length
  if (!count) return []
  const want = Math.max(2, Math.min(7, Math.floor(plotW.value / 110)))
  const step = Math.max(1, Math.floor(count / want))
  const out: { epoch: number; x: number; text: string }[] = []
  for (let i = count - 1; i >= 0; i -= step) {
    const candle = series.value[i]
    if (!candle) continue
    out.push({ epoch: candle.epoch, x: xAt(candle.epoch), text: timeAt(candle.epoch) })
  }
  return out
})

const linePath = computed(() => {
  if (!series.value.length) return ''
  return series.value
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${xAt(c.epoch).toFixed(2)} ${yAt(c.close).toFixed(2)}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (!series.value.length) return ''
  const base = H - PAD.b
  const top = series.value
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${xAt(c.epoch).toFixed(2)} ${yAt(c.close).toFixed(2)}`)
    .join(' ')
  const first = series.value[0]
  const last = series.value.at(-1)
  if (!first || !last) return top
  return `${top} L ${xAt(last.epoch).toFixed(2)} ${base} L ${xAt(first.epoch).toFixed(2)} ${base} Z`
})

const label = (value: number) => props.formatPrice(value)

const hover = computed(() => {
  const index = hoverIndex.value
  if (index === null) return null
  const candle = series.value[index]
  if (!candle) return null
  return { candle, x: xAt(candle.epoch), y: yAt(candle.close) }
})

/** Legend follows the crosshair, otherwise the newest candle. */
const legend = computed(() => {
  const candle = hover.value?.candle ?? series.value.at(-1)
  if (!candle) return null
  const open = candle.open
  const move = open === 0 ? 0 : (candle.close - open) / open
  return { candle, up: candle.close >= candle.open, move }
})

function onMove(event: PointerEvent) {
  if (!series.value.length) return
  const svg = event.currentTarget as SVGSVGElement
  const rect = svg.getBoundingClientRect()
  if (!rect.width) return
  const x = event.clientX - rect.left

  let best = 0
  let bestDistance = Infinity
  for (let i = 0; i < series.value.length; i++) {
    const candle = series.value[i]
    if (!candle) continue
    const distance = Math.abs(xAt(candle.epoch) - x)
    if (distance < bestDistance) {
      bestDistance = distance
      best = i
    }
  }
  hoverIndex.value = best
}

function timeAt(epoch: number) {
  const date = new Date(epoch * 1000)
  const days = props.granularity >= 86400
  const months = props.granularity >= 86400 * 7
  if (months) return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  if (days) return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

const emptyMessage = computed(() => {
  if (props.status === 'error') return props.errorMessage || 'Could not load this market.'
  return 'Connecting to Deriv market data…'
})
</script>

<style scoped>
.chart {
  position: relative;
  width: 100%;
  border-radius: var(--r-md);
  overflow: hidden;
  background: linear-gradient(180deg, rgb(var(--primary-rgb) / 0.06), transparent 55%);
}

.svg {
  display: block;
  touch-action: pan-y;
}

.legend {
  position: absolute;
  top: 8px;
  left: 10px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted-2);
  pointer-events: none;
}
.legend b {
  font-weight: 600;
  color: var(--text);
}
.legend-sym {
  font-weight: 700;
  color: var(--text);
}
.legend-muted {
  color: var(--muted-3);
}
.is-up {
  color: var(--accent);
  font-weight: 700;
}
.is-down {
  color: var(--danger);
  font-weight: 700;
}

.grid {
  stroke: rgba(255, 255, 255, 0.055);
  stroke-width: 1;
}
.axis {
  fill: var(--muted-3);
  font-size: 10.5px;
  font-family: var(--font-mono);
}
.axis--time {
  text-anchor: middle;
}

.wick {
  stroke-width: 1.25;
}
.wick.up {
  stroke: #26a69a;
}
.wick.down {
  stroke: #ef5350;
}
.body.up {
  fill: #26a69a;
}
.body.down {
  fill: #ef5350;
}

.line {
  fill: none;
  stroke: var(--primary-light);
  stroke-width: 1.75;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.area {
  fill: rgb(var(--primary-rgb) / 0.16);
  stroke: none;
}

.last-line {
  stroke: var(--primary-light);
  stroke-width: 1;
  stroke-dasharray: 4 3;
  opacity: 0.8;
}
.last-tag {
  fill: var(--primary);
}
.last-text {
  fill: #fff;
  font-size: 10.5px;
  font-weight: 700;
  font-family: var(--font-mono);
}

.cross {
  stroke: rgba(255, 255, 255, 0.4);
  stroke-width: 1;
  stroke-dasharray: 3 3;
}
.cross-tag {
  fill: #2a2a33;
  stroke: rgba(255, 255, 255, 0.22);
}
.cross-text {
  fill: var(--text);
  font-size: 10.5px;
  font-family: var(--font-mono);
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding: 0 24px;
  background: rgb(8 8 10 / 0.5);
  backdrop-filter: blur(4px);
}
.overlay-icon {
  color: var(--gold);
  opacity: 0.8;
}
.overlay-msg {
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
}
.overlay-sub {
  font-size: 12px;
  color: var(--muted-3);
  font-family: var(--font-mono);
}
.overlay-retry {
  margin-top: 6px;
  padding: 8px 20px;
  border-radius: var(--r-md);
  background: var(--primary);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s;
}
.overlay-retry:hover {
  background: var(--primary-hover);
}

.spinner {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.14);
  border-top-color: var(--primary-light);
  animation: spin 0.9s linear infinite;
}
.spinner--idle {
  animation: none;
  border-top-color: var(--gold);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
