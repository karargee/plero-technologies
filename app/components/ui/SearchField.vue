<template>
  <div class="search">
    <AppIcon name="search" :size="17" />
    <input v-model="model" type="search" class="search-input" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: 'Search…' })
const model = defineModel<string>({ required: true })
</script>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-radius: var(--r-full);
  background: var(--surface);
  border: 1px solid var(--hairline);
  color: var(--muted-2);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-soft);
}
.search-input {
  width: 100%;
  padding: 11px 0;
  font-size: 14.5px;
}
.search-input::placeholder {
  color: var(--muted-3);
}
</style>
