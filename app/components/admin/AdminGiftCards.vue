<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'

const props = defineProps<{ sb: SupabaseClient }>()
const emit = defineEmits<{ toast: [msg: string, kind?: 'ok' | 'err'] }>()

interface Row {
  id: string
  name: string
  color: string
  rate: number
  change: number
  min: number
  max: number
  active: boolean
  sort: number
  _new?: boolean
}

const rows = ref<Row[]>([])
const snapshot = ref<string>('{}')
const loading = ref(true)
const saving = ref(false)

const keyOf = (r: Row) => JSON.stringify([r.name, r.color, r.rate, r.change, r.min, r.max, r.active, r.sort])

async function load() {
  loading.value = true
  const { data, error } = await props.sb
    .from('gift_cards')
    .select('id,name,color,rate,change,min,max,active,sort')
    .order('sort', { ascending: true })
    .order('name', { ascending: true })
  loading.value = false
  if (error) {
    emit('toast', `Could not load gift cards: ${error.message}`, 'err')
    return
  }
  rows.value = (data ?? []).map((r) => ({ ...r, rate: +r.rate, change: +r.change, min: +r.min, max: +r.max }))
  snapshot.value = JSON.stringify(Object.fromEntries(rows.value.map((r) => [r.id, keyOf(r)])))
}

const changedRows = computed(() => {
  const snap = JSON.parse(snapshot.value) as Record<string, string>
  return rows.value.filter((r) => r._new || snap[r.id] !== keyOf(r))
})

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

function addCard() {
  rows.value.push({
    id: '',
    name: '',
    color: '#4c4fa6',
    rate: 0,
    change: 0,
    min: 10,
    max: 500,
    active: true,
    sort: (rows.value.at(-1)?.sort ?? 0) + 1,
    _new: true,
  })
}

async function save() {
  for (const r of changedRows.value) {
    if (!r.name.trim()) return emit('toast', 'Every gift card needs a name.', 'err')
    if (!(r.rate >= 0) || !(r.min >= 0) || !(r.max >= r.min)) {
      return emit('toast', `Check the numbers for “${r.name}” (max must be ≥ min).`, 'err')
    }
    if (r._new && !r.id) {
      // Never reuse an existing card's id — that would overwrite it.
      const base = slugify(r.name) || 'card'
      let id = base
      let n = 2
      while (rows.value.some((x) => x !== r && x.id === id)) id = `${base}-${n++}`
      r.id = id
    }
  }
  if (!changedRows.value.length) return
  saving.value = true
  const payload = changedRows.value.map(({ _new, ...r }) => ({ ...r, name: r.name.trim() }))
  const { error } = await props.sb.from('gift_cards').upsert(payload, { onConflict: 'id' })
  saving.value = false
  if (error) return emit('toast', `Save failed: ${error.message}`, 'err')
  emit('toast', `Saved ${payload.length} gift card${payload.length > 1 ? 's' : ''}.`)
  await load()
}

