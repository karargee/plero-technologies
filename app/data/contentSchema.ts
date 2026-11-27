// Describes every editable content section so /admin can build the forms automatically.
import type { ContentKey } from './defaults'
import { iconOptions } from './content'

export type Field =
  | { key: string; label: string; type: 'text' | 'url' | 'email'; hint?: string; placeholder?: string }
  | { key: string; label: string; type: 'textarea'; hint?: string; rows?: number }
  | { key: string; label: string; type: 'number'; hint?: string }
  | { key: string; label: string; type: 'toggle'; hint?: string }
  | { key: string; label: string; type: 'select'; options: { value: string; label: string }[]; hint?: string }
  | { key: string; label: string; type: 'image'; hint?: string }
  | { key: string; label: string; type: 'strings'; hint?: string; itemLabel?: string }
  | { key: string; label: string; type: 'list'; fields: Field[]; titleKey: string; itemLabel: string; hint?: string }
  | { key: string; label: string; type: 'group'; fields: Field[]; hint?: string; collapsed?: boolean }

export interface ContentSection {
  key: ContentKey
  title: string
  description: string
  icon: string
  group: 'Site' | 'Pages' | 'Lists' | 'Plero Pay'
  /** page to preview after saving */
  preview: string
  fields: Field[]
}

const heading = (key: string, label: string, collapsed = true): Field => ({
  key,
  label,
  type: 'group',
  collapsed,
  fields: [
    { key: 'eyebrow', label: 'Small label above title', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'text', label: 'Text', type: 'textarea', rows: 3 },
  ],
})

const icons = iconOptions.map((i) => ({ value: i, label: i[0]!.toUpperCase() + i.slice(1) }))
const step: Field[] = [
  { key: 'title', label: 'Step title', type: 'text' },
  { key: 'body', label: 'Description', type: 'textarea', rows: 2 },
]
const faq: Field[] = [
  { key: 'q', label: 'Question', type: 'text' },
  { key: 'a', label: 'Answer', type: 'textarea', rows: 3 },
]

