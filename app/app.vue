<template>
  <div class="app-root">
    <NuxtLoadingIndicator color="var(--primary)" :height="2" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
  bodyAttrs: { class: 'plero' },
})
</script>

<style>
.app-root {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
</style>
