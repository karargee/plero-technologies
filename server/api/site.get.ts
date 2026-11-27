// Everything the public site can load from Supabase, in one cached request (30s):
// rates, gift cards, edited content and approved testimonials.
// Each part falls back independently, so the site never breaks if one table is missing.

interface RateRow {
  key: string
  value: number
  updated_at: string
}
interface CardRow {
  id: string
  name: string
  color: string
  rate: number
  change: number
  min: number
  max: number
}
interface ContentRow {
  key: string
  data: unknown
}
interface TestimonialRow {
  id: string
  name: string
  location: string
  service: string
  quote: string
  rating: number
  featured: boolean
  created_at: string
}

export default defineCachedEventHandler(
  async (event) => {
    const [rates, cards, content, testimonials] = await Promise.allSettled([
      supabaseSelect<RateRow>(event, 'rates', 'select=key,value,updated_at'),
      supabaseSelect<CardRow>(
        event,
        'gift_cards',
        'select=id,name,color,rate,change,min,max&active=eq.true&order=sort.asc,name.asc',
      ),
      supabaseSelect<ContentRow>(event, 'content', 'select=key,data'),
      supabaseSelect<TestimonialRow>(
        event,
        'testimonials',
        'select=id,name,location,service,quote,rating,featured,created_at&status=eq.approved&order=featured.desc,created_at.desc&limit=24',
      ),
    ])

    for (const r of [rates, cards, content, testimonials]) {
      if (r.status === 'rejected' && !String(r.reason).includes('not configured')) {
        console.error('[site] Supabase fetch failed:', String(r.reason).slice(0, 200))
      }
    }

    const rateValues: Record<string, number> = {}
    let updatedAt = ''
    if (rates.status === 'fulfilled') {
      for (const r of rates.value) {
        rateValues[r.key] = Number(r.value)
        if (r.updated_at > updatedAt) updatedAt = r.updated_at
      }
    }

    const contentMap: Record<string, unknown> = {}
    if (content.status === 'fulfilled') for (const c of content.value) contentMap[c.key] = c.data

    return {
      source: rates.status === 'fulfilled' ? ('supabase' as const) : ('defaults' as const),
      rates: rateValues,
      cards:
        cards.status === 'fulfilled'
          ? cards.value.map((c) => ({ ...c, rate: +c.rate, change: +c.change, min: +c.min, max: +c.max }))
          : null,
      content: contentMap,
      testimonials: testimonials.status === 'fulfilled' ? testimonials.value : [],
      updatedAt: updatedAt || null,
    }
  },
  { maxAge: 30, swr: false, name: 'site', getKey: () => 'all' },
)
