/**
 * Inspects plero-logo.jpg so generated brand assets match the real artwork.
 * Run: node scripts/probe-logo.cjs
 */
const sharp = require('sharp')
const path = require('path')

const SRC = path.join(__dirname, '..', 'public', 'plero-logo.jpg')

const at = (data, info, x, y) => {
  const i = (y * info.width + x) * info.channels
  return [data[i], data[i + 1], data[i + 2]]
}

;(async () => {
  const meta = await sharp(SRC).metadata()
  console.log('metadata:', JSON.stringify({
    format: meta.format,
    width: meta.width,
    height: meta.height,
    hasAlpha: meta.hasAlpha,
    space: meta.space,
    channels: meta.channels,
  }, null, 2))

  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
  const W = info.width
  const H = info.height

  console.log('\ncorner / edge samples:')
  for (const [label, x, y] of [
    ['top-left', 2, 2], ['top-right', W - 3, 2],
    ['bottom-left', 2, H - 3], ['bottom-right', W - 3, H - 3],
    ['top-mid', W >> 1, 2], ['left-mid', 2, H >> 1],
    ['centre', W >> 1, H >> 1],
  ]) {
    console.log('  ' + label.padEnd(12) + `(${x},${y}) rgb=` + at(data, info, x, y).join(','))
  }

  const border = []
  const stepX = Math.max(1, W >> 6)
  const stepY = Math.max(1, H >> 6)
  for (let x = 0; x < W; x += stepX) {
    border.push(at(data, info, x, 1))
    border.push(at(data, info, x, H - 2))
  }
  for (let y = 0; y < H; y += stepY) {
    border.push(at(data, info, 1, y))
    border.push(at(data, info, W - 2, y))
  }
  const first = border[0]
  const maxDelta = border.reduce((m, c) =>
    Math.max(m, Math.abs(c[0] - first[0]), Math.abs(c[1] - first[1]), Math.abs(c[2] - first[2])), 0)

  console.log('\nborder samples:', border.length, ' first rgb:', first.join(','), ' max channel delta:', maxDelta)
  console.log('background is ' + (maxDelta <= 12 ? 'FLAT (safe to key out)' : 'NOT flat (needs soft matte)'))

  // Bounding box of pixels that differ from the border colour, to find the
  // artwork's real extent and trim whitespace consistently.
  const tol = 26
  let minX = W, minY = H, maxX = 0, maxY = 0
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const c = at(data, info, x, y)
      if (Math.abs(c[0] - first[0]) + Math.abs(c[1] - first[1]) + Math.abs(c[2] - first[2]) > tol) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  console.log(`\nartwork bbox (2px sampled): x ${minX}..${maxX}  y ${minY}..${maxY}`)
  console.log(`  content size: ${maxX - minX + 1} x ${maxY - minY + 1}`)
  console.log(`  canvas:       ${W} x ${H}`)
})()
