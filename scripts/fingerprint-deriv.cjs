// Fingerprints deriv.com: headers, meta generator tags, and bundled asset names.
const https = require('https')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

function get(url, depth = 0) {
  return new Promise(resolve => {
    const req = https.get(
      url,
      {
        timeout: 25000,
        headers: {
          'user-agent': UA,
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.9',
        },
      },
      res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && depth < 5) {
          res.destroy()
          let next
          try { next = new URL(res.headers.location, url).toString() } catch { return resolve({}) }
          return resolve(get(next, depth + 1))
        }
        let body = ''
        res.setEncoding('utf8')
        res.on('data', d => { body += d; if (body.length > 4_000_000) req.destroy() })
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }))
      },
    )
    req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }) })
    req.on('error', e => resolve({ error: 'error ' + (e.code || e.message) }))
  })
}

;(async () => {
  const r = await get('https://deriv.com/')
  if (r.error) { console.log('FETCH FAILED:', r.error); return }
  console.log('status:', r.status, ' final url:', r.url || '(no redirect)')
  console.log('\n=== response headers (stack signals) ===')
  const h = r.headers
  for (const k of ['server', 'x-powered-by', 'via', 'cf-ray', 'x-vercel-id', 'x-matched-path',
                   'x-nextjs-', 'x-nuxt', 'x-astro', 'content-security-policy', 'strict-transport-security',
                   'cache-control', 'age', 'x-served-by', 'link']) {
    const keys = Object.keys(h).filter(x => x === k || x.startsWith(k))
    for (const kk of keys) {
      let v = h[kk]
      if (typeof v === 'string' && v.length > 240) v = v.slice(0, 240) + '…'
      console.log('  ' + kk + ': ' + v)
    }
  }

  const html = r.body || ''
  console.log('\n=== document signals ===')
  console.log('  html length:', html.length)

  const gen = [...html.matchAll(/<meta[^>]+name=["']generator["'][^>]*content=["']([^"']+)["']/gi)]
  console.log('  generator:', gen.length ? gen.map(m => m[1]).join(', ') : 'none')

  const root = html.match(/<div[^>]+id=["'](root|app|__next|__nuxt)["'][^>]*>/i)
  console.log('  mount node:', root ? root[0].slice(0, 90) : 'not found')

  // Framework tell-tales in markup
  const tells = {
    'React (__next / react-root)': /__next|react-dom|_next\/static/i.test(html),
    'Next.js data script': /__NEXT_DATA__/.test(html),
    'Vue/Nuxt (__NUXT__)': /__NUXT__|__nuxt/.test(html),
    'Angular': /ng-version|angular\.js/.test(html),
    'Svelte': /svelte-[a-z0-9]{6}/i.test(html),
    'Gatsby': /___gatsby|gatsby-script/i.test(html),
    'WordPress': /wp-content|wp-includes/.test(html),
    'Webflow': /webflow|wf-/.test(html),
    'Astro': /astro-island|astro/.test(html),
    'Google Tag Manager': /googletagmanager\.com\/gtm\.js/.test(html),
    'Google Analytics': /google-analytics\.com\/analytics\.js|gtag\(/.test(html),
    'Segment': /cdn\.segment\.com/.test(html),
    'Hotjar': /hotjar\.com|static\.hotjar\.com/.test(html),
    'Intercom': /intercom/i.test(html),
    'Drift': /drift\.com/.test(html),
    'Zendesk': /zendesk/.test(html),
    'Amplitude': /amplitude\.com/.test(html),
    'Sentry': /sentry\.io/.test(html),
    'Cloudflare': /cdnjs\.cloudflare\.com/.test(html),
    'Tailwind CDN': /cdn\.tailwindcss\.com/.test(html),
    'Bootstrap': /bootstrap/.test(html),
  }
  console.log('\n=== library / platform tells ===')
  for (const [k, v] of Object.entries(tells)) if (v) console.log('  HIT  ' + k)
  console.log('  (no other hits)')

  console.log('\n=== script + stylesheet bundles ===')
  const assets = new Set()
  for (const m of html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|mjs|css)(?:\?[^"']*)?)["']/gi)) {
    assets.add(m[1].replace(/^https?:\/\/[^/]+/, ''))
  }
  const list = [...assets]
  console.log('  count:', list.length)
  list.slice(0, 40).forEach(a => console.log('   ', a.length > 110 ? a.slice(0, 110) + '…' : a))

  console.log('\n=== preconnect / font origins ===')
  const origins = new Set()
  for (const m of html.matchAll(/https:\/\/([a-z0-9.-]+)/gi)) origins.add(m[1])
  console.log('  ' + [...origins].sort().join('\n  '))

  console.log('\n=== inline framework config hints ===')
  for (const key of ['__NEXT_DATA__', '__NUXT__', 'window.__', 'data-reactroot', 'googletag']) {
    const idx = html.indexOf(key)
    if (idx !== -1) {
      console.log('  ' + key + ' found at ' + idx + ':')
      console.log('    ' + html.slice(Math.max(0, idx - 60), idx + 180).replace(/\s+/g, ' '))
    }
  }
})()