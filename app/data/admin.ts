// Which rate fields the admin page shows, grouped by service.
// Keys must match the `rates` table in supabase/schema.sql and useRates().

export interface RateField {
  key: string
  label: string
  hint?: string
  prefix?: string
}
export interface RateGroup {
  id: string
  title: string
  symbol: string
  color: string
  /** keys used to show the spread (margin) between buy and sell */
  spread?: [string, string]
  fields: RateField[]
}

export const rateGroups: RateGroup[] = [
  {
    id: 'deriv',
    title: 'Deriv payment agent',
    symbol: 'D',
    color: '#4c4fa6',
    spread: ['deriv_deposit', 'deriv_withdraw'],
    fields: [
      { key: 'deriv_deposit', label: 'Deposit rate', hint: '₦ customer pays per $1', prefix: '₦' },
      { key: 'deriv_withdraw', label: 'Withdrawal rate', hint: '₦ you pay per $1', prefix: '₦' },
      { key: 'deriv_min', label: 'Minimum', hint: 'USD', prefix: '$' },
      { key: 'deriv_max', label: 'Maximum', hint: 'USD', prefix: '$' },
    ],
  },
  {
    id: 'usdt',
    title: 'USDT',
    symbol: '₮',
    color: '#1a9e75',
    spread: ['usdt_buy', 'usdt_sell'],
    fields: [
      { key: 'usdt_buy', label: 'Customer buys at', hint: '₦ per 1 USDT', prefix: '₦' },
      { key: 'usdt_sell', label: 'Customer sells at', hint: '₦ per 1 USDT', prefix: '₦' },
      { key: 'usdt_min', label: 'Minimum', hint: 'USDT' },
      { key: 'usdt_max', label: 'Maximum', hint: 'USDT' },
    ],
  },
  {
    id: 'airtm',
    title: 'Airtm USD',
    symbol: 'A',
    color: '#2563eb',
    spread: ['airtm_buy', 'airtm_sell'],
    fields: [
      { key: 'airtm_buy', label: 'Customer buys at', hint: '₦ per $1', prefix: '₦' },
      { key: 'airtm_sell', label: 'Customer sells at', hint: '₦ per $1', prefix: '₦' },
      { key: 'airtm_min', label: 'Minimum', hint: 'USD', prefix: '$' },
      { key: 'airtm_max', label: 'Maximum', hint: 'USD', prefix: '$' },
    ],
  },
  {
    id: 'china',
    title: 'China supplier payments',
    symbol: '¥',
    color: '#d6342c',
    fields: [
      { key: 'china_rate', label: 'Rate', hint: '₦ per ¥1', prefix: '₦' },
      { key: 'china_fee', label: 'Service fee', hint: '₦ per payment', prefix: '₦' },
      { key: 'china_min', label: 'Minimum', hint: 'RMB', prefix: '¥' },
      { key: 'china_max', label: 'Maximum', hint: 'RMB', prefix: '¥' },
    ],
  },
]
