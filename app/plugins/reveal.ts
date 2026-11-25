// v-reveal            → fade up when scrolled into view
// v-reveal:left       → slide in from the left   (also :right, :zoom, :fade)
// v-reveal="120"      → delay in ms (use i * 80 for staggered lists)
// v-spotlight         → soft glow that follows the cursor over a card
export default defineNuxtPlugin((nuxtApp) => {
  let io: IntersectionObserver | null = null

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps: () => ({}),
    mounted(el: HTMLElement, binding) {
      el.classList.add('reveal', `reveal--${binding.arg ?? 'up'}`)
      if (typeof binding.value === 'number') el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      if (!('IntersectionObserver' in window)) {
        el.classList.add('is-visible')
        return
      }
      io ??= new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              io?.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      )
      io.observe(el)
    },
    unmounted(el: HTMLElement) {
      io?.unobserve(el)
    },
  })

  nuxtApp.vueApp.directive('spotlight', {
    getSSRProps: () => ({}),
    mounted(el: HTMLElement) {
      el.classList.add('spotlight')
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
      el.addEventListener('pointermove', move)
      ;(el as any)._spot = move
    },
    unmounted(el: HTMLElement) {
      el.removeEventListener('pointermove', (el as any)._spot)
    },
  })
})
