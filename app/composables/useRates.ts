// Live rates + service details with safe fallbacks:
// admin edits (Supabase) override the defaults in app/data/site.ts and app/data/pay.ts.
import { cards as defaultCards, deriv as defaultDeriv, type GiftCard } from '~/data/site'
import { payServices as defaultPay, type PayService } from '~/data/pay'
import { payTextDefaults } from '~/data/defaults'

export function useRates() {
  const state = useSiteData()
  const { settings } = useContent()

  const pick = (key: string, fallback: number) => {
    const v = state.value?.rates?.[key]
    return typeof v === 'number' && Number.isFinite(v) ? v : fallback
  }

  const deriv = computed(() => {
    const d = settings.value.deriv
    return {
      ...defaultDeriv,
      signupUrl: d.signupUrl || defaultDeriv.signupUrl,
      speed: d.speed || defaultDeriv.speed,
      agent: { name: d.agentName, loginId: d.agentLoginId, email: d.agentEmail },
      depositRate: pick('deriv_deposit', defaultDeriv.depositRate),
      withdrawRate: pick('deriv_withdraw', defaultDeriv.withdrawRate),
      min: pick('deriv_min', defaultDeriv.min),
      max: pick('deriv_max', defaultDeriv.max),
    }
  })

  const payServices = computed<PayService[]>(() => {
    const textOver = state.value?.content?.pay as Record<string, unknown> | undefined
    return defaultPay.map((s) => {
      const text = mergeContent(payTextDefaults[s.id]!, textOver?.[s.id]) as Partial<PayService>
      return s.kind === 'trade'
        ? ({
            ...s,
            ...text,
            buyRate: pick(`${s.id}_buy`, s.buyRate),
            sellRate: pick(`${s.id}_sell`, s.sellRate),
            min: pick(`${s.id}_min`, s.min),
            max: pick(`${s.id}_max`, s.max),
          } as PayService)
        : ({
            ...s,
            ...text,
            rate: pick(`${s.id}_rate`, s.rate),
            fee: pick(`${s.id}_fee`, s.fee),
            min: pick(`${s.id}_min`, s.min),
            max: pick(`${s.id}_max`, s.max),
          } as PayService)
    })
  })

  const cards = computed<GiftCard[]>(() => (state.value?.cards?.length ? state.value.cards : defaultCards))
  const updatedAt = computed(() => state.value?.updatedAt ?? null)

  return { deriv, payServices, cards, updatedAt }
}
