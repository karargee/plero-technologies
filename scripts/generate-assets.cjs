/**
 * Generates the brand raster/vector assets from public/plero-logo.jpg.
 *
 * The source is a flat-white JPEG, so the background is removed with a flood
 * fill seeded from the border. Only border-connected near-white pixels are
 * cleared, which preserves any white that belongs to the artwork itself — a
 * plain "remove all white" threshold punches holes in the mark.
 *
 * Outputs
 *   public/logo-mark.png      512 square, transparent
 *   public/icon.svg           scalable square mark
 *   public/favicon.ico        16/32/48, PNG-compressed entries
 *   public/apple-touch-icon.png  180 square on brand background
 *   public/icon-192.png / icon-512.png   PWA sizes
 *   public/og-image.png       1200x630 social card
 *
 * Run: node scripts/generate-assets.cjs
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const SRC = path.join(PUBLIC, 'plero-logo.jpg')

/** Brand tokens mirrored from app/assets/css/main.css. */
const BRAND = {
  deep: '#26256a',
  primary: '#6f6bf2',
  primaryDark: '#4b46d6',
  violet: '#b45cf0',
  bg: '#08080a',
  surface: '#0e0e18',
  text: '#ffffff',
  muted: '#a9a9c4',
  hairline: 'rgba(255,255,255,0.12)',
}

/** How far from pure white a pixel may sit and still count as background. */
const BG_TOLERANCE = 62
/**
 * Looser, applied only in a thin band around the cut. JPEG ringing leaves
 * pixels just off-white a few px inside the silhouette; clearing them stops a
 * pale halo on the transparent edge. Kept separate from BG_TOLERANCE so it can
 * never reach the interior of the artwork.
 */
const FRINGE_TOLERANCE = 150
const FRINGE_RINGS = 2

/**
 * Removes border-connected background and returns a tightly cropped square RGBA
 * buffer containing only the mark.
 */
async function extractSquareMark(padding = 0.06) {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width: W, height: H, channels: C } = info
  const px = (x, y) => (y * W + x) * C

  const isBgish = i => {
    const dr = 255 - data[i]
    const dg = 255 - data[i + 1]
    const db = 255 - data[i + 2]
    return dr + dg + db <= BG_TOLERANCE
  }

  // Flood fill outward from the border.
  const cleared = new Uint8Array(W * H)
  const queue = []
  const seed = (x, y) => {
    const i = px(x, y)
    if (!cleared[y * W + x] && isBgish(i)) {
      cleared[y * W + x] = 1
      queue.push(x, y)
    }
  }
  for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1) }
  for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y) }

  while (queue.length) {
    const y = queue.pop()
    const x = queue.pop()
    if (x > 0) seed(x - 1, y)
    if (x < W - 1) seed(x + 1, y)
    if (y > 0) seed(x, y - 1)
    if (y < H - 1) seed(x, y + 1)
  }

  // Tight bounds of what survived.
  let minX = W, minY = H, maxX = -1, maxY = -1
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (cleared[y * W + x]) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  if (maxX < 0) throw new Error('Flood fill removed the whole image; lower BG_TOLERANCE.')

  // Clear the background, then widen the cut by a couple of rings of near-white
  // so JPEG ringing does not leave a pale halo on the transparent edge.
  const near = (i, tol) => {
    const dr = 255 - data[i]
    const dg = 255 - data[i + 1]
    const db = 255 - data[i + 2]
    return dr + dg + db <= tol
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!cleared[y * W + x]) continue
      data[px(x, y) + 3] = 0
      for (let ring = 1; ring <= FRINGE_RINGS; ring++) {
        for (let dy = -ring; dy <= ring; dy++) {
          for (let dx = -ring; dx <= ring; dx++) {
            // Only the shell at exactly this radius.
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue
            const nx = x + dx
            const ny = y + dy
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue
            if (cleared[ny * W + nx]) continue
            const ni = px(nx, ny)
            if (near(ni, FRINGE_TOLERANCE)) data[ni + 3] = 0
          }
        }
      }
    }
  }

  const cw = maxX - minX + 1
  const ch = maxY - minY + 1
  const side = Math.ceil(Math.max(cw, ch) * (1 + padding * 2))
  const left = Math.round(minX - (side - cw) / 2)
  const top = Math.round(minY - (side - ch) / 2)

  return {
    buffer: await sharp(data, { raw: { width: W, height: H, channels: C } })
      .extract({ left, top, width: side, height: side })
      .png()
      .toBuffer(),
    content: `${cw}x${ch}`,
    removed: cleared.reduce((a, b) => a + b, 0),
  }
}

