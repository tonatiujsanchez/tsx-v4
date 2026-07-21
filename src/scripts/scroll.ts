const SCROLL_THRESHOLD = 350
const SHOW_CLASS = 'scroll-top__show'

let controller: AbortController | null = null

export function initScrollTop(): void {
  const button = document.getElementById('scroll-top')
  if (!button) return

  controller?.abort()
  controller = new AbortController()
  const { signal } = controller

  button.classList.toggle(SHOW_CLASS, window.scrollY >= SCROLL_THRESHOLD)

  window.addEventListener(
    'scroll',
    () => {
      button.classList.toggle(SHOW_CLASS, window.scrollY >= SCROLL_THRESHOLD)
    },
    { passive: true, signal }
  )

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, { signal })
}
