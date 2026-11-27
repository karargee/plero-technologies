// Live rates with safe fallbacks: values set in /admin (Supabase) override the
// defaults in app/data/site.ts and app/data/pay.ts.
import { cards as defaultCards, deriv as defaultDeriv, type GiftCard } from '~/data/site'
import { payServices as defaultPay, type PayService } from '~/data/pay'

export interface RatesPayload {
  source: 'supabase' | 'defaults'
  rates: Record<string, number>
  cards: GiftCard[] | null
  updatedAt: string | null
}

export function useRates() {
  const state = useState<RatesPayload | null>('live-rates', () => null)

  const pick = (key: string, fallback: number) => {
    const v = state.value?.rates?.[key]
    return typeof v === 'number' && Number.isFinite(v) ? v : fallback
  }

  const deriv = computed(() => ({
    ...defaultDeriv,
    depositRate: pick('deriv_deposit', defaultDeriv.depositRate),
    withdrawRate: pick('deriv_withdraw', defaultDeriv.withdrawRate),
    min: pick('deriv_min', defaultDeriv.min),
    max: pick('deriv_max', defaultDeriv.max),
  }))

  const payServices = computed<PayService[]>(() =>
    defaultPay.map((s) =>
      s.kind === 'trade'
        ? {
            ...s,
            buyRate: pick(`${s.id}_buy`, s.buyRate),
            sellRate: pick(`${s.id}_sell`, s.sellRate),
            min: pick(`${s.id}_min`, s.min),
            max: pick(`${s.id}_max`, s.max),
          }
        : {
            ...s,
            rate: pick(`${s.id}_rate`, s.rate),
            fee: pick(`${s.id}_fee`, s.fee),
            min: pick(`${s.id}_min`, s.min),
            max: pick(`${s.id}_max`, s.max),
          },
    ),
  )

  const cards = computed<GiftCard[]>(() => (state.value?.cards?.length ? state.value.cards : defaultCards))

  const updatedAt = computed(() => state.value?.updatedAt ?? null)

  return { deriv, payServices, cards, updatedAt }
}
