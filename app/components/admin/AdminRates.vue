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
  <div>
    <div class="a-head">
      <div>
        <h1>Rates</h1>
        <p>Type a new number and press <b>Save</b>. The website updates within about 30 seconds.</p>
      </div>
    </div>

    <div v-if="loading" class="groups">
      <div v-for="n in 4" :key="n" class="a-skel" style="height: 260px" />
    </div>
    <template v-else>
      <p v-if="missing.length" class="a-note" style="margin-bottom: 16px">
        {{ missing.length }} rate{{ missing.length > 1 ? 's are' : ' is' }} not saved yet — the site is using its built-in value
        (highlighted). Check and press <b>Save</b>.
      </p>
      <div class="groups">
        <section v-for="g in rateGroups" :key="g.id" class="group a-card">
          <header>
            <span class="sym" :style="{ background: g.color }">{{ g.symbol }}</span>
            <div class="group__t">
              <h2>{{ g.title }}</h2>
              <small>Updated {{ lastUpdated(g.fields.map((f) => f.key)) }}</small>
            </div>
            <span
              v-if="g.spread && spread(g.spread[0], g.spread[1]) != null"
              class="a-chip"
              :class="spread(g.spread[0], g.spread[1])! < 0 ? 'a-chip--red' : 'a-chip--green'"
              title="Your margin per unit"
            >
              Spread {{ formatMoney(spread(g.spread[0], g.spread[1])!) }}
            </span>
          </header>
          <div class="fields">
            <label v-for="f in g.fields" :key="f.key" class="a-label">
              {{ f.label }}
              <span class="inp">
                <i v-if="f.prefix">{{ f.prefix }}</i>
                <input
                  v-model.number="values[f.key]"
                  class="a-input"
                  :class="{ 'a-input--dirty': changed.includes(f.key), pad: f.prefix }"
                  type="number"
                  min="0"
                  step="any"
                  inputmode="decimal"
                />
              </span>
              <small>{{ f.hint }}</small>
            </label>
          </div>
        </section>
      </div>
    </template>

    <Transition name="a-fade">
      <div v-if="changed.length" class="savebar">
        <span><i class="pulse" /> {{ changed.length }} unsaved change{{ changed.length > 1 ? 's' : '' }}</span>
        <div class="a-actions">
          <button type="button" class="a-btn a-btn--sm" :disabled="saving" @click="reset">Undo</button>
          <button type="button" class="a-btn a-btn--sm a-btn--primary" :disabled="saving" @click="save">
            {{ saving ? 'Saving…' : 'Save & publish' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 90px;
}
.group {
  padding: 20px;
}
.group header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.group__t {
  flex: 1;
  min-width: 0;
}
.group h2 {
  font-size: 17px;
}
.group small {
  color: var(--a-mute);
  font-size: 12.5px;
}
.sym {
  flex: none;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  color: #fff;
  font-weight: 800;
  font-size: 18px;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.2);
}
.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
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
  color: var(--a-mute);
  pointer-events: none;
}
.inp .a-input {
  font-size: 17px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.inp .a-input.pad {
  padding-left: 30px;
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
@media (max-width: 900px) {
  .groups {
    grid-template-columns: 1fr;
  }
}
</style>
