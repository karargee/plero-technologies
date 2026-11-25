<script setup lang="ts">
import { guides } from '~/data/guides'

const route = useRoute()
const guide = computed(() => guides.find((g) => g.slug === route.params.slug))
if (!guide.value) {
  throw createError({ statusCode: 404, statusMessage: 'Guide not found', fatal: true })
}

const others = computed(() => guides.filter((g) => g.slug !== guide.value!.slug).slice(0, 3))

useSeoMeta({
  title: () => guide.value!.title,
  description: () => guide.value!.summary,
  ogType: 'article',
})
</script>

<template>
  <div v-if="guide">
    <section class="page-hero">
      <div class="container">
        <NuxtLink to="/guides" class="back">← All guides</NuxtLink>
        <span class="eyebrow" style="color: var(--indigo-200); display: flex">{{ guide.category }} · {{ guide.minutes }} min read</span>
        <h1>{{ guide.title }}</h1>
        <p>{{ guide.summary }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container article-wrap">
        <article class="article">
          <template v-for="(b, i) in guide.body" :key="i">
            <h2 v-if="'h' in b">{{ b.h }}</h2>
            <p v-else-if="'p' in b">{{ b.p }}</p>
            <ol v-else-if="'ol' in b">
              <li v-for="item in b.ol" :key="item">{{ item }}</li>
            </ol>
            <ul v-else-if="'ul' in b">
              <li v-for="item in b.ul" :key="item">{{ item }}</li>
            </ul>
            <aside v-else-if="'note' in b" class="note">
              <AppIcon name="shield" :size="20" />
              <span>{{ b.note }}</span>
            </aside>
          </template>
        </article>

        <aside class="side">
          <AgentCalculator />
        </aside>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <h2 class="more__title">More guides</h2>
        <div class="more">
          <NuxtLink v-for="g in others" :key="g.slug" :to="`/guides/${g.slug}`" class="card more__item">
            <small>{{ g.category }}</small>
            <strong>{{ g.title }}</strong>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--indigo-200);
}
.back:hover {
  color: #fff;
}
.article-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
}
.article {
  max-width: 700px;
  font-size: 17.5px;
  line-height: 1.75;
  color: var(--ink);
}
.article > * + * {
  margin-top: 20px;
}
.article h2 {
  margin-top: 40px;
  font-size: 26px;
}
.article ol,
.article ul {
  padding-left: 1.3em;
}
.article li + li {
  margin-top: 10px;
}
.article li::marker {
  color: var(--indigo-500);
  font-weight: 700;
}
.note {
  display: flex;
  gap: 12px;
  padding: 16px 18px;
  border-radius: var(--radius);
  background: var(--indigo-50);
  border-left: 4px solid var(--indigo-500);
  font-size: 16px;
  color: var(--navy-700);
}
.note svg {
  flex: none;
  margin-top: 3px;
}
.side {
  position: sticky;
  top: 96px;
}
.more__title {
  font-size: 24px;
  margin-bottom: 20px;
}
.more {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.more__item {
  display: grid;
  gap: 6px;
  padding: 20px;
  transition: border-color 0.15s ease;
}
.more__item:hover {
  border-color: var(--indigo-200);
}
.more__item small {
  color: var(--indigo-500);
  font-weight: 600;
}
@media (max-width: 960px) {
  .article-wrap {
    grid-template-columns: 1fr;
  }
  .side {
    position: static;
    max-width: 480px;
  }
  .more {
    grid-template-columns: 1fr;
  }
}
</style>
