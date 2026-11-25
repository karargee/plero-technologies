<script setup lang="ts">
import { cards } from '~/data/site'

useSeoMeta({
  title: "Today's gift card rates",
  description: 'Live gift card rates for Apple, Amazon, Steam, Google Play, Razer Gold and more.',
})

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? cards.filter((c) => c.name.toLowerCase().includes(q)) : cards
})
const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">Rates</span>
        <h1>Today's gift card rates</h1>
        <p>Updated {{ today }}. The rate you see is what you get paid — no hidden fees.</p>
      </div>
    </section>

    <section class="section">
      <div class="container rates">
        <div class="rates__table card">
          <div class="rates__toolbar">
            <h2>All cards</h2>
            <label class="rates__search">
              <span class="sr-only">Search cards</span>
              <input v-model="query" class="input" type="search" placeholder="Search cards…" />
            </label>
          </div>

          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Card</th>
                  <th scope="col" class="num">Rate per $1</th>
                  <th scope="col" class="num">24h</th>
                  <th scope="col" class="num">Range (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in filtered" :key="c.id">
                  <td>
                    <span class="rates__card">
                      <CardMark :name="c.name" :color="c.color" :size="34" />
                      {{ c.name }}
                    </span>
                  </td>
                  <td class="num"><strong>{{ formatMoney(c.rate) }}</strong></td>
                  <td class="num">
                    <span class="chg" :class="c.change >= 0 ? 'up' : 'down'">
                      {{ c.change >= 0 ? '+' : '−' }}{{ Math.abs(c.change).toFixed(1) }}%
                    </span>
                  </td>
                  <td class="num muted">${{ c.min }} – ${{ c.max.toLocaleString() }}</td>
                </tr>
                <tr v-if="!filtered.length">
                  <td colspan="4" class="empty">No cards match “{{ query }}”.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <aside class="rates__side">
          <RateCalculator />
        </aside>
      </div>
    </section>

    <FaqSection alt />
  </div>
</template>

<style scoped>
.rates {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 28px;
  align-items: start;
}
.rates__side {
  position: sticky;
  top: 96px;
}
.rates__table {
  overflow: hidden;
}
.rates__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px;
  border-bottom: 1px solid var(--line);
}
.rates__toolbar h2 {
  font-size: 20px;
}
.rates__search {
  flex: 1;
  max-width: 260px;
  min-width: 180px;
}
.rates__search .input {
  height: 42px;
}
.table-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
th {
  text-align: left;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-mute);
  background: var(--surface-alt);
  padding: 12px 22px;
  white-space: nowrap;
}
td {
  padding: 14px 22px;
  border-top: 1px solid var(--line);
  white-space: nowrap;
}
tbody tr:hover {
  background: var(--indigo-50);
}
.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.muted {
  color: var(--ink-mute);
}
.rates__card {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}
.chg {
  font-weight: 600;
  font-size: 14px;
}
.up {
  color: var(--success);
}
.down {
  color: #b42318;
}
.empty {
  text-align: center;
  color: var(--ink-mute);
  padding: 40px;
}
@media (max-width: 1020px) {
  .rates {
    grid-template-columns: 1fr;
  }
  .rates__side {
    position: static;
    max-width: 480px;
  }
}
</style>
