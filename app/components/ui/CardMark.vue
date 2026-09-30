<template>
  <span
    class="mark"
    :class="`mark--${size}`"
    :style="style"
    aria-hidden="true"
  >{{ card.logo }}</span>
</template>

<script setup lang="ts">
import type { Card } from '~/types'

const props = withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const style = computed(() => ({
  background: `linear-gradient(150deg, ${props.card.color}33, ${props.card.color}12)`,
  borderColor: `${props.card.color}40`,
  color: props.card.color,
}))
</script>

<style scoped>
.mark {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 1px solid;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  user-select: none;
}
.mark--sm {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  font-size: 13px;
}
.mark--md {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  font-size: 16px;
}
.mark--lg {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  font-size: 20px;
}
</style>
