import type {
  ComparisonRow,
  FaqItem,
  Feature,
  FooterColumn,
  Milestone,
  NavLink,
  Order,
  Principle,
  ServiceLevel,
  SocialLink,
  StatItem,
  Step,
  SupportChannel,
  Testimonial,
} from '~/types'

/* ── Brand ─────────────────────────────────────────────── */

export const BRAND = {
  name: 'Plero',
  legalName: 'Plero Technologies Ltd.',
  logo: '/plero-logo.jpg',
  tagline: 'Trade gift cards at live market rates',
  supportEmail: 'support@plero.technology',
  supportPhone: '+234 800 000 0000',
} as const

/* ── Navigation ────────────────────────────────────────── */

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Trade',
    links: [
      { label: 'Live rates', to: '/rates' },
      { label: 'All gift cards', to: '/cards' },
      { label: 'Sell a card', to: '/sell' },
      { label: 'How it works', to: '/how-it-works' },
    ] satisfies NavLink[],
  },
  {
    title: 'Account',
    links: [
      { label: 'Create account', to: '/register' },
      { label: 'Log in', to: '/login' },
      { label: 'My orders', to: '/orders' },
      { label: 'Profile', to: '/profile' },
    ] satisfies NavLink[],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Plero', to: '/about' },
      { label: 'Support centre', to: '/support' },
      { label: 'Rate alerts', to: '/rates' },
      { label: 'System status', to: '/support' },
    ] satisfies NavLink[],
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'X', icon: 'x', href: '#' },
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'WhatsApp', icon: 'whatsapp', href: '#' },
  { label: 'Email', icon: 'mail', href: `mailto:${BRAND.supportEmail}` },
]

export const APP_TABS: { key: string; label: string; to: string; icon: 'grid' | 'card' | 'send' | 'receipt' | 'users' }[] = [
  { key: 'home', label: 'Home', to: '/home', icon: 'grid' },
  { key: 'buy', label: 'Buy', to: '/buy', icon: 'card' },
  { key: 'sell', label: 'Sell', to: '/sell', icon: 'send' },
  { key: 'orders', label: 'Orders', to: '/orders', icon: 'receipt' },
  { key: 'profile', label: 'Profile', to: '/profile', icon: 'users' },
]

export const QUICK_ACTIONS: { label: string; to: string; icon: 'send' | 'card' | 'receipt' | 'users' }[] = [
  { label: 'Sell', to: '/sell', icon: 'send' },
  { label: 'Buy', to: '/buy', icon: 'card' },
  { label: 'Orders', to: '/orders', icon: 'receipt' },
  { label: 'Profile', to: '/profile', icon: 'users' },
]

/* ── Home ──────────────────────────────────────────────── */

export const HERO_TRUST: string[] = [
  'No hidden fees',
  'Bank payout in 5–15 min',
  'Regulated escrow handling',
]

export const HOME_STATS: StatItem[] = [
  { value: '54,000+', label: 'Traders onboard' },
  { value: '₦3.4B', label: 'Card value settled' },
  { value: '8', label: 'Card brands live' },
  { value: '11 min', label: 'Median payout' },
]

export const STEPS: Step[] = [
  {
    num: '01',
    icon: 'users',
    title: 'Verify once',
    desc: 'Create an account, confirm your identity and attach a payout account. It takes about two minutes and it is the only step you repeat never.',
  },
  {
    num: '02',
    icon: 'scan',
    title: 'Submit the card',
    desc: 'Pick your brand, enter the code and the amount. The live rate is locked the moment you submit, so the quote you accepted is the quote you get.',
  },
  {
    num: '03',
    icon: 'bank',
    title: 'Get paid',
    desc: 'We verify and settle. Money lands in your bank account while you are still on this page, with a receipt pushed to your profile.',
  },
]

export const FEATURES: Feature[] = [
  { icon: 'trend', title: 'Market-linked pricing', desc: 'Every quote is derived from the live USD/NGN feed and your card multiplier — no desk, no stale sheet.' },
  { icon: 'bolt', title: 'Settlement in minutes', desc: 'Automated validation for major brands means most cards are verified and paid out inside a fifteen minute window.' },
  { icon: 'shield', title: 'Held-safely funds', desc: 'Customer value moves through a segregated flow with dual-approval controls and a full audit trail on every order.' },
  { icon: 'lock', title: 'Card data protection', desc: 'Codes are encrypted in transit and at rest, and purged once an order settles. We never sell or share your data.' },
  { icon: 'wallet', title: 'Any Nigerian bank', desc: 'Payouts to all major banks, with instant transfers where supported and same-day settlement everywhere else.' },
  { icon: 'headset', title: 'Support that answers', desc: 'Real people on live chat and WhatsApp, around the clock, with order context already loaded when you reach out.' },
]

