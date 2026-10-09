<template>
  <div class="mkt-page">
    <div class="container">
      <div class="mkt-header">
        <div>
          <p class="eyebrow">LIVE MARKETS</p>
          <h1 class="mkt-title">Deriv Market Charts</h1>
          <p class="mkt-sub">Real-time prices streamed directly from Deriv WebSocket API</p>
        </div>
        <div class="mkt-status">
          <span v-if="connected" class="live-dot" />
          <span class="mkt-status-text" :class="connected ? 'is-live' : 'is-connecting'">
            {{ connected ? 'Connected to Deriv' : 'Connecting…' }}
          </span>
        </div>
      </div>

      <TradeView />

      <p class="mkt-disclaimer">
        Market data is streamed from the Deriv public feed for information only.
        Rates shown here are not the settlement rates used for gift card trades.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { connected } = useDerivRate()

useSeoMeta({
  title: 'Live Markets — Plero Technologies',
  description: 'Real-time Deriv market charts. Volatility indices, Forex, Crypto and more.',
})
</script>

<style scoped>
.mkt-page {
  padding: 40px 0 64px;
}

.mkt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.mkt-title {
  font-size: clamp(22px, 4vw, 38px);
  font-weight: 800;
  margin-bottom: 6px;
}

.mkt-sub {
  color: var(--muted);
  font-size: 15px;
}

.mkt-status {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-full);
  padding: 8px 16px;
  flex-shrink: 0;
}

.mkt-status-text {
  font-size: 13px;
  font-weight: 600;
}
.is-live { color: var(--accent); }
.is-connecting { color: var(--gold); }

.mkt-disclaimer {
  color: var(--muted-3);
  font-size: 12px;
  margin-top: 16px;
  text-align: center;
}
</style>
