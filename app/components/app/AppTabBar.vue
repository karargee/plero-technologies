<template>
  <nav class="tab-bar" aria-label="Primary">
    <NuxtLink
      v-for="tab in APP_TABS"
      :key="tab.key"
      :to="tab.to"
      class="tab"
      :class="{ 'tab--on': active === tab.key }"
    >
      <AppIcon :name="tab.icon" :size="20" />
      <span>{{ tab.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { APP_TABS } from '~/data/site'

withDefaults(defineProps<{ active?: string }>(), { active: '' })
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 520px;
  z-index: 90;
  display: flex;
  justify-content: space-around;
  padding: 10px 8px calc(12px + env(safe-area-inset-bottom, 0px));
  background: rgba(11, 11, 15, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--hairline);
}
.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  padding: 6px 4px;
  border-radius: var(--r-md);
  font-size: 10.5px;
  font-weight: 500;
  color: var(--muted-3);
  transition: color 0.2s var(--ease);
}
.tab--on {
  color: var(--text);
}
.tab--on :deep(.icon) {
  color: var(--primary);
}
.tab:hover {
  color: var(--text);
}
</style>
