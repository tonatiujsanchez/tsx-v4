export function initNavObserver(): void {
  const sections = document.querySelectorAll<HTMLElement>('section[id]')
  if (!sections.length) return

  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav__item a[href^="#"]')
  if (!navLinks.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id')
        const navLink = document.querySelector<HTMLAnchorElement>(`.nav__item a[href="#${id}"]`)
        const navItem = navLink?.closest<HTMLElement>('.nav__item')

        navLink?.classList.toggle('nav__link--active', entry.isIntersecting)
        navItem?.classList.toggle('nav__item--active', entry.isIntersecting)
      })
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  )

  sections.forEach((section) => observer.observe(section))
}
