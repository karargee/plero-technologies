<template>
  <div class="page-header">
    <NuxtLink v-if="backTo" :to="backTo" class="back-btn" aria-label="Go back">
      <AppIcon name="arrow" :size="18" class="flip" />
    </NuxtLink>
    <button v-else class="back-btn" aria-label="Go back" @click="$emit('back')">
      <AppIcon name="arrow" :size="18" class="flip" />
    </button>

    <h2>{{ title }}</h2>

    <NuxtLink v-if="to" :to="to" class="back-btn" :aria-label="actionLabel">
      <AppIcon :name="icon" :size="18" />
    </NuxtLink>
    <span v-else class="back-btn back-btn--ghost" />
  </div>
</template>

<script setup lang="ts">
import type { IconName } from '~/types'

withDefaults(
  defineProps<{
    title: string
    /** Renders a link; omit to emit `back` instead. Defaults to the dashboard. */
    backTo?: string
    to?: string
    icon?: IconName
    actionLabel?: string
  }>(),
  { backTo: '/home', to: '', icon: 'help', actionLabel: 'More options' },
)

defineEmits<{ back: [] }>()
</script>

<style scoped>
.flip {
  transform: rotate(180deg);
}
.back-btn--ghost {
  background: transparent;
  border-color: transparent;
  pointer-events: none;
}
</style>
