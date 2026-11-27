<script setup lang="ts">
// Top-of-site banner, switched on and written in /admin → Content → Announcement.
const { announcement } = useContent()
const a = computed(() => announcement.value)
const dismissed = ref(false)
const isExternal = computed(() => /^https?:\/\//.test(a.value.linkUrl))
</script>

<template>
  <div v-if="a.enabled && a.text && !dismissed" class="bar" :class="`bar--${a.tone}`" role="region" aria-label="Announcement">
    <div class="container bar__in">
      <span class="bar__dot" aria-hidden="true" />
      <p>
        {{ a.text }}
        <template v-if="a.linkUrl && a.linkLabel">
          <a v-if="isExternal" :href="a.linkUrl" target="_blank" rel="noopener">{{ a.linkLabel }} →</a>
          <NuxtLink v-else :to="a.linkUrl">{{ a.linkLabel }} →</NuxtLink>
        </template>
      </p>
      <button type="button" class="bar__x" aria-label="Dismiss announcement" @click="dismissed = true">
        <AppIcon name="close" :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.bar {
  position: relative;
  z-index: 55;
  color: #fff;
  background: linear-gradient(90deg, var(--navy-800), var(--indigo-500));
  font-size: 14px;
}
.bar--success {
  background: linear-gradient(90deg, #0b6b4b, #12805c);
}
.bar--warning {
  background: linear-gradient(90deg, #8a5a00, #b7791f);
}
.bar__in {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding-block: 8px;
}
.bar__dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8ee0b9;
  box-shadow: 0 0 0 4px rgb(142 224 185 / 0.25);
}
p {
  flex: 1;
  text-align: center;
}
p a {
  margin-left: 6px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.bar__x {
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.12);
  color: #fff;
  cursor: pointer;
}
</style>
