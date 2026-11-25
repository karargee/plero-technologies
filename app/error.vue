<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)
useHead({ title: is404.value ? 'Page not found' : 'Something went wrong' })
</script>

<template>
  <NuxtLayout>
    <section class="page-hero err">
      <div class="container">
        <LogoMark :size="72" light />
        <h1>{{ is404 ? "We couldn't find that page." : 'Something went wrong.' }}</h1>
        <p>{{ is404 ? 'It may have moved, or the link might be wrong.' : 'Please try again in a moment.' }}</p>
        <button class="btn btn--light" type="button" @click="clearError({ redirect: '/' })">Back to home</button>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.err {
  min-height: 60vh;
  display: grid;
  align-items: center;
}
.err h1 {
  margin-top: 24px;
}
.err .btn {
  margin-top: 28px;
}
</style>
