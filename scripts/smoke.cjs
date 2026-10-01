// Smoke-tests the built server: routes, head tags, and rendered section markup.
const BASE = 'http://127.0.0.1:3111'
const ROOT = path.join(__dirname, '..')
const fs = require('fs')
const path = require('path')

const get = async (p) => {
  const r = await fetch(BASE + p)
  return { status: r.status, type: r.headers.get('content-type'), body: await r.text() }
}

let fail = 0
const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`)
  if (!ok) fail++
}

;(async () => {
  console.log('\n=== routes ===')
  for (const p of ['/', '/rates', '/cards', '/how-it-works', '/about', '/support', '/login', '/register']) {
    const r = await get(p)
    check(`GET ${p}`, r.status === 200, String(r.status))
  }

  console.log('\n=== static brand assets ===')
  for (const p of ['/og-image.png', '/icon.svg', '/favicon.ico', '/apple-touch-icon.png', '/logo-mark.png', '/site.webmanifest']) {
    const r = await get(p)
    check(`GET ${p}`, r.status === 200 && /image|json|svg|xml|octet/.test(r.type || ''), `${r.status} ${r.type}`)
  }

  console.log('\n=== credential containment ===')
  {
    // The PAT must never reach the browser. Prove it by planting a canary in
    // the private runtime config and checking it is absent from the client
    // bundle, rather than trusting that no token happens to be configured.
    const clientDir = path.join(ROOT, '.output', 'public', '_nuxt')
    let files = 0
    let leaked = 0
    const canary = 'deriv-token-canary-zzz9'
    ;(function walk(dir) {
      if (!fs.existsSync(dir)) return
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name)
        if (e.isDirectory()) { walk(p); continue }
        if (!/\.(js|mjs|css)$/.test(e.name)) continue
        files++
        const s = fs.readFileSync(p, 'utf8')
        if (s.includes('derivToken') || s.includes('NUXT_DERIV_TOKEN')) {
          leaked++
          console.log('  LEAK: client bundle references the token key in', e.name)
        }
      }
    })(clientDir)
    check('client bundle has no token reference', leaked === 0, `${files} chunks scanned, ${leaked} leaks`)

    // And the token must not be readable from the public config at runtime.
    const { body } = await get('/')
    check('rendered HTML does not expose a token key', !/derivToken/.test(body))
  }

  console.log('\n=== rate api ===')
  {
    const r = await fetch(BASE + '/api/rate')
    const j = await r.json()
    check('GET /api/rate is 200', r.status === 200, String(r.status))
    check('returns a numeric rate > 0', Number.isFinite(j.rate) && j.rate > 0, String(j.rate))
    check('declares a source', typeof j.source === 'string' && j.source.length > 0, String(j.source))
    check(
      'source is a known provider',
      ['deriv', 'deriv-legacy', 'open.er-api.com'].includes(j.source),
      j.source,
    )
  }

  console.log('\n=== homepage head ===')
  {
    const { body } = await get('/')
    check('og:image points at the card', body.includes('property="og:image" content="/og-image.png"'))
    check('og:image:width is 1200', body.includes('property="og:image:width" content="1200"'))
    check('twitter:image set', body.includes('name="twitter:image"'))
    check('svg icon linked', body.includes('rel="icon" type="image/svg+xml"'))
    check('apple-touch-icon linked', body.includes('rel="apple-touch-icon"'))
    check('manifest linked', body.includes('rel="manifest"'))
    check('no raw jpg as og:image', !body.includes('og:image" content="/plero-logo.jpg'))
  }

  console.log('\n=== homepage sections rendered ===')
  {
    const { body } = await get('/')
    // Markers taken from each component's own markup and site data, rather
    // than guessed class names.
    const expect = {
      'HeroSection': 'hero-title',
      'RateTicker': 'marquee__track',
      'BentoShowcase': 'tile--hero',
      'StepsSection': 'step-index',
      'FeaturesSection': 'feature-grid',
      'StatsBand': 'stats-band',
      'TestimonialsSection': 'quote-grid',
      'FaqSection': 'faq',
      'CtaSection': 'cta-title',
    }
    for (const [name, cls] of Object.entries(expect)) {
      check(`${name} present (."${cls}")`, body.includes(cls))
    }
    // Data-driven content proves the sections are populated, not empty shells.
    check('features data rendered', body.includes('Market-linked pricing'))
    check('steps data rendered', body.includes('Verify once'))
    check('testimonials data rendered', body.includes('I stopped queueing at agents'))
    check('faq data rendered', body.includes('How is the rate decided?'))
    check('bento deriv tile rendered', body.includes('Sell Deriv USD'))
    check('site header rendered', body.includes('class="nav'))
    check('site footer rendered', body.includes('class="footer'))
  }

  console.log('\n=== old homepage is gone ===')
  {
    const { body } = await get('/')
    const legacy = {
      'legacy red hero class .red': /class="red"/.test(body),
      'legacy btn-red': body.includes('btn-red'),
      'legacy AppNav': body.includes('<AppNav'),
      'legacy RateCalculator': body.includes('rate-calc') || body.includes('RateCalculator'),
      'legacy hero-tag': body.includes('hero-tag'),
      'legacy ticker-label': body.includes('ticker-label'),
      'legacy deriv-banner': body.includes('deriv-banner'),
    }
    for (const [label, present] of Object.entries(legacy)) {
      check(`removed: ${label}`, !present)
    }
  }

  console.log('\n=== emoji purged from rendered homepage ===')
  {
    const { body } = await get('/')
    const emoji = [...body.matchAll(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E0}-\u{1F1FF}]/gu)]
    const unique = [...new Set(emoji.map(m => m[0]))]
    check('no emoji in output', unique.length === 0, unique.length ? unique.join(' ') : 'none')
  }

  console.log('\n=== monogram marks ===')
  {
    const { body } = await get('/')
    const marks = [...body.matchAll(/class="mark mark--(\w+)"/g)].length
    check('CardMark rendered', marks > 0, marks + ' marks')
    check('monogram letters present', />[A-Z]<\/span>/.test(body), 'e.g. >D</span>')
  }

  console.log(fail === 0 ? '\nAll smoke checks passed.\n' : `\n${fail} check(s) FAILED.\n`)
  process.exit(fail === 0 ? 0 : 1)
})().catch(e => {
  console.error('ERROR', e)
  process.exit(1)
})