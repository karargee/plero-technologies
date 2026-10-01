/**
 * Cursor-tracked glow for `.glass-hover` cards.
 *
 * Writes `--mx` / `--my` as percentages onto the element, which the
 * `.glow-spot` layer reads to position its radial gradient. Uses a rAF
 * throttle and skips coarse pointers, where there is no cursor to follow.
 */
export function useSpotlight<T extends HTMLElement = HTMLElement>(enabled = true) {
  const el = ref<T | null>(null)
  let frame = 0

  const onMove = (event: PointerEvent) => {
    if (frame) return
    // Snapshot the target now: the event is pooled, and reading it again inside
    // the rAF callback would be undefined. Using the event's own target (rather
    // than `el`) keeps the glow aligned when one instance binds many elements.
    const node = event.currentTarget as HTMLElement | null
    const x = event.clientX
    const y = event.clientY
    if (!node) return
    frame = requestAnimationFrame(() => {
      frame = 0
      const rect = node.getBoundingClientRect()
      node.style.setProperty('--mx', `${x - rect.left}px`)
      node.style.setProperty('--my', `${y - rect.top}px`)
    })
  }

  const bind = (target: HTMLElement | null) => {
    if (!enabled) return
    if (target?.matches('(hover: hover) and (pointer: fine)')) {
      target.addEventListener('pointermove', onMove)
    }
  }

  const unbind = (target: HTMLElement | null) => {
    target?.removeEventListener('pointermove', onMove)
  }

  onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame)
    unbind(el.value)
  })

  return { el, bind, unbind }
}
