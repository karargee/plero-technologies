// v-reveal: fades an element in when it scrolls into view.
export default defineNuxtPlugin((nuxtApp) => {
  let io: IntersectionObserver | null = null

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps: () => ({}),
    mounted(el: HTMLElement) {
      el.classList.add('reveal')
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
})
