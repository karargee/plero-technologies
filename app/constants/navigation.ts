import type { NavLink } from '~/types'

/** Primary marketing navigation, shared by the site header and its mobile sheet. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Markets', to: '/markets' },
  { label: 'Rates', to: '/rates' },
  { label: 'Gift Cards', to: '/cards' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Support', to: '/support' },
]