/**
 * Splits the locked-up mark into the emblem alone.
 *
 * The source is an emblem with a wordmark beneath it. At 16px that lockup is
 * illegible, so small icons use the emblem. The split is found from the widest
 * fully-empty horizontal band in the lower half rather than a hardcoded crop.
 */
async function cropEmblem(squareBuffer) {
  const { data, info } = await sharp(squareBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels: C } = info

  const rowCount = y => {
    let n = 0
    for (let x = 0; x < W; x++) if (data[(y * W + x) * C + 3] > 40) n++
    return n
  }

  // Longest run of empty rows, searching only below the midpoint.
  let best = { start: -1, length: 0 }
  let run = -1
  for (let y = Math.floor(H * 0.5); y < H; y++) {
    if (rowCount(y) === 0) {
      if (run === -1) run = y
      if (y - run + 1 > best.length) best = { start: run, length: y - run + 1 }
    } else {
      run = -1
    }
  }
  if (best.start === -1) return { buffer: squareBuffer, split: false }

  const emblemHeight = best.start
  // Trim the emblem to its own horizontal extent, then re-pad to a square.
  let minX = W, maxX = 0, minY = 0, maxY = emblemHeight - 1
  for (let y = minY; y <= maxY; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * C + 3] > 40) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
    }
  }
  const cw = maxX - minX + 1
  const ch = maxY - minY + 1
  // The emblem is usually wider than it is tall, so the square side comes from
  // the larger dimension. Pad by compositing onto a fresh canvas: cropping
  // straight out of the source would need a negative origin.
  const side = Math.ceil(Math.max(cw, ch) * 1.08)
  const region = await sharp(data, { raw: { width: W, height: H, channels: C } })
    .extract({ left: minX, top: minY, width: cw, height: ch })
    .png()
    .toBuffer()

  return {
    buffer: await sharp({
      create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: region, gravity: 'center' }])
      .png()
      .toBuffer(),
    split: true,
    emblem: `${cw}x${ch}`,
    gapRow: best.start,
  }
}

/** Wraps an ICO container around PNG-encoded images. */
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(entries.length, 4)

  const dir = Buffer.alloc(16 * entries.length)
  let offset = header.length + dir.length
  entries.forEach((e, i) => {
    const at = i * 16
    dir[at] = e.size >= 256 ? 0 : e.size
    dir[at + 1] = e.size >= 256 ? 0 : e.size
    dir[at + 2] = 0 // palette
    dir[at + 3] = 0 // reserved
    dir.writeUInt16LE(1, at + 4) // colour planes
    dir.writeUInt16LE(32, at + 6) // bits per pixel
    dir.writeUInt32LE(e.data.length, at + 8)
    dir.writeUInt32LE(offset, at + 12)
    offset += e.data.length
  })

  return Buffer.concat([header, dir, ...entries.map(e => e.data)])
}

const write = async (file, buffer) => {
  await fs.promises.writeFile(path.join(PUBLIC, file), buffer)
  console.log('  ' + file.padEnd(26) + (buffer.length / 1024).toFixed(1) + ' KB')
}

