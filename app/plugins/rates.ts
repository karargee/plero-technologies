// Loads live rates (from Supabase via /api/rates) once per page load.
// On the server the result is embedded in the page, so the browser doesn't fetch again.
import type { RatesPayload } from '~/composables/useRates'

export default defineNuxtPlugin(async () => {
  const state = useState<RatesPayload | null>('live-rates', () => null)
  if (state.value) return
  try {
    state.value = await $fetch<RatesPayload>('/api/rates')
  } catch {
    state.value = null // fall back to built-in defaults
  }
})
