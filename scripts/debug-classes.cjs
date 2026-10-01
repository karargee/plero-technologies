// Why do the class probes miss? Dump what the server actually renders.
const BASE = 'http://127.0.0.1:3111'

;(async () => {
  const html = await (await fetch(BASE + '/')).text()

  const probes = ['step-index', 'feature-grid', 'stats-band', 'quote-grid',
                  'feature', 'steps', 'quote-grid', 'fs__', 'stat']

  console.log('=== raw presence of each probe ===')
  for (const p of probes) {
    const n = html.split(p).length - 1
    console.log('  ' + p.padEnd(14) + n)
  }

  console.log('\n=== every distinct class token containing "step" / "feature" / "quote" / "stat" ===')
  const classes = new Set()
  for (const m of html.matchAll(/class="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) {
      if (/step|feature|quote|stat|fs__/i.test(c)) classes.add(c)
    }
  }
  console.log('  ' + [...classes].sort().join('\n  '))

  console.log('\n=== markup around "Verify once" ===')
  const i = html.indexOf('Verify once')
  if (i !== -1) console.log(html.slice(Math.max(0, i - 700), i + 200))
  else console.log('  NOT FOUND')
})()