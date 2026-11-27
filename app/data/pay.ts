// ---------------------------------------------------------------------------
// Plero Pay by Plero Technologies — USDT, Airtm USD and China supplier payments.
// Rates are placeholders (TODO) — set your real buy/sell rates before launch.
// ---------------------------------------------------------------------------

export type PayId = 'usdt' | 'airtm' | 'china'

export interface Step {
  title: string
  body: string
}

interface Base {
  id: PayId
  name: string
  short: string
  tagline: string
  description: string
  icon: string
  symbol: string
  color: string
  speed: string
  needs: string[]
  safety: string[]
  faqs: { q: string; a: string }[]
}

/** USDT and Airtm: you buy from us / sell to us. */
export interface TradeService extends Base {
  kind: 'trade'
  unit: string
  /** Naira the customer pays per 1 unit when BUYING from Plero. */
  buyRate: number
  /** Naira Plero pays per 1 unit when the customer SELLS to Plero. */
  sellRate: number
  min: number
  max: number
  networks?: string[]
  buySteps: Step[]
  sellSteps: Step[]
}

/** China payments: customer pays Naira, we pay the supplier in RMB. */
export interface SupplierService extends Base {
  kind: 'supplier'
  unit: string
  /** Naira per ¥1. */
  rate: number
  /** Flat service fee in Naira per payment. */
  fee: number
  min: number
  max: number
  methods: string[]
  steps: Step[]
}

export type PayService = TradeService | SupplierService

export const payBrand = {
  name: 'Plero Pay',
  by: 'by Plero Technologies',
  tagline: 'Buy & sell USDT, Airtm USD and pay Chinese suppliers — in Naira.',
}

