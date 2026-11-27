<script setup lang="ts">
const { about, images, bg } = useContent()
useSeoMeta({
  title: 'About us',
  description: 'Plero Technologies is a Deriv payment agent helping traders deposit and withdraw in Naira.',
})

const values = computed(() => about.value.values.filter((v) => v.title))
</script>

<template>
  <div>
    <section class="page-hero page-hero--photo" :style="{ '--hero-img': bg(images.aboutHeader) }">
      <div class="container">
        <span class="eyebrow" style="color: var(--indigo-200)">{{ about.hero.eyebrow }}</span>
        <h1>{{ about.hero.title }}</h1>
        <p>{{ about.hero.text }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container story">
        <div v-reveal:left class="story__img">
          <img
            :src="images.about"
            alt="The Lekki–Ikoyi Link Bridge in Lagos"
            width="900"
            height="522"
            loading="lazy"
          />
          <div class="story__badge">
            <LogoMark :size="34" />
            <span><b>Deriv payment agent</b><small>Serving traders across Nigeria</small></span>
          </div>
        </div>
        <div v-reveal:right>
          <span class="eyebrow">{{ about.story.eyebrow }}</span>
          <h2 class="section-title">{{ about.story.title }}</h2>
          <p class="section-lead">{{ about.story.lead }}</p>
          <p class="story__body">{{ about.story.body }}</p>
          <RegistrationBadge class="story__reg" />
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div v-reveal class="section-head section-head--center">
          <span class="eyebrow">What we stand for</span>
          <h2 class="section-title">Our values</h2>
        </div>
        <div class="values">
          <article v-for="(v, i) in values" :key="v.title" v-reveal="i * 110" v-spotlight class="card value">
            <span class="value__icon"><AppIcon :name="v.icon" /></span>
            <h3>{{ v.title }}</h3>
            <p>{{ v.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <LagosBand />
    <CtaSection />
    <p class="credits">
      Photos via Wikimedia Commons: Victoria Island, Lagos by Ayorinde Ogundele (CC BY-SA 4.0); Lekki–Ikoyi Link
      Bridge by Chippla (CC BY-SA 3.0).
    </p>
  </div>
</template>

<style scoped>
.story {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
}
.story__img {
  position: relative;
}
.story__img img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
.story__img::after {
  content: '';
  position: absolute;
  inset: auto -14px -14px auto;
  width: 45%;
  height: 45%;
  z-index: -1;
  border-radius: var(--radius-lg);
  background: var(--indigo-100);
}
.story__img img {
  transition: transform 0.6s ease;
}
.story__img:hover img {
  transform: scale(1.02);
}
.story__badge {
  position: absolute;
  left: -18px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px 12px 12px;
  border-radius: 16px;
  background: #fff;
  box-shadow: var(--shadow-lg);
  animation: float 6s ease-in-out infinite;
}
.story__badge b {
  display: block;
  font-size: 14px;
}
.story__badge small {
  color: var(--ink-mute);
  font-size: 12.5px;
}
.story__reg {
  margin-top: 22px;
}
.credits {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter) 32px;
  font-size: 12px;
  color: var(--ink-mute);
}
.story__body {
  margin-top: 16px;
  color: var(--ink-soft);
}
.values {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.value {
  padding: 28px;
  text-align: center;
}
.value__icon {
  display: inline-grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--indigo-50);
  color: var(--indigo-500);
}
.value h3 {
  margin-top: 16px;
  font-size: 19px;
}
.value p {
  margin-top: 8px;
  color: var(--ink-soft);
}
@media (max-width: 860px) {
  .story,
  .values {
    grid-template-columns: 1fr;
  }
}
</style>
