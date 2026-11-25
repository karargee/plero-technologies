<script setup lang="ts">
// Animates the leading number of a value like "24/7", "4.8/5" or "5–15 min" when it scrolls into view.
const props = defineProps<{ value: string }>()

const match = props.value.match(/^(\d+(?:\.\d+)?)(.*)$/)
const target = match ? Number(match[1]) : null
const decimals = match?.[1]?.includes('.') ? match[1].split('.')[1]!.length : 0
const rest = match?.[2] ?? ''

const el = ref<HTMLElement>()
const shown = ref(target == null ? props.value : (0).toFixed(decimals) + rest)

onMounted(() => {
  if (target == null || !el.value) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = props.value
    return
  }
  const io = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    io.disconnect()
    const start = performance.now()
    const dur = 1400
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      shown.value = (target * eased).toFixed(decimals) + rest
      if (t < 1) requestAnimationFrame(tick)
      else shown.value = props.value
    }
    requestAnimationFrame(tick)
  })
  io.observe(el.value)
})
</script>

<template>
  <span ref="el">{{ shown }}</span>
</template>
