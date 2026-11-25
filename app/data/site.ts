// ---------------------------------------------------------------------------
// Site content lives here so you can edit copy, rates and contacts in one place.
// Anything marked TODO is a placeholder — replace it with your real details.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Plero Technologies',
  short: 'Plero',
  tagline: 'Turn unused gift cards into cash — fast, fair and safe.',
  currency: { code: 'NGN', symbol: '₦' }, // TODO: confirm your payout currency
  contact: {
    email: 'support@plerotechnologies.com', // TODO: real support email
    phone: '+234 800 000 0000', // TODO: real phone number
    whatsapp: 'https://wa.me/2348000000000', // TODO: real WhatsApp link
    address: 'Lagos, Nigeria', // TODO: real address
    hours: 'Every day, 8:00am – 11:00pm',
  },
  socials: [
    { label: 'Instagram', href: '#' }, // TODO
    { label: 'X (Twitter)', href: '#' }, // TODO
    { label: 'Facebook', href: '#' }, // TODO
  ],
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'Rates', to: '/rates' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'Support', to: '/support' },
]

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

// TODO: sample rates only — connect these to your live rate source.
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

export const features = [
  {
    icon: 'bolt',
    title: 'Paid in minutes',
    body: 'Most trades are verified and paid out to your bank account in under 15 minutes.',
  },
  {
    icon: 'chart',
    title: 'Transparent rates',
    body: 'The rate you see is the rate you get. No hidden fees, no last-minute changes.',
  },
  {
    icon: 'shield',
    title: 'Safe & verified',
    body: 'Every card is checked by our trade desk, and your details are never shared.',
  },
  {
    icon: 'chat',
    title: 'Real human support',
    body: 'Talk to a real person on WhatsApp or email whenever you need help with a trade.',
  },
  {
    icon: 'cards',
    title: 'Dozens of cards',
    body: 'Apple, Amazon, Steam, Google Play, Razer Gold and many more — physical or e-code.',
  },
  {
    icon: 'bank',
    title: 'Direct to your bank',
    body: 'Payouts go straight to any local bank account you choose.',
  },
]

export const steps = [
  {
    title: 'Check the rate',
    body: 'Pick your card type and enter the amount to see exactly what you will receive.',
  },
  {
    title: 'Send your card',
    body: 'Share a clear photo of the card or the e-code with our trade desk.',
  },
  {
    title: 'We verify it',
    body: 'Our team confirms the card balance — usually within a few minutes.',
  },
  {
    title: 'Get paid',
    body: 'The money lands in your bank account. Done.',
  },
]

// TODO: placeholder figures — replace with your real numbers before launch.
export const stats = [
  { value: '15 min', label: 'Average payout time' },
  { value: '30+', label: 'Gift card types accepted' },
  { value: '24/7', label: 'Trade desk availability' },
  { value: '4.8/5', label: 'Average customer rating' },
]

// TODO: placeholder testimonials — replace with real customer reviews (with permission).
export const testimonials = [
  {
    quote:
      'I sold an Apple card on my lunch break and the money was in my account before I finished eating.',
    name: 'Customer name',
    role: 'Lagos',
  },
  {
    quote:
      'The rate on the site was exactly what I got paid. No back-and-forth, no surprises. That is rare.',
    name: 'Customer name',
    role: 'Abuja',
  },
  {
    quote:
      'Support answered me on WhatsApp in a minute and walked me through my first trade. Very easy.',
    name: 'Customer name',
    role: 'Port Harcourt',
  },
]

export const faqs = [
  {
    q: 'How long does it take to get paid?',
    a: 'Most trades are completed in under 15 minutes once your card is verified. Large or unusual cards can take a little longer.',
  },
  {
    q: 'Which gift cards do you accept?',
    a: 'We accept Apple/iTunes, Amazon, Steam, Google Play, Razer Gold, Sephora, eBay, Nordstrom, Walmart, Vanilla and more. Check the Rates page for the full list.',
  },
  {
    q: 'Are there any fees?',
    a: 'No. The payout shown in the rate calculator is what you receive. We do not charge extra fees.',
  },
  {
    q: 'Do you accept e-codes and physical cards?',
    a: 'Yes. Send a clear photo of a physical card (with the receipt if available) or paste the e-code.',
  },
  {
    q: 'Why might a card be rejected?',
    a: 'Cards that have already been redeemed, have a zero balance, or come from an unsupported region cannot be traded. We will always tell you why.',
  },
  {
    q: 'Is my information safe?',
    a: 'Yes. We only use your details to process your trade and pay you, and we never share them with third parties.',
  },
]
