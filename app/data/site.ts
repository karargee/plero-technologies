// ---------------------------------------------------------------------------
// Site content lives here so you can edit copy, rates and contacts in one place.
// Anything marked TODO is a placeholder — replace it with your real details.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Plero Technologies',
  short: 'Plero',
  tagline:
    'Deriv deposits & withdrawals, USDT, Airtm USD and China supplier payments — all in Naira, fast and from a real person.',
  currency: { code: 'NGN', symbol: '₦' },
  contact: {
    email: 'support@plerotechnologies.com', // TODO: real support email
    phone: '+234 800 000 0000', // TODO: real phone number
    whatsapp: 'https://wa.me/2348000000000', // TODO: real WhatsApp link (wa.me/<country code + number>)
    address: 'Lagos, Nigeria', // TODO: real address
    hours: 'Every day, 8:00am – 11:00pm',
  },
  /**
   * Company registration — shown in the footer, About page and Plero Pay pages.
   * Leave a value empty ('') to hide it.
   */
  registration: {
    legalName: '', // TODO: e.g. 'Plero Technologies Limited'
    rcNumber: '', // TODO: CAC RC number, e.g. 'RC 1234567'
    licences: [] as string[], // TODO: e.g. ['Registered with the SEC Nigeria as …']
  },
  socials: [
    { label: 'Instagram', href: '#' }, // TODO
    { label: 'X (Twitter)', href: '#' }, // TODO
    { label: 'Facebook', href: '#' }, // TODO
  ],
}

// ---------------------------------------------------------------------------
// Deriv payment agent
// ---------------------------------------------------------------------------
export const deriv = {
  /** Your Deriv affiliate / partner sign-up link. */
  signupUrl: 'https://deriv.com/signup/', // TODO: paste your affiliate link here
  /** Public market-data feed (no login needed). */
  wsUrl: 'wss://api.derivws.com/trading/v1/options/ws/public',
  /** 1089 is Deriv's public test app id — register your own at developers.deriv.com. */
  appId: '1089', // TODO: your own Deriv app id
  agent: {
    name: 'Plero Technologies', // TODO: name exactly as listed on Deriv
    loginId: 'CR0000000', // TODO: your payment agent account ID
    email: 'payments@plerotechnologies.com', // TODO: payment agent email shown on Deriv
  },
  /** Naira the customer pays you for $1 deposited to Deriv. */
  depositRate: 1650, // TODO
  /** Naira you pay the customer for $1 withdrawn from Deriv. */
  withdrawRate: 1580, // TODO
  min: 5, // TODO: confirm your min (USD)
  max: 2000, // TODO: confirm your max (USD)
  speed: '5–15 minutes',
}

export interface Market {
  symbol: string
  name: string
  group: 'Synthetics' | 'Forex' | 'Commodities' | 'Crypto'
}

export const markets: Market[] = [
  { symbol: 'R_75', name: 'Volatility 75 Index', group: 'Synthetics' },
  { symbol: 'R_100', name: 'Volatility 100 Index', group: 'Synthetics' },
  { symbol: 'R_50', name: 'Volatility 50 Index', group: 'Synthetics' },
  { symbol: 'R_25', name: 'Volatility 25 Index', group: 'Synthetics' },
  { symbol: 'R_10', name: 'Volatility 10 Index', group: 'Synthetics' },
  { symbol: '1HZ100V', name: 'Volatility 100 (1s) Index', group: 'Synthetics' },
  { symbol: 'BOOM1000', name: 'Boom 1000 Index', group: 'Synthetics' },
  { symbol: 'CRASH1000', name: 'Crash 1000 Index', group: 'Synthetics' },
  { symbol: 'BOOM500', name: 'Boom 500 Index', group: 'Synthetics' },
  { symbol: 'CRASH500', name: 'Crash 500 Index', group: 'Synthetics' },
  { symbol: 'stpRNG', name: 'Step Index', group: 'Synthetics' },
  { symbol: 'JD25', name: 'Jump 25 Index', group: 'Synthetics' },
  { symbol: 'frxEURUSD', name: 'EUR/USD', group: 'Forex' },
  { symbol: 'frxGBPUSD', name: 'GBP/USD', group: 'Forex' },
  { symbol: 'frxXAUUSD', name: 'Gold/USD', group: 'Commodities' },
  { symbol: 'cryBTCUSD', name: 'BTC/USD', group: 'Crypto' },
  { symbol: 'cryETHUSD', name: 'ETH/USD', group: 'Crypto' },
]

