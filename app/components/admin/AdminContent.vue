<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { contentSections, type ContentSection } from '~/data/contentSchema'
import { contentDefaults } from '~/data/defaults'

const props = defineProps<{ sb: SupabaseClient; initial?: string }>()
const emit = defineEmits<{ toast: [msg: string, kind?: 'ok' | 'err']; dirty: [v: boolean] }>()

const rows = ref<Record<string, { data: any; updated_at: string }>>({})
const loading = ref(true)
const active = ref<ContentSection | null>(null)
const draft = ref<any>(null)
const baseline = ref('')
const saving = ref(false)

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))
const groups = computed(() => {
  const out: Record<string, ContentSection[]> = {}
  for (const s of contentSections) (out[s.group] ??= []).push(s)
  return out
})
const dirty = computed(() => !!draft.value && JSON.stringify(draft.value) !== baseline.value)
watch(dirty, (v) => emit('dirty', v))

async function load() {
  loading.value = true
  const { data, error } = await props.sb.from('content').select('key,data,updated_at')
  loading.value = false
  if (error) return emit('toast', `Could not load content: ${error.message}`, 'err')
  rows.value = Object.fromEntries((data ?? []).map((r) => [r.key, { data: r.data, updated_at: r.updated_at }]))
}

function confirmLeave() {
  return !dirty.value || confirm('You have unsaved changes. Leave without saving?')
}

function openSection(s: ContentSection) {
  if (!confirmLeave()) return
  active.value = s
  draft.value = clone(mergeContent(contentDefaults[s.key], rows.value[s.key]?.data))
  baseline.value = JSON.stringify(draft.value)
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function back() {
  if (!confirmLeave()) return
  active.value = null
  draft.value = null
}

async function save() {
  if (!active.value) return
  saving.value = true
  const { error } = await props.sb.from('content').upsert({ key: active.value.key, data: draft.value }, { onConflict: 'key' })
  saving.value = false
  if (error) return emit('toast', `Save failed: ${error.message}`, 'err')
  baseline.value = JSON.stringify(draft.value)
  rows.value[active.value.key] = { data: clone(draft.value), updated_at: new Date().toISOString() }
  emit('toast', `${active.value.title} saved. Live on the site within 30 seconds.`)
}

function discard() {
  if (!active.value) return
  draft.value = JSON.parse(baseline.value)
}

async function resetToOriginal() {
  if (!active.value) return
  if (!confirm(`Reset “${active.value.title}” back to the original website text? Your edits for this section will be removed.`)) return
  const { error } = await props.sb.from('content').delete().eq('key', active.value.key)
  if (error) return emit('toast', `Reset failed: ${error.message}`, 'err')
  delete rows.value[active.value.key]
  draft.value = clone(contentDefaults[active.value.key])
  baseline.value = JSON.stringify(draft.value)
  emit('toast', `${active.value.title} reset to the original.`)
}

const when = (s?: string) => (s ? new Date(s).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '')

function beforeUnload(e: BeforeUnloadEvent) {
  if (dirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}
onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnload)
  await load()
  const pre = contentSections.find((s) => s.key === props.initial)
  if (pre) openSection(pre)
})
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
defineExpose({ confirmLeave })
</script>

<template>
  <div>
    <!-- Section list -->
    <template v-if="!active">
      <div class="a-head">
        <div>
          <h1>Content</h1>
          <p>Edit any text or photo on the website. Changes go live within about 30 seconds.</p>
        </div>
      </div>
      <div v-if="loading" class="grid">
        <div v-for="n in 6" :key="n" class="a-skel" style="height: 120px" />
      </div>
      <div v-else class="groups">
        <section v-for="(list, g) in groups" :key="g">
          <h2 class="g-title">{{ g }}</h2>
          <div class="grid">
            <button v-for="s in list" :key="s.key" type="button" class="sec a-card" @click="openSection(s)">
              <span class="sec__icon"><AppIcon :name="s.icon" :size="20" /></span>
              <span class="sec__body">
                <b>{{ s.title }}</b>
                <small>{{ s.description }}</small>
                <span v-if="rows[s.key]" class="a-chip a-chip--accent">Edited · {{ when(rows[s.key]!.updated_at) }}</span>
                <span v-else class="a-chip">Original text</span>
              </span>
              <span class="sec__go" aria-hidden="true">›</span>
            </button>
          </div>
        </section>
      </div>
    </template>

    <!-- Editor -->
    <template v-else>
      <div class="ed-top">
        <button type="button" class="a-btn a-btn--sm" @click="back">← All content</button>
        <a :href="active.preview" target="_blank" rel="noopener" class="a-btn a-btn--sm">Preview page ↗</a>
      </div>
      <div class="a-head">
        <div>
          <h1>{{ active.title }}</h1>
          <p>{{ active.description }}</p>
        </div>
      </div>

      <div class="editor a-card a-card--pad">
        <SchemaField
          v-for="f in active.fields"
          :key="f.key"
          :field="f"
          :sb="sb"
          :model-value="draft[f.key]"
          :default-value="(contentDefaults as any)[active.key]?.[f.key]"
          @update:model-value="draft[f.key] = $event"
          @toast="(m, k) => emit('toast', m, k)"
        />
        <div class="reset">
          <button v-if="rows[active.key]" type="button" class="a-btn a-btn--sm a-btn--danger" @click="resetToOriginal">
            Reset this section to original
          </button>
        </div>
      </div>

      <!-- Sticky save bar -->
      <Transition name="a-fade">
        <div v-if="dirty" class="savebar">
          <span><i class="pulse" /> Unsaved changes</span>
          <div class="a-actions">
            <button type="button" class="a-btn a-btn--sm" :disabled="saving" @click="discard">Discard</button>
            <button type="button" class="a-btn a-btn--sm a-btn--primary" :disabled="saving" @click="save">
              {{ saving ? 'Saving…' : 'Save & publish' }}
            </button>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped>
.groups {
  display: grid;
  gap: 26px;
}
.g-title {
  margin-bottom: 12px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--a-mute) !important;
  font-family: var(--font-body);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.sec {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  text-align: left;
  color: var(--a-text);
  font: inherit;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}
.sec:hover {
  transform: translateY(-2px);
  border-color: rgb(129 135 255 / 0.45);
  background: rgb(129 135 255 / 0.07);
}
.sec__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgb(129 135 255 / 0.3), rgb(91 96 230 / 0.15));
  color: #c7c9ff;
}
.sec__body {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 6px;
  justify-items: start;
}
.sec__body b {
  font-size: 15.5px;
}
.sec__body small {
  color: var(--a-soft);
  font-size: 13px;
  line-height: 1.45;
}
.sec__go {
  font-size: 24px;
  line-height: 1;
  color: var(--a-mute);
}
.ed-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
}
.editor {
  display: grid;
  gap: 16px;
  margin-bottom: 90px;
}
.reset {
  display: flex;
  justify-content: flex-end;
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
  box-shadow: 0 0 0 0 rgb(251 191 36 / 0.6);
  animation: pulse 1.6s infinite;
}
@keyframes pulse {
  70% {
    box-shadow: 0 0 0 8px rgb(251 191 36 / 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgb(251 191 36 / 0);
  }
}
@media (max-width: 1023px) {
  .savebar {
    bottom: calc(84px + env(safe-area-inset-bottom));
  }
}
</style>
