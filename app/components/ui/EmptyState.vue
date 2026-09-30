<template>
  <div class="empty">
    <AppIcon :name="icon" :size="24" />
    <p class="empty-text"><slot /></p>
    <button v-if="action" class="btn btn-soft" type="button" @click="$emit('action')">
      {{ action }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { IconName } from '~/types'

withDefaults(
  defineProps<{ icon?: IconName; action?: string }>(),
  { icon: 'search', action: '' },
)

defineEmits<{ action: [] }>()
</script>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 56px 24px;
  text-align: center;
  color: var(--muted-2);
}
.empty-text {
  font-size: 14.5px;
  max-width: 40ch;
}
</style>
