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
const unreadCount = computed(() => msgs.value.filter((m) => !m.read).length)

async function setRead(m: Msg, read: boolean) {
  const { error } = await props.sb.from('messages').update({ read }).eq('id', m.id)
  if (error) return emit('toast', `Update failed: ${error.message}`, 'err')
  m.read = read
  emit('unread', unreadCount.value)
}

async function remove(m: Msg) {
  if (!confirm(`Delete the message from ${m.name}?`)) return
  const { error } = await props.sb.from('messages').delete().eq('id', m.id)
  if (error) return emit('toast', `Delete failed: ${error.message}`, 'err')
  msgs.value = msgs.value.filter((x) => x.id !== m.id)
  emit('unread', unreadCount.value)
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
  <div>
    <div class="a-head">
      <div>
        <h1>Messages</h1>
        <p>Sent from the contact form on the Support page.</p>
      </div>
      <div class="a-actions">
        <div class="a-seg">
          <button type="button" :class="{ on: filter === 'unread' }" @click="filter = 'unread'">
            Unread <span v-if="unreadCount" class="a-count">{{ unreadCount }}</span>
          </button>
          <button type="button" :class="{ on: filter === 'all' }" @click="filter = 'all'">All</button>
        </div>
        <button class="a-btn a-btn--sm" type="button" @click="load">Refresh</button>
      </div>
    </div>

    <div v-if="loading" class="list">
      <div v-for="n in 3" :key="n" class="a-skel" style="height: 76px" />
    </div>
    <div v-else-if="!shown.length" class="a-card a-empty">
      {{ filter === 'unread' ? 'No unread messages. You’re all caught up 🎉' : 'No messages yet.' }}
    </div>

    <ul v-else class="list">
      <li v-for="m in shown" :key="m.id" class="msg a-card" :class="{ unread: !m.read, open: open === m.id }">
        <button type="button" class="msg__head" :aria-expanded="open === m.id" @click="toggle(m)">
          <span class="avatar">{{ m.name.slice(0, 1).toUpperCase() }}</span>
          <span class="who">
            <b>{{ m.name }}</b>
            <small>{{ m.email }}</small>
          </span>
          <span class="a-chip a-chip--accent topic">{{ m.topic }}</span>
          <span class="date">{{ when(m.created_at) }}</span>
        </button>
        <p v-if="open !== m.id" class="preview">{{ m.message }}</p>
        <div v-else class="body">
          <p>{{ m.message }}</p>
          <div class="a-actions">
            <a :href="replyHref(m)" class="a-btn a-btn--sm a-btn--primary">Reply by email</a>
            <button type="button" class="a-btn a-btn--sm" @click="setRead(m, !m.read)">Mark {{ m.read ? 'unread' : 'read' }}</button>
            <button type="button" class="a-btn a-btn--sm a-btn--danger" @click="remove(m)">Delete</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
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
.msg.unread {
  border-color: rgb(129 135 255 / 0.4);
  background: rgb(129 135 255 / 0.06);
}
.msg__head {
  width: 100%;
  display: grid;
  grid-template-columns: 40px minmax(0, 1.4fr) auto auto;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border: 0;
  background: transparent;
  color: var(--a-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--a-panel-3);
  font-weight: 700;
}
.unread .avatar {
  background: linear-gradient(135deg, var(--a-accent), var(--a-accent-2));
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
.who small,
.date {
  color: var(--a-mute);
  font-size: 13px;
}
.topic {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.preview {
  padding: 0 16px 14px 70px;
  color: var(--a-soft);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.body {
  padding: 0 16px 16px 70px;
  display: grid;
  gap: 14px;
}
.body p {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--a-soft);
  line-height: 1.6;
}
@media (max-width: 640px) {
  .msg__head {
    grid-template-columns: 40px 1fr;
  }
  .topic,
  .date {
    grid-column: 2;
    justify-self: start;
  }
  .preview,
  .body {
    padding-left: 16px;
  }
}
</style>
