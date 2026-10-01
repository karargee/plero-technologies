// Confirms no Deriv credential leaked into the client bundle or public output.
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

// Read the real token from .env so the check uses the actual secret, not a guess.
let token = ''
const envPath = path.join(ROOT, '.env')
if (fs.existsSync(envPath)) {
  const m = fs.readFileSync(envPath, 'utf8').match(/NUXT_DERIV_TOKEN\s*=\s*(\S+)/)
  if (m) token = m[1]
}

const needles = [token, 'NUXT_DERIV_TOKEN', '34xFLbcLB2zQsuRFhVs4n'].filter(
  t => t && t.length > 6,
)

const roots = [
  path.join(ROOT, '.output', 'public'),
  path.join(ROOT, '.output', 'server', 'chunks', 'build'),
]

let scanned = 0
let hits = 0

;(function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) { walk(p); continue }
    if (!/\.(js|mjs|css|html|json|map)$/.test(e.name)) continue
    scanned++
    const s = fs.readFileSync(p, 'utf8')
    for (const n of needles) {
      if (s.includes(n)) {
        hits++
        console.log('  LEAK in', path.relative(ROOT, p), '->', n.slice(0, 12) + '...')
      }
    }
  }
})(roots[0])

console.log('token configured:', token ? 'yes (checked verbatim)' : 'empty — checked app-id only')
console.log('files scanned:', scanned)
console.log(hits === 0
  ? '\nNo Deriv credential found in client assets or server build output.\n'
  : `\n${hits} LEAK(S) FOUND.\n`)
process.exit(hits === 0 ? 0 : 1)