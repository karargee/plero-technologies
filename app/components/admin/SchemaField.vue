<script setup lang="ts">
// Renders one field of a content section (recursive for groups and lists).
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Field } from '~/data/contentSchema'

const props = defineProps<{ field: Field; modelValue: any; sb: SupabaseClient; defaultValue?: any; depth?: number }>()
const emit = defineEmits<{ 'update:modelValue': [v: any]; toast: [msg: string, kind?: 'ok' | 'err'] }>()

const depth = computed(() => props.depth ?? 0)
const set = (v: any) => emit('update:modelValue', v)
const setKey = (k: string, v: any) => set({ ...(props.modelValue ?? {}), [k]: v })
const uid = `f${Math.random().toString(36).slice(2, 9)}`

// ---------- empty values for new list items ----------
function blank(f: Field): any {
  switch (f.type) {
    case 'number':
      return 0
    case 'toggle':
      return false
    case 'strings':
    case 'list':
      return []
    case 'group':
      return Object.fromEntries(f.fields.map((x) => [x.key, blank(x)]))
    case 'select':
      return f.options[0]?.value ?? ''
    default:
      return ''
  }
}

// ---------- lists ----------
const list = computed<any[]>(() => (Array.isArray(props.modelValue) ? props.modelValue : []))
const openItem = ref<number | null>(null)
function addItem() {
  if (props.field.type === 'list') {
    set([...list.value, Object.fromEntries(props.field.fields.map((x) => [x.key, blank(x)]))])
    openItem.value = list.value.length
  } else set([...list.value, ''])
}
function removeItem(i: number) {
  const it = list.value[i]
  const label = props.field.type === 'list' ? itemTitle(it, i) : String(it || 'this item')
  if (!confirm(`Remove “${label.slice(0, 60)}”?`)) return
  set(list.value.filter((_, j) => j !== i))
  if (openItem.value === i) openItem.value = null
}
function moveItem(i: number, d: -1 | 1) {
  const j = i + d
  if (j < 0 || j >= list.value.length) return
  const a = [...list.value]
  ;[a[i], a[j]] = [a[j], a[i]]
  set(a)
  if (openItem.value === i) openItem.value = j
}
function setItem(i: number, v: any) {
  const a = [...list.value]
  a[i] = v
  set(a)
}
function itemTitle(it: any, i: number) {
  if (props.field.type !== 'list') return ''
  const t = String(it?.[props.field.titleKey] ?? '').trim()
  return t ? t.split('\n')[0]!.slice(0, 80) : `New ${props.field.itemLabel} ${i + 1}`
}

// ---------- groups ----------
const groupOpen = ref(props.field.type === 'group' ? !props.field.collapsed : true)

// ---------- images ----------
const uploading = ref(false)
const fileInput = ref<HTMLInputElement>()

async function shrink(file: File): Promise<Blob> {
  if (file.type === 'image/gif' || file.size < 400_000) return file
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, 1920 / Math.max(bmp.width, bmp.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bmp.width * scale)
    canvas.height = Math.round(bmp.height * scale)
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    const toBlob = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q))
    const webp = await toBlob('image/webp', 0.82)
    const out = webp && webp.type === 'image/webp' ? webp : await toBlob('image/jpeg', 0.85)
    return out && out.size < file.size ? out : file
  } catch {
    return file
  }
}

