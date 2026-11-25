<script setup lang="ts">
// A phone illustration whose screen shows real live Deriv data.
import { markets } from '~/data/site'

const symbol = ref('R_75')
const mode = ref<'ticks' | 'candles'>('ticks')
const { ticks, pipSize, status } = useDerivSeries(symbol, mode)

const list = ['R_100', 'BOOM1000', 'CRASH1000', 'stpRNG']
const prices = useDerivPrices(list)
const name = (s: string) => markets.find((m) => m.symbol === s)?.name ?? s

const W = 260
const H = 110
const spark = computed(() => {
  const pts = ticks.value.slice(-80)
  if (pts.length < 2) return { line: '', area: '', last: null as null | { x: number; y: number } }
  let lo = Infinity
  let hi = -Infinity
  for (const p of pts) {
    lo = Math.min(lo, p.v)
    hi = Math.max(hi, p.v)
  }
  const span = hi - lo || 1
  const xy = pts.map((p, i) => ({ x: (i / (pts.length - 1)) * W, y: 8 + (1 - (p.v - lo) / span) * (H - 16) }))
  const line = xy.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  return { line, area: `${line} L${W} ${H} L0 ${H} Z`, last: xy[xy.length - 1]! }
})
const last = computed(() => ticks.value.at(-1)?.v)
const first = computed(() => ticks.value.at(-80)?.v ?? ticks.value[0]?.v)
const pct = computed(() => (last.value && first.value ? ((last.value - first.value) / first.value) * 100 : 0))

// Gentle 3D tilt that follows the pointer
const tilt = ref({ x: 0, y: 0 })
function onMove(e: PointerEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tilt.value = { x: ((e.clientY - r.top) / r.height - 0.5) * -10, y: ((e.clientX - r.left) / r.width - 0.5) * 12 }
}
</script>

<template>
  <div class="stage" @pointermove="onMove" @pointerleave="tilt = { x: 0, y: 0 }">
    <div class="glow" aria-hidden="true" />
    <div class="floater">
    <div class="phone" :style="{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }" role="img" aria-label="Phone showing live Deriv prices">
      <div class="notch" />
      <div class="screen">
        <div class="bar">
          <span>9:41</span>
          <span class="bar__icons"><i /><i /><i /></span>
        </div>
        <div class="app-head">
          <LogoMark :size="26" />
          <b>Plero</b>
          <span class="live" :class="status"><i />{{ status === 'live' ? 'Live' : '…' }}</span>
        </div>

        <div class="main">
          <small>Volatility 75 Index</small>
          <strong>{{ formatPrice(last, pipSize) }}</strong>
          <span :class="pct >= 0 ? 'up' : 'down'">{{ pct >= 0 ? '▲' : '▼' }} {{ Math.abs(pct).toFixed(2) }}%</span>
          <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="spark">
            <defs>
              <linearGradient id="ph-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#9599ff" stop-opacity=".45" />
                <stop offset="1" stop-color="#9599ff" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path :d="spark.area" fill="url(#ph-area)" />
            <path :d="spark.line" fill="none" stroke="#9599ff" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
            <circle v-if="spark.last" :cx="spark.last.x" :cy="spark.last.y" r="3.5" fill="#fff" />
          </svg>
        </div>

        <ul class="rows">
          <li v-for="s in list" :key="s">
            <span>{{ name(s) }}</span>
            <b :class="{ up: prices[s]?.dir === 1, down: prices[s]?.dir === -1 }">{{ formatPrice(prices[s]?.price, prices[s]?.pip) }}</b>
          </li>
        </ul>

        <div class="btns">
          <span>Deposit</span>
          <span class="alt">Withdraw</span>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  display: grid;
  place-items: center;
  perspective: 1200px;
  padding: 24px 0;
}
.glow {
  position: absolute;
  width: 80%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(108 112 209 / 0.45), transparent 65%);
  filter: blur(20px);
  animation: aurora 16s ease-in-out infinite;
}
.phone {
  position: relative;
  width: 300px;
  max-width: 100%;
  padding: 12px;
  border-radius: 46px;
  background: linear-gradient(145deg, #2a2960, #0c0c24);
  box-shadow: 0 50px 100px -30px rgb(12 12 36 / 0.7), inset 0 0 0 2px rgb(255 255 255 / 0.08),
    inset 0 0 0 7px #0c0c24;
  transition: transform 0.25s ease-out;
  transform-style: preserve-3d;
}
.floater {
  position: relative;
  max-width: 100%;
  animation: float 7s ease-in-out infinite;
}
.notch {
  position: absolute;
  top: 20px;
  left: 50%;
  width: 92px;
  height: 24px;
  border-radius: 20px;
  background: #000;
  transform: translateX(-50%);
  z-index: 2;
}
.screen {
  overflow: hidden;
  border-radius: 36px;
  background: linear-gradient(180deg, #13123a 0%, #0c0c24 100%);
  color: #fff;
  padding: 14px 16px 18px;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bar {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px 6px;
}
.bar__icons {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}
.bar__icons i {
  width: 4px;
  border-radius: 1px;
  background: #fff;
}
.bar__icons i:nth-child(1) {
  height: 5px;
}
.bar__icons i:nth-child(2) {
  height: 8px;
}
.bar__icons i:nth-child(3) {
  height: 11px;
}
.app-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
}
.live {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: rgb(255 255 255 / 0.5);
}
.live i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.live.live {
  color: #2ebd85;
}
.main {
  padding: 16px;
  border-radius: 20px;
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.08);
  display: grid;
  gap: 2px;
}
.main small {
  color: rgb(255 255 255 / 0.55);
  font-size: 12px;
}
.main strong {
  font-family: var(--font-display);
  font-size: 26px;
  font-variant-numeric: tabular-nums;
}
.main > span {
  font-size: 12.5px;
  font-weight: 600;
}
.spark {
  width: 100%;
  height: 110px;
  margin-top: 8px;
}
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 2px;
}
.rows li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 4px;
  font-size: 13px;
  border-bottom: 1px solid rgb(255 255 255 / 0.06);
}
.rows span {
  color: rgb(255 255 255 / 0.75);
}
.rows b {
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
}
.btns {
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.btns span {
  display: grid;
  place-items: center;
  height: 42px;
  border-radius: 14px;
  background: var(--indigo-500);
  font-weight: 600;
  font-size: 14px;
}
.btns .alt {
  background: rgb(255 255 255 / 0.08);
}
.up {
  color: #2ebd85;
}
.down {
  color: #f6465d;
}
@media (max-width: 400px) {
  .phone {
    width: 270px;
  }
}
</style>
