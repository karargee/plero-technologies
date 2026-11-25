<script setup lang="ts">
// Vector version of the Plero "P in a ring" logo.
withDefaults(defineProps<{ size?: number; light?: boolean }>(), { size: 40, light: false })
const id = useId()
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <linearGradient :id="`ring-${id}`" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" :stop-color="light ? '#2a2970' : '#0f0f2e'" />
        <stop offset="1" :stop-color="light ? '#7b7fe0' : '#4c4fa6'" />
      </linearGradient>
    </defs>
    <!-- data dashes -->
    <g transform="rotate(-45 32 32)">
      <g :fill="light ? '#a9acf0' : '#4c4fa6'">
        <rect x="55" y="26.5" width="6" height="2.2" rx="0.6" />
        <rect x="56.5" y="30.9" width="4.5" height="2.2" rx="0.6" />
        <rect x="55" y="35.3" width="7" height="2.2" rx="0.6" />
      </g>
      <g :fill="light ? '#ffffff' : '#13123a'">
        <rect x="2" y="26.5" width="7" height="2.2" rx="0.6" />
        <rect x="3" y="30.9" width="4.5" height="2.2" rx="0.6" />
        <rect x="3" y="35.3" width="6" height="2.2" rx="0.6" />
      </g>
    </g>
    <circle cx="32" cy="32" r="25" fill="none" :stroke="light ? '#ffffff' : '#13123a'" stroke-opacity=".5" stroke-width=".8" />
    <circle cx="32" cy="32" r="22" :fill="`url(#ring-${id})`" />
    <circle cx="32" cy="32" r="15.5" fill="#f1f1f6" />
    <circle cx="32" cy="32" r="14.2" fill="none" stroke="#13123a" stroke-opacity=".35" stroke-width=".4" />
    <path
      fill="#26246b"
      fill-rule="evenodd"
      d="M26.5 23h6.8a6 6 0 0 1 0 12h-2.8v6.5h-4zm4 3.6v4.8h2.6a2.4 2.4 0 0 0 0-4.8z"
    />
  </svg>
</template>