export const TESTIMONIALS: Testimonial[] = [
  { quote: 'I stopped queueing at agents. Submitted a $200 Deriv card at 11pm and the money was in my account before midnight.', name: 'Amaka O.', role: 'Lagos · sells weekly', initials: 'AO' },
  { quote: 'The rate on screen is the rate I get paid. That is the whole reason I moved here and stayed.', name: 'Tunde B.', role: 'Abuja · first traded 2025', initials: 'TB' },
  { quote: 'Support actually pulled my order up mid-dispute and fixed it. That is rarer than it should be.', name: 'Zainab K.', role: 'Kano · power seller', initials: 'ZK' },
]

export const HOME_FAQS: FaqItem[] = [
  { q: 'How is the rate decided?', a: 'We anchor every card to the live USD/NGN exchange rate streamed from our pricing feed, then apply a card-specific multiplier that reflects demand, brand and denomination. The multiplier is shown next to every rate, so you can see exactly how the number was built.' },
  { q: 'How long do payouts take?', a: 'Major brands such as Deriv, iCash, Vouch and Cherry typically settle between five and fifteen minutes. Larger or non-instant brands such as Amazon and Apple usually clear within ten to twenty minutes.' },
  { q: 'What do I need to start trading?', a: 'A verified account and a payout account in your name. After that, submitting a card is a single flow: pick the brand, enter the code and the amount, and confirm.' },
  { q: 'Is my card code safe with you?', a: 'Codes are encrypted in transit and at rest, used only to verify your order, and permanently purged once the order settles. We never store a usable code longer than the order requires.' },
  { q: 'What are the fees?', a: 'There is no separate transaction fee. The rate you are quoted is the rate you are paid — the margin is already inside it, and there are no hidden charges on either side.' },
]

/* ── How it works ──────────────────────────────────────── */

export const FLOW_STEPS: Step[] = [
  {
    num: '01',
    icon: 'users',
    title: 'Create and verify your account',
    desc: 'Register with your email and phone, complete identity verification and attach a payout account in your name. This is a one-time step — we do not ask for documents on every order.',
    points: ['BVN and a valid ID', 'Bank account in your name', 'Two-minute average setup'],
  },
  {
    num: '02',
    icon: 'scan',
    title: 'Submit the card at a locked rate',
    desc: 'Choose your brand, denomination and enter the code. The live rate is captured at the moment you submit, so the quote you accepted is protected even if the market moves while we verify.',
    points: ['Rate locked on submission', 'Image upload for non-instant brands', 'Order reference issued instantly'],
  },
  {
    num: '03',
    icon: 'bank',
    title: 'Verification and bank payout',
    desc: 'Our system validates the code against the brand. Once cleared, settlement is released to your payout account and a receipt is pushed to your Plero profile.',
    points: ['5–15 min for instant brands', 'Dual-approval release controls', 'Full audit trail per order'],
  },
]

export const COMPARISON: ComparisonRow[] = [
  { label: 'Rate source', them: 'Desk-set, changes hourly', us: 'Live market feed, continuous' },
  { label: 'Waiting', them: 'Queue at the counter', us: 'Submit from anywhere' },
  { label: 'Payout window', them: 'Same day at best', us: '5–15 minutes median' },
  { label: 'Receipt', them: 'Handwritten slip', us: 'Permanent, downloadable' },
  { label: 'Disputes', them: 'In person, no record', us: 'Ticketed, order-linked' },
]

export const FLOW_FAQS: FaqItem[] = [
  { q: 'Which brands settle instantly?', a: 'Deriv USD, iCash, Vouch and Cherry are validated automatically and usually settle within five to fifteen minutes. Amazon, Apple, Google Play and Steam typically clear within ten to twenty minutes because the brand requires a merchant-side redemption check.' },
  { q: 'What happens if a card is rejected?', a: 'Nothing is deducted from your balance. You get a reason code on the order, and support can walk you through what to correct. Rejections on our side carry no fee.' },
  { q: 'Can I trade a card that is not listed?', a: 'Yes, for higher-value cards. Submit through support with the brand, denomination and an image, and we will confirm the rate and settlement window before you send the code.' },
  { q: 'Is there a limit per order?', a: 'Per-order limits are set per brand and denomination and shown on each card page. Aggregate daily limits apply to keep settlement safe; higher limits are available on request for verified high-volume traders.' },
]

/* ── About ─────────────────────────────────────────────── */

export const ABOUT_STATS: StatItem[] = [
  { value: '2024', label: 'Founded' },
  { value: '54,000+', label: 'Registered traders' },
  { value: '₦3.4B', label: 'Settled to date' },
  { value: '8', label: 'Brands supported' },
]

export const PRINCIPLES: Principle[] = [
  { icon: 'trend', title: 'Price off the market', desc: 'Every quote traces back to a live feed and a visible multiplier. If we cannot show the arithmetic, we do not publish the rate.' },
  { icon: 'receipt', title: 'Leave a record', desc: 'Each order produces a durable receipt with its own reference, status trail and settlement time. No handwritten slips.' },
  { icon: 'shield', title: 'Move money carefully', desc: 'Dual-approval release controls, segregation of customer value and a full audit trail on every settlement.' },
  { icon: 'headset', title: 'Answer for the outcome', desc: 'Support is measured on resolution time, not response time. A reply that does not fix the order has not done the job.' },
]

