<template>
  <span class="row-icon"><AppIcon :name="icon" :size="18" /></span>
  <span class="row-text">
    <b>{{ label }}</b>
    <small>{{ sub }}</small>
  </span>
</template>

<script setup lang="ts">
import type { IconName } from '~/types'

defineProps<{
  icon: IconName
  label: string
  sub: string
}>()
</script>

<style scoped>
.row-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--r-md);
  background: var(--surface-3);
  color: var(--text);
  flex-shrink: 0;
}
.row-text {
  flex: 1;
  min-width: 0;
}
.row-text b {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
}
.row-text small {
  font-size: 12px;
  color: var(--muted-3);
}
</style>
