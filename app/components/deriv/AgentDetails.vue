<script setup lang="ts">
const { deriv } = useRates()

const rows = computed(() =>
  [
    { label: 'Payment agent name', value: deriv.value.agent.name },
    { label: 'Payment agent ID', value: deriv.value.agent.loginId },
    { label: 'Agent email', value: deriv.value.agent.email },
  ].filter((r) => r.value),
)
const copied = ref<string | null>(null)
async function copy(v: string) {
  try {
    await navigator.clipboard.writeText(v)
    copied.value = v
    setTimeout(() => (copied.value = null), 1600)
  } catch {
    /* clipboard blocked — user can still select the text */
  }
}
</script>

<template>
  <div class="agent card">
    <h3>Our Deriv payment agent details</h3>
    <p>Use these when withdrawing on Deriv (Cashier → Payment agents → Withdraw).</p>
    <dl>
      <div v-for="r in rows" :key="r.label" class="agent__row">
        <dt>{{ r.label }}</dt>
        <dd>
          <code>{{ r.value }}</code>
          <button type="button" class="agent__copy" @click="copy(r.value)">
            {{ copied === r.value ? 'Copied' : 'Copy' }}
          </button>
        </dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
.agent {
  padding: clamp(20px, 3vw, 28px);
}
h3 {
  font-size: 19px;
}
p {
  margin-top: 6px;
  color: var(--ink-soft);
  font-size: 14.5px;
}
dl {
  margin: 18px 0 0;
  display: grid;
  gap: 10px;
}
.agent__row {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: var(--surface-alt);
}
dt {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
dd {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
code {
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  font-size: 15px;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.agent__copy {
  flex: none;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--indigo-600);
  cursor: pointer;
}
.agent__copy:hover {
  border-color: var(--indigo-200);
}
</style>