export const payServices: PayService[] = [
  {
    id: 'usdt',
    kind: 'trade',
    name: 'USDT',
    short: 'Buy & sell USDT',
    tagline: 'Buy or sell USDT (Tether) for Naira at clear rates, paid fast.',
    description:
      'Need dollars for trading, online payments or savings? Buy USDT from us with Naira, or sell your USDT and get Naira in your bank account.',
    icon: 'coin',
    symbol: '₮',
    color: '#1a9e75',
    unit: 'USDT',
    buyRate: 1665, // TODO: Naira per 1 USDT when customer buys
    sellRate: 1600, // TODO: Naira per 1 USDT when customer sells
    min: 10, // TODO
    max: 10000, // TODO
    speed: '5–20 minutes',
    networks: ['TRC20 (Tron)', 'BEP20 (BNB Smart Chain)'], // TODO: networks you support
    buySteps: [
      { title: 'Get a quote', body: 'Use the calculator, then message us the amount of USDT you want.' },
      { title: 'Share your wallet', body: 'Send your USDT wallet address and the network (e.g. TRC20). Double-check it.' },
      { title: 'Pay in Naira', body: 'Transfer the Naira amount to the account we give you and send the receipt.' },
      { title: 'Receive USDT', body: 'We send the USDT to your wallet and share the transaction ID (TXID).' },
    ],
    sellSteps: [
      { title: 'Get a quote', body: 'Use the calculator, then message us how much USDT you want to sell.' },
      { title: 'Get our address', body: 'We send you our wallet address and the exact network to use.' },
      { title: 'Send USDT', body: 'Send the USDT on that network only and share the TXID with us.' },
      { title: 'Get paid in Naira', body: 'Once it confirms on the blockchain, we pay Naira to your bank.' },
    ],
    needs: [
      'Your USDT wallet address (when buying)',
      'The network you are using — e.g. TRC20 or BEP20',
      'Your bank account details (when selling)',
      'A valid ID for larger amounts',
    ],
    safety: [
      'Always send on the exact network we tell you. Crypto sent on the wrong network can be lost forever.',
      'Only use wallet addresses we send from our official WhatsApp number — never from a stranger.',
      'Blockchain transactions cannot be reversed. Check every address before you send.',
    ],
    faqs: [
      { q: 'Which networks do you support?', a: 'We support TRC20 (Tron) and BEP20 (BNB Smart Chain). Tell us your network before any trade.' },
      { q: 'How long does it take?', a: 'Most trades complete in 5–20 minutes, depending on network confirmations.' },
      { q: 'Is there a minimum?', a: 'Yes — see the limits next to the calculator. Contact us for amounts above the maximum.' },
      { q: 'What if I send on the wrong network?', a: 'Contact us immediately. In many cases funds sent on the wrong network cannot be recovered, so always confirm first.' },
    ],
  },
  {
    id: 'airtm',
    kind: 'trade',
    name: 'Airtm USD',
    short: 'Buy & sell Airtm USD',
    tagline: 'Fund or cash out your Airtm dollar balance in Naira.',
    description:
      'Get paid in Airtm by clients or platforms? Sell your Airtm USD to us for Naira. Need dollars in Airtm? Buy them from us with Naira.',
    icon: 'wallet',
    symbol: 'A',
    color: '#2563eb',
    unit: 'USD',
    buyRate: 1660, // TODO: Naira per $1 Airtm when customer buys
    sellRate: 1590, // TODO: Naira per $1 Airtm when customer sells
    min: 10, // TODO
    max: 5000, // TODO
    speed: '10–30 minutes',
    buySteps: [
      { title: 'Get a quote', body: 'Use the calculator, then message us the USD amount you want in Airtm.' },
      { title: 'Share your Airtm details', body: 'Send the email or username on your Airtm account.' },
      { title: 'Pay in Naira', body: 'Transfer the Naira amount and send us the receipt.' },
      { title: 'Receive Airtm USD', body: 'We send the USD to your Airtm account and confirm with you.' },
    ],
    sellSteps: [
      { title: 'Get a quote', body: 'Use the calculator, then message us how much Airtm USD you want to sell.' },
      { title: 'Get our Airtm details', body: 'We send you the Airtm account to transfer to.' },
      { title: 'Send the USD', body: 'Transfer on Airtm and share the confirmation screenshot.' },
      { title: 'Get paid in Naira', body: 'We confirm receipt and pay Naira to your bank account.' },
    ],
    needs: [
      'Your Airtm email or username',
      'Your bank account details (when selling)',
      'A screenshot of the Airtm transfer confirmation',
    ],
    safety: [
      'Only send to Airtm details we give you on our official WhatsApp number.',
      'Never share your Airtm password or one-time codes with anyone — including us.',
    ],
    faqs: [
      { q: 'What is Airtm?', a: 'Airtm is a digital dollar wallet many freelancers and online earners use to receive and hold USD.' },
      { q: 'How fast is it?', a: 'Most Airtm trades complete within 10–30 minutes during business hours.' },
      { q: 'Do I need a verified Airtm account?', a: 'Airtm may limit unverified accounts. Verifying your Airtm account helps avoid delays.' },
    ],
  },
  {
    id: 'china',
    kind: 'supplier',
    name: 'China supplier payments',
    short: 'Pay Chinese suppliers',
    tagline: 'Pay suppliers in China in RMB — you pay us in Naira.',
    description:
      'Importing from China? Pay your suppliers on Alipay, WeChat Pay or by Chinese bank transfer. You pay us in Naira and we pay your supplier in RMB, with proof of payment.',
    icon: 'globe',
    symbol: '¥',
    color: '#d6342c',
    unit: 'CNY',
    rate: 236, // TODO: Naira per ¥1
    fee: 5000, // TODO: flat service fee in Naira per payment
    min: 500, // TODO: minimum in ¥
    max: 500000, // TODO: maximum in ¥
    speed: 'Same day (usually within a few hours)',
    methods: ['Alipay', 'WeChat Pay', 'Chinese bank transfer (RMB)'],
    steps: [
      { title: 'Send supplier details', body: 'Share the invoice and your supplier’s Alipay, WeChat Pay or bank details.' },
      { title: 'Get your Naira quote', body: 'We confirm the RMB amount and exactly how much Naira to pay, including our fee.' },
      { title: 'Pay in Naira', body: 'Transfer the Naira to the account we give you and send the receipt.' },
      { title: 'We pay your supplier', body: 'We pay the supplier in RMB and send you proof of payment to share with them.' },
    ],
    needs: [
      'The supplier’s invoice or order (e.g. from 1688, Alibaba or a factory)',
      'Supplier payment details: Alipay ID, WeChat Pay QR code, or Chinese bank account (name, bank, account number)',
      'The exact amount in RMB (¥)',
      'Your name and phone number for the receipt',
    ],
    safety: [
      'Confirm the supplier’s details with them directly before payment — scammers sometimes change bank details.',
      'Payments to suppliers cannot be reversed once made. Check every detail.',
      'We always send proof of payment. Keep it for your records.',
    ],
    faqs: [
      { q: 'Which payment methods can you pay to?', a: 'Alipay, WeChat Pay and Chinese bank accounts (RMB).' },
      { q: 'How long does a supplier payment take?', a: 'Usually the same day — often within a few hours of receiving your Naira payment.' },
      { q: 'Do I get proof of payment?', a: 'Yes. We send a payment screenshot or bank slip that you can forward to your supplier.' },
      { q: 'Can you pay 1688 or Alibaba sellers?', a: 'Yes, as long as the seller gives you Alipay, WeChat Pay or Chinese bank details.' },
    ],
  },
]

export const getPayService = (id: string) => payServices.find((s) => s.id === id)