const payTrade = (id: 'usdt' | 'airtm', label: string): Field => ({
  key: id,
  label,
  type: 'group',
  collapsed: true,
  fields: [
    { key: 'name', label: 'Service name', type: 'text' },
    { key: 'short', label: 'Short title (cards)', type: 'text' },
    { key: 'tagline', label: 'Tagline (page title)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { key: 'speed', label: 'Typical time', type: 'text' },
    ...(id === 'usdt' ? [{ key: 'networks', label: 'Supported networks', type: 'strings', itemLabel: 'network' } as Field] : []),
    { key: 'buySteps', label: 'Steps when customer BUYS', type: 'list', fields: step, titleKey: 'title', itemLabel: 'step' },
    { key: 'sellSteps', label: 'Steps when customer SELLS', type: 'list', fields: step, titleKey: 'title', itemLabel: 'step' },
    { key: 'needs', label: 'What customers need', type: 'strings', itemLabel: 'item' },
    { key: 'safety', label: 'Safety tips', type: 'strings', itemLabel: 'tip' },
    { key: 'faqs', label: 'FAQs', type: 'list', fields: faq, titleKey: 'q', itemLabel: 'question' },
  ],
})

export const contentSections: ContentSection[] = [
  {
    key: 'settings',
    title: 'Business details',
    description: 'Name, tagline, WhatsApp, phone, email, socials, CAC/registration, Deriv agent details and sign-up link.',
    icon: 'bank',
    group: 'Site',
    preview: '/support',
    fields: [
      { key: 'name', label: 'Business name', type: 'text' },
      { key: 'tagline', label: 'Tagline (footer & search engines)', type: 'textarea', rows: 2 },
      {
        key: 'contact',
        label: 'Contact',
        type: 'group',
        fields: [
          { key: 'whatsapp', label: 'WhatsApp link', type: 'url', hint: 'Format: https://wa.me/234XXXXXXXXXX (country code, no + or spaces)', placeholder: 'https://wa.me/2348012345678' },
          { key: 'phone', label: 'Phone number', type: 'text', placeholder: '+234 801 234 5678' },
          { key: 'email', label: 'Email', type: 'email' },
          { key: 'address', label: 'Address / city', type: 'text' },
          { key: 'hours', label: 'Opening hours', type: 'text' },
        ],
      },
      {
        key: 'deriv',
        label: 'Deriv payment agent',
        type: 'group',
        fields: [
          { key: 'signupUrl', label: 'Deriv sign-up / affiliate link', type: 'url', hint: 'Every “Register on Deriv” button uses this link.' },
          { key: 'agentName', label: 'Payment agent name (as on Deriv)', type: 'text' },
          { key: 'agentLoginId', label: 'Payment agent ID', type: 'text', placeholder: 'CR1234567' },
          { key: 'agentEmail', label: 'Payment agent email', type: 'email' },
          { key: 'speed', label: 'Typical funding time', type: 'text', placeholder: '5–15 minutes' },
        ],
      },
      {
        key: 'registration',
        label: 'Company registration',
        type: 'group',
        hint: 'Shown as a “Registered business” badge. Leave empty to hide.',
        fields: [
          { key: 'legalName', label: 'Legal company name', type: 'text', placeholder: 'Plero Technologies Limited' },
          { key: 'rcNumber', label: 'CAC RC number', type: 'text', placeholder: 'RC 1234567' },
          { key: 'licences', label: 'Licences / registrations', type: 'strings', itemLabel: 'line' },
        ],
      },
      {
        key: 'socials',
        label: 'Social media',
        type: 'list',
        titleKey: 'label',
        itemLabel: 'social link',
        fields: [
          { key: 'label', label: 'Name', type: 'text', placeholder: 'Instagram' },
          { key: 'href', label: 'Link', type: 'url' },
        ],
      },
    ],
  },
  {
    key: 'announcement',
    title: 'Announcement banner',
    description: 'A banner across the top of every page — for promos, rate changes or holiday hours.',
    icon: 'chat',
    group: 'Site',
    preview: '/',
    fields: [
      { key: 'enabled', label: 'Show the banner', type: 'toggle' },
      { key: 'text', label: 'Message', type: 'textarea', rows: 2 },
      { key: 'linkLabel', label: 'Link text (optional)', type: 'text', placeholder: 'See rates' },
      { key: 'linkUrl', label: 'Link (optional)', type: 'text', placeholder: '/deriv or https://…' },
      {
        key: 'tone',
        label: 'Colour',
        type: 'select',
        options: [
          { value: 'brand', label: 'Plero blue' },
          { value: 'success', label: 'Green' },
          { value: 'warning', label: 'Amber' },
        ],
      },
    ],
  },
  {
    key: 'images',
    title: 'Photos',
    description: 'Replace any photo on the site — upload from your phone or computer.',
    icon: 'cards',
    group: 'Site',
    preview: '/',
    fields: [
      { key: 'hero', label: 'Home — top background (faint)', type: 'image' },
      { key: 'trader', label: 'Home — someone trading', type: 'image' },
      { key: 'paying', label: 'Home — someone paying', type: 'image' },
      { key: 'lagosBand', label: 'Home — “Built in Lagos” band', type: 'image' },
      { key: 'cta', label: 'Closing banner (all pages)', type: 'image' },
      { key: 'phone', label: 'Plero Pay page photo', type: 'image' },
      { key: 'about', label: 'About page photo', type: 'image' },
      { key: 'aboutHeader', label: 'About page header', type: 'image' },
      { key: 'derivHeader', label: 'Deposit & Withdraw page header', type: 'image' },
      { key: 'marketsHeader', label: 'Live charts page header', type: 'image' },
      { key: 'supportHeader', label: 'Support page header', type: 'image' },
    ],
  },
  {
    key: 'home',
    title: 'Home page',
    description: 'Hero headline and every section heading on the home page.',
    icon: 'star',
    group: 'Pages',
    preview: '/',
    fields: [
      {
        key: 'hero',
        label: 'Hero (top of page)',
        type: 'group',
        fields: [
          { key: 'badge', label: 'Small badge', type: 'text' },
          { key: 'titleStart', label: 'Headline', type: 'text' },
          { key: 'highlight', label: 'Highlighted word(s)', type: 'text', hint: 'Shown with the shimmering colour.' },
          { key: 'titleEnd', label: 'Headline ending', type: 'text', hint: 'Usually just “.”' },
          { key: 'text', label: 'Intro text', type: 'textarea', rows: 3 },
          { key: 'primaryCta', label: 'Main button', type: 'text' },
          { key: 'secondaryCta', label: 'Second button', type: 'text' },
          { key: 'points', label: 'Tick points', type: 'strings', itemLabel: 'point' },
        ],
      },
      heading('live', 'Live markets section'),
      heading('steps', 'How it works section'),
      heading('action', 'See it in action section'),
      heading('showcase', 'Phone section'),
      heading('features', 'Why Plero section'),
      heading('lagos', 'Built in Lagos band'),
      heading('register', 'Register on Deriv band'),
      heading('pay', 'Plero Pay section'),
      heading('testimonials', 'Reviews section'),
      heading('faq', 'FAQ section'),
      heading('cta', 'Closing banner'),
    ],
  },
  {
    key: 'pages',
    title: 'Page headers',
    description: 'The big title and intro at the top of every other page.',
    icon: 'check',
    group: 'Pages',
    preview: '/deriv',
    fields: [
      heading('deriv', 'Deposit & Withdraw'),
      heading('pleroPay', 'Plero Pay'),
      heading('markets', 'Live charts'),
      heading('tools', 'Tools'),
      heading('guides', 'Guides'),
      heading('giftCards', 'Gift cards'),
      heading('support', 'Support'),
    ],
  },
  {
    key: 'about',
    title: 'About page',
    description: 'Your story and company values.',
    icon: 'shield',
    group: 'Pages',
    preview: '/about',
    fields: [
      heading('hero', 'Header', false),
      {
        key: 'story',
        label: 'Our story',
        type: 'group',
        fields: [
          { key: 'eyebrow', label: 'Small label', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'lead', label: 'Intro paragraph', type: 'textarea', rows: 3 },
          { key: 'body', label: 'Second paragraph', type: 'textarea', rows: 4 },
        ],
      },
      {
        key: 'values',
        label: 'Values',
        type: 'list',
        titleKey: 'title',
        itemLabel: 'value',
        fields: [
          { key: 'icon', label: 'Icon', type: 'select', options: icons },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'body', label: 'Text', type: 'textarea', rows: 2 },
        ],
      },
    ],
  },
  {
    key: 'features',
    title: 'Features',
    description: 'The “Why Plero” cards on the home page.',
    icon: 'bolt',
    group: 'Lists',
    preview: '/',
    fields: [
      {
        key: 'items',
        label: 'Feature cards',
        type: 'list',
        titleKey: 'title',
        itemLabel: 'feature',
        fields: [
          { key: 'icon', label: 'Icon', type: 'select', options: icons },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'body', label: 'Text', type: 'textarea', rows: 2 },
        ],
      },
    ],
  },
  {
    key: 'stats',
    title: 'Stats',
    description: 'The numbers shown in the “Built in Lagos” band and About page.',
    icon: 'chart',
    group: 'Lists',
    preview: '/',
    fields: [
      {
        key: 'items',
        label: 'Stats',
        type: 'list',
        titleKey: 'label',
        itemLabel: 'stat',
        hint: 'Numbers at the start of a value count up when shown (e.g. “24/7”, “5–15 min”).',
        fields: [
          { key: 'value', label: 'Value', type: 'text', placeholder: '5–15 min' },
          { key: 'label', label: 'Label', type: 'text', placeholder: 'Typical deposit time' },
        ],
      },
    ],
  },
  {
    key: 'steps',
    title: 'Deposit & withdraw steps',
    description: 'The 4-step guides on the home page and Deposit & Withdraw page.',
    icon: 'check',
    group: 'Lists',
    preview: '/deriv',
    fields: [
      { key: 'deposit', label: 'Deposit steps', type: 'list', fields: step, titleKey: 'title', itemLabel: 'step' },
      { key: 'withdraw', label: 'Withdrawal steps', type: 'list', fields: step, titleKey: 'title', itemLabel: 'step' },
    ],
  },
  {
    key: 'faqs',
    title: 'FAQs',
    description: 'Questions and answers shown across the site.',
    icon: 'chat',
    group: 'Lists',
    preview: '/support#faq',
    fields: [{ key: 'items', label: 'Questions', type: 'list', fields: faq, titleKey: 'q', itemLabel: 'question' }],
  },
  {
    key: 'guides',
    title: 'Guides',
    description: 'Write, edit or remove guide articles.',
    icon: 'cards',
    group: 'Lists',
    preview: '/guides',
    fields: [
      {
        key: 'items',
        label: 'Articles',
        type: 'list',
        titleKey: 'title',
        itemLabel: 'guide',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'slug', label: 'Web address', type: 'text', hint: 'Lowercase words with dashes, e.g. how-to-deposit → /guides/how-to-deposit' },
          { key: 'summary', label: 'Summary', type: 'textarea', rows: 2 },
          {
            key: 'category',
            label: 'Category',
            type: 'select',
            options: ['Getting started', 'Payments', 'Trading basics', 'Plero Pay'].map((c) => ({ value: c, label: c })),
          },
          { key: 'minutes', label: 'Reading time (minutes)', type: 'number' },
          {
            key: 'body',
            label: 'Article content',
            type: 'list',
            titleKey: 'text',
            itemLabel: 'block',
            hint: 'For lists, put one item per line.',
            fields: [
              {
                key: 'type',
                label: 'Block type',
                type: 'select',
                options: [
                  { value: 'p', label: 'Paragraph' },
                  { value: 'h', label: 'Heading' },
                  { value: 'ol', label: 'Numbered list' },
                  { value: 'ul', label: 'Bullet list' },
                  { value: 'note', label: 'Highlighted note' },
                ],
              },
              { key: 'text', label: 'Text', type: 'textarea', rows: 4 },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'pay',
    title: 'Plero Pay services',
    description: 'Text, steps, safety tips and FAQs for USDT, Airtm and China payments. (Prices are under Rates.)',
    icon: 'coin',
    group: 'Plero Pay',
    preview: '/plero-pay',
    fields: [
      payTrade('usdt', 'USDT'),
      payTrade('airtm', 'Airtm USD'),
      {
        key: 'china',
        label: 'China supplier payments',
        type: 'group',
        collapsed: true,
        fields: [
          { key: 'name', label: 'Service name', type: 'text' },
          { key: 'short', label: 'Short title (cards)', type: 'text' },
          { key: 'tagline', label: 'Tagline (page title)', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
          { key: 'speed', label: 'Typical time', type: 'text' },
          { key: 'methods', label: 'Payment methods', type: 'strings', itemLabel: 'method' },
          { key: 'steps', label: 'Steps', type: 'list', fields: step, titleKey: 'title', itemLabel: 'step' },
          { key: 'needs', label: 'What customers need', type: 'strings', itemLabel: 'item' },
          { key: 'safety', label: 'Safety tips', type: 'strings', itemLabel: 'tip' },
          { key: 'faqs', label: 'FAQs', type: 'list', fields: faq, titleKey: 'q', itemLabel: 'question' },
        ],
      },
    ],
  },
]
