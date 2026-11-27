// Loads live site data (rates, gift cards, content, testimonials) once per page load.
// On the server the result is embedded in the page, so the browser doesn't fetch again.
import type { SitePayload } from '~/composables/useSiteData'

export default defineNuxtPlugin(async () => {
  const state = useState<SitePayload | null>('live-site', () => null)
  if (state.value) return
  try {
    state.value = await $fetch<SitePayload>('/api/site')
  } catch {
    state.value = null // fall back to built-in defaults
  }
})