;(async () => {
  console.log('Reading', path.relative(ROOT, SRC))
  const mark = await extractSquareMark()
  console.log(
    `  artwork ${mark.content}, background px cleared: ${mark.removed}\n`,
  )

  const dataUri =
    'data:image/png;base64,' + mark.buffer.toString('base64')

  // Emblem-only variant: legible at favicon sizes, unlike the full lockup.
  const emblem = await cropEmblem(mark.buffer)
  console.log(
    '  emblem split at row ' + emblem.gapRow +
      (emblem.split ? `, artwork ${emblem.emblem}` : ' (no gap found — using full mark)'),
  )
  const emblemUri = 'data:image/png;base64,' + emblem.buffer.toString('base64')

  // ── Full lockup (emblem + wordmark) ───────────────────────────────────────
  await write('logo-mark.png', await sharp(mark.buffer).resize(512, 512).png().toBuffer())

  // ── Scalable icon (emblem only) ────────────────────────────────────────────
  await write(
    'icon.svg',
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">` +
        `<image href="${emblemUri}" width="512" height="512"/></svg>\n`,
    ),
  )

  // ── Favicons (emblem only) ────────────────────────────────────────────────
  const icoEntries = []
  for (const size of [16, 32, 48]) {
    icoEntries.push({
      size,
      data: await sharp(emblem.buffer).resize(size, size).png().toBuffer(),
    })
  }
  await write('favicon.ico', buildIco(icoEntries))

  // Apple touch icons are composited on the brand background: iOS does not
  // render transparency and would otherwise show a black plate.
  const apple = await sharp({
    create: { width: 180, height: 180, channels: 4, background: BRAND.surface },
  })
    .composite([
      {
        input: await sharp(emblem.buffer)
          .resize(140, 140)
          .png()
          .toBuffer(),
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer()
  await write('apple-touch-icon.png', apple)

  await write('icon-192.png', await sharp(emblem.buffer).resize(192, 192).png().toBuffer())
  await write('icon-512.png', await sharp(emblem.buffer).resize(512, 512).png().toBuffer())

  // ── Social card ───────────────────────────────────────────────────────────
  const W = 1200
  const H = 630
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND.deep}"/>
      <stop offset="55%" stop-color="#12112e"/>
      <stop offset="100%" stop-color="${BRAND.bg}"/>
    </linearGradient>
    <radialGradient id="orbA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${BRAND.primary}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${BRAND.primary}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${BRAND.violet}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${BRAND.violet}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="rgba(255,255,255,0.045)" stroke-width="1"/>
    </pattern>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BRAND.primary}"/>
      <stop offset="100%" stop-color="${BRAND.violet}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <ellipse cx="1090" cy="120" rx="380" ry="300" fill="url(#orbA)"/>
  <ellipse cx="140" cy="600" rx="340" ry="260" fill="url(#orbB)"/>

  <rect x="72" y="72" width="128" height="128" rx="30" fill="rgba(255,255,255,0.06)" stroke="${BRAND.hairline}"/>
  <image href="${emblemUri}" x="88" y="88" width="96" height="96"/>

  <text x="72" y="320" font-family="Inter, 'Segoe UI', Arial, sans-serif"
        font-size="104" font-weight="800" letter-spacing="-3" fill="${BRAND.text}">Plero</text>
  <text x="72" y="372" font-family="Inter, 'Segoe UI', Arial, sans-serif"
        font-size="33" font-weight="600" fill="${BRAND.muted}">Trade gift cards at live market rates</text>

  <g font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="22" font-weight="600">
    ${['Deriv USD', 'Crypto', 'Vouchers', 'Gift cards']
      .map((label, i) => {
        const x = 72 + i * 196
        return (
          `<rect x="${x}" y="424" width="176" height="52" rx="26" fill="rgba(255,255,255,0.05)" stroke="${BRAND.hairline}"/>` +
          `<circle cx="${x + 30}" cy="450" r="6" fill="${BRAND.primary}"/>` +
          `<text x="${x + 50}" y="458" fill="#d8d8ee">${label}</text>`
        )
      })
      .join('\n    ')}
  </g>

  <text x="72" y="556" font-family="'Segoe UI', Arial, sans-serif"
        font-size="24" font-weight="500" fill="#8b8bab">Payouts to any Nigerian bank in 5–15 minutes</text>

  <rect x="72" y="586" width="220" height="6" rx="3" fill="url(#accent)"/>
</svg>`

  const og = await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toBuffer()
  await write('og-image.png', og)
  const { width, height } = await sharp(og).metadata()
  console.log(`\n  og-image.png verified ${width}x${height} (target 1200x630)`)
})().catch(err => {
  console.error('FAILED:', err.message)
  process.exit(1)
})
