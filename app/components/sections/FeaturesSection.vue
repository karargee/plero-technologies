<script setup lang="ts">
const { features, home } = useContent()
</script>

<template>
  <section class="section">
    <div class="container">
      <div v-reveal class="section-head section-head--center">
        <span class="eyebrow">{{ home.features.eyebrow }}</span>
        <h2 class="section-title">{{ home.features.title }}</h2>
        <p class="section-lead">{{ home.features.text }}</p>
      </div>

      <div class="grid">
        <article v-for="(f, i) in features" :key="f.title" v-reveal="(i % 3) * 100" v-spotlight class="feature card">
          <span class="feature__icon"><AppIcon :name="f.icon" /></span>
          <h3>{{ f.title }}</h3>
          <p>{{ f.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature {
  padding: 28px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.feature:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--indigo-100);
}
.feature__icon {
  display: inline-grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: var(--indigo-50);
  color: var(--indigo-500);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s ease, color 0.25s ease;
}
.feature:hover .feature__icon {
  transform: rotate(-8deg) scale(1.1);
  background: linear-gradient(135deg, var(--indigo-500), var(--navy-700));
  color: #fff;
}
h3 {
  margin-top: 20px;
  font-size: 19px;
}
p {
  margin-top: 8px;
  color: var(--ink-soft);
}
@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