export const featuredSymbols = ['R_75', 'R_100', 'BOOM1000', 'CRASH1000', 'stpRNG', 'frxEURUSD', 'frxXAUUSD', 'cryBTCUSD']

export const nav = [
  { label: 'Deriv', to: '/deriv' },
  { label: 'Plero Pay', to: '/plero-pay' },
  { label: 'Live charts', to: '/markets' },
  { label: 'Tools', to: '/tools' },
  { label: 'Guides', to: '/guides' },
  { label: 'Support', to: '/support' },
]

/** Extra links shown in the footer only. */
export const footerNav = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Deriv deposit & withdraw', to: '/deriv' },
  { label: 'Live charts', to: '/markets' },
  { label: 'Tools', to: '/tools' },
  { label: 'Guides', to: '/guides' },
  { label: 'Support', to: '/support' },
]

/** Plero Pay links for the footer. */
export const payNav = [
  { label: 'Plero Pay', to: '/plero-pay' },
  { label: 'Buy & sell USDT', to: '/plero-pay/usdt' },
  { label: 'Buy & sell Airtm USD', to: '/plero-pay/airtm' },
  { label: 'Pay Chinese suppliers', to: '/plero-pay/china' },
  { label: 'Sell gift cards', to: '/gift-cards' },
]

// ---------------------------------------------------------------------------
// Gift cards (secondary service)
// ---------------------------------------------------------------------------
export interface GiftCard {
  id: string
  name: string
  color: string
  /** Payout per 1 USD of card value, in site.currency */
  rate: number
  /** Change vs. yesterday, in % */
  change: number
  min: number
  max: number
}

// TODO: sample rates only — replace with your real gift card rates.
export const cards: GiftCard[] = [
  { id: 'apple', name: 'Apple / iTunes', color: '#1d1d1f', rate: 1180, change: 0.8, min: 25, max: 2000 },
  { id: 'amazon', name: 'Amazon', color: '#ff9900', rate: 1120, change: -0.4, min: 25, max: 1000 },
  { id: 'steam', name: 'Steam', color: '#1b2838', rate: 1210, change: 1.2, min: 20, max: 500 },
  { id: 'google', name: 'Google Play', color: '#0f9d58', rate: 1050, change: 0.3, min: 25, max: 500 },
  { id: 'razer', name: 'Razer Gold', color: '#00c000', rate: 1150, change: 0.6, min: 10, max: 500 },
  { id: 'sephora', name: 'Sephora', color: '#000000', rate: 980, change: -0.2, min: 50, max: 500 },
  { id: 'ebay', name: 'eBay', color: '#e53238', rate: 1010, change: 0.1, min: 25, max: 500 },
  { id: 'nordstrom', name: 'Nordstrom', color: '#2c2c2c', rate: 990, change: 0.0, min: 50, max: 500 },
  { id: 'walmart', name: 'Walmart', color: '#0071ce', rate: 1030, change: 0.5, min: 25, max: 500 },
  { id: 'vanilla', name: 'Vanilla Visa', color: '#6a3fb5', rate: 1080, change: -0.6, min: 25, max: 500 },
]

