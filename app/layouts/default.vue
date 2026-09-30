<template>
  <div class="site-layout">
    <SiteHeader />
    <main class="site-main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.site-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
.site-main {
  flex: 1;
  /* Clears the fixed site header. */
  padding-top: var(--nav-h);
}
</style>
