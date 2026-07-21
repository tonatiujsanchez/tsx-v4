let progressListenerSet = false

function initSpotlight(): void {
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
    if (card.dataset.spotlightInit === 'true') return
    card.dataset.spotlightInit = 'true'
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    })
  })
}

export function initAnimations(): void {
  initSpotlight()
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

  if (elements.length === 0) return

  // Assign stagger delays to children inside [data-reveal-stagger] groups
  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((item, i) => {
      item.dataset.revealDelay = String(Math.min(i, 9))
    })
  })

  // Pre-mark elements already in the viewport — prevents flash of invisibility
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-visible')
    }
  })

  // Enable motion CSS — only affects elements not yet marked as is-visible
  document.documentElement.classList.add('motion-ready')

  // Observe off-viewport elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
  )

  elements.forEach((el) => {
    if (!el.classList.contains('is-visible')) {
      observer.observe(el)
    }
  })

  // Scroll progress — set up once, survives view transitions
  const updateProgress = (): void => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0
    document.documentElement.style.setProperty('--scroll-progress', String(progress))
  }

  if (!progressListenerSet) {
    window.addEventListener('scroll', updateProgress, { passive: true })
    progressListenerSet = true
  }

  updateProgress()
}
