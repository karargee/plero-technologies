<template>
  <div class="page">
    <AppPageHeader title="Profile" to="/support" icon="headset" action-label="Support" />

    <div class="identity">
      <span class="avatar">{{ initials }}</span>
      <h1 class="name">{{ user?.name ?? 'Plero User' }}</h1>
      <p class="email">{{ user?.email ?? 'user@plero.com' }}</p>
      <span class="tag tag-green">
        <AppIcon name="badge" :size="13" /> Verified account
      </span>
    </div>

    <div class="stats">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <p class="stat-value">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>

    <div class="menu">
      <template v-for="item in PROFILE_MENU" :key="item.label">
        <NuxtLink v-if="item.to" :to="item.to" class="menu-item">
          <MenuRow :icon="item.icon" :label="item.label" :sub="item.sub" />
          <AppIcon name="arrow" :size="16" class="menu-go" />
        </NuxtLink>
        <button v-else class="menu-item menu-item--danger" type="button" @click="signOut">
          <MenuRow :icon="item.icon" :label="item.label" :sub="item.sub" />
          <AppIcon name="arrow" :size="16" class="menu-go" />
        </button>
      </template>
    </div>

    <p class="version">{{ BRAND.legalName }} · {{ year }}</p>
  </div>
</template>

<script setup lang="ts">
import { BRAND, PROFILE_MENU } from '~/data/site'

definePageMeta({ layout: 'app' })

const { user, initials, signOut } = useAuth()
const year = new Date().getFullYear()

const stats = [
  { label: 'Trades', value: '5' },
  { label: 'Earned', value: '₦396K' },
  { label: 'Rating', value: '4.9' },
]
</script>

<style scoped>
.identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 20px 22px;
}
.avatar {
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(140deg, var(--primary-light), var(--primary-dark));
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 0 0 6px rgb(var(--primary-rgb) / 0.12);
}
.name {
  font-size: 20px;
  font-weight: 700;
  margin-top: 6px;
}
.email {
  font-size: 13.5px;
  color: var(--muted-2);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 0 20px;
}
.stat {
  padding: 15px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  text-align: center;
}
.stat-value {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.stat-label {
  margin-top: 2px;
  font-size: 11.5px;
  color: var(--muted-3);
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 20px 0;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--hairline);
  text-align: left;
  transition: all 0.2s var(--ease);
}
.menu-item:hover {
  background: var(--surface-2);
  border-color: var(--hairline-strong);
}
.menu-item--danger:hover {
  border-color: rgba(239, 68, 68, 0.4);
}
.menu-go {
  color: var(--muted-3);
  transform: rotate(180deg);
}
.menu-item--danger .menu-go {
  color: var(--danger);
}
.version {
  text-align: center;
  font-size: 12px;
  color: var(--muted-3);
  padding: 28px 0 0;
}
</style>
