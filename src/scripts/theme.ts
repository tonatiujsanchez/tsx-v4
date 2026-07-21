const THEME_KEY = 'selected-theme-tsx'
const DARK_CLASS = 'dark-theme'
const LIGHT_CLASS = 'light-theme'

function getStoredTheme(): 'dark-theme' | 'light-theme' {
  const stored = localStorage.getItem(THEME_KEY)
  return stored === 'light-theme' ? 'light-theme' : 'dark-theme'
}

function applyTheme(theme: 'dark-theme' | 'light-theme'): void {
  const html = document.documentElement
  html.classList.toggle(DARK_CLASS, theme === 'dark-theme')
  html.classList.toggle(LIGHT_CLASS, theme === 'light-theme')
}

function toggleTheme(): void {
  const isDark = document.documentElement.classList.contains(DARK_CLASS)
  const next: 'dark-theme' | 'light-theme' = isDark ? 'light-theme' : 'dark-theme'
  applyTheme(next)
  localStorage.setItem(THEME_KEY, next)
}

export function initTheme(): void {
  applyTheme(getStoredTheme())
  document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
    ?.addEventListener('click', toggleTheme)
}