// ---------------------------------------------------------------------------
// Marketing copy
// ---------------------------------------------------------------------------
export const features = [
  {
    icon: 'bolt',
    title: 'Funded in minutes',
    body: 'Send Naira, and your Deriv account is topped up in minutes — not hours.',
  },
  {
    icon: 'bank',
    title: 'Withdraw to your bank',
    body: 'Withdraw from Deriv to us and receive Naira straight into your local bank account.',
  },
  {
    icon: 'shield',
    title: 'Deriv payment agent',
    body: 'We are listed as a payment agent on Deriv, so every transfer runs through Deriv’s own cashier.',
  },
  {
    icon: 'chart',
    title: 'Clear, fixed rates',
    body: 'Our deposit and withdrawal rates are published openly. What you see is what you pay or get.',
  },
  {
    icon: 'chat',
    title: 'Real human support',
    body: 'Talk to a real person on WhatsApp whenever you need help with a deposit or withdrawal.',
  },
  {
    icon: 'cards',
    title: 'Gift cards too',
    body: 'Got an unused gift card? We buy those as well, at fair rates.',
  },
]

export const depositSteps = [
  { title: 'Message us', body: 'Tell us on WhatsApp how much you want to deposit and your Deriv account ID (CR number).' },
  { title: 'Send Naira', body: 'Transfer the Naira amount to the account we give you and share the receipt.' },
  { title: 'We fund Deriv', body: 'We transfer the USD to your Deriv account through Deriv’s payment agent system.' },
  { title: 'Start trading', body: 'The balance appears in your Deriv account. Usually within 5–15 minutes.' },
]

export const withdrawSteps = [
  { title: 'Open the cashier', body: 'Log in to Deriv and go to Cashier → Payment agents → Withdraw.' },
  { title: 'Choose Plero', body: 'Select Plero Technologies, or enter our payment agent ID, then enter the amount.' },
  { title: 'Confirm by email', body: 'Deriv emails you a confirmation link — click it to approve the withdrawal.' },
  { title: 'Get paid in Naira', body: 'Send us your bank details on WhatsApp and we pay you out right away.' },
]

// TODO: placeholder figures — replace with your real numbers before launch.
export const stats = [
  { value: '5–15 min', label: 'Typical deposit time' },
  { value: '24/7', label: 'Live Deriv charts' },
  { value: '7 days', label: 'Support every week' },
  { value: '4.8/5', label: 'Average customer rating' },
]

// TODO: placeholder testimonials — replace with real customer reviews (with permission).
export const testimonials = [
  {
    quote: 'I deposited to my Deriv account on a Sunday night and it was funded before I finished my tea.',
    name: 'Customer name',
    role: 'Lagos',
  },
  {
    quote: 'Withdrawals are smooth. I approve it on Deriv, send my bank details, and the Naira lands quickly.',
    name: 'Customer name',
    role: 'Abuja',
  },
  {
    quote: 'They answered me on WhatsApp in a minute and walked me through my first withdrawal. Very easy.',
    name: 'Customer name',
    role: 'Port Harcourt',
  },
]

export const faqs = [
  {
    q: 'What is a Deriv payment agent?',
    a: 'A payment agent is a business approved by Deriv to help clients deposit and withdraw using local payment methods. You pay us in Naira and we fund your Deriv account, or you withdraw to us on Deriv and we pay you in Naira.',
  },
  {
    q: 'How long does a deposit take?',
    a: 'Most deposits are completed within 5–15 minutes after we confirm your payment.',
  },
  {
    q: 'How do I withdraw from Deriv to Plero?',
    a: 'In Deriv go to Cashier → Payment agents → Withdraw, choose Plero Technologies (or enter our agent ID), enter the amount and confirm the email Deriv sends you. Then send us your bank details on WhatsApp.',
  },
  {
    q: 'I don’t have a Deriv account yet. What do I do?',
    a: 'Use the “Register on Deriv” button on this site to create a free account, then message us to make your first deposit.',
  },
  {
    q: 'Are the live charts real?',
    a: 'Yes. The charts stream live prices directly from Deriv’s public market data feed.',
  },
  {
    q: 'What is Plero Pay?',
    a: 'Plero Pay is our payments service. You can buy and sell USDT and Airtm USD for Naira, and pay suppliers in China (Alipay, WeChat Pay or Chinese bank) in RMB.',
  },
  {
    q: 'Do you still buy gift cards?',
    a: 'Yes. Check the Gift cards page for today’s rates and use the calculator to see your payout.',
  },
]
