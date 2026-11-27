<script setup lang="ts">
// Shows company registration details from site.ts — renders nothing until they are filled in.
import { site } from '~/data/site'

withDefaults(defineProps<{ dark?: boolean }>(), { dark: false })

const r = site.registration
const lines = [r.legalName && r.rcNumber ? `${r.legalName} · ${r.rcNumber}` : r.legalName || r.rcNumber, ...r.licences].filter(Boolean)
</script>

<template>
  <div v-if="lines.length" class="reg" :class="{ 'reg--dark': dark }">
    <span class="reg__icon"><AppIcon name="shield" :size="18" /></span>
    <span class="reg__text">
      <b>Registered business</b>
      <small v-for="l in lines" :key="l">{{ l }}</small>
    </span>
  </div>
</template>

<style scoped>
.reg {
  display: inline-flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  background: #e7f6ef;
  color: #0b5e43;
}
.reg--dark {
  background: rgb(46 189 133 / 0.12);
  color: #b6efd6;
}
.reg__icon {
  flex: none;
  margin-top: 2px;
}
.reg__text {
  display: grid;
  gap: 2px;
}
.reg__text b {
  font-size: 14px;
}
.reg__text small {
  font-size: 13px;
  opacity: 0.9;
}
</style>
