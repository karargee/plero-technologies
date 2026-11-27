// ---------------------------------------------------------------------------
// Default wording for every editable part of the site.
// The admin (/admin → Content) can override any of it; these are the fallbacks.
// ---------------------------------------------------------------------------

export interface Heading {
  eyebrow: string
  title: string
  text: string
}

export const homeDefaults = {
  hero: {
    badge: 'Deriv payment agent · Nigeria',
    titleStart: 'Fund & withdraw your Deriv account in',
    highlight: 'Naira',
    titleEnd: '.',
    text: 'Plero Technologies tops up your Deriv account in minutes and pays out your withdrawals straight to your bank — with clear rates and a real person on WhatsApp.',
    primaryCta: 'Deposit or withdraw',
    secondaryCta: 'Register on Deriv',
    points: ['Funded in 5–15 minutes', 'Fixed, published rates', 'Live Deriv charts'],
  },
  live: {
    eyebrow: 'Live markets',
    title: 'Watch Deriv markets move in real time',
    text: 'Follow Volatility indices, Boom & Crash, forex, gold and crypto — streamed live from Deriv, right here on our site.',
  } as Heading,
  steps: {
    eyebrow: 'How it works',
    title: 'Deposit or withdraw in four simple steps',
    text: 'Everything runs through Deriv’s own payment agent system.',
  } as Heading,
  action: {
    eyebrow: 'See it in action',
    title: 'Trade on Deriv. Pay with Plero. All from your phone.',
    text: 'Fund your account, watch the markets and move your money — in minutes, not days.',
  } as Heading,
  showcase: {
    eyebrow: 'Built for your phone',
    title: 'Everything you need, wherever you trade',
    text: 'Check live prices, work out your rate and message us to deposit or withdraw — all from your phone, in a couple of taps.',
  } as Heading,
  features: {
    eyebrow: 'Why Plero',
    title: 'The easy way to move money in and out of Deriv',
    text: 'Fair rates, fast transfers and people who actually answer when you need them.',
  } as Heading,
  lagos: {
    eyebrow: 'Proudly Nigerian',
    title: 'Built in Lagos. Serving Deriv traders across Nigeria.',
    text: 'From Lagos to Abuja to Port Harcourt — wherever you trade, your deposits and withdrawals are handled by a local team that understands Naira, local banks and your time.',
  } as Heading,
  register: {
    eyebrow: 'New to Deriv?',
    title: 'Create your free Deriv account in 2 minutes',
    text: 'Sign up with our link, then message us to fund your account in Naira. We’ll guide you through your first deposit step by step.',
  } as Heading,
  pay: {
    eyebrow: 'Plero Pay',
    title: 'More ways to move your money',
    text: 'Beyond Deriv, Plero Pay helps you buy and sell USDT and Airtm USD, and pay your suppliers in China — all in Naira, with the same fast, honest service.',
  } as Heading,
  testimonials: {
    eyebrow: 'Customers',
    title: 'What people say about trading with us',
    text: 'Real reviews from Plero customers. Traded with us? We’d love to hear from you.',
  } as Heading,
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions, answered',
    text: 'Can’t find what you need?',
  } as Heading,
  cta: {
    eyebrow: '',
    title: 'Ready to fund your Deriv account?',
    text: 'Message us with the amount and your Deriv ID — you could be trading in minutes.',
  } as Heading,
}

export const pagesDefaults = {
  deriv: {
    eyebrow: 'Deriv payment agent',
    title: 'Deposit and withdraw on Deriv — in Naira.',
    text: 'Today’s rates, step-by-step guides and our payment agent details. Fast, with a real person on WhatsApp if you need help.',
  } as Heading,
  pleroPay: {
    eyebrow: 'Plero Pay',
    title: 'Move money your way — in Naira.',
    text: 'Buy & sell USDT, Airtm USD and pay Chinese suppliers — in Naira. Clear rates, fast delivery and a real person on WhatsApp.',
  } as Heading,
  markets: {
    eyebrow: 'Live charts',
    title: 'Live Deriv markets',
    text: 'Real-time prices streamed from Deriv. Pick a market, switch between ticks and 1-minute candles.',
  } as Heading,
  tools: {
    eyebrow: 'Tools',
    title: 'Free calculators for Deriv traders.',
    text: 'Size your trades, check your profit or loss, and plan deposits and withdrawals in Naira.',
  } as Heading,
  guides: {
    eyebrow: 'Guides',
    title: 'Learn the basics, step by step.',
    text: 'Plain-English guides to opening a Deriv account, moving money in and out, and trading more safely.',
  } as Heading,
  giftCards: {
    eyebrow: 'Gift cards',
    title: 'Sell your gift cards',
    text: 'The rate you see is what you get paid — no hidden fees.',
  } as Heading,
  support: {
    eyebrow: 'Support',
    title: 'We’re here to help.',
    text: 'Questions about a Deriv deposit, a withdrawal or a gift card? Reach a real person on any channel below.',
  } as Heading,
}

export const aboutDefaults = {
  hero: {
    eyebrow: 'About',
    title: 'We make moving money in and out of Deriv simple.',
    text: 'Plero Technologies is a Deriv payment agent. We started with a simple idea: funding or withdrawing from your trading account should be as easy and as trustworthy as sending a bank transfer.',
  } as Heading,
  story: {
    eyebrow: 'Our story',
    title: 'Fair rates, real people, fast transfers',
    lead: 'Too many traders struggle to fund their Deriv accounts locally — unclear rates, slow transfers, or agents who disappear. We built Plero to fix that.',
    body: 'Every deposit and withdrawal runs through Deriv’s own payment agent system, our rates are published openly, and our support team is a real group of people you can message any time. We also buy gift cards, with the same honest treatment.',
  },
  values: [
    { icon: 'chart', title: 'Honest pricing', body: 'We publish our rates openly and stick to them.' },
    { icon: 'bolt', title: 'Speed matters', body: 'Your time is valuable, so we pay out as fast as we can verify.' },
    { icon: 'shield', title: 'Trust first', body: 'We protect your data and treat every trade with care.' },
  ],
}

export const announcementDefaults = {
  enabled: false,
  text: '',
  linkLabel: '',
  linkUrl: '',
  tone: 'brand' as 'brand' | 'success' | 'warning',
}

/** Every photo on the site. The admin can upload a replacement for any of them. */
export const imagesDefaults = {
  hero: '/images/lagos-aerial.webp',
  trader: '/images/trader.webp',
  paying: '/images/paying.webp',
  phone: '/images/phone-hands.webp',
  about: '/images/lekki-bridge-sm.webp',
  lagosBand: '/images/lagos-aerial.webp',
  cta: '/images/lekki-bridge-sm.webp',
  derivHeader: '/images/lagos-aerial.webp',
  marketsHeader: '/images/trading-laptop.webp',
  supportHeader: '/images/lekki-bridge.webp',
  aboutHeader: '/images/lagos-aerial.webp',
}

/** Icons available to the admin for features / values. */
export const iconOptions = ['bolt', 'bank', 'shield', 'chart', 'chat', 'cards', 'coin', 'wallet', 'globe', 'check', 'clock', 'star']