export const MILESTONES: Milestone[] = [
  { year: '2024', title: 'Manual settlement desk', desc: 'Started absorbing unpriced gift card trades for traders who were losing margin daily.' },
  { year: '2025', title: 'Live pricing feed', desc: 'Moved card pricing onto a continuous USD/NGN feed with per-brand multipliers.' },
  { year: '2025', title: 'Automated verification', desc: 'Instant settlement for major brands, cutting median payout from hours to minutes.' },
  { year: '2026', title: 'Public platform', desc: 'Self-serve accounts, permanent order receipts and expanded brand coverage.' },
]

/* ── Support ───────────────────────────────────────────── */

export const SUPPORT_CHANNELS: SupportChannel[] = [
  { label: 'Live chat', value: 'Median reply 40 seconds', icon: 'headset', color: 'var(--accent)', href: '#' },
  { label: 'WhatsApp', value: BRAND.supportPhone, icon: 'whatsapp', color: '#22c55e', href: '#' },
  { label: 'Email', value: BRAND.supportEmail, icon: 'mail', color: '#6366f1', href: `mailto:${BRAND.supportEmail}` },
  { label: 'Phone', value: 'Mon–Sun, 8am–10pm WAT', icon: 'phone', color: 'var(--gold)', href: `tel:${BRAND.supportPhone.replace(/\s/g, '')}` },
]

export const SERVICE_LEVELS: ServiceLevel[] = [
  { label: 'Chat response', value: '< 1 min' },
  { label: 'Settlement (instant brands)', value: '5–15 min' },
  { label: 'Settlement (merchant brands)', value: '10–20 min' },
  { label: 'Dispute resolution', value: '< 24 hrs' },
]

export const SUPPORT_FAQS: FaqItem[] = [
  { q: 'My payout has not arrived yet', a: 'Check the order in your profile first — most payouts clear inside the quoted window. If the window has passed, send us the order reference and the last four digits of your payout account and we will trace the settlement.' },
  { q: 'A card was rejected', a: 'Open the order to see the reason code. Common causes are an already-redeemed code, a mismatch between the entered denomination and the card face value, or a damaged code. Rejected orders carry no fee.' },
  { q: 'How do I change my payout account?', a: 'Go to Profile → Payout account and submit the new details. The change applies to the next order; an in-flight order settles to the account that was on file when it was submitted.' },
  { q: 'Can I trade a brand that is not listed?', a: 'Yes. Send the brand, denomination and a photo through live chat. We will confirm the rate and settlement window before you share any code.' },
  { q: 'Do you accept card images?', a: 'Yes, and it speeds up non-instant brands considerably. Photograph the full card with the code legible, and keep the original until the order settles.' },
  { q: 'What are your fees?', a: 'There is no separate transaction fee. The margin sits inside the quoted rate, and there are no charges for verification or rejection.' },
]

/* ── Auth ──────────────────────────────────────────────── */

export const SIGN_IN_PERKS: string[] = [
  'Rates derived from the live market feed',
  'Payouts to any Nigerian bank in minutes',
  'Permanent receipts on every order',
  'Support staffed around the clock',
]

export const SIGN_UP_PERKS: string[] = [
  'Free to register — no hidden charges',
  'Instant payouts to any Nigerian bank',
  'Referral bonuses paid on settlement',
  'Eight gift card brands from day one',
]

/* ── Orders (demo data) ────────────────────────────────── */
export const ORDERS: Order[] = [
  { id: '#PL1042', cardId: 'deriv', amount: '$100', payout: '144,000', status: 'completed', date: 'Dec 10' },
  { id: '#PL1043', cardId: 'icash', amount: '$50', payout: '69,600', status: 'pending', date: 'Dec 11' },
  { id: '#PL1044', cardId: 'cherry', amount: '$20', payout: '25,600', status: 'processing', date: 'Dec 12' },
  { id: '#PL1045', cardId: 'vouch', amount: '$25', payout: '32,800', status: 'completed', date: 'Dec 13' },
  { id: '#PL1046', cardId: 'amazon', amount: '$100', payout: '124,800', status: 'failed', date: 'Dec 14' },
]

export const ORDER_FILTERS = ['All', 'Completed', 'Processing', 'Pending', 'Failed'] as const

export const PROFILE_MENU: { icon: 'bank' | 'trend' | 'receipt' | 'lock' | 'headset' | 'refresh'; label: string; sub: string; to?: string; danger?: boolean }[] = [
  { icon: 'bank', label: 'Payout account', sub: 'Add or change your bank account', to: '/profile' },
  { icon: 'trend', label: 'Rate alerts', sub: 'Get notified on rate movement', to: '/rates' },
  { icon: 'receipt', label: 'Order history', sub: 'Receipts and settlement records', to: '/orders' },
  { icon: 'lock', label: 'Security', sub: 'PIN, password and two-factor', to: '/profile' },
  { icon: 'headset', label: 'Support', sub: 'Chat with us, 24/7', to: '/support' },
  { icon: 'refresh', label: 'Log out', sub: 'Sign out of this device', danger: true },
]
