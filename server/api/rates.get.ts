// Live rates for the public site, read from Supabase and cached for 30 seconds.
// If Supabase isn't configured or is down, returns empty data and the site uses its built-in defaults.

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
  active: boolean
  sort: number
}

export default defineCachedEventHandler(
  async (event) => {
    try {
      const [rates, cards] = await Promise.all([
        supabaseSelect<RateRow>(event, 'rates', 'select=key,value,updated_at'),
        supabaseSelect<CardRow>(event, 'gift_cards', 'select=id,name,color,rate,change,min,max,active,sort&active=eq.true&order=sort.asc,name.asc'),
      ])
      const values: Record<string, number> = {}
      let updatedAt = ''
      for (const r of rates) {
        values[r.key] = Number(r.value)
        if (r.updated_at > updatedAt) updatedAt = r.updated_at
      }
      return {
        source: 'supabase' as const,
        rates: values,
        cards: cards.map((c) => ({
          id: c.id,
          name: c.name,
          color: c.color,
          rate: Number(c.rate),
          change: Number(c.change),
          min: Number(c.min),
          max: Number(c.max),
        })),
        updatedAt: updatedAt || null,
      }
    } catch (err) {
      if (!(err instanceof Error && err.message.includes('not configured'))) {
        console.error('[rates] Supabase fetch failed', err)
      }
      return { source: 'defaults' as const, rates: {}, cards: null, updatedAt: null }
    }
  },
  // swr off: after 30s the next visitor waits for fresh rates instead of seeing old ones once more.
  { maxAge: 30, swr: false, name: 'rates', getKey: () => 'all' },
)
