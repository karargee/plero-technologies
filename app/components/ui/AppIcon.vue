<template>
  <svg
    class="icon"
    :class="[`icon--${size}`, { 'icon--fill': fill }]"
    :style="box"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="shapes[name] || shapes.spark"
  />
</template>

<script setup>
const props = defineProps({
  name: { type: String, default: 'spark' },
  size: { type: [Number, String], default: 20 },
  strokeWidth: { type: [Number, String], default: 1.75 },
  fill: { type: Boolean, default: false },
})

const shapes = {
  bolt: '<path d="M13 2 4.5 13.2a.6.6 0 0 0 .5.9H11l-1 7.9 8.5-11.2a.6.6 0 0 0-.5-.9H13z"/>',
  shield: '<path d="M12 2.5 4.5 5.6v6c0 4.7 3.1 8.6 7.5 9.9 4.4-1.3 7.5-5.2 7.5-9.9v-6z"/><path d="m9.2 12 2 2 3.6-3.8"/>',
  trend: '<path d="M3 17 9.5 10.5l3.5 3.5L21 6"/><path d="M15 6h6v6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 3.8 9A15 15 0 0 1 12 21a15 15 0 0 1-3.8-9A15 15 0 0 1 12 3z"/>',
  headset: '<path d="M3.5 17v-5a8.5 8.5 0 0 1 17 0v5"/><path d="M20.5 18a2 2 0 0 1-2 2H18a1.5 1.5 0 0 1-1.5-1.5V15A1.5 1.5 0 0 1 18 13.5h2.5zM3.5 18a2 2 0 0 0 2 2H6a1.5 1.5 0 0 0 1.5-1.5V15A1.5 1.5 0 0 0 6 13.5H3.5z"/>',
  badge: '<path d="m12 2.6 2.3 2 3-.3.9 2.9 2.6 1.6-1.2 2.7 1.2 2.7-2.6 1.6-.9 2.9-3-.3-2.3 2-2.3-2-3 .3-.9-2.9L2.6 14.2 3.8 11.5 2.6 8.8l2.6-1.6.9-2.9 3 .3z"/><path d="m9.3 11.9 1.9 1.9 3.5-3.7"/>',
  wallet: '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H18a2 2 0 0 1 2 2v1"/><rect x="3" y="8.5" width="18" height="11" rx="2.5"/><path d="M16.5 14h.01"/>',
  bank: '<path d="M3 20.5h18"/><path d="M5.5 20.5V10M9.8 20.5V10M14.2 20.5V10M18.5 20.5V10"/><path d="M12 3.2 21 8.4H3z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/><path d="M6.5 14.5h3"/>',
  lock: '<rect x="3.5" y="10.5" width="17" height="10.5" rx="2.5"/><path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5"/><path d="M12 15v2"/>',
  users: '<path d="M16.5 20.5v-1.8a4 4 0 0 0-4-4h-5a4 4 0 0 0-4 4v1.8"/><circle cx="10" cy="7.5" r="3.5"/><path d="M21.5 20.5v-1.8a4 4 0 0 0-3-3.9"/><path d="M15.5 4.2a3.5 3.5 0 0 1 0 6.6"/>',
  spark: '<path d="m12 2.8 2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="m18.5 15.5 1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  arrow: '<path d="M4.5 12h15"/><path d="m13.5 6 6 6-6 6"/>',
  chevron: '<path d="m6 9.5 6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>',
  x: '<path d="m4.5 4.5 15 15M19.5 4.5l-15 15"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.6h.01"/>',
  whatsapp: '<path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.5-4.4A8.4 8.4 0 1 1 20.5 11.6z"/><path d="M8.9 8.6c.2 2.7 2.4 4.9 5.1 5.3l1-1.4-2-1-1 1a5.4 5.4 0 0 1-1.9-2l1-1-1-2.1z"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  phone: '<path d="M21.5 17v2.5a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19 19 0 0 1-6-6 19.5 19.5 0 0 1-3-8.6A2 2 0 0 1 3.8 2h2.5a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L7.3 9.9a15.5 15.5 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.4-4.4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  receipt: '<path d="M5.5 3h13v18l-2.2-1.6-2.1 1.6-2.2-1.6-2.1 1.6L7.7 19.4 5.5 21z"/><path d="M9 8h6M9 12h6"/>',
  star: '<path d="m12 3.2 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.6l6.1-.9z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.4a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.7-2.6 2.7"/><path d="M12 17h.01"/>',
  scan: '<path d="M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5"/><path d="M7.5 12h9"/>',
  refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.5 3.5V10H14"/>',
  gift: '<rect x="3" y="8.5" width="18" height="4" rx="1"/><path d="M4.5 12.5V20a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-7.5"/><path d="M12 8.5v13"/><path d="M12 8.5H7.8a2.2 2.2 0 1 1 0-4.4c2.6 0 4.2 4.4 4.2 4.4zM12 8.5h4.2a2.2 2.2 0 1 0 0-4.4c-2.6 0-4.2 4.4-4.2 4.4z"/>',
  percent: '<path d="m19 5-14 14"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  send: '<path d="M21.5 2.5 2.5 10.2l7.6 2.7 2.7 7.6z"/><path d="m10.1 12.9 4.6-4.6"/>',
}

const box = computed(() => {
  const px = `${props.size}px`
  return { width: px, height: px }
})
</script>

<style scoped>
.icon {
  flex-shrink: 0;
}
.icon--fill {
  fill: currentColor;
}
</style>
