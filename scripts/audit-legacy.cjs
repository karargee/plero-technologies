// Which pages are still on legacy markup vs. the new design system?
const BASE = 'http://127.0.0.1:3111'

const PAGES = [
  '/', '/rates', '/cards', '/how-it-works', '/about', '/support',
  '/login', '/register', '/home', '/buy', '/sell', '/orders', '/profile',
  '/card/deriv',
]

// Markers of the pre-redesign build.
const LEGACY = {
  'legacy red .red': /class="red"/,
  'btn-red': /btn-red/,
  'hero-tag': /hero-tag/,
  'deriv-banner': /deriv-banner/,
  'ticker-label': /ticker-label/,
  'cat-tab': /class="cat-tab/,
  'feat-grid (legacy)': /class="feat-grid"/,
  'steps-grid (legacy)': /class="steps-grid"/,
  'red rgba literal': /rgba\(255,\s*68,\s*79/,
}

// Markers of the new system.
const MODERN = {
  'btn-grad/btn-primary': /btn-(grad|primary)/,
  'glass surface': /class="[^"]*glass/,
  'section-head': /section-head/,
  'grad-text': /grad-text/,
  'eyebrow': /class="eyebrow"/,
}

const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E0}-\u{1F1FF}]/u

;(async () => {
  console.log('page              legacy-markers                        emoji  modern-markers')
  console.log('-'.repeat(96))
  let allClean = true

  for (const p of PAGES) {
    const res = await fetch(BASE + p)
    if (res.status !== 200) {
      console.log(p.padEnd(17) + 'HTTP ' + res.status)
      allClean = false
      continue
    }
    const html = await res.text()
    const legacy = Object.entries(LEGACY).filter(([, re]) => re.test(html)).map(([k]) => k)
    const modern = Object.entries(MODERN).filter(([, re]) => re.test(html)).map(([k]) => k)
    const em = emoji.test(html)

    if (legacy.length) allClean = false
    console.log(
      p.padEnd(17) +
      (legacy.length ? legacy.slice(0, 3).join(', ') + (legacy.length > 3 ? ` +${legacy.length - 3}` : '') : '— none —').padEnd(38) +
      '  ' + (em ? 'YES ' : ' no ') +
      '  ' + modern.length + '/5',
    )
  }

  console.log('\n' + (allClean
    ? 'Every page is free of legacy markup.'
    : 'Pages still carrying legacy markup are listed above.'))
})()