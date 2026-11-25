<script setup lang="ts">
const bar = ref<HTMLElement>()
let raf = 0
function update() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    const h = document.documentElement
    const max = h.scrollHeight - h.clientHeight
    bar.value?.style.setProperty('transform', `scaleX(${max > 0 ? h.scrollTop / max : 0})`)
  })
}
onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div ref="bar" class="progress" aria-hidden="true" />
</template>

<style scoped>
.progress {
  position: fixed;
  inset: 0 0 auto;
  height: 3px;
  z-index: 70;
  transform-origin: 0 50%;
  transform: scaleX(0);
  background: linear-gradient(90deg, var(--indigo-400), #8ee0b9);
}
</style>
