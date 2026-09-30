<template>
  <section class="section">
    <div class="container">
      <div class="section-head cards-head">
        <div>
          <p class="eyebrow">Gift cards</p>
          <h2 class="section-title">Eight brands. One rate table.</h2>
          <p class="section-lede">
            Every card is priced off the live USD/NGN feed, so the number you see is the number you
            get. Filter by what you actually hold.
          </p>
        </div>
        <FilterChips v-model="category" :options="CATEGORIES" />
      </div>

      <TransitionGroup name="grid" tag="div" class="card-grid">
        <NuxtLink
          v-for="card in visible"
          :key="card.id"
          :to="`/card/${card.id}`"
          class="gift-card"
          :style="{ '--accent-card': card.color }"
        >
          <div class="gift-top">
            <CardMark :card="card" />
            <span v-if="card.instant" class="tag tag-green">
              <AppIcon name="bolt" :size="12" /> Instant
            </span>
          </div>
          <h3 class="gift-name">{{ card.name }}</h3>
          <p class="gift-cat">{{ card.category }} · from ${{ card.denominations[0] }}</p>

          <div class="gift-rates">
            <div>
              <p class="gift-rate-label">You sell</p>
              <p class="gift-rate gift-rate--out">{{ format(card.sellRate) }}</p>
            </div>
            <div class="gift-rate-right">
              <p class="gift-rate-label">You buy</p>
              <p class="gift-rate gift-rate--in">{{ format(card.buyRate) }}</p>
            </div>
          </div>

          <p class="gift-foot">
            {{ card.eta }} settlement
            <AppIcon name="arrow" :size="15" />
          </p>
        </NuxtLink>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CARDS, CATEGORIES } from '~/data/cards'

const { format } = useDerivRate()

const category = ref<string>('All')
const visible = computed(() =>
  category.value === 'All' ? CARDS : CARDS.filter(card => card.category === category.value),
)
</script>

<style scoped>
.cards-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
}

.card-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(252px, 1fr));
  gap: 16px;
}
.gift-card {
  display: flex;
  flex-direction: column;
  padding: 22px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  transition: transform 0.28s var(--ease), border-color 0.28s, background 0.28s, box-shadow 0.28s;
}
.gift-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent-card) 45%, transparent);
  background: var(--surface-2);
  box-shadow: var(--shadow-md);
}
.gift-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.gift-name {
  font-size: 16px;
  font-weight: 600;
}
.gift-cat {
  font-size: 12.5px;
  color: var(--muted-3);
  margin-top: 3px;
}
.gift-rates {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  padding: 14px;
  border-radius: var(--r-md);
  background: var(--bg-alt);
  border: 1px solid var(--hairline);
}
.gift-rate-right {
  text-align: right;
}
.gift-rate-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-3);
}
.gift-rate {
  font-size: 17px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  margin-top: 3px;
}
.gift-rate--out {
  color: var(--accent);
}
.gift-rate--in {
  color: var(--gold);
}
.gift-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12.5px;
  color: var(--muted-3);
}
.gift-card:hover .gift-foot {
  color: var(--text);
}
.gift-foot :deep(.icon) {
  transition: transform 0.28s var(--ease);
}
.gift-card:hover .gift-foot :deep(.icon) {
  transform: translateX(3px);
  color: var(--primary);
}

.grid-enter-active,
.grid-leave-active {
  transition: opacity 0.25s var(--ease), transform 0.25s var(--ease);
}
.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.grid-leave-active {
  position: absolute;
}
</style>