async function remove(r: Row) {
  if (r._new) {
    rows.value = rows.value.filter((x) => x !== r)
    return
  }
  if (!confirm(`Delete “${r.name}”? It will disappear from the website.`)) return
  const { error } = await props.sb.from('gift_cards').delete().eq('id', r.id)
  if (error) return emit('toast', `Delete failed: ${error.message}`, 'err')
  emit('toast', `Deleted ${r.name}.`)
  await load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="a-head">
      <div>
        <h1>Gift cards</h1>
        <p>Rates are ₦ per $1. Switch a card off to hide it from the website without deleting it.</p>
      </div>
      <div class="a-actions">
        <button class="a-btn" type="button" @click="addCard">+ Add card</button>
      </div>
    </div>

    <div v-if="loading" class="cards">
      <div v-for="n in 4" :key="n" class="a-skel" style="height: 150px" />
    </div>
    <div v-else-if="!rows.length" class="a-card a-empty">No gift cards yet. Tap “Add card”.</div>

    <div v-else class="cards">
      <article
        v-for="(r, i) in rows"
        :key="r.id || `new-${i}`"
        class="gc a-card"
        :class="{ off: !r.active, dirty: changedRows.includes(r) }"
      >
        <div class="gc__top">
          <input v-model="r.color" type="color" class="color" :aria-label="`Colour for ${r.name || 'new card'}`" />
          <input v-model="r.name" type="text" class="a-input name" placeholder="Card name, e.g. Apple / iTunes" aria-label="Card name" />
          <label class="a-switch" :title="r.active ? 'Shown on site' : 'Hidden'">
            <input v-model="r.active" type="checkbox" :aria-label="`Show ${r.name || 'this card'} on the website`" />
            <i />
          </label>
        </div>
        <div class="gc__nums">
          <label class="a-label">Rate ₦/$<input v-model.number="r.rate" type="number" min="0" step="any" inputmode="decimal" class="a-input num" /></label>
          <label class="a-label">24h %<input v-model.number="r.change" type="number" step="0.1" inputmode="decimal" class="a-input num" /></label>
          <label class="a-label">Min $<input v-model.number="r.min" type="number" min="0" inputmode="decimal" class="a-input num" /></label>
          <label class="a-label">Max $<input v-model.number="r.max" type="number" min="0" inputmode="decimal" class="a-input num" /></label>
          <label class="a-label">Order<input v-model.number="r.sort" type="number" inputmode="numeric" class="a-input num" /></label>
        </div>
        <div class="gc__foot">
          <span class="a-chip" :class="r.active ? 'a-chip--green' : ''">{{ r.active ? 'On the website' : 'Hidden' }}</span>
          <span v-if="r._new" class="a-chip a-chip--amber">New — not saved</span>
          <button type="button" class="a-btn a-btn--sm a-btn--danger" @click="remove(r)">Delete</button>
        </div>
      </article>
    </div>

    <Transition name="a-fade">
      <div v-if="changedRows.length" class="savebar">
        <span><i class="pulse" /> {{ changedRows.length }} card{{ changedRows.length > 1 ? 's' : '' }} changed</span>
        <div class="a-actions">
          <button type="button" class="a-btn a-btn--sm" :disabled="saving" @click="load">Undo</button>
          <button type="button" class="a-btn a-btn--sm a-btn--primary" :disabled="saving" @click="save">
            {{ saving ? 'Saving…' : 'Save & publish' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 12px;
  margin-bottom: 90px;
}
.gc {
  display: grid;
  gap: 14px;
  padding: 16px;
  transition: border-color 0.15s ease, opacity 0.15s ease;
}
.gc.dirty {
  border-color: rgb(251 191 36 / 0.55);
}
.gc.off {
  opacity: 0.62;
}
.gc__top {
  display: flex;
  align-items: center;
  gap: 10px;
}
.name {
  flex: 1;
  min-width: 0;
  font-weight: 700;
}
.color {
  flex: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--a-line-2);
  border-radius: 12px;
  background: none;
  cursor: pointer;
}
.gc__nums {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr 0.8fr;
  gap: 8px;
}
.gc__nums .a-label {
  font-size: 11.5px;
}
.num {
  padding: 8px 10px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.gc__foot {
  display: flex;
  align-items: center;
  gap: 8px;
}
.gc__foot .a-btn {
  margin-left: auto;
}
.savebar {
  position: fixed;
  z-index: 40;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(18px + env(safe-area-inset-bottom));
  width: min(640px, calc(100% - 24px));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 10px 10px 18px;
  border-radius: 18px;
  background: rgb(20 20 50 / 0.92);
  border: 1px solid var(--a-line-2);
  backdrop-filter: blur(16px);
  box-shadow: var(--a-shadow);
  font-size: 14px;
  font-weight: 600;
}
.savebar > span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--a-amber);
}
@media (max-width: 1023px) {
  .savebar {
    bottom: calc(84px + env(safe-area-inset-bottom));
  }
}
@media (max-width: 480px) {
  .cards {
    grid-template-columns: 1fr;
  }
  .gc__nums {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
