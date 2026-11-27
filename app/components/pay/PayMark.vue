<script setup lang="ts">
// Neutral coloured tile with a currency symbol — no third-party logos.
withDefaults(defineProps<{ symbol: string; color: string; size?: number }>(), { size: 44 })
</script>

<template>
  <span
    class="pmark"
    :style="{ '--c': color, width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.46}px` }"
    aria-hidden="true"
  >
    {{ symbol }}
  </span>
</template>

<style scoped>
.pmark {
  flex: none;
  display: inline-grid;
  place-items: center;
  border-radius: 30%;
  font-family: var(--font-display);
  font-weight: 800;
  color: #fff;
  background: linear-gradient(145deg, color-mix(in srgb, var(--c) 80%, #fff), var(--c) 55%, color-mix(in srgb, var(--c) 70%, #000));
  box-shadow: 0 10px 22px -10px var(--c), inset 0 0 0 1px rgb(255 255 255 / 0.18);
}
</style>
