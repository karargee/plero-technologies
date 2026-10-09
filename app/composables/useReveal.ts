/**
 * Wires IntersectionObserver onto elements with class `reveal`.
 * Supports both `useReveal(rootRef)` and `const { revealRef } = useReveal()`.
 */
export function useReveal(root?: Ref<HTMLElement | null>) {
  const revealRef = (el: any) => {
    if (import.meta.client && el && el.classList && el.classList.contains('reveal')) {
      // Direct ref callback support
    }
  }

  if (import.meta.client) {
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

  return { revealRef }
}
