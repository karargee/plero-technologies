export interface Card {
  id: string
  name: string
  short: string
  /** Monogram shown inside the card's colour tile. */
  logo: string
  /** Brand accent colour, also used for tile borders and hover states. */
  color: string
  /** Multiplier applied when Plero buys the card from a trader. */
  buyRate: number
  /** Multiplier applied when Plero sells the card to a buyer. */
  sellRate: number
  category: CardCategory
  denominations: number[]
  /** Typical settlement window once the order is submitted. */
  eta: string
  /** True when the brand is validated automatically. */
  instant: boolean
}

export type CardCategory = 'Trading' | 'Crypto' | 'Voucher' | 'Shopping' | 'Entertainment' | 'Gaming'

export interface NavLink {
  label: string
  to: string
}

export interface FooterColumn {
  title: string
  links: NavLink[]
}

export interface SocialLink {
  label: string
  icon: IconName
  href: string
}

export interface StatItem {
  value: string
  label: string
}

export interface Step {
  num: string
  icon: IconName
  title: string
  desc: string
  points?: string[]
}

export interface Feature {
  icon: IconName
  title: string
  desc: string
}

export interface Principle {
  icon: IconName
  title: string
  desc: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  initials: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface Milestone {
  year: string
  title: string
  desc: string
}

export interface ComparisonRow {
  label: string
  them: string
  us: string
}

export interface SupportChannel {
  label: string
  value: string
  icon: IconName
  color: string
  href: string
}

export interface ServiceLevel {
  label: string
  value: string
}

export interface Order {
  id: string
  cardId: string
  amount: string
  payout: string
  status: OrderStatus
  date: string
}

export type OrderStatus = 'completed' | 'processing' | 'pending' | 'failed'

export type IconName =
  | 'bolt'
  | 'shield'
  | 'trend'
  | 'globe'
  | 'headset'
  | 'badge'
  | 'wallet'
  | 'bank'
  | 'clock'
  | 'card'
  | 'lock'
  | 'users'
  | 'spark'
  | 'grid'
  | 'arrow'
  | 'chevron'
  | 'menu'
  | 'close'
  | 'x'
  | 'instagram'
  | 'whatsapp'
  | 'mail'
  | 'phone'
  | 'search'
  | 'plus'
  | 'receipt'
  | 'star'
  | 'help'
  | 'scan'
  | 'refresh'
  | 'gift'
  | 'percent'
  | 'check'
  | 'send'
