const fs = require('fs')
const path = require('path')
const dir = path.join(__dirname, '..', 'app', 'components', 'marketing', 'sections')
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.vue'))) {
  const s = fs.readFileSync(path.join(dir, f), 'utf8')
  const t = s.match(/<template>([\s\S]*)<\/template>/)[1]
  const headings = [...new Set([...t.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean))]
  const root = (t.match(/^\s*<section[^>]*class="([^"]+)"/) || [, '-'])[1]
  console.log(f.replace('.vue', '').padEnd(22) + ' root=.' + root)
  headings.forEach(h => console.log('    H: ' + h))
}