async function upload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  ;(e.target as HTMLInputElement).value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) return emit('toast', 'Please choose an image file.', 'err')
  uploading.value = true
  try {
    const blob = await shrink(file)
    const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/jpeg' ? 'jpg' : file.name.split('.').pop() || 'img'
    const path = `${props.field.key}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
    const { error } = await props.sb.storage.from('site-images').upload(path, blob, { contentType: blob.type || file.type, cacheControl: '31536000' })
    if (error) throw error
    const { data } = props.sb.storage.from('site-images').getPublicUrl(path)
    set(data.publicUrl)
    emit('toast', 'Photo uploaded — press Save to publish it.')
  } catch (err: any) {
    emit('toast', `Upload failed: ${err?.message || err}`, 'err')
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <!-- Text-like -->
  <label v-if="['text', 'url', 'email', 'number'].includes(field.type)" class="a-label" :for="uid">
    {{ field.label }}
    <input
      :id="uid"
      class="a-input"
      :type="field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'"
      :inputmode="field.type === 'number' ? 'decimal' : field.type === 'url' ? 'url' : undefined"
      :value="modelValue"
      :placeholder="'placeholder' in field ? field.placeholder : ''"
      @input="set(field.type === 'number' ? Number(($event.target as HTMLInputElement).value) : ($event.target as HTMLInputElement).value)"
    />
    <small v-if="field.hint">{{ field.hint }}</small>
  </label>

  <label v-else-if="field.type === 'textarea'" class="a-label" :for="uid">
    {{ field.label }}
    <textarea :id="uid" class="a-input" :rows="field.rows ?? 3" :value="modelValue" @input="set(($event.target as HTMLTextAreaElement).value)" />
    <small v-if="field.hint">{{ field.hint }}</small>
  </label>

  <div v-else-if="field.type === 'toggle'" class="toggle-row">
    <label class="a-switch">
      <input type="checkbox" :checked="!!modelValue" @change="set(($event.target as HTMLInputElement).checked)" />
      <i />
      <span>{{ field.label }}</span>
    </label>
    <small v-if="field.hint" class="a-muted">{{ field.hint }}</small>
  </div>

  <label v-else-if="field.type === 'select'" class="a-label" :for="uid">
    {{ field.label }}
    <select :id="uid" class="a-input" :value="modelValue" @change="set(($event.target as HTMLSelectElement).value)">
      <option v-for="o in field.options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <small v-if="field.hint">{{ field.hint }}</small>
  </label>

  <!-- Image -->
  <div v-else-if="field.type === 'image'" class="img">
    <div class="img__preview">
      <img v-if="modelValue" :src="modelValue" :alt="field.label" loading="lazy" />
      <span v-if="uploading" class="img__busy"><i /> Uploading…</span>
    </div>
    <div class="img__body">
      <b>{{ field.label }}</b>
      <small v-if="defaultValue && modelValue !== defaultValue" class="a-chip a-chip--accent">Custom photo</small>
      <small v-else class="a-muted">Original photo</small>
      <div class="img__btns">
        <button type="button" class="a-btn a-btn--sm a-btn--primary" :disabled="uploading" @click="fileInput?.click()">
          {{ uploading ? 'Uploading…' : 'Upload new' }}
        </button>
        <button v-if="defaultValue && modelValue !== defaultValue" type="button" class="a-btn a-btn--sm" @click="set(defaultValue)">
          Use original
        </button>
      </div>
      <input ref="fileInput" type="file" accept="image/*" hidden @change="upload" />
    </div>
  </div>

  <!-- List of strings -->
  <div v-else-if="field.type === 'strings'" class="block">
    <div class="block__head">
      <b>{{ field.label }}</b>
      <small v-if="field.hint" class="a-muted">{{ field.hint }}</small>
    </div>
    <div v-for="(s, i) in list" :key="i" class="str">
      <input class="a-input" :value="s" :aria-label="`${field.label} ${i + 1}`" @input="setItem(i, ($event.target as HTMLInputElement).value)" />
      <div class="mini">
        <button type="button" class="a-btn a-btn--sm a-btn--icon" :disabled="i === 0" aria-label="Move up" @click="moveItem(i, -1)">↑</button>
        <button type="button" class="a-btn a-btn--sm a-btn--icon" :disabled="i === list.length - 1" aria-label="Move down" @click="moveItem(i, 1)">↓</button>
        <button type="button" class="a-btn a-btn--sm a-btn--icon a-btn--danger" aria-label="Remove" @click="removeItem(i)">✕</button>
      </div>
    </div>
    <button type="button" class="a-btn a-btn--sm add" @click="addItem">+ Add {{ field.itemLabel ?? 'item' }}</button>
  </div>

  <!-- List of objects -->
  <div v-else-if="field.type === 'list'" class="block">
    <div class="block__head">
      <b>{{ field.label }} <span class="a-chip">{{ list.length }}</span></b>
      <small v-if="field.hint" class="a-muted">{{ field.hint }}</small>
    </div>
    <div v-for="(it, i) in list" :key="i" class="item" :class="{ open: openItem === i }">
      <div class="item__bar">
        <button type="button" class="item__title" :aria-expanded="openItem === i" @click="openItem = openItem === i ? null : i">
          <span class="item__n">{{ i + 1 }}</span>
          <span class="item__t">{{ itemTitle(it, i) }}</span>
          <span class="item__chev" aria-hidden="true">▾</span>
        </button>
        <div class="mini">
          <button type="button" class="a-btn a-btn--sm a-btn--icon" :disabled="i === 0" aria-label="Move up" @click="moveItem(i, -1)">↑</button>
          <button type="button" class="a-btn a-btn--sm a-btn--icon" :disabled="i === list.length - 1" aria-label="Move down" @click="moveItem(i, 1)">↓</button>
          <button type="button" class="a-btn a-btn--sm a-btn--icon a-btn--danger" aria-label="Remove" @click="removeItem(i)">✕</button>
        </div>
      </div>
      <div v-if="openItem === i" class="item__body">
        <SchemaField
          v-for="sub in field.fields"
          :key="sub.key"
          :field="sub"
          :sb="sb"
          :depth="depth + 1"
          :model-value="it?.[sub.key]"
          @update:model-value="setItem(i, { ...it, [sub.key]: $event })"
          @toast="(m, k) => emit('toast', m, k)"
        />
      </div>
    </div>
    <button type="button" class="a-btn a-btn--sm add" @click="addItem">+ Add {{ field.itemLabel }}</button>
  </div>

  <!-- Group -->
  <fieldset v-else-if="field.type === 'group'" class="group" :class="{ 'group--nested': depth > 0, open: groupOpen }">
    <legend>
      <button type="button" class="group__toggle" :aria-expanded="groupOpen" @click="groupOpen = !groupOpen">
        <span>{{ field.label }}</span>
        <span class="item__chev" aria-hidden="true">▾</span>
      </button>
    </legend>
    <small v-if="field.hint && groupOpen" class="a-muted group__hint">{{ field.hint }}</small>
    <div v-if="groupOpen" class="group__body">
      <SchemaField
        v-for="sub in field.fields"
        :key="sub.key"
        :field="sub"
        :sb="sb"
        :depth="depth + 1"
        :model-value="modelValue?.[sub.key]"
        :default-value="defaultValue?.[sub.key]"
        @update:model-value="setKey(sub.key, $event)"
        @toast="(m, k) => emit('toast', m, k)"
      />
    </div>
  </fieldset>
</template>

<style scoped>
.toggle-row {
  display: grid;
  gap: 4px;
}
.block {
  display: grid;
  gap: 10px;
}
.block__head {
  display: grid;
  gap: 2px;
}
.block__head b {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.str {
  display: flex;
  gap: 8px;
  align-items: center;
}
.mini {
  flex: none;
  display: flex;
  gap: 4px;
}
.add {
  justify-self: start;
  border-style: dashed;
}
.item {
  border: 1px solid var(--a-line);
  border-radius: 14px;
  background: rgb(255 255 255 / 0.025);
  overflow: hidden;
}
.item.open {
  border-color: rgb(129 135 255 / 0.45);
  background: rgb(129 135 255 / 0.05);
}
.item__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px 6px 6px;
}
.item__title {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;
  border: 0;
  background: transparent;
  color: var(--a-text);
  font: inherit;
  font-weight: 600;
  font-size: 14.5px;
  text-align: left;
  cursor: pointer;
}
.item__n {
  flex: none;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--a-panel-2);
  color: var(--a-soft);
  font-size: 12px;
}
.item__t {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item__chev {
  color: var(--a-mute);
  transition: transform 0.2s ease;
}
.item.open .item__chev,
.group.open > legend .item__chev {
  transform: rotate(180deg);
}
.item__body {
  display: grid;
  gap: 14px;
  padding: 6px 14px 16px;
}
.group {
  margin: 0;
  padding: 0;
  border: 1px solid var(--a-line);
  border-radius: 16px;
  background: rgb(255 255 255 / 0.02);
  min-width: 0;
}
.group legend {
  float: left;
  width: 100%;
  padding: 0;
}
.group__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  border: 0;
  background: transparent;
  color: var(--a-text);
  font: inherit;
  font-weight: 700;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
}
.group__hint {
  display: block;
  clear: both;
  padding: 0 16px 6px;
}
.group__body {
  clear: both;
  display: grid;
  gap: 14px;
  padding: 4px 16px 18px;
}
.group--nested {
  background: transparent;
}
.img {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 14px;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--a-line);
  border-radius: 16px;
  background: rgb(255 255 255 / 0.025);
}
.img__preview {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  background: var(--a-panel-2);
}
.img__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img__busy {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  gap: 6px;
  background: rgb(9 9 24 / 0.7);
  font-size: 13px;
  font-weight: 600;
}
.img__busy i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 3px solid rgb(255 255 255 / 0.2);
  border-top-color: var(--a-accent);
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.img__body {
  display: grid;
  gap: 6px;
  justify-items: start;
  min-width: 0;
}
.img__body b {
  font-size: 14.5px;
}
.img__btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
@media (max-width: 520px) {
  .img {
    grid-template-columns: 110px 1fr;
  }
  .str {
    flex-wrap: wrap;
  }
  .str .a-input {
    flex: 1 1 100%;
  }
}
</style>
