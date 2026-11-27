<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'

const props = defineProps<{ sb: SupabaseClient }>()
const emit = defineEmits<{ toast: [msg: string, kind?: 'ok' | 'err']; pending: [n: number] }>()

type Status = 'pending' | 'approved' | 'rejected'
interface Review {
  id: string
  created_at: string
  name: string
  location: string
  service: string
  quote: string
  rating: number
  status: Status
  source: 'visitor' | 'admin'
  featured: boolean
}

const all = ref<Review[]>([])
const loading = ref(true)
const filter = ref<Status | 'all'>('pending')
const busy = ref<string | null>(null)

const counts = computed(() => ({
  pending: all.value.filter((r) => r.status === 'pending').length,
  approved: all.value.filter((r) => r.status === 'approved').length,
  rejected: all.value.filter((r) => r.status === 'rejected').length,
  all: all.value.length,
}))
const shown = computed(() => (filter.value === 'all' ? all.value : all.value.filter((r) => r.status === filter.value)))

async function load() {
  loading.value = true
  const { data, error } = await props.sb
    .from('testimonials')
    .select('id,created_at,name,location,service,quote,rating,status,source,featured')
    .order('created_at', { ascending: false })
    .limit(500)
  loading.value = false
  if (error) return emit('toast', `Could not load reviews: ${error.message}`, 'err')
  all.value = (data ?? []) as Review[]
  emit('pending', counts.value.pending)
}

async function patch(r: Review, change: Partial<Review>, msg: string) {
  busy.value = r.id
  const { error } = await props.sb.from('testimonials').update(change).eq('id', r.id)
  busy.value = null
  if (error) return emit('toast', `Update failed: ${error.message}`, 'err')
  Object.assign(r, change)
  emit('pending', counts.value.pending)
  emit('toast', msg)
}

async function remove(r: Review) {
  if (!confirm(`Delete the review from ${r.name}? This can’t be undone.`)) return
  const { error } = await props.sb.from('testimonials').delete().eq('id', r.id)
  if (error) return emit('toast', `Delete failed: ${error.message}`, 'err')
  all.value = all.value.filter((x) => x.id !== r.id)
  emit('pending', counts.value.pending)
  emit('toast', 'Review deleted.')
}

// ---------- Add / edit ----------
const editing = ref<Partial<Review> | null>(null)
const saving = ref(false)
const services = ['Deriv deposit', 'Deriv withdrawal', 'USDT', 'Airtm USD', 'China supplier payment', 'Gift cards', '']

function startNew() {
  editing.value = { name: '', location: '', service: 'Deriv deposit', quote: '', rating: 5, status: 'approved', featured: false }
}
function startEdit(r: Review) {
  editing.value = { ...r }
}
async function saveEdit() {
  const e = editing.value
  if (!e) return
  if (!e.name?.trim() || (e.quote?.trim().length ?? 0) < 10) return emit('toast', 'Add a name and at least a sentence of review.', 'err')
  saving.value = true
  const row = {
    name: e.name.trim(),
    location: (e.location ?? '').trim(),
    service: e.service ?? '',
    quote: e.quote!.trim(),
    rating: e.rating ?? 5,
    status: e.status ?? 'approved',
    featured: !!e.featured,
  }
  const res = e.id
    ? await props.sb.from('testimonials').update(row).eq('id', e.id)
    : await props.sb.from('testimonials').insert({ ...row, source: 'admin' })
  saving.value = false
  if (res.error) return emit('toast', `Save failed: ${res.error.message}`, 'err')
  emit('toast', e.id ? 'Review updated.' : 'Review added.')
  editing.value = null
  await load()
}

const when = (s: string) => new Date(s).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
onMounted(load)
</script>

