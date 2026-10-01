/**
 * Wires IntersectionObserver onto elements with class `reveal`.
 * Call `useReveal(rootRef)` in onMounted — every `.reveal` child inside
 * rootRef gets the `is-in` class when it enters the viewport.
 */
export function useReveal(root?: Ref<HTMLElement | null>) {
  if (!import.meta.client) return

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    )

    const container = root?.value ?? document.body
    for (const el of container.querySelectorAll('.reveal')) {
      observer.observe(el)
    }

    onBeforeUnmount(() => observer.disconnect())
  })
}
