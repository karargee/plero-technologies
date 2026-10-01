/**
 * Probes the real Deriv endpoints so we integrate against observed behaviour
 * rather than the docs alone.
 * Run: node scripts/probe-deriv-api.cjs
 */
const https = require('https')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const env = {}
const envPath = path.join(ROOT, '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const APP_ID = env.NUXT_DERIV_APP_ID || ''
const TOKEN = env.NUXT_DERIV_TOKEN || ''
console.log('NUXT_DERIV_APP_ID:', APP_ID || '(empty)')
console.log('NUXT_DERIV_TOKEN: ', TOKEN ? 'set (' + TOKEN.length + ' chars)' : '(empty)')

function req(url, { method = 'GET', headers = {}, body = null } = {}) {
  return new Promise(resolve => {
    const u = new URL(url)
    const r = https.request(
      { hostname: u.hostname, path: u.pathname + u.search, method, headers, timeout: 20000 },
      res => {
        let d = ''
        res.setEncoding('utf8')
        res.on('data', c => (d += c))
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: d }))
      },
    )
    r.on('timeout', () => { r.destroy(); resolve({ error: 'timeout' }) })
    r.on('error', e => resolve({ error: 'error ' + (e.code || e.message) }))
    if (body) r.write(body)
    r.end()
  })
}

const show = (label, r) => {
  console.log('\n--- ' + label)
  if (r.error) { console.log('  ERROR:', r.error); return }
  console.log('  status:', r.status)
  console.log('  body  :', r.body.slice(0, 500).replace(/\s+/g, ' '))
}

;(async () => {
  const BASE = 'https://api.derivws.com'

  // 1. The documented exchange-rate endpoint, no credentials at all.
  show('GET /wallet/v1/exchange-rate (no auth)', await req(
    BASE + '/wallet/v1/exchange-rate?source_currency=USD&destination_currency=NGN',
  ))

  // 2. With app id only, no token.
  if (APP_ID) show('GET /wallet/v1/exchange-rate (app_id only, no token)', await req(
    BASE + '/wallet/v1/exchange-rate?source_currency=USD&destination_currency=NGN',
    { headers: { 'Deriv-App-ID': APP_ID } },
  ))

  // 3. With both, if a token happens to be configured.
  if (APP_ID && TOKEN) show('GET /wallet/v1/exchange-rate (app_id + token)', await req(
    BASE + '/wallet/v1/exchange-rate?source_currency=USD&destination_currency=NGN',
    { headers: { 'Deriv-App-ID': APP_ID, Authorization: 'Bearer ' + TOKEN } },
  ))

  // 4. Other currency pairs, to see what is actually quotable.
  for (const [s, d] of [['USD', 'NGN'], ['USD', 'NGN '], ['NGN', 'USD'], ['USD', 'BTC']]) {
    const r = await req(
      `${BASE}/wallet/v1/exchange-rate?source_currency=${encodeURIComponent(s)}&destination_currency=${encodeURIComponent(d)}`,
    )
    console.log(`\n  pair ${s}->${d}: ${r.error ? r.error : r.status + ' ' + r.body.slice(0, 160)}`)
  }

  // 5. Confirm the public market feed shape we already depend on.
  console.log('\n--- public WebSocket endpoints (HEAD/GET reachability) ---')
  for (const u of [
    'https://api.derivws.com/trading/v1/options/ws/public',
    'https://api.derivws.com/websockets/v3?app_id=' + (APP_ID || '1089'),
  ]) {
    const r = await req(u)
    console.log('  ' + u.replace(/app_id=\d*/, 'app_id=…') + '  ->  ' + (r.error || r.status))
  }
})()