<template>
  <div>
    <div class="a-head">
      <div>
        <h1>Reviews</h1>
        <p>Visitors’ reviews wait here until you approve them. Only approved reviews show on the website.</p>
      </div>
      <div class="a-actions">
        <button type="button" class="a-btn a-btn--primary" @click="startNew">+ Write a review</button>
      </div>
    </div>

    <div class="a-seg filters" role="tablist" aria-label="Filter reviews">
      <button v-for="f in (['pending', 'approved', 'rejected', 'all'] as const)" :key="f" type="button" :class="{ on: filter === f }" @click="filter = f">
        {{ f[0]!.toUpperCase() + f.slice(1) }}
        <span v-if="f === 'pending' && counts.pending" class="a-count">{{ counts.pending }}</span>
        <span v-else class="a-muted">{{ counts[f] }}</span>
      </button>
    </div>

    <div v-if="loading" class="list">
      <div v-for="n in 3" :key="n" class="a-skel" style="height: 140px" />
    </div>
    <div v-else-if="!shown.length" class="a-card a-empty">
      {{ filter === 'pending' ? 'No reviews waiting. New ones from visitors will appear here.' : 'Nothing here yet.' }}
    </div>

    <TransitionGroup v-else name="a-fade" tag="div" class="list">
      <article v-for="r in shown" :key="r.id" class="rev a-card" :class="[`rev--${r.status}`, { 'rev--busy': busy === r.id }]">
        <header class="rev__head">
          <span class="avatar">{{ r.name.slice(0, 1).toUpperCase() }}</span>
          <div class="rev__who">
            <b>{{ r.name }}</b>
            <small>{{ [r.location, r.service].filter(Boolean).join(' · ') || '—' }}</small>
          </div>
          <div class="rev__tags">
            <span class="stars" :aria-label="`${r.rating} of 5`">{{ '★'.repeat(r.rating) }}<i>{{ '★'.repeat(5 - r.rating) }}</i></span>
            <span class="a-chip" :class="{ 'a-chip--amber': r.status === 'pending', 'a-chip--green': r.status === 'approved', 'a-chip--red': r.status === 'rejected' }">
              {{ r.status }}
            </span>
            <span v-if="r.featured" class="a-chip a-chip--accent">★ Featured</span>
          </div>
        </header>
        <p class="rev__quote">“{{ r.quote }}”</p>
        <footer class="rev__foot">
          <small class="a-muted">{{ r.source === 'admin' ? 'Added by admin' : 'From a visitor' }} · {{ when(r.created_at) }}</small>
          <div class="a-actions">
            <button v-if="r.status !== 'approved'" type="button" class="a-btn a-btn--sm a-btn--green" @click="patch(r, { status: 'approved' }, 'Approved — it’s now on the site.')">
              ✓ Approve
            </button>
            <button v-if="r.status !== 'rejected'" type="button" class="a-btn a-btn--sm" @click="patch(r, { status: 'rejected', featured: false }, 'Rejected — hidden from the site.')">
              Reject
            </button>
            <button v-if="r.status === 'approved'" type="button" class="a-btn a-btn--sm" @click="patch(r, { featured: !r.featured }, r.featured ? 'Unfeatured.' : 'Featured — shown first.')">
              {{ r.featured ? 'Unfeature' : '★ Feature' }}
            </button>
            <button type="button" class="a-btn a-btn--sm" @click="startEdit(r)">Edit</button>
            <button type="button" class="a-btn a-btn--sm a-btn--danger" @click="remove(r)">Delete</button>
          </div>
        </footer>
      </article>
    </TransitionGroup>

    <!-- Add / edit sheet -->
    <Teleport to="body">
      <Transition name="a-fade">
        <div v-if="editing" class="adm sheet-wrap" @click.self="editing = null">
          <form class="sheet a-card" @submit.prevent="saveEdit">
            <h2>{{ editing.id ? 'Edit review' : 'Write a review' }}</h2>
            <div class="stars-pick" role="radiogroup" aria-label="Rating">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                role="radio"
                :aria-checked="editing.rating === n"
                :class="{ on: n <= (editing.rating ?? 5) }"
                @click="editing.rating = n"
              >
                ★
              </button>
            </div>
            <div class="two">
              <label class="a-label">Customer name<input v-model="editing.name" class="a-input" required maxlength="80" /></label>
              <label class="a-label">City<input v-model="editing.location" class="a-input" maxlength="80" /></label>
            </div>
            <label class="a-label">
              Service
              <select v-model="editing.service" class="a-input">
                <option v-for="s in services" :key="s" :value="s">{{ s || '— none —' }}</option>
              </select>
            </label>
            <label class="a-label">Review<textarea v-model="editing.quote" class="a-input" rows="5" maxlength="1000" required /></label>
            <div class="two">
              <label class="a-label">
                Status
                <select v-model="editing.status" class="a-input">
                  <option value="approved">Approved (on site)</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <label class="a-switch feat">
                <input v-model="editing.featured" type="checkbox" />
                <i />
                <span>Feature (show first)</span>
              </label>
            </div>
            <div class="a-actions end">
              <button type="button" class="a-btn" @click="editing = null">Cancel</button>
              <button type="submit" class="a-btn a-btn--primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save review' }}</button>
            </div>
          </form>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.filters {
  margin-bottom: 18px;
}
.list {
  display: grid;
  gap: 12px;
}
.rev {
  display: grid;
  gap: 12px;
  padding: 18px;
  border-left: 3px solid var(--a-line-2);
  transition: opacity 0.2s ease;
}
.rev--pending {
  border-left-color: var(--a-amber);
}
.rev--approved {
  border-left-color: var(--a-green);
}
.rev--rejected {
  border-left-color: var(--a-red);
  opacity: 0.75;
}
.rev--busy {
  opacity: 0.5;
  pointer-events: none;
}
.rev__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--a-accent), var(--a-accent-2));
  font-weight: 700;
}
.rev__who {
  flex: 1;
  min-width: 140px;
  display: grid;
}
.rev__who small {
  color: var(--a-mute);
}
.rev__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.stars {
  color: var(--a-amber);
  letter-spacing: 1px;
}
.stars i {
  font-style: normal;
  color: var(--a-panel-3);
}
.rev__quote {
  color: var(--a-soft);
  font-size: 15px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.rev__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.sheet-wrap {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  padding: 16px;
  min-height: 0 !important;
  background: rgb(5 5 15 / 0.7) !important;
  backdrop-filter: blur(6px);
  overflow-y: auto;
}
.sheet {
  width: 100%;
  max-width: 560px;
  display: grid;
  gap: 14px;
  padding: 24px;
  background: #13132e;
  box-shadow: var(--a-shadow);
}
.sheet h2 {
  font-size: 22px;
}
.stars-pick {
  display: flex;
  gap: 4px;
}
.stars-pick button {
  border: 0;
  background: transparent;
  font-size: 30px;
  line-height: 1;
  color: var(--a-panel-3);
  cursor: pointer;
}
.stars-pick button.on {
  color: var(--a-amber);
}
.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: end;
}
.feat {
  min-height: 44px;
}
.end {
  justify-content: flex-end;
}
@media (max-width: 560px) {
  .two {
    grid-template-columns: 1fr;
  }
  .sheet-wrap {
    place-items: end center;
    padding: 0;
  }
  .sheet {
    border-radius: 22px 22px 0 0;
    max-height: 92vh;
    overflow-y: auto;
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
  }
}
</style>
