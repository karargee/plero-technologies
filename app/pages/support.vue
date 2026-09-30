<template>
  <div>
    <section class="head">
      <div class="container">
        <p class="eyebrow">Support</p>
        <h1 class="head-title">We answer fast.</h1>
        <p class="head-lede">
          Live chat is staffed around the clock, and every conversation loads your active orders
          automatically — so you never have to explain which card you sent.
        </p>

        <div class="channels">
          <a
            v-for="channel in SUPPORT_CHANNELS"
            :key="channel.label"
            :href="channel.href"
            class="channel"
            :style="{ '--accent-card': channel.color }"
          >
            <span class="channel-icon"><AppIcon :name="channel.icon" :size="20" /></span>
            <span class="channel-text">
              <b>{{ channel.label }}</b>
              <small>{{ channel.value }}</small>
            </span>
            <AppIcon name="arrow" :size="16" class="channel-go" />
          </a>
        </div>
      </div>
    </section>

    <section class="container body">
      <div class="main">
        <p class="label" style="margin-bottom: 18px">Common questions</p>
        <FaqSection :items="SUPPORT_FAQS" embedded />
      </div>

      <aside class="side">
        <div class="panel side-card">
          <h2 class="side-title">Order status</h2>
          <p class="side-copy">
            Have a reference like <code>#PL1042</code>? Check where it is without opening a ticket.
          </p>
          <form class="track" @submit.prevent="tracked = true">
            <input v-model="orderRef" class="input-field" placeholder="#PL1042" :disabled="tracked" />
            <button class="btn btn-red btn-block" type="submit">
              {{ tracked ? 'Tracked' : 'Check order' }}
            </button>
          </form>
          <p v-if="tracked" class="side-note">
            <AppIcon name="check" :size="15" /> We found that order. Status updates are also in your profile.
          </p>
        </div>

        <div class="panel side-card">
          <h2 class="side-title">Service levels</h2>
          <ul class="sl-list">
            <li v-for="level in SERVICE_LEVELS" :key="level.label">
              <span>{{ level.label }}</span>
              <b>{{ level.value }}</b>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { SERVICE_LEVELS, SUPPORT_CHANNELS, SUPPORT_FAQS } from '~/data/site'

const orderRef = ref('')
const tracked = ref(false)

useHead({ title: 'Support — Plero Technologies' })
</script>

<style scoped>
.head {
  padding-block: clamp(40px, 6vw, 80px);
  background: radial-gradient(ellipse 70% 100% at 20% 0%, rgba(0, 167, 158, 0.08), transparent 60%);
  border-bottom: 1px solid var(--hairline);
}
.head-title {
  font-size: clamp(32px, 5vw, 54px);
  font-weight: 800;
  letter-spacing: -0.035em;
}
.head-lede {
  margin-top: 16px;
  max-width: 58ch;
  color: var(--muted);
  font-size: 16.5px;
}

.channels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  margin-top: 34px;
}
.channel {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  transition: transform 0.25s var(--ease), border-color 0.25s, background 0.25s;
}
.channel:hover {
  transform: translateY(-3px);
  background: var(--surface-2);
  border-color: color-mix(in srgb, var(--accent-card) 45%, transparent);
}
.channel-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: var(--r-md);
  background: color-mix(in srgb, var(--accent-card) 14%, transparent);
  color: var(--accent-card);
}
.channel-text {
  flex: 1;
  min-width: 0;
}
.channel-text b {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
}
.channel-text small {
  display: block;
  font-size: 12.5px;
  color: var(--muted-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.channel-go {
  color: var(--muted-3);
}

.body {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: clamp(28px, 4vw, 56px);
  padding-block: clamp(40px, 6vw, 80px);
  align-items: start;
}

.side {
  position: sticky;
  top: calc(var(--nav-h) + 24px);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.side-card {
  padding: 24px;
}
.side-title {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 10px;
}
.side-copy {
  font-size: 14px;
  color: var(--muted-2);
  line-height: 1.7;
}
.side-copy code {
  font-family: var(--font-mono);
  font-size: 12.5px;
  padding: 1px 6px;
  border-radius: 5px;
  background: var(--surface-3);
  color: var(--text);
}
.track {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
}
.side-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 13.5px;
  color: var(--accent);
}
.sl-list {
  list-style: none;
  margin-top: 16px;
}
.sl-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--hairline);
  font-size: 14px;
  color: var(--muted-2);
}
.sl-list li:last-child {
  border-bottom: 0;
}
.sl-list b {
  color: var(--text);
  font-weight: 600;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .body {
    grid-template-columns: 1fr;
  }
  .side {
    position: static;
  }
}
</style>
