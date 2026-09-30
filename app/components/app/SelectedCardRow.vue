<template>
  <div class="selected panel">
    <CardMark :card="card" />
    <div class="selected-text">
      <p class="selected-title">{{ title || card.name }}</p>
      <p class="selected-rate" :class="{ 'selected-rate--accent': highlight }">{{ rate }}</p>
    </div>
    <button v-if="changeLabel" class="change" type="button" @click="$emit('change')">
      {{ changeLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/types'

withDefaults(
  defineProps<{
    card: Card
    title?: string
    rate: string
    highlight?: boolean
    changeLabel?: string
  }>(),
  { title: '', highlight: false, changeLabel: 'Change' },
)

defineEmits<{ change: [] }>()
</script>

<style scoped>
.selected {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px 16px;
}
.selected-text {
  min-width: 0;
}
.selected-title {
  font-size: 14.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.selected-rate {
  font-size: 12.5px;
  color: var(--muted-3);
  margin-top: 2px;
}
.selected-rate--accent {
  color: var(--accent);
}
.change {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--muted);
}
.change:hover {
  color: var(--text);
}
</style>
