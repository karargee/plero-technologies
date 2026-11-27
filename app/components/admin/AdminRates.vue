<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { rateGroups } from '~/data/admin'
import { deriv as defDeriv } from '~/data/site'
import { payServices as defPay } from '~/data/pay'

// The website's built-in values, used when a rate isn't in the database yet.
const defaults: Record<string, number> = {
  deriv_deposit: defDeriv.depositRate,
  deriv_withdraw: defDeriv.withdrawRate,
  deriv_min: defDeriv.min,
  deriv_max: defDeriv.max,
}
for (const s of defPay) {
  defaults[`${s.id}_min`] = s.min
  defaults[`${s.id}_max`] = s.max
  if (s.kind === 'trade') {
    defaults[`${s.id}_buy`] = s.buyRate
    defaults[`${s.id}_sell`] = s.sellRate
  } else {
    defaults[`${s.id}_rate`] = s.rate
    defaults[`${s.id}_fee`] = s.fee
  }
}

const props = defineProps<{ sb: SupabaseClient }>()
const emit = defineEmits<{ toast: [msg: string, kind?: 'ok' | 'err'] }>()

const values = reactive<Record<string, number | null>>({})
const original = ref<Record<string, number>>({})
const updated = ref<Record<string, string>>({})
const loading = ref(true)
const saving = ref(false)

const allKeys = rateGroups.flatMap((g) => g.fields.map((f) => f.key))

async function load() {
  loading.value = true
  const { data, error } = await props.sb.from('rates').select('key,value,updated_at')
  loading.value = false
  if (error) {
    emit('toast', `Could not load rates: ${error.message}`, 'err')
    return
  }
  const orig: Record<string, number> = {}
  const upd: Record<string, string> = {}
  for (const r of data ?? []) {
    orig[r.key] = Number(r.value)
    upd[r.key] = r.updated_at
  }
  original.value = orig
  updated.value = upd
  for (const k of allKeys) values[k] = orig[k] ?? defaults[k] ?? null
}

/** Rates the website is using from its built-in defaults because they aren't saved yet. */
const missing = computed(() => allKeys.filter((k) => !(k in original.value)))
const changed = computed(() => allKeys.filter((k) => values[k] != null && (values[k] !== original.value[k] || !(k in original.value))))
const invalid = computed(() => allKeys.filter((k) => values[k] == null || Number.isNaN(values[k]) || (values[k] as number) < 0))

function spread(a: string, b: string) {
  const x = values[a]
  const y = values[b]
  return x != null && y != null ? x - y : null
}

function lastUpdated(keys: string[]) {
  const t = keys.map((k) => updated.value[k]).filter(Boolean).sort().at(-1)
  return t ? new Date(t).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'never'
}

async function save() {
  if (invalid.value.length) {
    emit('toast', 'Please fill every rate with a number of 0 or more.', 'err')
    return
  }
  if (!changed.value.length) return
  saving.value = true
  const rows = changed.value.map((key) => ({ key, value: values[key] as number }))
  const { error } = await props.sb.from('rates').upsert(rows, { onConflict: 'key' })
  saving.value = false
  if (error) {
    emit('toast', `Save failed: ${error.message}`, 'err')
    return
  }
  emit('toast', `Saved ${rows.length} rate${rows.length > 1 ? 's' : ''}. The website updates within 30 seconds.`)
  await load()
}

function reset() {
  for (const k of allKeys) values[k] = original.value[k] ?? defaults[k] ?? null
}

onMounted(load)
</script>

<template>
  <div class="panel">
    <div class="panel__head">
      <div>
        <h2>Rates</h2>
        <p>Change a number and press <b>Save changes</b>. The public site updates within about 30 seconds.</p>
      </div>
      <div class="panel__actions">
        <button class="btn btn--ghost" type="button" :disabled="!changed.length || saving" @click="reset">Undo</button>
        <button class="btn btn--primary" type="button" :disabled="!changed.length || saving" @click="save">
          {{ saving ? 'Saving…' : changed.length ? `Save changes (${changed.length})` : 'Saved' }}
        </button>
      </div>
    </div>

    <p v-if="loading" class="muted">Loading rates…</p>
    <p v-if="!loading && missing.length" class="note">
      {{ missing.length }} rate{{ missing.length > 1 ? 's are' : ' is' }} not saved in Supabase yet, so the website is
      using its built-in value (filled in below, highlighted). Check them and press <b>Save changes</b>.
    </p>

    <div v-if="!loading" class="groups">
      <section v-for="g in rateGroups" :key="g.id" class="group card">
        <header>
          <span class="sym" :style="{ background: g.color }">{{ g.symbol }}</span>
          <div>
            <h3>{{ g.title }}</h3>
            <small>Last updated: {{ lastUpdated(g.fields.map((f) => f.key)) }}</small>
          </div>
          <span v-if="g.spread && spread(g.spread[0], g.spread[1]) != null" class="spread" :class="{ bad: spread(g.spread[0], g.spread[1])! < 0 }">
            Spread {{ formatMoney(spread(g.spread[0], g.spread[1])!) }}
          </span>
        </header>
        <div class="fields">
          <label v-for="f in g.fields" :key="f.key" class="f" :class="{ dirty: changed.includes(f.key) }">
            <span>{{ f.label }}</span>
            <span class="inp">
              <i v-if="f.prefix">{{ f.prefix }}</i>
              <input v-model.number="values[f.key]" type="number" min="0" step="any" inputmode="decimal" :class="{ pad: f.prefix }" />
            </span>
            <small>{{ f.hint }}</small>
          </label>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped src="./admin.css"></style>
<style scoped>
.note {
  padding: 12px 16px;
  border-radius: 12px;
  background: #fffbeb;
  border: 1px solid #f5dfa3;
  color: #7a5200;
  font-size: 14.5px;
}
.groups {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.group {
  padding: 20px;
}
.group header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.group h3 {
  font-size: 17px;
}
.group small {
  color: var(--ink-mute);
  font-size: 12.5px;
}
.sym {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  color: #fff;
  font-weight: 800;
}
.spread {
  margin-left: auto;
  font-size: 12.5px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e7f6ef;
  color: var(--success);
  white-space: nowrap;
}
.spread.bad {
  background: #fdecea;
  color: #b42318;
}
.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.f {
  display: grid;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
}
.f small {
  font-weight: 400;
}
.inp {
  position: relative;
  display: flex;
  align-items: center;
}
.inp i {
  position: absolute;
  left: 12px;
  font-style: normal;
  color: var(--ink-mute);
}
.inp input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.inp input.pad {
  padding-left: 28px;
}
.inp input:focus {
  outline: none;
  border-color: var(--indigo-400);
  box-shadow: 0 0 0 3px rgb(108 112 209 / 0.18);
}
.f.dirty input {
  border-color: #f0b429;
  background: #fffbeb;
}
@media (max-width: 900px) {
  .groups {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 420px) {
  .fields {
    grid-template-columns: 1fr;
  }
}
</style>
