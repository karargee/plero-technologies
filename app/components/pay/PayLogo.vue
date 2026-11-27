<script setup lang="ts">
withDefaults(defineProps<{ light?: boolean; size?: number }>(), { light: false, size: 34 })
</script>

<template>
  <span class="pay-logo" :class="{ 'pay-logo--light': light }">
    <LogoMark :size="size" :light="light" />
    <span class="pay-logo__text">
      <strong>Plero <em>Pay</em></strong>
      <small>by Plero Technologies</small>
    </span>
  </span>
</template>

<style scoped>
.pay-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--navy-700);
}
.pay-logo--light {
  color: #fff;
}
.pay-logo__text {
  display: grid;
  line-height: 1.05;
}
strong {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
em {
  font-style: normal;
  background: linear-gradient(90deg, var(--indigo-400), #2ebd85);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
small {
  margin-top: 3px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  opacity: 0.7;
}
</style>
