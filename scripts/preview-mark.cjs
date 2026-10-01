// Renders the keyed mark as ASCII so its structure can be inspected in a terminal.
const sharp = require('sharp')
const path = require('path')

const FILE = process.argv[2] ||
  path.join(__dirname, '..', 'public', 'logo-mark.png')
const COLS = 74

const RAMP = ' .:-=+*#%@'

;(async () => {
  const { data, info } = await sharp(FILE).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels: C } = info
  const at = (x, y) => (y * W + x) * C

  const rows = Math.round((COLS * H) / W / 2.1)
  console.log(`${FILE}  ${W}x${H}  -> ${COLS}x${rows} ascii\n`)

  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let c = 0; c < COLS; c++) {
      // Average the block this character represents.
      const x0 = Math.floor((c / COLS) * W)
      const x1 = Math.max(x0 + 1, Math.floor(((c + 1) / COLS) * W))
      const y0 = Math.floor((r / rows) * H)
      const y1 = Math.max(y0 + 1, Math.floor(((r + 1) / rows) * H))
      let a = 0, lum = 0, n = 0
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = at(x, y)
          a += data[i + 3]
          lum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
          n++
        }
      }
      const alpha = a / n
      if (alpha < 40) { line += ' '; continue }
      const L = lum / n
      if (L > 240) line += 'W'            // white — genuinely in the artwork
      else if (L < 40) line += '@'        // near-black
      else line += RAMP[Math.min(9, Math.floor((L / 255) * 10))]
    }
    console.log(line)
  }
  console.log('\nlegend: space=transparent  W=white artwork  @=near-black  ramp: .:-=+*#%@ by luminance')
})()
