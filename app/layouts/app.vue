<template>
  <div class="app-shell">
    <div class="app-frame">
      <slot />
      <AppTabBar :active="active" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * App views are phone-shaped. On mobile the frame fills the viewport; on
 * desktop it becomes a centred device frame on a lit backdrop rather than a
 * bare column floating in an empty page.
 */
const route = useRoute()

const TAB_BY_PATH: Record<string, string> = {
  '/home': 'home',
  '/buy': 'buy',
  '/sell': 'sell',
  '/orders': 'orders',
  '/profile': 'profile',
}

const active = computed(() => TAB_BY_PATH[route.path] ?? 'home')
</script>

<style scoped>
.app-shell {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  background:
    radial-gradient(ellipse 70% 50% at 50% 0%, rgb(var(--primary-rgb) / 0.09), transparent 65%),
    var(--bg);
}

.app-frame {
  position: relative;
  width: 100%;
  max-width: 520px;
  min-height: 100dvh;
  background: var(--bg);
}

@media (min-width: 720px) {
  .app-shell {
    padding-block: clamp(24px, 5vh, 56px);
    background:
      radial-gradient(ellipse 60% 45% at 50% 0%, rgb(var(--primary-rgb) / 0.1), transparent 65%),
      linear-gradient(180deg, var(--bg-alt), var(--bg) 40%);
  }

  .app-frame {
    border: 1px solid var(--hairline);
    border-radius: 34px;
    box-shadow: var(--shadow-lg);
  }
}
</style>
