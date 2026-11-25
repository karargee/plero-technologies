<script setup lang="ts">
withDefaults(defineProps<{ light?: boolean }>(), { light: false })
</script>

<template>
  <NuxtLink to="/" class="brand" :class="{ 'brand--light': light }" aria-label="Plero Technologies home">
    <LogoMark :size="38" :light="light" />
    <span class="brand__text">
      <strong>PLERO</strong>
      <small>TECHNOLOGIES</small>
    </span>
  </NuxtLink>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--navy-700);
}
.brand--light {
  color: #fff;
}
.brand__text {
  display: grid;
  line-height: 1;
}
.brand__text strong {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0.2em;
}
.brand__text small {
  margin-top: 4px;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.24em;
  opacity: 0.8;
}
</style>
