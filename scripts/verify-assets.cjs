/**
 * Verifies the generated brand assets without needing to look at them.
 * Run: node scripts/verify-assets.cjs
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC = path.join(__dirname, '..', 'public')
let failures = 0

const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`)
  if (!ok) failures++
}

const exists = f => fs.existsSync(path.join(PUBLIC, f))

;(async () => {
  console.log('\n=== presence ===')
  for (const f of [
    'logo-mark.png', 'icon.svg', 'favicon.ico',
    'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og-image.png',
  ]) {
    check(f, exists(f), exists(f) ? (fs.statSync(path.join(PUBLIC, f)).size / 1024).toFixed(1) + ' KB' : 'missing')
  }

  // ── Square mark ───────────────────────────────────────────────────────────
  console.log('\n=== logo-mark.png ===')
  {
    const { data, info } = await sharp(path.join(PUBLIC, 'logo-mark.png'))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const { width: W, height: H, channels: C } = info
    check('is 512x512', W === 512 && H === 512, `${W}x${H}`)

    const at = (x, y) => (y * W + x) * C
    const corner = data[at(3, 3) + 3]
    check('corners are transparent', corner === 0, `alpha=${corner}`)

    let opaque = 0
    let minX = W, minY = H, maxX = 0, maxY = 0
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (data[at(x, y) + 3] > 200) {
          opaque++
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }
    const frac = opaque / (W * H)
    check('has visible artwork', frac > 0.05, `${(frac * 100).toFixed(1)}% opaque`)
    check('artwork not over-keyed', frac < 0.92, `${(frac * 100).toFixed(1)}% opaque`)
    const bw = maxX - minX + 1, bh = maxY - minY + 1
    const inset = Math.min(minX, minY, W - maxX, H - maxY)
    check('centred with breathing room', inset > 8, `bbox ${bw}x${bh}, min inset ${inset}px`)

    // Fringe detector. Only near-white pixels *adjacent to transparency* are
    // artefacts. The mark legitimately contains white lettering inside the
    // emblem, so testing all white pixels would flag correct output.
    const isTransparent = (x, y) => data[at(x, y) + 3] < 40
    let fringe = 0
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = at(x, y)
        if (data[i + 3] <= 200) continue
        if (!(data[i] > 246 && data[i + 1] > 246 && data[i + 2] > 246)) continue
        const nearEdge =
          (x > 0 && isTransparent(x - 1, y)) || (x < W - 1 && isTransparent(x + 1, y)) ||
          (y > 0 && isTransparent(x, y - 1)) || (y < H - 1 && isTransparent(x, y + 1))
        if (nearEdge) fringe++
      }
    }
    check('no white fringe on the cut edge', fringe === 0, `${fringe} near-white px touching transparency`)

    // The emblem must actually have been split from the wordmark.
    const rowHasInk = y => {
      for (let x = 0; x < W; x++) if (data[at(x, y) + 3] > 40) return true
      return false
    }
    let lowest = -1
    for (let y = H - 1; y >= 0; y--) if (rowHasInk(y)) { lowest = y; break }
    let highest = -1
    for (let y = 0; y < H; y++) if (rowHasInk(y)) { highest = y; break }
    const verticalUse = (lowest - highest + 1) / H
    check('lockup uses the vertical space', verticalUse > 0.72, `${(verticalUse * 100).toFixed(0)}% of height`)
  }

  // ── Favicon container ─────────────────────────────────────────────────────
  console.log('\n=== favicon.ico ===')
  {
    const b = fs.readFileSync(path.join(PUBLIC, 'favicon.ico'))
    const reserved = b.readUInt16LE(0)
    const type = b.readUInt16LE(2)
    const count = b.readUInt16LE(4)
    check('reserved field is 0', reserved === 0, String(reserved))
    check('type is 1 (icon)', type === 1, String(type))
    check('has 3 entries', count === 3, String(count))

    const sizes = []
    let allDecode = true
    for (let i = 0; i < count; i++) {
      const at = 6 + i * 16
      const w = b[at] || 256
      const h = b[at + 1] || 256
      const bytes = b.readUInt32LE(at + 8)
      const offset = b.readUInt32LE(at + 12)
      sizes.push(`${w}x${h}`)
      if (offset + bytes > b.length) { allDecode = false; continue }
      // PNG payloads start with the 8-byte signature.
      const isPng = b.slice(offset, offset + 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      if (!isPng) allDecode = false
    }
    check('sizes are 16/32/48', sizes.join(' ') === '16x16 32x32 48x48', sizes.join(' '))
    check('all entries are valid PNG payloads', allDecode)
  }

  // ── Apple touch icon ───────────────────────────────────────────────────────
  console.log('\n=== apple-touch-icon.png ===')
  {
    const { data, info } = await sharp(path.join(PUBLIC, 'apple-touch-icon.png'))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    check('is 180x180', info.width === 180 && info.height === 180, `${info.width}x${info.height}`)
    let transparent = 0
    for (let i = 3; i < data.length; i += info.channels) if (data[i] === 0) transparent++
    check('fully opaque (iOS shows no black plate)', transparent === 0, `${transparent} transparent px`)
  }

  // ── PWA sizes ──────────────────────────────────────────────────────────────
  console.log('\n=== PWA icons ===')
  for (const [f, size] of [['icon-192.png', 192], ['icon-512.png', 512]]) {
    const m = await sharp(path.join(PUBLIC, f)).metadata()
    check(`${f} is ${size}px`, m.width === size && m.height === size, `${m.width}x${m.height}`)
  }

  // ── Social card ────────────────────────────────────────────────────────────
  console.log('\n=== og-image.png ===')
  {
    const { data, info } = await sharp(path.join(PUBLIC, 'og-image.png'))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const { width: W, height: H, channels: C } = info
    check('is 1200x630', W === 1200 && H === 630, `${W}x${H}`)

    const lum = (x, y) => {
      const i = (y * W + x) * C
      return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
    }

    // The wordmark band must contain bright text pixels.
    let bandLit = 0
    for (let y = 250; y < 330; y++) for (let x = 60; x < 640; x++) if (lum(x, y) > 140) bandLit++
    check('wordmark rendered', bandLit > 1500, `${bandLit} bright px in y=250..330`)

    // Tagline band.
    let tagLit = 0
    for (let y = 345; y < 390; y++) for (let x = 60; x < 700; x++) if (lum(x, y) > 90) tagLit++
    check('tagline rendered', tagLit > 800, `${tagLit} lit px in y=345..390`)

    // Logo plate: the keyed mark must not be fully transparent here.
    let plateLit = 0
    for (let y = 90; y < 190; y++) for (let x = 90; x < 190; x++) if (lum(x, y) > 60) plateLit++
    check('logo mark visible in plate', plateLit > 1500, `${plateLit} lit px in plate`)

    // Bottom payout line.
    let footLit = 0
    for (let y = 535; y < 570; y++) for (let x = 60; x < 700; x++) if (lum(x, y) > 80) footLit++
    check('payout line rendered', footLit > 600, `${footLit} lit px in y=535..570`)

    // Accent bar bottom-left.
    const accent = (() => {
      const i = (590 * W + 150) * C
      return [data[i], data[i + 1], data[i + 2]]
    })()
    check('accent bar present', accent[0] > 60 && accent[2] > 120, `rgb(${accent.join(',')})`)

    // No large dead-flat region (would mean a failed gradient/background).
    const colours = new Set()
    for (let y = 0; y < H; y += 7) for (let x = 0; x < W; x += 7) {
      const i = (y * W + x) * C
      colours.add(`${data[i] >> 3},${data[i + 1] >> 3},${data[i + 2] >> 3}`)
    }
    check('background is not flat', colours.size > 40, `${colours.size} distinct colour buckets`)
  }

  // ── SVG well-formedness ────────────────────────────────────────────────────
  console.log('\n=== icon.svg ===')
  {
    const s = fs.readFileSync(path.join(PUBLIC, 'icon.svg'), 'utf8')
    check('is an <svg> document', s.trimStart().startsWith('<svg') && s.trimEnd().endsWith('</svg>'))
    check('embeds a PNG payload', s.includes('data:image/png;base64,'))
    check('declares a square viewBox', /viewBox="0 0 512 512"/.test(s))
  }

  console.log(failures === 0 ? '\nAll asset checks passed.\n' : `\n${failures} check(s) FAILED.\n`)
  process.exit(failures === 0 ? 0 : 1)
})().catch(e => {
  console.error('ERROR', e)
  process.exit(1)
})
