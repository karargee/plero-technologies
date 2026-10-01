// Second pass: styling approach, charting libraries, and the actual trading app host.
const https = require('https')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

function get(url, depth = 0) {
  return new Promise(resolve => {
    const req = https.get(url, {
      timeout: 25000,
      headers: { 'user-agent': UA, accept: '*/*', 'accept-language': 'en-US,en;q=0.9' },
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && depth < 5) {
        res.destroy()
        let n
        try { n = new URL(res.headers.location, url).toString() } catch { return resolve({}) }
        return resolve(get(n, depth + 1))
      }
      let body = ''
      res.setEncoding('utf8')
      res.on('data', d => { body += d; if (body.length > 6_000_000) req.destroy() })
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }))
    })
    req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }) })
    req.on('error', e => resolve({ error: 'error ' + (e.code || e.message) }))
  })
}

const sig = (s) => ({
  'Tailwind': /--tw-[\w-]+\s*:|tailwindcss/i.test(s),
  'Tailwind preflight (reset)': /-webkit-tap-highlight-color|box-sizing:border-box;[^}]*border-width:0/.test(s),
  'CSS Modules (hashed class)': /\.css-module-|\.styles_[a-z0-9_]{4,}/i.test(s),
  'styled-components': /sc-[a-zA-Z0-9_-]{5,}\s*\{|data-styled/.test(s),
  'emotion': /\.css-[a-z0-9]{6,}|\bclassName="css-[a-z0-9]{6,}/.test(s),
  'Bootstrap': /\.btn-primary\s*\{|bootstrap/.test(s),
  'Sass/SCSS output marker': /\/\*!.*sass/.test(s),
  'Lightweight Charts': /lightweight[-_]?charts/i.test(s),
  'TradingView widget': /tradingview/i.test(s),
  'Highcharts': /highcharts/i.test(s),
  'Chart.js': /chart\.js|Chart\.js/.test(s),
  'D3': /\bd3\b|d3-scale|d3-selection/i.test(s),
  'Recharts': /recharts/i.test(s),
  'Framer Motion': /framer-motion/i.test(s),
  'Radix': /radix-ui|data-radix/i.test(s),
  'Webflow CSS': /w-container|webflow/i.test(s),
  'GSAP': /gsap|greensock/i.test(s),
})

;(async () => {
  // 1. Main marketing CSS bundles
  const home = await get('https://deriv.com/')
  const cssUrls = [...new Set([...(home.body || '').matchAll(/href="(\/_next\/static\/chunks\/[^"]+\.css)"/g)].map(m => 'https://deriv.com' + m[1]))]
  console.log('=== main site CSS bundles:', cssUrls.length)
  let combined = ''
  for (const u of cssUrls.slice(0, 4)) {
    const r = await get(u)
    combined += r.body || ''
  }
  console.log('  bytes inspected:', combined.length)
  console.log('  styling / library signatures:')
  for (const [k, v] of Object.entries(sig(combined))) if (v) console.log('    HIT  ' + k)

  const fonts = [...new Set([...(home.body || '').matchAll(/font-family:\s*([^;}{]+)/gi)].map(m => m[1].trim()))]
  console.log('\n  font families declared:', fonts.length)
  fonts.slice(0, 12).forEach(f => console.log('    ' + f.slice(0, 90)))

  // 2. JS chunk signatures
  const jsUrls = [...new Set([...(home.body || '').matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)].map(m => 'https://deriv.com' + m[1]))]
  let js = ''
  for (const u of jsUrls.slice(0, 8)) {
    const r = await get(u)
    js += r.body || ''
  }
  console.log('\n=== main site JS chunks:', jsUrls.length, ' bytes inspected:', js.length)
  for (const [k, v] of Object.entries(sig(js))) if (v) console.log('    HIT  ' + k)

  // 3. The actual trading application host
  console.log('\n=== trading app: dsmarttrader.deriv.com ===')
  const dt = await get('https://dsmarttrader.deriv.com/')
  if (dt.error) console.log('  fetch:', dt.error)
  else {
    console.log('  status:', dt.status, ' html:', (dt.body || '').length, 'bytes')
    console.log('  server:', dt.headers.server || '-', ' cf-ray:', dt.headers['cf-ray'] ? 'yes' : 'no')
    console.log('  title:', ((dt.body || '').match(/<title[^>]*>([^<]*)<\/title>/i) || [, '-'])[1])
    const jsAssets = [...new Set([...(dt.body || '').matchAll(/(?:src|href)="([^"]+\.(?:js|mjs|css))"/g)].map(m => m[1]))]
    console.log('  bundles:', jsAssets.length)
    jsAssets.slice(0, 12).forEach(a => console.log('    ' + a.slice(0, 100)))
    for (const [k, v] of Object.entries(sig(dt.body || ''))) if (v) console.log('    HIT  ' + k)
    let djs = ''
    for (const a of jsAssets.filter(a => /\.js$/.test(a)).slice(0, 6)) {
      const r = await get(a.startsWith('http') ? a : 'https://dsmarttrader.deriv.com' + a)
      djs += r.body || ''
    }
    console.log('  trading-app JS bytes:', djs.length)
    for (const [k, v] of Object.entries(sig(djs))) if (v) console.log('    HIT  ' + k)
  }
})()