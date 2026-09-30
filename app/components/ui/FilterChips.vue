<template>
  <span class="filter-chips">
    <button
      v-for="option in props.options"
      :key="option"
      class="chip"
      :class="{ 'chip--on': model === option }"
      type="button"
      @click="model = option"
    >
      {{ option }}
    </button>
  </span>
</template>

<script setup lang="ts">
/** Pill filter used by the cards, rates and buy views. */
const props = defineProps<{ options: readonly string[] }>()
const model = defineModel<string>({ required: true })
</script>

<style scoped>
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  padding: 8px 16px;
  border-radius: var(--r-full);
  border: 1px solid var(--hairline);
  background: var(--surface);
  color: var(--muted);
  font-size: 13.5px;
  transition: all 0.2s var(--ease);
}
.chip:hover {
  color: var(--text);
  border-color: var(--hairline-strong);
}
.chip--on {
  background: var(--text);
  border-color: var(--text);
  color: #0b0b0f;
  font-weight: 600;
}
</style>
