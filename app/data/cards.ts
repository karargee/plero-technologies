import type { Card, CardCategory } from '~/types'

/**
 * Single source of truth for every gift card Plero settles.
 * Rates are multipliers applied to the live USD/NGN feed.
 */
export const CARDS: Card[] = [
  {
    id: 'deriv',
    name: 'Deriv USD',
    short: 'Deriv',
    logo: 'D',
    color: '#ff444f',
    buyRate: 0.95,
    sellRate: 0.9,
    category: 'Trading',
    denominations: [10, 50, 100, 500, 1000],
    eta: '5–10 min',
    instant: true,
  },
  {
    id: 'icash',
    name: 'iCash Voucher',
    short: 'iCash',
    logo: 'iC',
    color: '#10b981',
    buyRate: 0.92,
    sellRate: 0.87,
    category: 'Voucher',
    denominations: [20, 50, 100, 200],
    eta: '5–10 min',
    instant: true,
  },
  {
    id: 'vouch',
    name: 'Vouch',
    short: 'Vouch',
    logo: 'V',
    color: '#6366f1',
    buyRate: 0.88,
    sellRate: 0.82,
    category: 'Voucher',
    denominations: [10, 25, 50, 100],
    eta: '5–15 min',
    instant: true,
  },
  {
    id: 'cherry',
    name: 'Cherry',
    short: 'Cherry',
    logo: 'C',
    color: '#e11d48',
    buyRate: 0.86,
    sellRate: 0.8,
    category: 'Voucher',
    denominations: [10, 20, 50, 100],
    eta: '5–15 min',
    instant: true,
  },
  {
    id: 'amazon',
    name: 'Amazon',
    short: 'Amazon',
    logo: 'a',
    color: '#ff9900',
    buyRate: 0.85,
    sellRate: 0.78,
    category: 'Shopping',
    denominations: [25, 50, 100, 200, 500],
    eta: '10–20 min',
    instant: false,
  },
  {
    id: 'itunes',
    name: 'iTunes / Apple',
    short: 'Apple',
    logo: 'A',
    color: '#9ca3af',
    buyRate: 0.8,
    sellRate: 0.73,
    category: 'Entertainment',
    denominations: [15, 25, 50, 100],
    eta: '10–20 min',
    instant: false,
  },
  {
    id: 'google-play',
    name: 'Google Play',
    short: 'Google Play',
    logo: 'G',
    color: '#34a853',
    buyRate: 0.82,
    sellRate: 0.75,
    category: 'Entertainment',
    denominations: [10, 25, 50, 100],
    eta: '10–20 min',
    instant: false,
  },
  {
    id: 'steam',
    name: 'Steam Wallet',
    short: 'Steam',
    logo: 'S',
    color: '#3b6ea5',
    buyRate: 0.83,
    sellRate: 0.76,
    category: 'Gaming',
    denominations: [20, 50, 100],
    eta: '10–20 min',
    instant: false,
  },
]

export const CATEGORIES: ('All' | CardCategory)[] = [
  'All',
  'Trading',
  'Voucher',
  'Shopping',
  'Entertainment',
  'Gaming',
]

export const FEATURED_IDS = ['deriv', 'icash', 'vouch', 'cherry'] as const

export const getCard = (id: string | string[] | undefined): Card | undefined =>
  CARDS.find(c => c.id === id)

export const getFeaturedCards = (): Card[] => CARDS.filter(c => FEATURED_IDS.includes(c.id as never))
