<template>
  <div class="layout">
    <ScrollProgress />
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
    <WhatsAppFab />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
}
</style>
