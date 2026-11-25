<script setup lang="ts">
// A neutral colored tile with initials — stands in for a gift card brand.
const props = withDefaults(defineProps<{ name: string; color: string; size?: number }>(), { size: 40 })
const initials = computed(() =>
  props.name
    .replace(/[^A-Za-z ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <span
    class="mark"
    :style="{ background: color, width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.34}px` }"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>

<style scoped>
.mark {
  flex: none;
  display: inline-grid;
  place-items: center;
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.12);
}
</style>
