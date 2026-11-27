// All editable wording, with admin edits (Supabase `content` table) merged over defaults.
import { contentDefaults, type ContentKey } from '~/data/defaults'
import { iconOptions } from '~/data/content'

export function useContent() {
  const state = useSiteData()

  function doc<K extends ContentKey>(key: K) {
    return computed(() => mergeContent(contentDefaults[key], state.value?.content?.[key]) as (typeof contentDefaults)[K])
  }

  const settings = doc('settings')
  const announcement = doc('announcement')
  const home = doc('home')
  const pages = doc('pages')
  const about = doc('about')
  const featuresDoc = doc('features')
  const statsDoc = doc('stats')
  const faqsDoc = doc('faqs')
  const guidesDoc = doc('guides')
  const features = computed(() =>
    featuresDoc.value.items.map((f) => ({ ...f, icon: iconOptions.includes(f.icon) ? f.icon : 'check' })),
  )
  const stats = computed(() => statsDoc.value.items.filter((s) => s.value || s.label))
  const steps = doc('steps')
  const faqs = computed(() => faqsDoc.value.items.filter((f) => f.q && f.a))
  const guides = computed(() => guidesDoc.value.items.filter((g) => g.slug && g.title))

  /** Site identity + contact, in the same shape the components already use. */
  const site = computed(() => {
    const s = settings.value
    return {
      name: s.name,
      tagline: s.tagline,
      contact: s.contact,
      socials: s.socials.filter((x) => x.label),
      registration: { ...s.registration, licences: s.registration.licences.filter(Boolean) },
    }
  })

  const testimonials = computed(() => state.value?.testimonials ?? [])

  // Only allow site-relative paths or https URLs for images.
  const imagesDoc = doc('images')
  const images = computed(() => {
    const out = { ...imagesDoc.value }
    for (const k of Object.keys(out) as (keyof typeof out)[]) {
      const v = out[k]
      if (!(typeof v === 'string' && (v.startsWith('/') || v.startsWith('https://')))) out[k] = contentDefaults.images[k]
    }
    return out
  })
  /** CSS `url(...)` helper for background images. */
  const bg = (src: string) => `url("${src.replace(/"/g, '%22')}")`

  return { settings, site, announcement, home, pages, about, features, stats, steps, faqs, guides, testimonials, images, bg }
}
