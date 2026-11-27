<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'

const props = defineProps<{ sb: SupabaseClient }>()
const emit = defineEmits<{ toast: [msg: string, kind?: 'ok' | 'err']; unread: [n: number] }>()

interface Msg {
  id: string
  created_at: string
  name: string
  email: string
  topic: string
  message: string
  read: boolean
}

const msgs = ref<Msg[]>([])
const loading = ref(true)
const filter = ref<'all' | 'unread'>('unread')
const open = ref<string | null>(null)

async function load() {
  loading.value = true
  const { data, error } = await props.sb
    .from('messages')
    .select('id,created_at,name,email,topic,message,read')
    .order('created_at', { ascending: false })
    .limit(200)
  loading.value = false
  if (error) return emit('toast', `Could not load messages: ${error.message}`, 'err')
  msgs.value = data ?? []
  emit('unread', msgs.value.filter((m) => !m.read).length)
}

// Keep the message you're reading on screen even after it's marked read.
const shown = computed(() =>
  filter.value === 'unread' ? msgs.value.filter((m) => !m.read || m.id === open.value) : msgs.value,
)

async function setRead(m: Msg, read: boolean) {
  const { error } = await props.sb.from('messages').update({ read }).eq('id', m.id)
  if (error) return emit('toast', `Update failed: ${error.message}`, 'err')
  m.read = read
  emit('unread', msgs.value.filter((x) => !x.read).length)
}

async function remove(m: Msg) {
  if (!confirm(`Delete the message from ${m.name}?`)) return
  const { error } = await props.sb.from('messages').delete().eq('id', m.id)
  if (error) return emit('toast', `Delete failed: ${error.message}`, 'err')
  msgs.value = msgs.value.filter((x) => x.id !== m.id)
  emit('unread', msgs.value.filter((x) => !x.read).length)
  emit('toast', 'Message deleted.')
}

function toggle(m: Msg) {
  open.value = open.value === m.id ? null : m.id
  if (open.value && !m.read) setRead(m, true)
}

const when = (s: string) => new Date(s).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
const replyHref = (m: Msg) =>
  `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(`Re: ${m.topic}`)}&body=${encodeURIComponent(`Hi ${m.name},\n\n`)}`

onMounted(load)
defineExpose({ load })
</script>

<template>
  <div class="panel">
    <div class="panel__head">
      <div>
        <h2>Messages</h2>
        <p>Sent from the Support page contact form.</p>
      </div>
      <div class="panel__actions">
        <div class="seg">
          <button type="button" :class="{ on: filter === 'unread' }" @click="filter = 'unread'">Unread</button>
          <button type="button" :class="{ on: filter === 'all' }" @click="filter = 'all'">All</button>
        </div>
        <button class="btn btn--ghost" type="button" @click="load">Refresh</button>
      </div>
    </div>

    <p v-if="loading" class="muted">Loading messages…</p>
    <p v-else-if="!shown.length" class="muted empty card">
      {{ filter === 'unread' ? 'No unread messages. 🎉' : 'No messages yet.' }}
    </p>

    <ul v-else class="list">
      <li v-for="m in shown" :key="m.id" class="msg card" :class="{ unread: !m.read, open: open === m.id }">
        <button type="button" class="msg__head" :aria-expanded="open === m.id" @click="toggle(m)">
          <span class="dot" aria-hidden="true" />
          <span class="who">
            <b>{{ m.name }}</b>
            <small>{{ m.email }}</small>
          </span>
          <span class="topic">{{ m.topic }}</span>
          <span class="date">{{ when(m.created_at) }}</span>
        </button>
        <p v-if="open !== m.id" class="preview">{{ m.message }}</p>
        <div v-else class="body">
          <p>{{ m.message }}</p>
          <div class="acts">
            <a :href="replyHref(m)" class="btn btn--primary">Reply by email</a>
            <button type="button" class="btn btn--ghost" @click="setRead(m, !m.read)">
              Mark as {{ m.read ? 'unread' : 'read' }}
            </button>
            <button type="button" class="btn btn--ghost danger" @click="remove(m)">Delete</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped src="./admin.css"></style>
<style scoped>
.seg {
  display: inline-flex;
  padding: 3px;
  border-radius: 10px;
  background: var(--surface-alt);
  border: 1px solid var(--line);
}
.seg button {
  border: 0;
  background: transparent;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
}
.seg button.on {
  background: #fff;
  color: var(--navy-700);
  box-shadow: var(--shadow-sm);
}
.empty {
  padding: 28px;
  text-align: center;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
.msg {
  overflow: hidden;
}
.msg__head {
  width: 100%;
  display: grid;
  grid-template-columns: 10px minmax(0, 1.4fr) minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 14px 18px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: transparent;
}
.unread .dot {
  background: var(--indigo-500);
}
.who {
  display: grid;
  min-width: 0;
}
.who b,
.who small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.unread .who b {
  font-weight: 800;
}
.who small,
.date {
  color: var(--ink-mute);
  font-size: 13px;
}
.topic {
  justify-self: start;
  font-size: 12.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--indigo-50);
  color: var(--indigo-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.preview {
  padding: 0 18px 14px 42px;
  color: var(--ink-soft);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.body {
  padding: 0 18px 18px 42px;
  display: grid;
  gap: 14px;
}
.body p {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.acts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.acts .btn {
  height: 38px;
  font-size: 14px;
}
.danger:hover {
  border-color: #f5c2bd;
  background: #fdecea;
  color: #b42318;
}
@media (max-width: 640px) {
  .msg__head {
    grid-template-columns: 10px 1fr;
  }
  .topic,
  .date {
    grid-column: 2;
  }
}
</style>
