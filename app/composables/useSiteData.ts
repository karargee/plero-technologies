// Shared live data + helpers to merge admin edits over the built-in defaults.
import type { GiftCard } from '~/data/site'

export interface PublicTestimonial {
  id: string
  name: string
  location: string
  service: string
  quote: string
  rating: number
  featured: boolean
  created_at: string
}

export interface SitePayload {
  source: 'supabase' | 'defaults'
  rates: Record<string, number>
  cards: GiftCard[] | null
  content: Record<string, unknown>
  testimonials: PublicTestimonial[]
  updatedAt: string | null
}

export function useSiteData() {
  return useState<SitePayload | null>('live-site', () => null)
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

/**
 * Deep-merge `over` onto `base`: objects merge key by key, arrays and plain values replace.
 * Empty/invalid overrides (null, undefined, wrong type) keep the default.
 */
export function mergeContent<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base
  if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T
  if (isObj(base)) {
    if (!isObj(over)) return base
    const out: Record<string, unknown> = { ...base }
    for (const k of Object.keys(over)) out[k] = k in base ? mergeContent((base as Record<string, unknown>)[k], over[k]) : over[k]
    return out as T
  }
  if (typeof base === 'number') return (typeof over === 'number' && Number.isFinite(over) ? over : base) as T
  if (typeof base === 'boolean') return (typeof over === 'boolean' ? over : base) as T
  if (typeof base === 'string') return (typeof over === 'string' ? over : base) as T
  return over as T
}
