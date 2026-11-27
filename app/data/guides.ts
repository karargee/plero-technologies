// Guides shown at /guides. Each body is a list of simple blocks so you can add articles
// without touching any page code.

export type Block =
  | { h: string }
  | { p: string }
  | { ol: string[] }
  | { ul: string[] }
  | { note: string }

export interface Guide {
  slug: string
  title: string
  summary: string
  category: 'Getting started' | 'Payments' | 'Trading basics'
  minutes: number
  body: Block[]
}

export const guides: Guide[] = [
  {
    slug: 'create-a-deriv-account',
    title: 'How to create a Deriv account',
    summary: 'Open a free Deriv account in a few minutes and get a demo account to practise with.',
    category: 'Getting started',
    minutes: 3,
    body: [
      { p: 'A Deriv account is free to open. You get a demo account with virtual money straight away, and a real account you can fund through Plero.' },
      { h: 'Step by step' },
      {
        ol: [
          'Click any “Register on Deriv” button on this site.',
          'Enter your email address and confirm it using the link Deriv sends you.',
          'Choose your country of residence and create a strong password.',
          'Fill in your personal details exactly as they appear on your ID — this matters later for verification and withdrawals.',
          'Choose USD as your account currency.',
        ],
      },
      { h: 'Your Deriv account ID' },
      { p: 'Your real account has an ID that starts with “CR” (for example CR1234567). You will find it at the top of your Deriv dashboard. Send us this ID when you want to deposit.' },
      { note: 'Use your real name and details. Deriv may ask you to verify your identity before you can withdraw, and the details must match.' },
    ],
  },
  {
    slug: 'verify-your-deriv-account',
    title: 'How to verify your Deriv account',
    summary: 'What Deriv asks for when verifying your identity and address, and how to avoid delays.',
    category: 'Getting started',
    minutes: 3,
    body: [
      { p: 'Deriv may ask you to verify your account, usually before your first withdrawal or once you reach certain limits. Doing it early means no surprises later.' },
      { h: 'What you will usually need' },
      {
        ul: [
          'Proof of identity: a valid government-issued ID such as an international passport, driver’s licence or national ID card.',
          'Proof of address: a recent document showing your name and address, such as a utility bill or bank statement (usually from the last few months).',
          'Sometimes a selfie, to match your face to your ID.',
        ],
      },
      { h: 'Where to do it' },
      { p: 'Log in to Deriv, open your account settings and look for the Verification section. Upload clear, uncropped photos where every corner of the document is visible.' },
      { note: 'Make sure the name on your documents matches the name on your Deriv account exactly. Mismatches are the most common reason for rejection.' },
    ],
  },
  {
    slug: 'deposit-with-a-payment-agent',
    title: 'Depositing to Deriv through Plero',
    summary: 'Fund your Deriv account in Naira through our payment agent service.',
    category: 'Payments',
    minutes: 2,
    body: [
      { p: 'As a Deriv payment agent, we can move USD into your Deriv account after you pay us in Naira. Here is exactly how it works.' },
      {
        ol: [
          'Use the calculator on our Deposit & Withdraw page to see how much Naira you will pay.',
          'Message us on WhatsApp with the USD amount and your Deriv account ID (CR number).',
          'We send you our bank details. Transfer the Naira amount and send us the receipt.',
          'We transfer the USD to your Deriv account through Deriv’s payment agent system.',
          'Check your Deriv balance — it usually arrives within minutes.',
        ],
      },
      { note: 'Only pay into bank details we send you from our official WhatsApp number shown on this site. We will never ask for your Deriv password.' },
    ],
  },
  {
    slug: 'withdraw-with-a-payment-agent',
    title: 'Withdrawing from Deriv through Plero',
    summary: 'Withdraw your Deriv balance to us and receive Naira in your bank account.',
    category: 'Payments',
    minutes: 3,
    body: [
      { p: 'Withdrawals are started by you inside Deriv’s own cashier, so you stay in control of your money at every step.' },
      {
        ol: [
          'Log in to Deriv and open the Cashier.',
          'Choose Payment agents, then Withdraw.',
          'Select Plero Technologies from the list, or enter our payment agent ID (shown on our Deposit & Withdraw page).',
          'Enter the amount and submit.',
          'Deriv sends a confirmation link to your email — open it to approve the withdrawal.',
          'Message us on WhatsApp with the amount and your bank details. We pay you in Naira.',
        ],
      },
      { note: 'If you don’t see the payment agent option, your account may need to be verified first. See our verification guide.' },
    ],
  },
  {
    slug: 'what-are-synthetic-indices',
    title: 'What are synthetic indices?',
    summary: 'Volatility, Boom & Crash, Step and Jump indices explained in plain English.',
    category: 'Trading basics',
    minutes: 4,
    body: [
      { p: 'Synthetic indices are markets created by Deriv that are not tied to any real-world asset. Their prices are generated by an algorithm designed to be random, and they trade 24/7 — including weekends and holidays.' },
      { h: 'The main types' },
      {
        ul: [
          'Volatility indices (e.g. Volatility 75, Volatility 100): the number describes how much the price tends to move. Higher numbers move more. “(1s)” versions produce a new price every second.',
          'Boom & Crash indices: mostly drift in one direction, with sudden spikes. Boom spikes up, Crash spikes down. Boom 1000 has a spike on average once every 1,000 ticks.',
          'Step Index: moves up or down by a fixed small step on every tick.',
          'Jump indices: have sudden jumps in either direction, on average a few times per hour.',
        ],
      },
      { h: 'Why traders like them' },
      { p: 'They are always open, they are not moved by news, and they have predictable volatility profiles. But they can move fast — Volatility 75 in particular can wipe out a small account quickly.' },
      { note: 'Watch any of these markets live on our Live charts page before you trade them.' },
    ],
  },
  {
    slug: 'managing-risk',
    title: 'Five rules for managing risk',
    summary: 'Simple habits that protect your account while you learn to trade.',
    category: 'Trading basics',
    minutes: 3,
    body: [
      { p: 'Trading derivatives is high-risk and most beginners lose money. These rules will not make you profitable on their own, but they help you survive long enough to learn.' },
      {
        ol: [
          'Practise on a demo account first. Deriv gives you one for free.',
          'Risk only a small part of your balance on each trade — many traders use 1–2%. Our position size calculator does the maths for you.',
          'Always use a stop loss, and decide where it goes before you enter.',
          'Never deposit money you need for rent, food or school fees.',
          'Don’t try to “win it back” after a loss. Take a break.',
        ],
      },
      { note: 'Plero Technologies is a payment agent, not an investment adviser. Nothing here is financial advice.' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Editable format used by /admin → Content → Guides.
// Lists are stored as text with one item per line.
// ---------------------------------------------------------------------------
export type BlockType = 'h' | 'p' | 'ol' | 'ul' | 'note'
export interface EditableBlock {
  type: BlockType
  text: string
}
export interface EditableGuide extends Omit<Guide, 'body' | 'category'> {
  category: string
  body: EditableBlock[]
}

function toEditable(b: Block): EditableBlock {
  if ('h' in b) return { type: 'h', text: b.h }
  if ('p' in b) return { type: 'p', text: b.p }
  if ('ol' in b) return { type: 'ol', text: b.ol.join('\n') }
  if ('ul' in b) return { type: 'ul', text: b.ul.join('\n') }
  return { type: 'note', text: b.note }
}

export const guideDefaults: EditableGuide[] = guides.map((g) => ({ ...g, body: g.body.map(toEditable) }))
