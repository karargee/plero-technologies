export interface RevealOptions {
  threshold?: number
  rootMargin?: string
  /** Keep the element visible after the first intersection. */
  once?: boolean
}

/**
 * Returns a `revealRef` function ref to place on any element that should
 * fade in on scroll. Elements also need the global `.reveal` class.
 */
export function useReveal(options: RevealOptions = {}) {
  const { threshold = 0.12, rootMargin = '0px 0px -60px 0px', once = true } = options

  const targets = new Set<Element>()
  let observer: IntersectionObserver | null = null

  // Vue passes `Element | ComponentPublicInstance | null` to function refs.
  const revealRef = (el: Element | ComponentPublicInstance | null) => {
    if (el instanceof Element) targets.add(el)
  }

  onMounted(() => {
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-in'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            if (once) observer?.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('is-in')
          }
        })
      },
      { threshold, rootMargin },
    )

    targets.forEach(el => observer?.observe(el))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    targets.clear()
  })

  return { revealRef }
}
