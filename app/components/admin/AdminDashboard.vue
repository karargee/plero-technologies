<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'

const props = defineProps<{ sb: SupabaseClient; email: string }>()
const emit = defineEmits<{
  go: [section: string, sub?: string]
  toast: [msg: string, kind?: 'ok' | 'err']
  counts: [c: { pending: number; unread: number }]
}>()

const loading = ref(true)
const rates = ref<Record<string, number>>({})
const ratesAt = ref<string>('')
const cardsLive = ref(0)
const edited = ref(0)
const pending = ref<any[]>([])
const pendingCount = ref(0)
const unread = ref(0)
const recentMsgs = ref<any[]>([])

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
const firstName = computed(() => {
  const n = props.email.split('@')[0] ?? ''
  return n.replace(/[^a-zA-Z]/g, ' ').trim().split(/\s+/)[0] ?? ''
})

async function load() {
  loading.value = true
  const [r, c, ct, pv, pc, um, rm] = await Promise.all([
    props.sb.from('rates').select('key,value,updated_at'),
    props.sb.from('gift_cards').select('id', { count: 'exact', head: true }).eq('active', true),
    props.sb.from('content').select('key', { count: 'exact', head: true }),
    props.sb.from('testimonials').select('id,name,location,quote,rating,created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(3),
    props.sb.from('testimonials').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    props.sb.from('messages').select('id', { count: 'exact', head: true }).eq('read', false),
    props.sb.from('messages').select('id,name,topic,message,created_at,read').order('created_at', { ascending: false }).limit(4),
  ])
  loading.value = false
  const map: Record<string, number> = {}
  let at = ''
  for (const x of r.data ?? []) {
    map[x.key] = Number(x.value)
    if (x.updated_at > at) at = x.updated_at
  }
  rates.value = map
  ratesAt.value = at
  cardsLive.value = c.count ?? 0
  edited.value = ct.count ?? 0
  pending.value = pv.data ?? []
  pendingCount.value = pc.count ?? 0
  unread.value = um.count ?? 0
  recentMsgs.value = rm.data ?? []
  emit('counts', { pending: pendingCount.value, unread: unread.value })
}

async function approve(t: any) {
  const { error } = await props.sb.from('testimonials').update({ status: 'approved' }).eq('id', t.id)
  if (error) return emit('toast', `Could not approve: ${error.message}`, 'err')
  emit('toast', `Approved ${t.name}’s review — it’s on the site.`)
  await load()
}

const fx = (k: string) => (rates.value[k] != null ? formatMoney(rates.value[k]!) : '—')
const spread = (a: string, b: string) =>
  rates.value[a] != null && rates.value[b] != null ? formatMoney(rates.value[a]! - rates.value[b]!) : '—'
const ago = (s: string) => {
  if (!s) return 'never'
  const m = Math.round((Date.now() - new Date(s).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

onMounted(load)
defineExpose({ load })
</script>

<template>
  <div class="dash">
    <header class="hello">
      <div>
        <p class="hello__eyebrow">{{ new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) }}</p>
        <h1>{{ greeting }}<template v-if="firstName">, {{ firstName }}</template> 👋</h1>
        <p class="a-muted">Here’s what’s happening on pleropay.com.</p>
      </div>
      <a href="/" target="_blank" rel="noopener" class="a-btn">View website ↗</a>
    </header>

    <!-- KPIs -->
    <div class="kpis">
      <button type="button" class="kpi a-card" :class="{ alert: pendingCount }" @click="emit('go', 'reviews')">
        <span class="kpi__icon amber"><AppIcon name="star" :size="20" /></span>
        <span class="kpi__n">{{ loading ? '…' : pendingCount }}</span>
        <span class="kpi__l">Reviews waiting</span>
      </button>
      <button type="button" class="kpi a-card" :class="{ alert: unread }" @click="emit('go', 'messages')">
        <span class="kpi__icon accent"><AppIcon name="mail" :size="20" /></span>
        <span class="kpi__n">{{ loading ? '…' : unread }}</span>
        <span class="kpi__l">Unread messages</span>
      </button>
      <button type="button" class="kpi a-card" @click="emit('go', 'rates', 'cards')">
        <span class="kpi__icon green"><AppIcon name="cards" :size="20" /></span>
        <span class="kpi__n">{{ loading ? '…' : cardsLive }}</span>
        <span class="kpi__l">Gift cards live</span>
      </button>
      <button type="button" class="kpi a-card" @click="emit('go', 'content')">
        <span class="kpi__icon pink"><AppIcon name="check" :size="20" /></span>
        <span class="kpi__n">{{ loading ? '…' : edited }}</span>
        <span class="kpi__l">Sections customised</span>
      </button>
    </div>

    <div class="cols">
      <!-- Rates snapshot -->
      <section class="a-card a-card--pad panel">
        <div class="panel__head">
          <h2>Live rates</h2>
          <span class="a-muted">Updated {{ ago(ratesAt) }}</span>
        </div>
        <div v-if="loading" class="a-skel" style="height: 180px" />
        <div v-else class="rates">
          <div class="rate">
            <span class="sym" style="background: #4c4fa6">D</span>
            <span class="rate__n">Deriv</span>
            <span class="rate__v"><small>In</small>{{ fx('deriv_deposit') }}</span>
            <span class="rate__v"><small>Out</small>{{ fx('deriv_withdraw') }}</span>
            <span class="a-chip a-chip--green">{{ spread('deriv_deposit', 'deriv_withdraw') }}</span>
          </div>
          <div class="rate">
            <span class="sym" style="background: #1a9e75">₮</span>
            <span class="rate__n">USDT</span>
            <span class="rate__v"><small>Buy</small>{{ fx('usdt_buy') }}</span>
            <span class="rate__v"><small>Sell</small>{{ fx('usdt_sell') }}</span>
            <span class="a-chip a-chip--green">{{ spread('usdt_buy', 'usdt_sell') }}</span>
          </div>
          <div class="rate">
            <span class="sym" style="background: #2563eb">A</span>
            <span class="rate__n">Airtm</span>
            <span class="rate__v"><small>Buy</small>{{ fx('airtm_buy') }}</span>
            <span class="rate__v"><small>Sell</small>{{ fx('airtm_sell') }}</span>
            <span class="a-chip a-chip--green">{{ spread('airtm_buy', 'airtm_sell') }}</span>
          </div>
          <div class="rate">
            <span class="sym" style="background: #d6342c">¥</span>
            <span class="rate__n">China</span>
            <span class="rate__v"><small>Per ¥1</small>{{ fx('china_rate') }}</span>
            <span class="rate__v"><small>Fee</small>{{ fx('china_fee') }}</span>
            <span />
          </div>
        </div>
        <button type="button" class="a-btn a-btn--primary full" @click="emit('go', 'rates')">Update rates</button>
      </section>

      <!-- Quick actions -->
      <section class="a-card a-card--pad panel">
        <div class="panel__head"><h2>Quick actions</h2></div>
        <div class="quick">
          <button type="button" class="q" @click="emit('go', 'content', 'announcement')">
            <span class="q__i"><AppIcon name="chat" :size="18" /></span>Post an announcement
          </button>
          <button type="button" class="q" @click="emit('go', 'content', 'home')">
            <span class="q__i"><AppIcon name="star" :size="18" /></span>Edit home page text
          </button>
          <button type="button" class="q" @click="emit('go', 'content', 'images')">
            <span class="q__i"><AppIcon name="cards" :size="18" /></span>Change photos
          </button>
          <button type="button" class="q" @click="emit('go', 'content', 'settings')">
            <span class="q__i"><AppIcon name="phone" :size="18" /></span>WhatsApp &amp; contact details
          </button>
          <button type="button" class="q" @click="emit('go', 'reviews')">
            <span class="q__i"><AppIcon name="check" :size="18" /></span>Write a review
          </button>
          <button type="button" class="q" @click="emit('go', 'content', 'guides')">
            <span class="q__i"><AppIcon name="cards" :size="18" /></span>Write a guide
          </button>
        </div>
      </section>
    </div>

    <div class="cols">
      <section class="a-card a-card--pad panel">
        <div class="panel__head">
          <h2>Reviews waiting</h2>
          <button type="button" class="link" @click="emit('go', 'reviews')">See all →</button>
        </div>
        <p v-if="!loading && !pending.length" class="a-muted small">Nothing waiting. New reviews from visitors appear here.</p>
        <div v-for="t in pending" :key="t.id" class="mini-rev">
          <div>
            <b>{{ t.name }}</b> <span class="stars">{{ '★'.repeat(t.rating) }}</span>
            <p>“{{ t.quote }}”</p>
          </div>
          <button type="button" class="a-btn a-btn--sm a-btn--green" @click="approve(t)">✓ Approve</button>
        </div>
      </section>

      <section class="a-card a-card--pad panel">
        <div class="panel__head">
          <h2>Latest messages</h2>
          <button type="button" class="link" @click="emit('go', 'messages')">Inbox →</button>
        </div>
        <p v-if="!loading && !recentMsgs.length" class="a-muted small">No messages yet.</p>
        <button v-for="m in recentMsgs" :key="m.id" type="button" class="mini-msg" @click="emit('go', 'messages')">
          <span class="dot" :class="{ on: !m.read }" />
          <span class="mini-msg__b">
            <b>{{ m.name }}</b> <small>· {{ m.topic }} · {{ ago(m.created_at) }}</small>
            <span>{{ m.message }}</span>
          </span>
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dash {
  display: grid;
  gap: 18px;
}
.hello {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 4px;
}
.hello__eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #b5b8ff;
}
.hello h1 {
  margin-top: 6px;
  font-size: clamp(26px, 3.6vw, 36px);
  letter-spacing: -0.02em;
}
.kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.kpi {
  display: grid;
  gap: 4px;
  justify-items: start;
  padding: 18px;
  color: var(--a-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.kpi:hover {
  transform: translateY(-2px);
  border-color: var(--a-line-2);
}
.kpi.alert {
  border-color: rgb(251 191 36 / 0.45);
}
.kpi__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  margin-bottom: 8px;
}
.amber {
  background: rgb(251 191 36 / 0.15);
  color: var(--a-amber);
}
.accent {
  background: rgb(129 135 255 / 0.18);
  color: #b5b8ff;
}
.green {
  background: rgb(52 211 153 / 0.15);
  color: var(--a-green);
}
.pink {
  background: rgb(244 114 182 / 0.15);
  color: #f9a8d4;
}
.kpi__n {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
}
.kpi__l {
  color: var(--a-soft);
  font-size: 13.5px;
}
.cols {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 14px;
}
.panel {
  display: grid;
  gap: 14px;
  align-content: start;
}
.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.panel__head h2 {
  font-size: 17px;
}
.panel__head .a-muted {
  font-size: 13px;
}
.rates {
  display: grid;
  gap: 8px;
}
.rate {
  display: grid;
  grid-template-columns: 34px 1fr 1fr 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.03);
}
.sym {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: #fff;
  font-weight: 800;
}
.rate__n {
  font-weight: 700;
}
.rate__v {
  display: grid;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.rate__v small {
  font-size: 11px;
  font-weight: 500;
  color: var(--a-mute);
}
.full {
  width: 100%;
}
.quick {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.q {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--a-line);
  background: rgb(255 255 255 / 0.03);
  color: var(--a-text);
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.q:hover {
  background: rgb(129 135 255 / 0.1);
  border-color: rgb(129 135 255 / 0.35);
}
.q__i {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--a-panel-2);
  color: #c7c9ff;
}
.link {
  border: 0;
  background: none;
  color: #b5b8ff;
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.small {
  font-size: 14px;
}
.mini-rev {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.03);
}
.mini-rev p {
  margin-top: 4px;
  color: var(--a-soft);
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.stars {
  color: var(--a-amber);
  font-size: 13px;
}
.mini-msg {
  display: flex;
  gap: 10px;
  padding: 10px;
  border: 0;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.03);
  color: var(--a-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.mini-msg + .mini-msg {
  margin-top: -6px;
}
.dot {
  flex: none;
  width: 8px;
  height: 8px;
  margin-top: 7px;
  border-radius: 50%;
  background: transparent;
}
.dot.on {
  background: var(--a-accent);
}
.mini-msg__b {
  min-width: 0;
  display: grid;
  font-size: 14px;
}
.mini-msg__b small {
  color: var(--a-mute);
}
.mini-msg__b span {
  color: var(--a-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 1100px) {
  .kpis {
    grid-template-columns: repeat(2, 1fr);
  }
  .cols {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 480px) {
  .rate {
    grid-template-columns: 30px 1fr 1fr 1fr;
  }
  .rate .a-chip {
    display: none;
  }
  .quick {
    grid-template-columns: 1fr;
  }
  .kpi__n {
    font-size: 26px;
  }
}
</style>
