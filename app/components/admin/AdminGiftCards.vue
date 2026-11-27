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
  <div class="panel">
    <div class="panel__head">
      <div>
        <h2>Gift cards</h2>
        <p>Edit rates (₦ per $1), limits and visibility. Turn a card off to hide it without deleting it.</p>
      </div>
      <div class="panel__actions">
        <button class="btn btn--ghost" type="button" @click="addCard">+ Add card</button>
        <button class="btn btn--primary" type="button" :disabled="!changedRows.length || saving" @click="save">
          {{ saving ? 'Saving…' : changedRows.length ? `Save changes (${changedRows.length})` : 'Saved' }}
        </button>
      </div>
    </div>

    <p v-if="loading" class="muted">Loading gift cards…</p>

    <div v-else class="table card">
      <div class="tr th">
        <span>Card</span><span>Rate ₦/$</span><span>24h %</span><span>Min $</span><span>Max $</span><span>Order</span><span>Live</span><span />
      </div>
      <div v-for="(r, i) in rows" :key="r.id || `new-${i}`" class="tr" :class="{ off: !r.active, dirty: changedRows.includes(r) }">
        <span class="name">
          <input v-model="r.color" type="color" class="color" :aria-label="`Colour for ${r.name || 'new card'}`" />
          <input v-model="r.name" type="text" placeholder="Card name" class="in" />
        </span>
        <input v-model.number="r.rate" type="number" min="0" step="any" class="in num" aria-label="Rate" />
        <input v-model.number="r.change" type="number" step="0.1" class="in num" aria-label="24h change" />
        <input v-model.number="r.min" type="number" min="0" class="in num" aria-label="Minimum" />
        <input v-model.number="r.max" type="number" min="0" class="in num" aria-label="Maximum" />
        <input v-model.number="r.sort" type="number" class="in num" aria-label="Order" />
        <label class="switch">
          <input v-model="r.active" type="checkbox" />
          <i />
        </label>
        <button type="button" class="del" :aria-label="`Delete ${r.name}`" @click="remove(r)">✕</button>
      </div>
      <p v-if="!rows.length" class="muted empty">No gift cards yet. Click “Add card”.</p>
    </div>
  </div>
</template>

<style scoped src="./admin.css"></style>
<style scoped>
.table {
  overflow-x: auto;
  padding: 6px;
}
.tr {
  display: grid;
  grid-template-columns: minmax(200px, 2fr) repeat(5, minmax(84px, 1fr)) 60px 40px;
  gap: 8px;
  align-items: center;
  padding: 8px;
  border-radius: 10px;
  min-width: 860px;
}
.tr + .tr {
  border-top: 1px solid var(--line);
}
.th {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.tr.dirty {
  background: #fffbeb;
}
.tr.off .name .in {
  color: var(--ink-mute);
  text-decoration: line-through;
}
.name {
  display: flex;
  gap: 8px;
  align-items: center;
}
.in {
  width: 100%;
  height: 38px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 14px;
}
.in:focus {
  outline: none;
  border-color: var(--indigo-400);
}
.num {
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.color {
  flex: none;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: none;
  cursor: pointer;
}
.switch {
  position: relative;
  width: 42px;
  height: 24px;
  cursor: pointer;
}
.switch input {
  position: absolute;
  opacity: 0;
}
.switch i {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: var(--line);
  transition: background-color 0.15s ease;
}
.switch i::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s ease;
}
.switch input:checked + i {
  background: var(--success);
}
.switch input:checked + i::after {
  transform: translateX(18px);
}
.switch input:focus-visible + i {
  outline: 2px solid var(--indigo-400);
  outline-offset: 2px;
}
.del {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ink-mute);
  cursor: pointer;
}
.del:hover {
  background: #fdecea;
  color: #b42318;
}
.empty {
  padding: 20px;
}
</style>
